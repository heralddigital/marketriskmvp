# marketrisk.ro: Strategy review and roadmap (September 2026)

> Status: working draft for discussion. Competitor prices and market figures come from
> public web sources found in September 2026. Several competitor pricing pages could not
> be opened directly, so **check every competitor price before using it in a decision.**
> Statements about what users want are inferred from market data and competitor features.
> They are not based on MarketRisk customer interviews, which are still needed.

---

## 1. The current thesis (reconstructed from the repo)

There is no single thesis document. The thesis below is pieced together from `README.md`,
`messages/*.json` and the pricing code:

> *"Stop bad debts before they stop your business."* A self-service credit-risk
> **monitoring** SaaS for Romanian SMEs (sales, finance and credit teams). Users look up a
> company by CUI, get a proprietary score (MRCS: GREEN, YELLOW or RED) built from ANAF,
> PortalJust (court cases), BPI (insolvency) and MFinanțe (financial statements), and put
> partners on a watchlist that sends alerts when something changes. The pitch is
> "alerts, not information overload", transparent self-service pricing, and mobile first.

The thesis is still valid. Late payment and insolvency pain in Romania is real and growing
(see §3). But the product doesn't yet deliver the thesis, and the market around it has changed.

### Gaps between the thesis and the code

| Promise | Reality in the code |
|---|---|
| Insolvency (BPI) alerts | `bpi.active_insolvency` is **hard-coded `false`** (`app/[locale]/app/search/actions.ts:171`). The Puppeteer scraper (`lib/bpi/scraper.ts`) is not wired in and won't run reliably on Vercel serverless. |
| State-debt signals | `state_debts_eur: 0` is hard-coded. ANAF v9 doesn't return tax debts. |
| Consistent risk score | **Two incompatible engines.** Search uses `lib/risk-algorithm/calculator.ts` (penalty points, GREEN = 0–14). The daily cron uses `lib/anaf/risk-calculator.ts` (0–100, GREEN = 75–100). Watchlist alerts compare scores from different scales, so they will produce false or missed alerts. |
| "Transparent pricing" | **Four different pricing schemes** exist: homepage copy (€25 / €75, "50 CUI watchlist"), the `/pricing` copy (Starter 50 searches, Pro 200 searches), `types/user.ts` plus SQL migration 007 (3/20/∞ searches, 0/10/250 watchlist), and `lib/stripe/config.ts` (Free 5 / Professional €39 / Business €99). The RO copy also says 99 / 299 RON. |
| "Real-time" alerts | The data sources update daily or quarterly and the cron runs once a day. |
| Social proof | Testimonials ("saved us €50,000") and "Trusted by Romanian SMEs" logos appear with no real customers behind them. |
| Launch date | The copy still says "Launch Q1 2025". |

---

## 2. Competitive landscape

| Player | Positioning | Pricing I found (verify) |
|---|---|---|
| **Termene.ro** | Market leader. Deep data, monitoring with 12 criteria, court-case monitoring, lists and market analysis. Launched **6 AI agents** (TRM, chat assistant, financial assistant, etc.). | Annual licence, paid upfront, quote-based. An old public figure (around 2019) was about €320/yr. The current price is unknown. |
| **RisCo.ro** | 16+ report types, monitoring, B2B lead lists. **Launched a free mobile app in Sept 2026** (risk, sales and employer modules, no account needed). | Monthly, 6-month and 12-month subscriptions. I couldn't confirm the prices. 7-day trial. |
| **Confidas.ro** | Transparent SME plans, monitoring, FNIP (payment incident) reports. | Free (3 monitored) · Start-up 199 RON/yr (50 reports / 50 monitored) · IMM 699 RON/yr (200/200) · Unlimited 4,999 RON/yr, all + VAT. |
| **ListaFirme.ro** | Large company database plus contacts. Monitoring. API. | Unlimited access about 148–250 RON/month. Pay-per-SMS options. |
| **FirmeAlert.ro** (newer) | Free risk score, 16 years of financials, court cases and ANAF debts **with no account**. Same-day alerts. | Plans from about 29.95 RON/month. Reports from 9.99 RON. |
| **Monitorizarefirme.ro, AlertaCUI.ro, everifica.ro, CUIScan, DemoANAF** | Niche and low-cost monitoring or lookup tools. | Low-cost or free. |
| **Data/API resellers**: FirmeAPI.ro, openapi.ro, dosarjust.ro, Apify actors | Sell ONRC, ANAF, BPI, Monitorul Oficial and court data as an API. | Credit-based. FirmeAPI gives 1,000 free test credits. openapi.ro has a free tier of 100 requests/month. |
| **Enterprise**: Coface, CRIF, D&B, Creditinfo | Credit insurance plus international reports for banks and corporates. | Enterprise contracts. |

