"""Reproducible analysis for the September 2026 Kashi Taxi SEO sales-page review.

The current source is a pasted seven-day Google Search Console page table.
The secondary source is the most recent local 28-day GSC export, used for
query-intent checks and persistence checks.  No page/query attribution is
assumed because the exports contain the two dimensions separately.
"""

from __future__ import annotations

import csv
import re
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse


WORKSPACE = Path("/Users/britz/Desktop/Code/Varanasi_Insider")
CURRENT_PAGE_SOURCE = Path(
    "/Users/britz/.codex/attachments/0b13a281-6949-4bb7-8156-84c519b6516c/pasted-text.txt"
)
HISTORICAL_PAGE_SOURCE = Path("/Users/britz/Downloads/kashitaxi-10/Pages.csv")
HISTORICAL_QUERY_SOURCE = Path("/Users/britz/Downloads/kashitaxi-10/Queries.csv")
OUTPUT_DIR = WORKSPACE / "analysis"


SALES_PATH_RE = re.compile(
    r"(taxi|cab|fare|tour-package|packages/|tempo-traveller|rentals?|hire|booking|"
    r"travel-agent|accommodation|boat-ride|boat-tour|84-ghat|day-tour|city-tour)",
    re.I,
)
NON_SALES_PATH_RE = re.compile(
    r"(events/|weather|safety|what-to-wear|best-time|how-many|tourist-spots)",
    re.I,
)
DISTANCE_QUERY_RE = re.compile(
    r"\b(distance|duri|dur\b|kilomet(?:er|re)s?|kms?|kitna\s+dur|how\s+far)\b|"
    r"दूरी|किलोमीटर|कितना\s+दूर|कितनी\s+दूर",
    re.I,
)
COMMERCIAL_QUERY_RE = re.compile(
    r"\b(taxi|cab|fare|rent|rental|scooty|bike|booking|book|package|tempo traveller|"
    r"hire|dharamshala|hotel|accommodation|travel agent)\b|किराया|टैक्सी|कैब|बुकिंग|पैकेज",
    re.I,
)
SUN_QUERY_RE = re.compile(r"sunrise|sunset|सूर्योदय|सूर्यास्त", re.I)


SHORTLIST = {
    "/bike-rentals-varanasi": ("P1", "Rank lift", "High"),
    "/en/city/varanasi/sightseeing/varanasi-local-sightseeing-package": (
        "P1",
        "Rank lift",
        "High",
    ),
    "/en/city/varanasi/taxi/varanasi-airport-to-kashi-vishwanath-taxi": (
        "P1",
        "CTR + sales-intent focus",
        "High",
    ),
    "/en/varanasi-to-ayodhya-tempo-traveller": ("P1", "Rank lift", "High"),
    "/en/senior-citizen-varanasi-tour-package": ("P2", "Rank lift", "Medium"),
    "/en/varanasi-to-prayagraj-taxi": ("P2", "Sales-query rank lift", "Medium"),
    "/en/city/varanasi/taxi/varanasi-airport-to-varanasi-junction-taxi": (
        "P1",
        "Intent repair + CTR",
        "High",
    ),
    "/en/city/varanasi/taxi/varanasi-airport-to-banaras-railway-station-taxi": (
        "P1",
        "Intent cleanup",
        "High",
    ),
    "/en/city/varanasi/taxi/varanasi-to-gaya-taxi-service": (
        "P1",
        "Consolidate + retarget",
        "High",
    ),
    "/en/force-urbania-hire-varanasi": ("P2", "Intent repair", "High"),
    "/en/varanasi-to-vindhyachal-taxi": ("P1", "Consolidate + retarget", "High"),
    "/hi/varanasi-to-vindhyachal-taxi": ("P1", "Consolidate Hindi cluster", "High"),
    "/en/city/nepal/taxi/varanasi-to-nepal-taxi": ("P2", "Intent repair", "High"),
    "/en/varanasi-to-ayodhya-taxi": ("P1", "Consolidate + sales-query rank", "High"),
}


