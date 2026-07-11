#!/usr/bin/env python3
"""
keyword_page_map.py — bidirectional keyword <-> page mapper for kashitaxi.in.

Indexes EVERY page on the site (markdown in content/<lang>/** AND JSX/TS route
pages in pages/**), replicating the live URL routing from lib/posts.js so no page
is missed. Then supports easy string-search lookups in both directions plus a
sales-focused GSC report.

Routing replicated from lib/posts.js resolveRoutePathFromFilePath():
  content/<lang>/<slug>.md                                  -> /<lang>/<slug>
  content/<lang>/{services|landing|guides}/<slug>.md        -> /<lang>/services/<slug>
  content/<lang>/packages/<slug>.md                         -> /<lang>/packages/<slug>
  content/<lang>/bus/<slug>.md                              -> /<lang>/bus/<slug>
  content/<lang>/destinations/<dest>/<cat>/<slug>.md        -> /<lang>/city/<dest>/<cat>/<slug>
  pages/<path>.{js,jsx,tsx}                                 -> /<path> (index->'', [x] dynamic skipped)

USAGE
  # keyword -> page: which page(s) best match a query
  python3 scripts/keyword_page_map.py keyword "scooty rent in varanasi"

  # page -> keyword: which GSC queries map to a page (needs a Queries.csv)
  python3 scripts/keyword_page_map.py page bike-rentals-varanasi \
      --queries data/gsc/2026-07-09/Queries.csv

  # full map + SALES-first opportunity report
  python3 scripts/keyword_page_map.py map \
      --queries data/gsc/2026-07-09/Queries.csv \
      --out data/gsc/2026-07-09/keyword-page-map.csv

  # list every discovered page + its URL (sanity check nothing is missed)
  python3 scripts/keyword_page_map.py pages
"""
from __future__ import annotations

import argparse
import csv
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Tuple

REPO = Path(__file__).resolve().parent.parent
CONTENT_DIR = REPO / "content"
PAGES_DIR = REPO / "pages"

SERVICES_LIKE = {"services", "landing", "guides"}
DESTINATION_CATEGORY_ROUTES = {
    "taxi", "tour-packages", "sightseeing", "activities",
    "events", "food", "shopping", "travel-guide",
}

# ---- normalization -------------------------------------------------------
_norm_re = re.compile(r"[^\w]+", flags=re.UNICODE)
_STOP = {"in", "to", "the", "a", "of", "at", "for", "is", "on", "from", "me",
         "ka", "ki", "ke", "hai", "h", "kitne", "kitna", "aur", "se"}


def normalize(text: str) -> str:
    return " ".join(_norm_re.sub(" ", (text or "").lower()).split())


# light stemming + synonyms so "rentals"~"rent", "scooter"~"scooty", etc.
_SYN = {
    "rentals": "rent", "rental": "rent", "renting": "rent", "rents": "rent",
    "scooter": "scooty", "scooters": "scooty", "scootys": "scooty",
    "bikes": "bike", "taxis": "taxi", "cabs": "cab", "cab": "taxi",
    "traveler": "traveller", "travelers": "traveller", "travellers": "traveller",
    "packages": "package", "tours": "tour", "timings": "timing", "times": "time",
    "ghats": "ghat", "temples": "temple", "fares": "fare", "prices": "price",
    "banaras": "varanasi", "kashi": "varanasi", "vns": "varanasi",
}


def stem(tok: str) -> str:
    if tok in _SYN:
        return _SYN[tok]
    if len(tok) > 4 and tok.endswith("s") and not tok.endswith("ss"):
        tok = tok[:-1]
    return _SYN.get(tok, tok)


def stem_set(text: str) -> set:
    return {stem(t) for t in normalize(text).split() if t}


def tokens(text: str) -> List[str]:
    return [t for t in normalize(text).split() if t and t not in _STOP]


# ---- intent classification (SALES vs INFO) --------------------------------
SALES_TOKENS = {
    "rent", "rental", "rentals", "hire", "book", "booking", "price", "fare",
    "cost", "charge", "charges", "cheap", "cheapest", "taxi", "cab", "cabs",
    "scooty", "scooter", "bike", "bikes", "tempo", "traveller", "traveler",
    "package", "packages", "tour", "tours", "dharamshala", "stay", "hotel",
    "ticket", "tickets", "uber", "charter", "pickup", "drop", "hire",
}
# purely informational signals (answered directly in SERP -> weak CTR/sales)
INFO_TOKENS = {
    "distance", "duri", "dur", "kilometre", "km", "time", "timing", "timings",
    "samay", "weather", "safe", "safety", "crime", "opening", "closing",
    "kab", "map", "suryoday", "suryast", "kitne", "kitna",
}