### What this means

- **Basic company data is now a commodity and often free** (RisCo's app, FirmeAlert,
  public profile pages on every competitor). A lookup plus a score is not something people will pay for.
- **The incumbents compete on breadth of data.** MarketRisk can't win on breadth against
  Termene or RisCo, but it can win on **workflow**: knowing *which of my customers who owe me money*
  are deteriorating, and what to do about it.
- **AI is now expected.** Termene already ships AI agents. A plain-language "why this is risky"
  explanation should be in the core product, not sold as a premium feature.

---

## 3. What has changed (2025 to 2026)

1. **e-Factura is universal.** RO e-Factura has been mandatory for B2B, B2C and B2G. SME
   enforcement dates run into 2026, and individuals with economic activity are included from June 2026
   (per VATupdate and ecosio). **Every Romanian business's sent and received invoices now pass through
   the ANAF SPV API**, which can be accessed with OAuth2 (message list and download endpoints). This is the biggest
   opportunity for MarketRisk.
2. **Insolvencies are rising.** ONRC and Coface report 7,553 insolvencies in 2025 (+3.84% y/y),
   preventive concordats up more than 130%, and Coface reports a **>36% jump in January 2026**. The fiscal
   measures from August 2025 added pressure. *(Figures from press reports. Check against ONRC or Coface directly.)*
3. **Late payment is structural.** In the Atradius 2025 Romania barometer, about 52% of B2B sales are
   on credit, about 42% of credit sales are overdue, and bad debts average about 5% of invoices. *(Verify against the primary report.)*
4. **The EU Late Payment Regulation (30-day cap) stalled in the Council.** The 60-day B2B maximum from
   the 2011 Directive still applies, so long payment terms (and exposure) won't go away soon.
5. **Free and mobile distribution arrived** (RisCo's free app, FirmeAlert's free profiles) along with AI (Termene).
6. **Court portal migration.** The Ministry of Justice launched a new portal (noulportal.just.ro, built alongside ECRIS IV).
   The SOAP endpoint MarketRisk depends on (`portalquery.just.ro`, plain HTTP) is a **platform risk**.

## 4. Market maturity

**The market is mature and crowded for company data and lookups. It is still early for
receivables-linked risk automation for SMEs.**

- There are 5+ established players, many low-cost entrants and API resellers, and prices are falling toward free.
- Buyers are used to the product category, so there's little need to explain what it is.
- There isn't yet a widely used, self-service SME tool that plugs into e-Factura or invoicing software
  and turns it into **"RON at risk"**. I'm not certain that no competitor does this. It needs checking with
  hands-on trials of Termene, RisCo and Confidas before committing.

## 5. What users are looking for (inferred; confirm with 15–20 interviews)

1. **Fewer, actionable alerts.** Not "field X changed", but "Client Y, who owes you 42,000 RON, just entered
   insolvency. File your claim with the judicial administrator before the deadline."
2. **Zero-effort setup.** Nobody wants to type 200 CUIs. They want an import from their invoicing
   software or e-Factura.
3. **Exposure, not just a score.** "How much money is at risk, and with whom?"
4. **A check before signing a contract** that's fast, on mobile, and free for occasional use.
5. **Plain-language explanations in Romanian**, with sources cited (for trust and audit).
6. **Local billing norms.** Prices in RON, VAT shown clearly, annual plans, and a Romanian fiscal invoice
   (via e-Factura) for the subscription itself.
7. **For accountants:** one workspace covering many client companies.

---

## 6. Pricing strategy

