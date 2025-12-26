#!/usr/bin/env python3
"""
Scan content/ recursively and report queries (with impressions > 0) from a CSV
that are missing from all content files. Outputs a JSON report for reuse.

Usage:
  /Users/britz/Desktop/Code/Varanasi_Insider/.venv/bin/python scripts/find_missing_queries.py \
    --queries docs/kashitaxi.in-Performance-on-Search-2025-12-24/Queries.csv \
    --content-root content \
    --out tmp/missing_queries.json
"""
from __future__ import annotations

import argparse
import csv
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Sequence

TEXT_EXTENSIONS = {
    ".md",
    ".mdx",
    ".txt",
    ".json",
    ".html",
    ".htm",
    ".yaml",
    ".yml",
    ".csv",
    ".tsv",
    ".xml",
}

BINARY_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".ico",
    ".pdf",
    ".zip",
    ".gz",
    ".mp4",
    ".mp3",
}

_normalize_pattern = re.compile(r"[^\w]+", flags=re.UNICODE)


def normalize(text: str) -> str:
    # Lowercase and collapse non-word chars to spaces to reduce punctuation mismatches
    normalized = _normalize_pattern.sub(" ", text.lower())
    return " ".join(normalized.split())


@dataclass
class ContentRecord:
    path: Path
    lowered: str
    normalized: str


@dataclass
class ScanResult:
    missing_queries: List[str]
    checked_queries: int
    files_scanned: int
    skipped_files: int


def load_queries(csv_path: Path) -> List[str]:
    queries: List[str] = []
    with csv_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            raw_query = (row.get("Top queries") or "").strip()
            impressions_raw = (row.get("Impressions") or "0").replace(",", "")
            try:
                impressions = float(impressions_raw)
            except ValueError:
                continue
            if impressions <= 0 or not raw_query:
                continue
            queries.append(raw_query)
    return queries


def iter_content_files(root: Path) -> Iterable[Path]:
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        ext = path.suffix.lower()
        if ext in BINARY_EXTENSIONS:
            continue
        yield path


def load_content(root: Path) -> List[ContentRecord]:
    records: List[ContentRecord] = []
    skipped = 0
    for path in iter_content_files(root):
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            skipped += 1
            continue
        lowered = text.lower()
        normalized = normalize(text)
        records.append(ContentRecord(path=path, lowered=lowered, normalized=normalized))
    return records, skipped


def find_missing(
    queries: Sequence[str], content_records: Sequence[ContentRecord], skipped_files: int
) -> ScanResult:
    missing: List[str] = []
    for query in queries:
        q_lower = query.lower()
        q_norm = normalize(query)
        found = False
        for record in content_records:
            if q_lower in record.lowered or q_norm in record.normalized:
                found = True
                break
        if not found:
            missing.append(query)
    return ScanResult(
        missing_queries=missing,
        checked_queries=len(queries),
        files_scanned=len(content_records),
        skipped_files=skipped_files,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Find queries missing from content files.")
    parser.add_argument("--queries", type=Path, required=True, help="Path to Queries.csv file")
    parser.add_argument(
        "--content-root",
        type=Path,
        default=Path("content"),
        help="Root folder to scan for content files",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=Path("tmp/missing_queries.json"),
        help="Where to write the JSON report",
    )
    parser.add_argument(
        "--sample",
        type=int,
        default=25,
        help="How many missing queries to print as a preview",
    )
    args = parser.parse_args()

    queries = load_queries(args.queries)
    if not queries:
        raise SystemExit("No queries with impressions > 0 were found.")

    content_root = args.content_root
    if not content_root.exists():
        raise SystemExit(f"Content root {content_root} does not exist")

    content_records, skipped = load_content(content_root)
    if not content_records:
        raise SystemExit("No readable content files found.")

    result = find_missing(queries, content_records, skipped)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    report = {
        "missing_queries": result.missing_queries,
        "stats": {
            "checked_queries": result.checked_queries,
            "files_scanned": result.files_scanned,
            "skipped_files": result.skipped_files,
            "missing_count": len(result.missing_queries),
        },
    }
    args.out.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(f"Queries checked: {result.checked_queries}")
    print(f"Content files scanned: {result.files_scanned}")
    if skipped:
        print(f"Files skipped (unreadable): {skipped}")
    print(f"Missing queries: {len(result.missing_queries)}")
    print(f"Report written to: {args.out}")
    preview = result.missing_queries[: args.sample]
    if preview:
        print("Sample missing queries:")
        for item in preview:
            print(f"- {item}")


if __name__ == "__main__":
    main()
