# Scheduled Task: 30-Day Upcoming Varanasi Events & Festival Guides

## 1. Task Objective & Workflow Definition

This scheduled task periodically monitors and discovers major cultural, spiritual, and pilgrimage events occurring in Varanasi within the **next 30 days** that currently lack dedicated coverage in the repository.

### Workflow Pipeline:
1. **Event Discovery & Verification:**
   - Deep search the Hindu Panchang calendar, Varanasi local administration notices, and festival schedules for the upcoming 30–45 day window.
   - Cross-reference with existing content in `content/en/` and `content/hi/` to isolate gaps.
2. **Deep Research Dossier:**
   - Compile comprehensive factual data into `docs/<event-slug>-research-2026.md`.
   - Must cover: official dates/timings, key locations & pandals/ghats, traffic diversions & police restrictions, approved drop-off points, senior citizen / family accessibility, traditional rituals, local food hubs, and eco/administrative regulations (e.g. NGT immersion rules).
3. **Bilingual Guide Creation:**
   - English guide: `content/en/<slug>.md`
   - Hindi guide: `content/hi/<slug>.md`
   - Strict **Zero AI Slop** standard: highly specific Varanasi geography, genuine Banarasi cultural terms, verified route constraints, and direct answers to traveler doubts.
4. **Commercial & Conversion Layer:**
   - Contextual CTA blocks via `{{CTA:<BLOCK_KEY>:<lang>}}` in `lib/ctaBlocks.js`.
   - Transparent, fixed-fare vehicle pricing tables covering standard fleet categories (Sedan, SUV, Crysta, 12/17-seater Tempo Travellers) with explicit waiting, night allowance, and toll policies.
5. **SEO & Hub Integration:**
   - Cross-link in relevant monthly hubs (e.g. `varanasi-in-october-2026.md`) and thematic hubs.
   - Update `WEBSITE_LINKS.md` inventory count.
   - Un-ignore the research doc in `.gitignore`.
   - Execute verification: `npm run generate-link-graph`, `npm run generate-sitemap`, and `npm run build`.
   - Record the completed run in `docs/scheduledTasks/UpcomingEvents` and `docs/scheduledTasks/UpcomingEvents.md`.

---

## 2. Run History & Event Registry

### Run 1 — 2026-09-10: Navratri Nava Durga Yatra 2026
- **Event:** Shardiya Navratri Nava Durga 9-Temple Parikrama (3–12 October 2026)
- **Research Dossier:** `docs/navratri-nava-durga-varanasi-research-2026.md`
- **Canonical URLs:**
  - `https://www.kashitaxi.in/en/navratri-nava-durga-yatra-varanasi-guide`
  - `https://www.kashitaxi.in/hi/navratri-nava-durga-yatra-varanasi-guide`
- **Scope & Coverage:** 9-temple sequential parikrama route (Shailputri to Siddhidatri), daily darshan timings, morning/evening crowd patterns, dedicated Navratri darshan cab packages, senior citizen accessible walking paths, and fast-friendly satvik food locations.

### Run 2 — 2026-09-11: Sorahia Mela Lakshmi Kund 2026
- **Event:** Sorahia Mela / 16-Day Mahalakshmi Vrat at Lakshmi Kund (11–26 September 2026)
- **Research Dossier:** `docs/sorahia-mela-lakshmi-kund-varanasi-research-2026.md`
- **Canonical URLs:**
  - `https://www.kashitaxi.in/en/sorahia-mela-lakshmi-kund-varanasi-guide`
  - `https://www.kashitaxi.in/hi/sorahia-mela-lakshmi-kund-varanasi-guide`
- **Scope & Coverage:** 16-knot sacred thread (Sorahtiya sutra) rituals, Lakshmi Kund (Luxa) crowd management, auto/rickshaw diversion points, early morning ritual bath protocols, and puja samagri buying guides.

### Run 3 — 2026-09-13: Varanasi Durga Puja & Chetganj Nakkataiya 2026
- **Event:** Varanasi Durga Puja 2026 (15–20 October 2026) & Chetganj Nakkataiya Lakkha Mela (29 October 2026)
- **Research Dossier:** `docs/durga-puja-pandals-varanasi-research-2026.md`
- **Canonical URLs:**
  - `https://www.kashitaxi.in/en/durga-puja-in-varanasi-pandals-guide-2026`
  - `https://www.kashitaxi.in/hi/durga-puja-in-varanasi-pandals-guide-2026`
- **Scope & Coverage:** Top mega-pandals (Sanatan Dharm Inter College, Hathua Market, Premier Club, Bhelupur), 250-year-old Bengali Tola heritage (*Dhaak*, *Dhunuchi Naach*, *Sindoor Khela*), Varanasi Traffic Police No-Vehicle Zone (4:00 PM – 4:00 AM), approved drop points (Maldahiya, Sigra, Bhelupur), senior citizen daytime visiting window (11:00 AM – 3:30 PM), NGT-compliant artificial pond idol immersions at Samne Ghat, full vehicle pricing CTA table, and `DURGA_PUJA` CTA widgets.

---

## 3. Forward Event Pipeline (Next 30–60 Days Watchlist)

1. **Chetganj Nakkataiya Lakkha Mela (Karwa Chauth Night, 29 October 2026):**
   - Iconic Banarasi street fair drawing hundreds of thousands of spectators to Chetganj for nighttime historical tableaux (chaukiyan) depicting Lakshman cutting Surpanakha's nose.
2. **Dala Chhath Puja at Ganga Ghats (5–8 November 2026):**
   - Massive sunset/sunrise arghya at Assi, Dashashwamedh, and Panchganga Ghats; strict riverbank restrictions, morning boat rules, and suburban family taxi transfers.
3. **Dev Deepawali 2026 (Kartik Purnima, 24 November 2026):**
   - Varanasi's highest-demand single-night event. 1 million+ oil lamps across all 84 ghats.
   - Crucial visitor needs: Advance boat charter rates/scams, Chet Singh Ghat laser show crowd zones, Godowlia pedestrianization, airport departure traffic jams.
4. **Ganga Mahotsav & Nag Nathaiya at Tulsi Ghat (Late November 2026):**
   - Traditional Krishna Leela enactment diving into the Ganga from a Kadamba tree branch at Tulsi Ghat.
