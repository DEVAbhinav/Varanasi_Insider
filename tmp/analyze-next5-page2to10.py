from __future__ import annotations

import csv
import json
import re
from pathlib import Path


WORKSPACE = Path("/Users/britz/Desktop/Code/Varanasi_Insider")
DOWNLOAD_DIR = Path("/Users/britz/Downloads/kashitaxi.in-Performance-on-Search-2026-04-03")
PAGES_CSV = DOWNLOAD_DIR / "Pages.csv"
QUERIES_CSV = DOWNLOAD_DIR / "Queries.csv"
PAGE_TO_KEYWORDS_JSON = WORKSPACE / "tmp/query-content-match-output/page_to_keywords.json"
KEYWORD_TO_PAGES_JSON = WORKSPACE / "tmp/query-content-match-output/keyword_to_pages.json"
CONTENT_ROOT = WORKSPACE / "content"
OUT_JSON = WORKSPACE / "tmp/next5-page2to10-analysis.json"

DONE_URL_PARTS = {
    "varanasi-to-ayodhya",
    "varanasi-to-prayagraj",
    "varanasi-to-nepal-taxi",
    "tempo-traveller-varanasi",
    "varanasi-airport-taxi-price-guide",
    "sarnath-timing-visit-guide",
    "sarnath-complete-guide",
    "varanasi-in-april",
    "tourist-spots-varanasi",
    "ashoka-pillar-sarnath-guide",
    "varanasi-airport-to-manikarnika-distance",
    "varanasi-airport-to-sarnath-distance",
    "dashashwamedh-ghat-ganga-aarti-timing",
    "malaiyo-varanasi-guide",
}

STOP_WORDS = {
    "a",
    "an",
    "and",
    "at",
    "best",
    "book",
    "booking",
    "by",
    "cab",
    "city",
    "cost",
    "distance",
    "for",
    "from",
    "guide",
    "how",
    "in",
    "india",
    "is",
    "it",
    "near",
    "of",
    "on",
    "or",
    "price",
    "service",
    "taxi",
    "the",
    "time",
    "timing",
    "to",
    "tour",
    "travel",
    "trip",
    "varanasi",
    "visit",
    "what",
    "where",
    "with",
    "2025",
    "2026",
}

TIER_RULES = [
    (1, 6.0, [r"taxi", r"cab", r"airport.*transfer", r"airport.*taxi", r"pickup", r"drop"]),
    (2, 4.5, [r"tour.*package", r"pilgrimage", r"darshan", r"yatra"]),
    (3, 5.0, [r"tempo.*traveller", r"traveller.*hire"]),
    (4, 3.0, [r"boat.*ride", r"sunrise.*boat", r"ganga.*aarti"]),
    (5, 2.5, [r"bike.*rental", r"scooty", r"activa"]),
    (6, 2.0, [r"hotel", r"stay", r"accommodation"]),
    (7, 1.5, [r"sightseeing", r"places.*visit", r"tourist.*spot", r"things.*do"]),
    (8, 1.0, [r"guide", r"timing", r"weather", r"best.*time", r"festival"]),
]


def normalize_url(url: str) -> str:
    url = url.replace("https://www.kashitaxi.in", "")
    url = url.replace("https://kashitaxi.in", "")
    url = url.replace("http://www.kashitaxi.in", "")
    url = url.rstrip("/")
    return url or "/"


def classify(url: str) -> tuple[int, float]:
    url_lower = url.lower()
    for tier, mult, patterns in TIER_RULES:
        for pattern in patterns:
            if re.search(pattern, url_lower):
                return tier, mult
    return 9, 0.5


def token_set(text: str) -> set[str]:
    return {
        token
        for token in re.split(r"[^a-z0-9]+", text.lower())
        if token and token not in STOP_WORDS and len(token) > 2
    }


def phrase_candidates(url_path: str) -> list[str]:
    slug = url_path.strip("/").split("/")[-1]
    words = [w for w in slug.split("-") if w and w not in STOP_WORDS]
    phrases = []
    if len(words) >= 2:
        phrases.append(" ".join(words[:2]))
    if len(words) >= 3:
        phrases.append(" ".join(words[:3]))
    if words:
        phrases.append(" ".join(words))
    return [p for p in phrases if len(p) >= 6]


