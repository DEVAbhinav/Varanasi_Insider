"""
Build full query/content frequency maps using literal string matching.

Outputs:
1) keyword_to_pages.json
   {"query": [{"page": "...", "freq": 3, "matches": 3}, ...]}
2) page_to_keywords.json
   {"page": [{"keyword": "...", "freq": 3, "matches": 3}, ...]}
3) summary.json

This scans every Markdown file under the content directory.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Sequence


QUERY_KEYS = (
    "top queries",
    "query",
    "queries",
    "search query",
    "search term",
    "keyword",
)


def normalize_spaces(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def normalize_query(text: str) -> str:
    return normalize_spaces(text).lower()


def find_query_column(fieldnames: Sequence[str]) -> str | None:
    lower_to_original = {name.strip().lower(): name for name in fieldnames if name}
    for key in QUERY_KEYS:
        if key in lower_to_original:
            return lower_to_original[key]
    for name in fieldnames:
        if name and "query" in name.strip().lower():
            return name
    return None


def load_queries_from_csv(path: Path) -> List[str]:
    queries: List[str] = []
    with path.open("r", encoding="utf-8", errors="ignore", newline="") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            return []

        query_col = find_query_column(reader.fieldnames)
        if query_col is None:
            return []

        for row in reader:
            raw = (row.get(query_col) or "").strip()
            if raw:
                queries.append(raw)
    return queries


def load_queries_from_json(path: Path) -> List[str]:
    with path.open("r", encoding="utf-8", errors="ignore") as f:
        data = json.load(f)

    queries: List[str] = []

    if isinstance(data, list):
        for item in data:
            if isinstance(item, str) and item.strip():
                queries.append(item.strip())
            elif isinstance(item, dict):
                for key in ("query", "top queries", "keyword"):
                    value = item.get(key)
                    if isinstance(value, str) and value.strip():
                        queries.append(value.strip())
                        break
    elif isinstance(data, dict):
        # Typical form: {"missing_queries": ["...", "..."]}
        for key, value in data.items():
            if isinstance(value, list) and ("query" in key.lower() or "keyword" in key.lower()):
                for item in value:
                    if isinstance(item, str) and item.strip():
                        queries.append(item.strip())
                    elif isinstance(item, dict):
                        for item_key in ("query", "top queries", "keyword"):
                            item_val = item.get(item_key)
                            if isinstance(item_val, str) and item_val.strip():
                                queries.append(item_val.strip())
                                break
            elif isinstance(value, str) and ("query" in key.lower() or "keyword" in key.lower()):
                if value.strip():
                    queries.append(value.strip())

    return queries


def load_queries(input_path: Path) -> List[str]:
    if input_path.is_dir():
        collected: List[str] = []
        for candidate in sorted(input_path.rglob("*")):
            if not candidate.is_file():
                continue
            if candidate.suffix.lower() == ".csv":
                collected.extend(load_queries_from_csv(candidate))
            elif candidate.suffix.lower() == ".json":
                try:
                    collected.extend(load_queries_from_json(candidate))
                except json.JSONDecodeError:
                    continue
        return collected

    if input_path.suffix.lower() == ".csv":
        return load_queries_from_csv(input_path)
    if input_path.suffix.lower() == ".json":
        return load_queries_from_json(input_path)

    # Fallback: one query per line text file
    queries: List[str] = []
    with input_path.open("r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            val = line.strip()
            if val:
                queries.append(val)
    return queries


def discover_markdown_files(content_root: Path) -> List[Path]:
    return sorted([p for p in content_root.rglob("*.md") if p.is_file()])


def count_literal_occurrences(text_lower: str, query_lower: str) -> int:
    if not query_lower:
        return 0
    # Literal, case-insensitive match against already-lower text.
    return sum(1 for _ in re.finditer(re.escape(query_lower), text_lower))


def build_maps(content_root: Path, markdown_files: Sequence[Path], queries: Sequence[str]) -> Dict[str, object]:
    page_to_keywords: Dict[str, List[Dict[str, object]]] = {}
    keyword_to_pages: Dict[str, List[Dict[str, object]]] = {}

    normalized_to_original: Dict[str, str] = {}
    for query in queries:
        nq = normalize_query(query)
        if nq and nq not in normalized_to_original:
            normalized_to_original[nq] = normalize_spaces(query)

    unique_normalized_queries = sorted(normalized_to_original.keys())

    all_pages = []
    page_text_cache: Dict[str, str] = {}

    for md_file in markdown_files:
        rel_page = md_file.relative_to(content_root).as_posix()
        all_pages.append(rel_page)
        text = md_file.read_text(encoding="utf-8", errors="ignore")
        page_text_cache[rel_page] = text.lower()
        page_to_keywords[rel_page] = []

    # Pre-build to keep empty lists for every query (even with zero matches).
    for nq in unique_normalized_queries:
        keyword_to_pages[normalized_to_original[nq]] = []

    for nq in unique_normalized_queries:
        original_query = normalized_to_original[nq]
        for rel_page in all_pages:
            freq = count_literal_occurrences(page_text_cache[rel_page], nq)
            if freq <= 0:
                continue

            keyword_to_pages[original_query].append(
                {
                    "page": rel_page,
                    "freq": freq,
                    "matches": freq,
                }
            )
            page_to_keywords[rel_page].append(
                {
                    "keyword": original_query,
                    "freq": freq,
                    "matches": freq,
                }
            )

    # Sort output for stable and readable files.
    for query, items in keyword_to_pages.items():
        items.sort(key=lambda x: (-int(x["freq"]), str(x["page"])))
        keyword_to_pages[query] = items

    for page, items in page_to_keywords.items():
        items.sort(key=lambda x: (-int(x["freq"]), str(x["keyword"])))
        page_to_keywords[page] = items

    pages_with_matches = sum(1 for items in page_to_keywords.values() if items)
    keywords_with_matches = sum(1 for items in keyword_to_pages.values() if items)
    total_pair_matches = sum(len(items) for items in page_to_keywords.values())

    return {
        "keyword_to_pages": keyword_to_pages,
        "page_to_keywords": page_to_keywords,
        "summary": {
            "generated_at_utc": datetime.now(timezone.utc).isoformat(),
            "content_root": str(content_root),
            "total_markdown_pages": len(all_pages),
            "total_unique_queries": len(unique_normalized_queries),
            "keywords_with_matches": keywords_with_matches,
            "keywords_without_matches": len(unique_normalized_queries) - keywords_with_matches,
            "pages_with_matches": pages_with_matches,
            "pages_without_matches": len(all_pages) - pages_with_matches,
            "total_keyword_page_pairs": total_pair_matches,
            "all_pages": all_pages,
        },
    }


def write_outputs(result: Dict[str, object], out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)

    keyword_to_pages_path = out_dir / "keyword_to_pages.json"
    page_to_keywords_path = out_dir / "page_to_keywords.json"
    summary_path = out_dir / "summary.json"

    keyword_to_pages_path.write_text(
        json.dumps(result["keyword_to_pages"], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    page_to_keywords_path.write_text(
        json.dumps(result["page_to_keywords"], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    summary_path.write_text(
        json.dumps(result["summary"], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print("\nOutput written:")
    print(f"- {keyword_to_pages_path}")
    print(f"- {page_to_keywords_path}")
    print(f"- {summary_path}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Map GSC queries to Markdown content pages with literal frequency counts."
    )
    parser.add_argument(
        "--queries",
        required=True,
        help="Path to GSC query file (.csv/.json/.txt) or directory containing them.",
    )
    parser.add_argument(
        "--content-root",
        default="content",
        help="Root folder containing Markdown content files (default: content).",
    )
    parser.add_argument(
        "--out-dir",
        default="tmp/query-content-match-output",
        help="Directory for output JSON files.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    queries_path = Path(args.queries).expanduser().resolve()
    content_root = Path(args.content_root).expanduser().resolve()
    out_dir = Path(args.out_dir).expanduser().resolve()

    if not queries_path.exists():
        raise FileNotFoundError(f"Queries path not found: {queries_path}")
    if not content_root.exists() or not content_root.is_dir():
        raise FileNotFoundError(f"Content root directory not found: {content_root}")

    print(f"Reading queries from: {queries_path}")
    raw_queries = load_queries(queries_path)
    if not raw_queries:
        raise ValueError(
            "No queries found. Check query file format and query column names (e.g. Top queries, Query)."
        )
    print(f"Loaded raw queries: {len(raw_queries)}")

    markdown_files = discover_markdown_files(content_root)
    if not markdown_files:
        raise ValueError(f"No markdown files found under: {content_root}")
    print(f"Discovered markdown content files: {len(markdown_files)}")

    result = build_maps(content_root, markdown_files, raw_queries)
    write_outputs(result, out_dir)

    summary = result["summary"]
    print("\nRun summary:")
    print(f"- total_markdown_pages: {summary['total_markdown_pages']}")
    print(f"- total_unique_queries: {summary['total_unique_queries']}")
    print(f"- keywords_with_matches: {summary['keywords_with_matches']}")
    print(f"- keywords_without_matches: {summary['keywords_without_matches']}")
    print(f"- pages_with_matches: {summary['pages_with_matches']}")
    print(f"- pages_without_matches: {summary['pages_without_matches']}")
    print(f"- total_keyword_page_pairs: {summary['total_keyword_page_pairs']}")


if __name__ == "__main__":
    main()