def classify_intent(query: str) -> str:
    toks = set(normalize(query).split())
    has_sales = bool(toks & SALES_TOKENS)
    has_info = bool(toks & INFO_TOKENS)
    if has_sales:
        # "varanasi to X distance" with no commercial word stays info; but
        # taxi/fare/cab/rent/etc make it a buying query.
        return "sales"
    if has_info:
        return "info"
    return "other"


# ---- page index -----------------------------------------------------------
@dataclass
class Page:
    url: str
    source: Path
    kind: str                       # md | jsx
    title: str = ""
    meta_text: str = ""             # frontmatter / head region (high weight)
    body_text: str = ""             # rest of the file (medium weight)
    title_norm: str = field(default="", repr=False)
    slug_norm: str = field(default="", repr=False)
    meta_norm: str = field(default="", repr=False)
    body_norm: str = field(default="", repr=False)

    def finalize(self):
        self.title_norm = normalize(self.title)
        # slug = last URL segment, hyphen->space so tokens match
        self.slug_norm = normalize(self.url.rsplit("/", 1)[-1].replace("-", " "))
        self.meta_norm = normalize(self.meta_text + " " + self.url)
        self.body_norm = normalize(self.body_text)


def _resolve_md_url(lang: str, rel_parts: List[str], fm_slug: str) -> Optional[str]:
    """Replicate lib/posts.js resolveRoutePathFromFilePath()."""
    slug = normalize(fm_slug).replace(" ", "-") if fm_slug else ""
    filename_slug = rel_parts[-1]
    resolved = slug or filename_slug
    if len(rel_parts) == 1:
        return f"/{lang}/{resolved}"
    head = rel_parts[0]
    if head in SERVICES_LIKE:
        return f"/{lang}/services/{resolved}"
    if head == "packages":
        return f"/{lang}/packages/{resolved}"
    if head == "bus":
        return f"/{lang}/bus/{resolved}"
    if head == "destinations" and len(rel_parts) >= 4:
        dest, cat = rel_parts[1], rel_parts[2]
        return f"/{lang}/city/{dest}/{cat}/{resolved}"
    return f"/{lang}/{resolved}"


def _split_frontmatter(text: str) -> Tuple[str, str]:
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[:end], text[end:]
    return "", text


def _extract_fm_field(fm: str, key: str) -> str:
    m = re.search(rf"^{key}\s*:\s*[\"']?(.+?)[\"']?\s*$", fm, flags=re.MULTILINE)
    return m.group(1).strip() if m else ""


def index_markdown() -> List[Page]:
    pages: List[Page] = []
    for lang_dir in sorted(CONTENT_DIR.glob("*")):
        if not lang_dir.is_dir():
            continue
        lang = lang_dir.name
        for md in lang_dir.rglob("*.md"):
            rel = md.relative_to(lang_dir)
            rel_parts = [p for p in rel.with_suffix("").parts]
            if md.name.lower() == "index.md":
                continue
            if any(p == "json" for p in rel_parts):
                continue
            try:
                text = md.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue
            fm, body = _split_frontmatter(text)
            fm_slug = _extract_fm_field(fm, "slug")
            url = _resolve_md_url(lang, rel_parts, fm_slug)
            if not url:
                continue
            title = _extract_fm_field(fm, "metaTitle") or _extract_fm_field(fm, "title")
            p = Page(url=url, source=md, kind="md", title=title,
                     meta_text=fm, body_text=body)
            p.finalize()
            pages.append(p)
    return pages


_DYNAMIC = re.compile(r"\[.*?\]")


def index_jsx() -> List[Page]:
    pages: List[Page] = []
    for f in PAGES_DIR.rglob("*"):
        if not f.is_file() or f.suffix not in {".js", ".jsx", ".tsx"}:
            continue
        rel = f.relative_to(PAGES_DIR).with_suffix("")
        parts = rel.parts
        if parts and parts[0] == "api":
            continue
        if any(p.startswith("_") for p in parts):
            continue
        if any(_DYNAMIC.search(p) for p in parts):
            continue  # dynamic routes are covered by markdown index
        route_parts = [p for p in parts if p != "index"]
        url = "/" + "/".join(route_parts)
        try:
            text = f.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        title = ""
        m = re.search(r"metaTitle[\"']?\s*[:=]\s*[\"'`](.+?)[\"'`]", text)
        if not m:
            m = re.search(r"<title>\s*(.+?)\s*</title>", text)
        if m:
            title = m.group(1)
        # heuristic head region = first 4000 chars (imports/meta/hero copy)
        head = text[:4000]
        p = Page(url=url, source=f, kind="jsx", title=title,
                 meta_text=head, body_text=text)
        p.finalize()
        pages.append(p)
    return pages


