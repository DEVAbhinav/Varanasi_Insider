"""Build and execute the reproducible SEO sales-opportunity notebook."""

from __future__ import annotations

from pathlib import Path

import nbformat as nbf
from nbclient import NotebookClient

from seo_sales_analysis import run_analysis


ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "analysis" / "seo_sales_opportunity_analysis.ipynb"


def pct(value: float) -> str:
    return f"{value:.2%}"


result = run_analysis(write_outputs=True)
intent = {row["intent"]: row for row in result["query_intent_summary"]}
sales = intent["Direct commercial"]
distance = intent["Distance-only"]
noise = intent["Sunrise/sunset noise"]
bike = next(row for row in result["cluster_summary"] if row["cluster"] == "Bike rental" and row["intent"] == "Direct commercial")

nb = nbf.v4.new_notebook()
nb.metadata = {
    "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
    "language_info": {"name": "python", "version": "3"},
}

nb.cells = [
    nbf.v4.new_markdown_cell(
        f"""## tl;dr

The seven-day GSC page snapshot contains 250 visible page rows, of which {len(result['sales_pages'])} are classified as transaction-oriented by URL pattern. The most actionable sales growth is **ranking lift for bike rentals** and **intent/snippet cleanup for airport and route pages**. The separate 28-day query export shows {sales['impressions']:,} impressions on direct-commercial queries at {pct(sales['ctr'])} CTR, but {bike['impressions']:,} ({bike['impressions']/sales['impressions']:.1%}) of those commercial impressions are bike/scooty rental demand.

The large page-average opportunities are not all sales opportunities: distance-only queries generated {distance['impressions']:,} impressions at {pct(distance['ctr'])} CTR, and sunrise/sunset noise generated {noise['impressions']:,} impressions at {pct(noise['ctr'])} CTR. Those impressions should not be used to judge sales-page CTR or to choose commercial owners."""
    ),
    nbf.v4.new_markdown_cell(
        """## Context & Methods

This is a decision-support analysis for the Kashi Taxi sales/SEO team. The controlling page source is the pasted Google Search Console seven-day export covering **31 August–6 September 2026**. A local 28-day GSC export covering **4–31 August 2026** is used only as a persistence and query-intent check.

### Key Assumptions

- “Sales page” means a URL whose path clearly describes taxi/cab/fare/booking, rental, tour package, tempo traveller, accommodation, or a bookable boat product. Editorial event, weather, safety, timing, and general guide URLs are excluded.
- “Direct commercial” queries contain a transaction signal such as taxi, cab, fare, rent, rental, booking, package, tempo traveller, hire, hotel, or dharamshala. “Distance-only” queries contain distance/duri/km wording without a transaction signal.
- The GSC page and query exports are separate dimensions. No page is credited with a specific query unless the page path/content and the query cluster align directionally; cannibalization findings are therefore architecture hypotheses to confirm in a page × query export."""
    ),
    nbf.v4.new_markdown_cell("## Data\n\nThe analysis loads the pasted page table, the latest local 28-day page export, and its 1,000-row query export. It writes bounded CSV companions in this folder for inspection."),
    nbf.v4.new_code_cell(
        """from pathlib import Path\nimport sys\nimport pandas as pd\n\nanalysis_dir = Path.cwd() / 'analysis'\nshortlist = pd.read_csv(analysis_dir / 'seo-sales-page-shortlist-2026-09-09.csv')\nintent_summary = pd.read_csv(analysis_dir / 'gsc-query-intent-summary-2026-08-04-to-2026-08-31.csv')\ncluster_summary = pd.read_csv(analysis_dir / 'gsc-query-cluster-summary-2026-08-04-to-2026-08-31.csv')\nshortlist.head(14)"""
    ),
    nbf.v4.new_markdown_cell("## Results\n\nThe shortlist below deliberately mixes true sales opportunities with high-volume intent-repair cases so the team does not mistake a good page average for good commercial visibility."),
    nbf.v4.new_code_cell("""shortlist[['priority','action','confidence','path','clicks_7d','impressions_7d','ctr_7d','position_7d','clicks_28d','impressions_28d','ctr_28d','position_28d']]"""),
    nbf.v4.new_code_cell("""intent_summary.sort_values('impressions', ascending=False)"""),
    nbf.v4.new_code_cell("""cluster_summary.sort_values(['cluster','impressions'], ascending=[True,False]).head(40)"""),
    nbf.v4.new_markdown_cell(
        """## Takeaways

1. Make `/bike-rentals-varanasi` the first ranking-lift test: its 28-day query cluster is direct commercial, already ranks around positions 3–7, and converts impressions to clicks far better than distance-led clusters.
2. Rework airport route titles and first-screen copy around fare, pickup, vehicle, and booking. Keep one short distance answer, but do not lead with “distance” when the page is meant to sell a transfer.
3. Consolidate duplicate Gaya/Bodhgaya, Ayodhya, Vindhyachal, airport, and station URLs before adding more keywords. Assign one owner per exact route/vehicle intent, then use supporting pages for narrower variants and internal links.
4. Request a GSC page × query export for the next pass. It is the missing evidence needed to verify which URL owns each commercial query and to quantify cannibalization instead of inferring it from URL/content overlap."""
    ),
]

OUT.parent.mkdir(parents=True, exist_ok=True)
nbf.write(nb, OUT)
NotebookClient(nb, timeout=120, kernel_name="python3").execute(cwd=str(ROOT))
nbf.write(nb, OUT)
print(OUT)