**Principles**
- Price in **RON, excluding VAT**, with **annual as the default** (2 months free) and monthly as an option. Romanian
  B2B buyers are used to this (Termene, Confidas, RisCo).
- **Charge for monitoring and integrations, not for lookups.** Lookups are commoditized. Keep them
  generous to drive sign-ups and SEO.
- Use **number of monitored companies** as the value metric, with **integrations and team seats** as the upgrade
  triggers.
- Undercut Termene. Match or slightly beat Confidas per monitored company. Justify a premium through
  the e-Factura/receivables features Confidas lacks.
- There must be **one source of truth** for plans (a single config used by the UI, the DB and Stripe).

**Proposed plans (hypotheses; test with a landing page or A/B test)**

| Plan | Monthly | Annual | Includes |
|---|---|---|---|
| **Gratuit** | 0 | 0 | Unlimited basic lookups (fair use), 5 monitored companies, weekly email digest |
| **Start** | 49 RON | 490 RON | 50 monitored, daily alerts, AI explanations, PDF reports, CSV import |
| **Business** ★ | 149 RON | 1,490 RON | 300 monitored, **e-Factura/SmartBill/Oblio sync**, exposure dashboard, 3 users, same-day alerts |
| **Pro** | 399 RON | 3,990 RON | 1,500 monitored, 10 users, API + webhooks, Slack/Teams, bulk portfolio scoring |
| **Enterprise / Partner** | custom | custom | Unlimited, SLA, dedicated data feeds, white-label for accountants and leasing/factoring firms |

Add-ons: +100 monitored companies for 29 RON/month. Deep report (financials, associates, group) pay-per-use,
about 19 RON. **Accountant programme:** discounted Business seats plus a revenue share for every client company they
onboard. This is the cheapest acquisition channel in Romania for SME B2B software.

Compared with today: the homepage's €25/€75 (about 125/375 RON per month, or about 1,500/4,500 RON per year) is
**2–6× Confidas's annual prices** for comparable monitoring volumes and has nothing extra to justify it. Hold that
level back until the e-Factura features ship.

---

## 7. APIs and data sources to add

### Official or public sources (usually cheapest; highest trust)
| Source | Value | Access (verify) |
|---|---|---|
| **ANAF e-Factura (SPV) API** | Import every customer and supplier CUI plus invoice amounts and dates → exposure, DSO, auto-watchlist | OAuth2, per-user consent, `api.anaf.ro/prod/FCTEL/rest/*`; list window of 60 days |
| **ANAF debtor lists (`anaf.ro/restante`)** | Real state-debt signal (replaces the hard-coded `0`) | Published quarterly; also on data.gov.ro. Only lists debts above the thresholds. |
| **ANAF inactive / reactivated taxpayers lists** | Strong red flag | Public ANAF lists |
| **ANAF financial statements web service / data.gov.ro statements** | Revenue, equity, employees (fills `employees: 0`) | The data.gov.ro import already exists. Add the per-CUI ANAF bilanț service (I believe it exists at `webservicesp.anaf.ro/bilant`, not verified). |
| **BPI (insolvency bulletin)** | Core promise | Licensed feed or reseller (FirmeAPI, openapi.ro) instead of Puppeteer scraping |
| **ONRC / RECOM** | Directors, associates, group links, status changes | Paid ONRC service, or via resellers |
| **Monitorul Oficial** | Director, share-capital and address changes | Via resellers |
| **RNPM** (movable-asset security register) | Pledges and liens show financial stress | Via resellers or monitorizarefirme-type providers |
| **Court portal (new ECRIS portal)** | Keep litigation working after the migration | Monitor for a new API. Consider dosarjust.ro as a fallback. |
| **SEAP/SICAP (public procurement)** | Public contracts won is a positive signal. Supports B2G exposure. | data.gov.ro open data |
| **VIES (EU VAT)** | Checks cross-border partners | Free EC API |
| **EU consolidated sanctions list / OpenSanctions** | Compliance screening for directors and associates | Free or cheap |
| **BNR FX rates** | RON/EUR exposure reporting | Free XML feed |
| **GLEIF LEI** | Identity for larger companies | Free API |