def build_index() -> List[Page]:
    return index_markdown() + index_jsx()


# ---- matching -------------------------------------------------------------
@dataclass
class Match:
    page: Page
    score: float
    where: str
    overlap: int


def match_keyword(query: str, pages: List[Page], top: int = 5) -> List[Match]:
    q_norm = normalize(query)
    q_tokens = {t for t in stem_set(query) if t not in _STOP}
    nq = max(1, len(q_tokens))
    matches: List[Match] = []
    for pg in pages:
        slug_tokens = {stem(t) for t in pg.slug_norm.split()}
        title_tokens = {stem(t) for t in pg.title_norm.split()}
        page_tokens = {stem(t) for t in (pg.meta_norm.split() + pg.body_norm.split())}
        slug_overlap = len(q_tokens & slug_tokens)
        title_overlap = len(q_tokens & title_tokens)
        overlap = len(q_tokens & page_tokens)

        # base score by strongest match location (title/slug > body > keywords)
        base = 0.0
        where = ""
        if q_norm and q_norm in pg.title_norm:
            base, where = 2000, "title"
        elif q_norm and q_norm in pg.slug_norm:
            base, where = 1800, "slug"
        elif slug_overlap == nq and nq >= 2:
            base, where = 1500, "slug (all terms)"
        elif q_norm and q_norm in pg.body_norm:
            base, where = 900, "body"
        elif overlap == nq and nq >= 2:
            base, where = 700, "all terms on page"
        elif q_norm and q_norm in pg.meta_norm:
            base, where = 400, "meta/keywords"   # keyword-list stuffing = weak
        elif overlap:
            base = 120 * (overlap / nq)
            where = f"tokens ({overlap}/{nq})"

        if base <= 0:
            continue
        # relevance boosts: canonical page usually has query words in slug/title
        score = base + 80 * slug_overlap + 40 * title_overlap + overlap
        matches.append(Match(pg, score, where, overlap))
    matches.sort(key=lambda m: (-m.score, m.page.url))
    return matches[:top]


# ---- CSV loading ----------------------------------------------------------
@dataclass
class Query:
    query: str
    clicks: int
    impressions: int
    ctr: str
    position: float
    intent: str