def load_pages() -> list[dict]:
    rows = []
    with PAGES_CSV.open("r", encoding="utf-8", errors="ignore", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            url = normalize_url(row["Top pages"])
            pos = float(row["Position"])
            impressions = int(row["Impressions"].replace(",", ""))
            clicks = int(row["Clicks"].replace(",", ""))
            ctr = row["CTR"]
            rows.append(
                {
                    "url": url,
                    "pos": pos,
                    "imp": impressions,
                    "clicks": clicks,
                    "ctr": ctr,
                }
            )
    return rows


def load_queries() -> list[dict]:
    rows = []
    with QUERIES_CSV.open("r", encoding="utf-8", errors="ignore", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(
                {
                    "query": row["Top queries"].strip(),
                    "query_lower": row["Top queries"].strip().lower(),
                    "imp": int(row["Impressions"].replace(",", "")),
                    "clicks": int(row["Clicks"].replace(",", "")),
                    "pos": float(row["Position"]),
                    "ctr": row["CTR"],
                }
            )
    return rows


def find_content_page(url_path: str, page_to_keywords: dict[str, list[dict]]) -> str | None:
    candidate = url_path.lstrip("/") + ".md"
    if candidate in page_to_keywords:
        return candidate

    slug = url_path.strip("/").split("/")[-1]
    matches = [page for page in page_to_keywords if page.endswith(f"/{slug}.md") or page == f"{slug}.md"]
    if len(matches) == 1:
        return matches[0]
    return None


def query_relevance(url_path: str, query_text: str, base_tokens: set[str], phrases: list[str]) -> int:
    q_lower = query_text.lower()
    q_tokens = token_set(q_lower)
    overlap = base_tokens & q_tokens
    phrase_bonus = sum(1 for phrase in phrases if phrase in q_lower)
    slug_bonus = 1 if url_path.strip("/").split("/")[-1].replace("-", " ") in q_lower else 0
    return len(overlap) + phrase_bonus + slug_bonus


def main() -> None:
    page_to_keywords = json.loads(PAGE_TO_KEYWORDS_JSON.read_text(encoding="utf-8"))
    keyword_to_pages = json.loads(KEYWORD_TO_PAGES_JSON.read_text(encoding="utf-8"))
    pages = load_pages()
    queries = load_queries()

    candidates = []
    for page in pages:
        if not (11 <= page["pos"] <= 100):
            continue
        if any(done in page["url"] for done in DONE_URL_PARTS):
            continue
        if page["url"].startswith("/hi/"):
            continue

        tier, mult = classify(page["url"])
        proximity = max(0.0, 101 - page["pos"]) / 90
        score = page["imp"] * proximity * mult
        page["tier"] = tier
        page["mult"] = mult
        page["score"] = round(score, 2)
        candidates.append(page)

    candidates.sort(key=lambda item: item["score"], reverse=True)
    next_five = candidates[:5]

    analysis = []
    for page in next_five:
        content_page = find_content_page(page["url"], page_to_keywords)
        matched_keywords = page_to_keywords.get(content_page or "", [])
        matched_keyword_names = {item["keyword"].lower() for item in matched_keywords}

        base_tokens = token_set(page["url"])
        phrases = phrase_candidates(page["url"])

        relevant_queries = []
        for query in queries:
            rel_score = query_relevance(page["url"], query["query"], base_tokens, phrases)
            if rel_score >= 2:
                relevant_queries.append({**query, "relevance": rel_score})

        relevant_queries.sort(key=lambda item: (item["relevance"], item["imp"]), reverse=True)

        matched_relevant = []
        gaps = []
        for query in relevant_queries:
            page_matches = keyword_to_pages.get(query["query"], [])
            competitors = [item for item in page_matches if item["page"] != content_page]
            item = {
                "query": query["query"],
                "imp": query["imp"],
                "clicks": query["clicks"],
                "pos": query["pos"],
                "relevance": query["relevance"],
                "present_in_page": query["query_lower"] in matched_keyword_names,
                "competitor_count": len(competitors),
                "top_competitors": competitors[:3],
            }
            if item["present_in_page"]:
                matched_relevant.append(item)
            else:
                gaps.append(item)

        matched_relevant.sort(key=lambda item: item["imp"], reverse=True)
        gaps.sort(key=lambda item: (item["imp"], item["relevance"]), reverse=True)

        analysis.append(
            {
                "url": page["url"],
                "content_page": content_page,
                "tier": page["tier"],
                "score": page["score"],
                "pos": page["pos"],
                "imp": page["imp"],
                "clicks": page["clicks"],
                "ctr": page["ctr"],
                "matched_relevant_queries": matched_relevant[:8],
                "gap_queries": gaps[:8],
                "matched_keyword_count": len(matched_keywords),
            }
        )

    OUT_JSON.write_text(json.dumps(analysis, indent=2, ensure_ascii=False), encoding="utf-8")

    print("Top 5 page-2-to-10 candidates")
    print("=" * 120)
    for index, item in enumerate(analysis, start=1):
        print(
            f"{index}. {item['url']} | pos={item['pos']:.2f} | imp={item['imp']:,} | ctr={item['ctr']} | tier=T{item['tier']} | score={item['score']:,.0f}"
        )
        print(f"   Content: {item['content_page'] or 'NOT_FOUND'}")
        if item["gap_queries"]:
            top_gap = "; ".join(
                f"{gap['query']} (imp {gap['imp']:,}, pos {gap['pos']:.1f}, competitors {gap['competitor_count']})"
                for gap in item["gap_queries"][:3]
            )
            print(f"   Top gaps: {top_gap}")
        if item["matched_relevant_queries"]:
            top_hit = "; ".join(
                f"{hit['query']} (imp {hit['imp']:,}, pos {hit['pos']:.1f})"
                for hit in item["matched_relevant_queries"][:3]
            )
            print(f"   Existing hits: {top_hit}")
        print()

    print(f"Saved JSON report to: {OUT_JSON}")


if __name__ == "__main__":
    main()