CLUSTERS = {
    "Bike rental": re.compile(r"\b(bike|scooty|2 wheeler|two wheeler)\b", re.I),
    "Local sightseeing": re.compile(r"local sightseeing|local tour package", re.I),
    "Airport to Kashi Vishwanath": re.compile(
        r"(airport|vns).*(kashi|vishwanath|temple)|(kashi|vishwanath|temple).*(airport|vns)",
        re.I,
    ),
    "Airport and railway stations": re.compile(
        r"(airport|vns).*(railway|junction|station|cantt|bsb|manduadih)|"
        r"(railway|junction|station|cantt|bsb|manduadih).*(airport|vns)",
        re.I,
    ),
    "Vindhyachal": re.compile(r"vindhyachal|vindhyavasini|विंध्याचल|विन्ध्याचल", re.I),
    "Urbania": re.compile(r"urbania", re.I),
    "Nepal": re.compile(r"nepal|kathmandu|lumbini|pokhara|sonauli|sunauli", re.I),
    "Gaya or Bodhgaya": re.compile(r"\bgaya\b|bodhgaya|bodh gaya", re.I),
    "Ayodhya": re.compile(r"ayodhya|अयोध्या", re.I),
}


def parse_int(value: str) -> int:
    return int(value.replace(",", "").strip())


def parse_rate(value: str) -> float:
    return float(value.strip().rstrip("%")) / 100


def parse_current_pages(path: Path = CURRENT_PAGE_SOURCE) -> list[dict]:
    lines = [line.strip() for line in path.read_text(encoding="utf-8").splitlines()]
    rows = []
    for index, line in enumerate(lines[:-1]):
        if not line.startswith("http") or "\t" not in lines[index + 1]:
            continue
        values = lines[index + 1].split("\t")
        if len(values) != 4:
            continue
        clicks, impressions, ctr, position = values
        rows.append(
            {
                "url": line,
                "path": urlparse(line).path,
                "clicks_7d": parse_int(clicks),
                "impressions_7d": parse_int(impressions),
                "ctr_7d": parse_rate(ctr),
                "position_7d": float(position),
            }
        )
    return rows