### Workflow integrations (drive activation and retention)
- **SmartBill, Oblio, FGO invoicing APIs.** Import clients and unpaid invoices. Most Romanian SMEs use one of these.
- **Resend** (already present) for email, plus **Slack/Teams webhooks**, plus optional **SMS/WhatsApp** for critical alerts.
- **Claude API** for Romanian explanations of risk changes and recommended actions, with each claim tied to a source.
- **Billing for MarketRisk's own subscriptions:** Stripe **plus** SmartBill/Oblio so Romanian customers get a valid
  e-Factura for their subscription.

### Needs a partnership (not self-service)
- **FNIP / Centrala Incidentelor de Plăți (BNR).** Payment incidents such as bounced cheques. Access is restricted.
  Confidas offers FNIP reports, so a route exists. Explore a partnership.

---

## 8. What to add, keep and remove

### Add
1. **One risk engine** used by search, the cron job and the API, with versioning (`score_version`) and unit tests.
2. **Real BPI, debtor-list and inactive-list signals.** Without them the product doesn't do what the landing page says.
3. **e-Factura / invoicing connect → auto-watchlist + "RON at risk" dashboard.** This is the wedge.
4. **Actionable alerts:** what changed, how much you're exposed, and the next step (e.g. the insolvency claim deadline).
5. **Free public company pages** (SEO acquisition; every competitor has them).
6. **AI explanations** in Romanian, with sources cited.
7. **Accountant multi-client workspace.**
8. **Real onboarding metrics** (activation = has connected invoicing software or monitored at least 10 companies).

### Keep
- The Next.js + Supabase stack, PortalJust litigation (keep the plaintiff/defendant weighting), the MFinanțe import,
  company history snapshots, the API key system and Stripe scaffolding.
- The "alerts, not information overload" positioning.

### Remove or fix
- **Fabricated testimonials and "Trusted by" logos.** These are a legal risk (unfair commercial
  practices) and hurt trust. Replace them with a "founding customers" programme.
