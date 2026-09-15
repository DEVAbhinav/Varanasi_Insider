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

### Run 4 — 2026-09-14: Maa Annapurna Swarna Roop Darshan & Annakut 2026
- **Event:** Maa Annapurna Swarna Roop Darshan & Annakut Mahotsav (6–11 November 2026)
- **Research Dossier:** `docs/annapurna-swarna-darshan-annakut-varanasi-research-2026.md`
- **Canonical URLs:**
  - `https://www.kashitaxi.in/en/annapurna-swarna-darshan-annakut-varanasi-guide`
  - `https://www.kashitaxi.in/hi/annapurna-swarna-darshan-annakut-varanasi-guide`
- **Scope & Coverage:** Annual 5-day opening of the pure solid-gold idol (Dhanteras to Bhai Dooj), distribution of sacred Annapurna Khazana (blessed coin and akshat) & street scam alert, Annakut Day 56 Bhog & Laddoo Parvat, separate queue mechanics in Vishwanath Gali from Kashi Vishwanath Corridor, invalidity of online Sugam Darshan tickets, police No-Vehicle Zone (Godowlia to Chowk), 4 approved perimeter drop points (Benia Bagh, Girjaghar, Maidagin, Bhelupur), senior citizen marble staircase reality, transparent fixed-fare festival taxi/tempo traveller pricing table, and `ANNAPURNA_ANNAKUT` CTA shortcodes.

### Run 5 — 2026-09-15: Chetganj Nakkataiya Lakkha Mela 2026
- **Event:** Chetganj Nakkataiya Lakkha Mela (Karwa Chauth Night, 29–30 October 2026)
- **Research Dossier:** `docs/chetganj-nakkataiya-lakkha-mela-varanasi-research-2026.md`
- **Canonical URLs:**
  - `https://www.kashitaxi.in/en/chetganj-nakkataiya-lakkha-mela-varanasi-guide`
  - `https://www.kashitaxi.in/hi/chetganj-nakkataiya-lakkha-mela-varanasi-guide`
- **Scope & Coverage:** 139-year-old historic nocturnal Lakkha Mela (400,000–500,000 attendees), 1887 anti-British political genesis by Baba Fateh Ram, underground sanctuary for Chandrashekhar Azad & revolutionaries, mechanical *Laag-Vimaan* (performers suspended on concealed iron *kamani* rods), 40+ monumental moving tableaux (*Chaukiyan*), wrestling akharas, flaming *banethi* and brass band duels, Varanasi Traffic Police 12-hour No-Vehicle Zone (6:00 PM – 6:00 AM from Maldahiya to Nai Sarak), 4 verified perimeter cab drops (Englishia Line, Sigra IP Mall, Andhrapul, Benia Bagh), senior citizen balcony booking tactics, all-night Banarasi food trail (midnight tamatar chaat, inaugural season malaiyo, 4 AM kachori-jalebi), transparent fixed-fare vehicle pricing table, and `NAKKATAIYA_MELA` CTA widgets.

---

## 3. Forward Event Pipeline (Next 30–60 Days Watchlist)

1. **Dala Chhath Puja at Ganga Ghats (13–16 November 2026):**
   - Massive sunset/sunrise arghya at Assi, Dashashwamedh, and Panchganga Ghats; strict riverbank restrictions, morning boat rules, and suburban family taxi transfers.
2. **Dev Deepawali 2026 (Kartik Purnima, 24 November 2026):**
   - Varanasi's highest-demand single-night event. 1 million+ oil lamps across all 84 ghats.
   - Crucial visitor needs: Advance boat charter rates/scams, Chet Singh Ghat laser show crowd zones, Godowlia pedestrianization, airport departure traffic jams.
3. **Ganga Mahotsav & Nag Nathaiya at Tulsi Ghat (Late November 2026):**
   - Traditional Krishna Leela enactment diving into the Ganga from a Kadamba tree branch at Tulsi Ghat.