def load_historical_pages(path: Path = HISTORICAL_PAGE_SOURCE) -> dict[str, dict]:
    rows = {}
    with path.open(encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            page_path = urlparse(row["Top pages"]).path
            rows[page_path] = {
                "clicks_28d": parse_int(row["Clicks"]),
                "impressions_28d": parse_int(row["Impressions"]),
                "ctr_28d": parse_rate(row["CTR"]),
                "position_28d": float(row["Position"]),
            }
    return rows


def load_queries(path: Path = HISTORICAL_QUERY_SOURCE) -> list[dict]:
    rows = []
    with path.open(encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            rows.append(
                {
                    "query": row["Top queries"].strip(),
                    "query_lc": row["Top queries"].strip().lower(),
                    "clicks": parse_int(row["Clicks"]),
                    "impressions": parse_int(row["Impressions"]),
                    "ctr": parse_rate(row["CTR"]),
                    "position": float(row["Position"]),
                }
            )
    return rows


def is_sales_page(path: str) -> bool:
    return bool(SALES_PATH_RE.search(path)) and not bool(NON_SALES_PATH_RE.search(path))


def query_intent(query: str) -> str:
    is_distance = bool(DISTANCE_QUERY_RE.search(query))
    is_commercial = bool(COMMERCIAL_QUERY_RE.search(query))
    if is_distance and is_commercial:
        return "Mixed commercial + distance"
    if is_distance:
        return "Distance-only"
    if is_commercial:
        return "Direct commercial"
    if SUN_QUERY_RE.search(query):
        return "Sunrise/sunset noise"
    return "Other informational"


def summarize(rows: list[dict], group_field: str) -> list[dict]:
    grouped = defaultdict(list)
    for row in rows:
        grouped[row[group_field]].append(row)
    output = []
    for group, items in grouped.items():
        impressions = sum(item["impressions"] for item in items)
        clicks = sum(item["clicks"] for item in items)
        weighted_position = (
            sum(item["position"] * item["impressions"] for item in items) / impressions
            if impressions
            else 0
        )
        output.append(
            {
                group_field: group,
                "query_rows": len(items),
                "clicks": clicks,
                "impressions": impressions,
                "ctr": clicks / impressions if impressions else 0,
                "weighted_position": weighted_position,
            }
        )
    return sorted(output, key=lambda item: item["impressions"], reverse=True)


def cluster_summary(queries: list[dict]) -> list[dict]:
    output = []
    for cluster, pattern in CLUSTERS.items():
        cluster_rows = [row for row in queries if pattern.search(row["query_lc"])]
        by_intent = defaultdict(list)
        for row in cluster_rows:
            by_intent[query_intent(row["query_lc"])].append(row)
        for intent, items in by_intent.items():
            impressions = sum(item["impressions"] for item in items)
            clicks = sum(item["clicks"] for item in items)
            output.append(
                {
                    "cluster": cluster,
                    "intent": intent,
                    "query_rows": len(items),
                    "clicks": clicks,
                    "impressions": impressions,
                    "ctr": clicks / impressions if impressions else 0,
                    "weighted_position": sum(
                        item["position"] * item["impressions"] for item in items
                    )
                    / impressions,
                }
            )
    return sorted(output, key=lambda item: (item["cluster"], -item["impressions"]))


def build_shortlist(current_pages: list[dict], historical_pages: dict[str, dict]) -> list[dict]:
    current_by_path = {row["path"]: row for row in current_pages}
    output = []
    for page_path, (priority, action, confidence) in SHORTLIST.items():
        if page_path not in current_by_path:
            continue
        row = dict(current_by_path[page_path])
        row.update(historical_pages.get(page_path, {}))
        row.update({"priority": priority, "action": action, "confidence": confidence})
        output.append(row)
    return sorted(
        output,
        key=lambda item: (
            0 if item["priority"] == "P1" else 1,
            -item["impressions_7d"],
        ),
    )


def write_csv(path: Path, rows: list[dict]) -> None:
    if not rows:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def run_analysis(write_outputs: bool = True) -> dict:
    current_pages = parse_current_pages()
    historical_pages = load_historical_pages()
    queries = load_queries()
    for row in queries:
        row["intent"] = query_intent(row["query_lc"])

    sales_pages = [row for row in current_pages if is_sales_page(row["path"])]
    shortlist = build_shortlist(current_pages, historical_pages)
    intent_summary = summarize(queries, "intent")
    clusters = cluster_summary(queries)

    results = {
        "current_pages": current_pages,
        "sales_pages": sales_pages,
        "shortlist": shortlist,
        "query_intent_summary": intent_summary,
        "cluster_summary": clusters,
        "queries": queries,
    }

    if write_outputs:
        write_csv(OUTPUT_DIR / "gsc-current-pages-2026-08-31-to-2026-09-06.csv", current_pages)
        write_csv(OUTPUT_DIR / "seo-sales-page-shortlist-2026-09-09.csv", shortlist)
        write_csv(OUTPUT_DIR / "gsc-query-intent-summary-2026-08-04-to-2026-08-31.csv", intent_summary)
        write_csv(OUTPUT_DIR / "gsc-query-cluster-summary-2026-08-04-to-2026-08-31.csv", clusters)
    return results


if __name__ == "__main__":
    result = run_analysis(write_outputs=True)
    print(f"Parsed {len(result['current_pages'])} current page rows")
    print(f"Classified {len(result['sales_pages'])} transaction-oriented page rows")
    print(f"Built a {len(result['shortlist'])}-page prioritized shortlist")
    print(f"Classified {len(result['queries'])} rows from the 28-day query export")