- **"Launch Q1 2025", "real-time", "bank-level security", "on-premise"** and "dedicated account manager" on a €75 plan.
- **The three extra pricing definitions.** Keep one config.
- **The legacy `lib/anaf/risk-calculator.ts` engine**, after moving the cron to the main engine.
- **Puppeteer BPI scraping on Vercel.** Replace it with a data provider (or a separate worker if there's no alternative).
- **Payload CMS + MongoDB** (a second database just for the blog/CMS). Use MDX or Supabase tables instead, unless the CMS is essential.
- **Duplicate and stray files:** `creator-dashboard/` (once the migration is finished), `middleware 2.ts`,
  `package-lock 2.json`, `*.bak`, `.DS_Store`, and the roughly 30 `PHASE_*`/`*_COMPLETE.md` status files (merge them into `README` + `ARCHITECTURE`).
- **Search and PDF export limits as the main paywall.** Gate on monitoring and integrations instead.

---

## 9. Roadmap

### Phase 0: Truth and cleanup (weeks 1–2)
- [ ] Remove the fake testimonials and logos and the outdated or unverifiable claims. Fix the launch date.
- [ ] Single `plans.ts` config → UI copy, DB limits (migration), Stripe products (RON).
- [ ] Unify the risk engine. Migrate the cron job. Backfill `risk_score_history` with a `score_version`.
- [ ] Delete stray files and consolidate the docs.
- [ ] Run 15–20 customer interviews (finance managers, sales, accountants) to confirm §5 and the pricing.

### Phase 1: A core that can be trusted (weeks 3–6)
- [ ] BPI via a data provider. ANAF debtor list and inactive list imports (scheduled jobs).
- [ ] Email alerts via Resend with a daily digest and instant critical alerts.
- [ ] Alert copy: what changed, why it matters, the recommended action.
- [ ] Stripe checkout in RON plus Romanian e-Factura invoicing for MarketRisk's own subscriptions.
- [ ] Legal: Terms, Privacy/GDPR, DPA, data-source attributions.
- **Exit criteria:** 20 design-partner accounts, less than 5% false-alert rate, first paid customer.

### Phase 2: The receivables wedge (weeks 7–12)
- [ ] ANAF e-Factura OAuth connect → auto-import customers and suppliers, plus invoice values.
- [ ] SmartBill / Oblio / FGO import. CSV import.
- [ ] "RON at risk" exposure dashboard (by customer, by risk level, overdue amounts).
- [ ] Free public company pages (SEO) with a sign-up CTA.
- [ ] Public launch with the new pricing.
- **Exit criteria:** 40% of paid accounts connect an integration. 100 paying accounts.

### Phase 3: Scale (Q1 2027)
- [ ] AI explanations and a Q&A about a company (Claude), with sources cited.
- [ ] Accountant workspace plus partner programme.
- [ ] Webhooks, Slack/Teams, public API v1 docs.
- [ ] ONRC/Monitorul Oficial signals: director and associate changes, group links.
- [ ] Migrate to the new court portal API if one is published.

### Phase 4: Moat (Q2 2027 onwards)
- [ ] Payment-behaviour insights from invoice data users agree to share (aggregated, anonymized). Needs GDPR
      and competition-law review before building.
- [ ] A predictive model calibrated on real insolvency outcomes (backtest MRCS against BPI history).
- [ ] SEAP, sanctions and VIES screening. RNPM liens.
- [ ] Partnerships: FNIP access, factoring and credit-insurance referrals (a revenue-share line).

### KPIs to track
Activation rate (integration connected or 10+ companies monitored) · weekly active monitors ·
alert precision (alerts users found useful) · free→paid conversion · net revenue retention ·
CAC by channel (SEO, accountants, partners).

---

## Sources
- Confidas pricing: https://www.confidas.ro/preturi
- RisCo products: https://www.risco.ro/en/produse · Free app (Sept 2026): https://www.clubantreprenor.ro/2026/09/21/aplicatia-mobila-risco-cunoaste-mai-bine-orice-firma-din-romania-gratuit-si-direct-de-pe-telefon/
- Termene AI agents: https://www.economica.net/termene-inteligenta-artificiala_776053.html · pricing FAQ: https://suport.termene.ro/ro/knowledge/cat-costa-accesul-la-platforma-termene.ro
- ListaFirme packages: https://listafirme.eu/pachete-acces.asp
- FirmeAlert: https://firmealert.ro/
- FirmeAPI: https://www.firmeapi.ro/ · openapi.ro: https://openapi.ro/ · AlertaCUI API: https://www.alertacui.ro/verificare-monitorizare-firme/en/api/
- Insolvencies 2025: https://newsweek.ro/economie/onrc-7553-de-firme-si-pfa-au-intrat-in-insolventa-in-2025-in-crestere-cu-384-fata-de-2024 · Jan 2026: https://agerpres.ro/economic/2026/03/04/chesoi-coface-romania-avem-o-crestere-notabila-de-peste-36-a-numarului-de-insolvente-in-ianuarie-202--1534131
- Atradius Romania 2025: https://group.atradius.com/knowledge-and-research/reports/b2b-payment-practices-trends-romania-2025
- e-Factura: https://www.vatupdate.com/2026/06/07/briefing-document-romanian-e-invoicing-and-e-transport-regulations/ · https://ecosio.com/en/blog/anaf-ro-e-factura-and-e-invoicing-in-romania/
- e-Factura API endpoints: https://iapp.ro/articol/extrage-lista-de-facturi-de-la-furnizori-din-spv-php-oauth2 · https://mfinante.gov.ro/static/10/eFactura/prezentare%20api%20efactura.pdf
- ANAF debtor lists: https://www.capital.ro/lista-datornici-2025-anaf-a-publicat-lista-firmelor-cu-obligatii-fiscale-restante.html · https://data.gov.ro/dataset/datoriile-catre-bugetul-de-stat
- EU late payment regulation status: https://www.lexisnexis.com/en-gb/legal/guidance/eu-late-payment-regulation-tracker
- New court portal: https://www.luju.ro/noul-portal-al-instantelor-de-judecata-dezvoltat-de-ministerul-justitiei-a-primit-culoarea-portocalie-a-partidului-care-l-a-pus-ministru-pe-catalin-predoiu
- SmartBill API: https://api.smartbill.ro/ · Oblio API: https://www.oblio.eu/api