def load_queries(csv_path: Path) -> List[Query]:
    out: List[Query] = []
    with csv_path.open(newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            q = (row.get("Top queries") or row.get("query") or "").strip()
            if not q:
                continue
            def num(k, default="0"):
                return (row.get(k) or default).replace(",", "").strip()
            try:
                clicks = int(float(num("Clicks") or num("clicks")))
            except ValueError:
                clicks = 0
            try:
                impr = int(float(num("Impressions") or num("impressions")))
            except ValueError:
                impr = 0
            try:
                pos = float(num("Position") or num("position") or "0")
            except ValueError:
                pos = 0.0
            ctr = (row.get("CTR") or row.get("ctr") or "").strip()
            out.append(Query(q, clicks, impr, ctr, pos, classify_intent(q)))
    return out


# ---- commands -------------------------------------------------------------
def cmd_keyword(args):
    pages = build_index()
    matches = match_keyword(args.query, pages, top=args.top)
    print(f"\nQuery: {args.query!r}   intent={classify_intent(args.query).upper()}")
    if not matches:
        print("  (no page matched)")
        return
    for m in matches:
        print(f"  [{m.score:7.1f}] {m.page.url}")
        print(f"            via {m.where} | {m.page.source.relative_to(REPO)}")


def _page_matches_target(pg: Page, target: str) -> bool:
    t = target.strip().lower().rstrip("/")
    u = pg.url.lower().rstrip("/")
    if u == t or u.endswith("/" + t.lstrip("/")):
        return True
    # allow bare slug match
    return u.rsplit("/", 1)[-1] == t.rsplit("/", 1)[-1] and t in u


def cmd_page(args):
    pages = build_index()
    target_pages = [p for p in pages if _page_matches_target(p, args.page)]
    if not target_pages:
        print(f"No page found for {args.page!r}. Try `pages` to list all URLs.")
        return
    queries = load_queries(Path(args.queries)) if args.queries else []
    for pg in target_pages:
        print(f"\n=== {pg.url}  ({pg.source.relative_to(REPO)}) ===")
        if not queries:
            print("  (pass --queries <Queries.csv> to see mapped queries)")
            continue
        mapped = []
        for q in queries:
            best = match_keyword(q.query, pages, top=1)
            if best and best[0].page.url == pg.url:
                mapped.append((q, best[0]))
        mapped.sort(key=lambda x: (-x[0].impressions))
        sales = [m for m in mapped if m[0].intent == "sales"]
        info = [m for m in mapped if m[0].intent != "sales"]
        print(f"  SALES queries ({len(sales)}):")
        for q, mt in sales:
            print(f"    {q.impressions:6d} impr  pos {q.position:4.1f}  {q.ctr:>6}  {q.query}")
        print(f"  INFO/other queries ({len(info)}):")
        for q, mt in info:
            print(f"    {q.impressions:6d} impr  pos {q.position:4.1f}  {q.ctr:>6}  {q.query}")


def cmd_map(args):
    pages = build_index()
    queries = load_queries(Path(args.queries))
    rows = []
    for q in queries:
        best = match_keyword(q.query, pages, top=1)
        page_url = best[0].page.url if best else ""
        where = best[0].where if best else "UNMATCHED"
        rows.append({
            "query": q.query,
            "intent": q.intent,
            "clicks": q.clicks,
            "impressions": q.impressions,
            "ctr": q.ctr,
            "position": q.position,
            "mapped_page": page_url,
            "match_where": where,
        })
    # sort: sales first, then by impressions
    rank = {"sales": 0, "info": 1, "other": 2}
    rows.sort(key=lambda r: (rank.get(r["intent"], 3), -r["impressions"]))

    if args.out:
        out = Path(args.out)
        out.parent.mkdir(parents=True, exist_ok=True)
        with out.open("w", newline="", encoding="utf-8") as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
            w.writeheader()
            w.writerows(rows)
        print(f"Wrote {len(rows)} mapped rows -> {out}")

    sales_rows = [r for r in rows if r["intent"] == "sales"]
    unmatched = [r for r in rows if not r["mapped_page"]]
    print(f"\nPages indexed: {len(pages)} | queries: {len(queries)} | "
          f"sales-intent: {len(sales_rows)} | unmatched: {len(unmatched)}")
    print("\nTOP SALES-INTENT QUERIES (by impressions):")
    print(f"  {'impr':>6} {'clk':>4} {'pos':>5} {'ctr':>6}  query -> page")
    for r in sales_rows[:args.top]:
        print(f"  {r['impressions']:6d} {r['clicks']:4d} {r['position']:5.1f} "
              f"{r['ctr']:>6}  {r['query']}  ->  {r['mapped_page'] or '(none)'}")
    if unmatched:
        print("\nUNMATCHED queries (no page owns them — content gap):")
        for r in unmatched[:args.top]:
            print(f"  {r['impressions']:6d} impr  {r['intent']:5}  {r['query']}")


def cmd_pages(args):
    pages = build_index()
    pages.sort(key=lambda p: p.url)
    for pg in pages:
        print(f"{pg.url:70s}  {pg.source.relative_to(REPO)}")
    print(f"\nTotal pages indexed: {len(pages)} "
          f"(md={sum(1 for p in pages if p.kind=='md')}, "
          f"jsx={sum(1 for p in pages if p.kind=='jsx')})")


def main():
    ap = argparse.ArgumentParser(description="Bidirectional keyword<->page mapper")
    sub = ap.add_subparsers(dest="cmd", required=True)

    k = sub.add_parser("keyword", help="keyword -> best matching page(s)")
    k.add_argument("query")
    k.add_argument("--top", type=int, default=5)
    k.set_defaults(func=cmd_keyword)

    p = sub.add_parser("page", help="page -> GSC queries that map to it")
    p.add_argument("page", help="slug or URL, e.g. bike-rentals-varanasi")
    p.add_argument("--queries", help="path to a GSC Queries.csv")
    p.set_defaults(func=cmd_page)

    m = sub.add_parser("map", help="full keyword<->page map + sales report")
    m.add_argument("--queries", required=True)
    m.add_argument("--out", help="write mapping CSV here")
    m.add_argument("--top", type=int, default=30)
    m.set_defaults(func=cmd_map)

    pg = sub.add_parser("pages", help="list every discovered page + URL")
    pg.set_defaults(func=cmd_pages)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
