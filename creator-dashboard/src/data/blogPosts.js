export const BLOG_POSTS = [
  {
    slug: 'exposure-trends-to-watch-in-2026',
    title: 'Exposure Trends to Watch in 2026',
    tag: 'Insights',
    date: 'Dec 29, 2025',
    excerpt: 'A calm, practical framework for spotting regime changes without overreacting to noise.',
    readingTime: '7 min read',
    author: {
      name: 'Alex Morgan',
      role: 'Risk Analytics Lead',
      org: 'marketrisk',
      bio: 'Builds calm reporting systems that help teams move from noisy metrics to clear decisions.',
    },
    sections: [
      {
        type: 'p',
        text: 'Risk teams rarely miss a trend because they lack data. They miss it because the signal is buried: too many charts, too many timeframes, and too many “interesting” changes that don’t matter.',
      },
      {
        type: 'p',
        text: 'A better default is to treat 2026 as a year of regime sensitivity. Not every move is a regime shift, but the cost of reacting late is higher than the cost of pausing to validate early. The goal is not prediction; it’s a calm process for detection.',
      },
      { type: 'h2', text: '1) Watch the spread between “level” and “change”' },
      {
        type: 'p',
        text: 'Executives intuitively ask two questions: “Where are we?” and “What changed?” Your dashboard should answer both — separately. Mixing them (e.g., a single headline number without context) creates debate, not decisions.',
      },
      {
        type: 'ul',
        items: [
          'Levels: current exposure, concentration, and top counterparties.',
          'Changes: deltas vs last period, with a clear driver attribution.',
          'Confidence: annotate whether the change is structural or likely noise.',
        ],
      },
      { type: 'h2', text: '2) Concentration is the silent risk' },
      {
        type: 'p',
        text: 'Many “stable” portfolios are stable only in aggregate. In practice, risk gets transferred into a small number of names, sectors, or regions. In 2026, concentration tends to rise during uncertainty because teams default to “known” exposures.',
      },
      {
        type: 'p',
        text: 'Track top-5/top-10 concentration weekly and highlight movements above a small threshold (e.g., +1–2pp). If the chart is flat, great — no discussion needed. If it moves, you have an early, explainable storyline.',
      },
      { type: 'h2', text: '3) Liquidity and “time-to-exit” deserve a first-class slot' },
      {
        type: 'p',
        text: 'Traditional reporting over-emphasizes point-in-time exposure and under-emphasizes exit constraints. The same exposure can be safe or dangerous depending on the ability to reduce it quickly.',
      },
      {
        type: 'ul',
        items: [
          'Define a simple liquidation/exit proxy for key positions (days, weeks).',
          'Show it beside exposure, not in a separate appendix.',
          'Flag when exit time increases while exposure stays “flat”.',
        ],
      },
      { type: 'h2', text: '4) Build a “drivers first” habit' },
      {
        type: 'p',
        text: 'In 2026, teams that win are the teams that can answer “why” quickly. A calm dashboard should lead with drivers (rate move, FX move, spread widening, volume, new positions) and then show the evidence.',
      },
      {
        type: 'p',
        text: 'A practical trick: limit driver lists to 3 items. If you need more, it’s a sign your grouping is wrong or you’re mixing multiple stories.',
      },
      { type: 'h2', text: 'A simple weekly cadence' },
      {
        type: 'ul',
        items: [
          'Monday: validate data quality and explain any discontinuities.',
          'Tuesday: publish executive summary (levels + deltas + drivers).',
          'Wednesday–Friday: follow-up deep dives only when thresholds trigger.',
        ],
      },
      {
        type: 'p',
        text: 'The best dashboards are boring when nothing matters — and unmistakable when something does. That’s the bar for 2026.',
      },
    ],
  },
  {
    slug: 'risk-reporting-that-executives-actually-read',
    title: 'Risk Reporting That Executives Actually Read',
    tag: 'Strategy',
    date: 'Dec 18, 2025',
    excerpt: 'How to design summaries that keep clarity high and cognitive load low—without losing accuracy.',
    readingTime: '8 min read',
    author: {
      name: 'Alex Morgan',
      role: 'Risk Analytics Lead',
      org: 'marketrisk',
      bio: 'Writes about narrative-first reporting, trustworthy dashboards, and executive-ready decision support.',
    },
    sections: [
      {
        type: 'p',
        text: 'Executives don’t ignore risk reports because they don’t care. They ignore them because the report forces them to do the analyst’s job: interpret charts, resolve contradictions, and guess what action is required.',
      },
      {
        type: 'p',
        text: 'A readable report behaves like a narrative: it starts with the decision context, highlights what changed, and ends with a clear set of actions and owners.',
      },
      { type: 'h2', text: 'Start with a single headline' },
      {
        type: 'p',
        text: 'One sentence. No jargon. Example: “Overall exposure is stable, but concentration increased due to two counterparties; recommend tightening limits.” If you can’t write the headline, the report is not ready.',
      },
      { type: 'h2', text: 'Use a 3-block structure' },
      {
        type: 'ul',
        items: [
          'What changed (deltas only): the few movements above threshold.',
          'Why it changed (drivers): the causal factors, not more charts.',
          'What we should do (actions): decisions, owners, and due dates.',
        ],
      },
      { type: 'h2', text: 'Make uncertainty explicit' },
      {
        type: 'p',
        text: 'Ambiguity is inevitable. Hiding it creates surprise later. Add a small confidence label (High / Medium / Low) next to the driver story. It earns trust and reduces escalation when new data arrives.',
      },
      { type: 'h2', text: 'Default to consistency' },
      {
        type: 'p',
        text: 'Executives build mental models from repeated patterns. Use the same layout every week. Keep metric order stable. Keep thresholds stable. Make exceptions obvious.',
      },
      { type: 'h2', text: 'A checklist for the last 10 minutes' },
      {
        type: 'ul',
        items: [
          'Can someone understand the report in 90 seconds?',
          'Are the top 3 changes clearly separated from everything else?',
          'Does every chart have a takeaway sentence?',
          'Is there an explicit “ask” (decision) for the meeting?',
        ],
      },
      {
        type: 'p',
        text: 'When reporting becomes predictable and calm, leadership stops “checking” the report and starts using it as a decision tool. That’s the outcome to design for.',
      },
    ],
  },
  {
    slug: 'designing-metric-cards-for-trust',
    title: 'Designing Metric Cards for Trust',
    tag: 'Design',
    date: 'Nov 30, 2025',
    excerpt: 'Small choices in spacing, typography, and deltas can make dashboards feel credible.',
    readingTime: '6 min read',
    author: {
      name: 'Alex Morgan',
      role: 'Design Systems & Risk UX',
      org: 'marketrisk',
      bio: 'Focuses on UX patterns that make numbers feel consistent, readable, and credible under pressure.',
    },
    sections: [
      {
        type: 'p',
        text: 'Most dashboards “work” but don’t feel trustworthy. Trust is a design outcome: the UI communicates whether the numbers are stable, comparable, and responsibly presented.',
      },
      { type: 'h2', text: '1) Typography should signal hierarchy' },
      {
        type: 'p',
        text: 'Use one strong number per card. Keep labels small and muted. If everything is bold, nothing is important.',
      },
      { type: 'h2', text: '2) Deltas need context' },
      {
        type: 'ul',
        items: [
          'Always show the comparison window (vs yesterday, vs last week).',
          'Use consistent formatting (%, bps, currency) across the dashboard.',
          'Prefer calm colors; reserve strong red for true risk events.',
        ],
      },
      { type: 'h2', text: '3) Align decimals and units' },
      {
        type: 'p',
        text: 'Misaligned units create “hidden work.” Format numbers so comparisons are effortless: align decimals, abbreviate consistently (K/M/B), and don’t mix too many unit types in one row.',
      },
      { type: 'h2', text: '4) Use whitespace as a signal' },
      {
        type: 'p',
        text: 'Whitespace isn’t empty; it’s a statement that the content has priority. Cards that are too dense look like they’re hiding something. Give the number room to breathe.',
      },
      { type: 'h2', text: 'A practical template' },
      {
        type: 'ul',
        items: [
          'Label (small, muted)',
          'Value (large, single line)',
          'Delta (small badge, with timeframe)',
          'Optional sparkline (only if it adds real signal)',
        ],
      },
      {
        type: 'p',
        text: 'The goal is not decoration. The goal is to reduce questions like “what am I looking at?” so the conversation can move to “what should we do?”',
      },
    ],
  },
  {
    slug: 'understanding-romanian-b2b-credit-risk-landscape',
    title: 'Understanding the Romanian B2B Credit Risk Landscape',
    tag: 'Insights',
    date: 'Jan 15, 2026',
    excerpt: 'A practical guide to navigating credit risk in Romania\'s SME market, from CUI lookups to insolvency patterns.',
    readingTime: '9 min read',
    author: {
      name: 'Alex Morgan',
      role: 'Risk Analytics Lead',
      org: 'marketrisk',
      bio: 'Builds calm reporting systems that help teams move from noisy metrics to clear decisions.',
    },
    sections: [
      {
        type: 'p',
        text: 'Romania\'s B2B market presents unique challenges for credit risk management. With over 500,000 active SMEs and a dynamic economic environment, understanding local patterns is essential for protecting cashflow.',
      },
      {
        type: 'p',
        text: 'The Romanian credit risk landscape differs from Western European markets in several key ways: faster insolvency proceedings, different reporting cadences, and sector-specific concentration risks. This guide covers what matters most for B2B teams.',
      },
      { type: 'h2', text: 'The CUI as your primary identifier' },
      {
        type: 'p',
        text: 'Every Romanian company has a CUI (Cod Unic de Înregistrare) — a unique registration code. This is your anchor for all credit checks. Unlike other markets, the CUI is stable and doesn\'t change, making it ideal for building watchlists.',
      },
      {
        type: 'ul',
        items: [
          'CUI format: 8 digits (e.g., 12345678) or RO prefix for EU companies.',
          'Always verify CUI before adding to your watchlist — typos create false negatives.',
          'Use CUI for cross-referencing across data sources (insolvency, financials, debt).',
        ],
      },
      { type: 'h2', text: 'Insolvency patterns in Romania' },
      {
        type: 'p',
        text: 'Romanian insolvency proceedings move faster than in many EU markets. The Biroul de Publicitate a Insolvenței (BPI) publishes notices daily, and companies can enter insolvency within weeks of financial distress.',
      },
      {
        type: 'p',
        text: 'Key patterns to watch: construction and retail sectors show higher default rates, especially during Q1 and Q4. Regional concentration matters — Bucharest and Cluj have different risk profiles than smaller cities.',
      },
      {
        type: 'ul',
        items: [
          'Monitor BPI alerts daily, not weekly — early detection saves exposure.',
          'Track sector trends: construction defaults peak in winter months.',
          'Regional risk: rural SMEs have different payment patterns than urban ones.',
        ],
      },
      { type: 'h2', text: 'Payment behavior in Romanian B2B' },
      {
        type: 'p',
        text: 'Payment terms in Romania often extend to 60–90 days, which creates longer exposure windows. Unlike some markets, payment delays don\'t always signal distress — they can be cultural norms in certain sectors.',
      },
      {
        type: 'p',
        text: 'The signal to watch isn\'t just "late payment" but "change in payment pattern." A company that consistently pays on day 75 suddenly paying on day 90+ is a stronger signal than a company that always pays late.',
      },
      { type: 'h2', text: 'Building a Romanian SME watchlist' },
      {
        type: 'ul',
        items: [
          'Start with your top 20 counterparties by exposure — monitor these weekly.',
          'Add new counterparties when exposure exceeds a threshold (e.g., €10,000).',
          'Include sector diversification: don\'t let one sector dominate your watchlist.',
          'Set alerts for: BPI insolvency notices, debt increases >20%, payment delays >15 days.',
        ],
      },
      {
        type: 'p',
        text: 'The goal isn\'t to monitor everything — it\'s to monitor what matters. A focused watchlist of 50–100 CUIs with clear thresholds beats a passive list of 500 companies.',
      },
      { type: 'h2', text: 'Practical next steps' },
      {
        type: 'ul',
        items: [
          'Audit your current counterparty list: how many have CUIs recorded?',
          'Set up weekly BPI checks for your top 20 exposures.',
          'Define clear escalation thresholds (e.g., insolvency = immediate review, payment delay >30 days = weekly check).',
          'Document sector and regional concentrations — these drive risk clustering.',
        ],
      },
      {
        type: 'p',
        text: 'Romanian B2B credit risk isn\'t about predicting defaults — it\'s about detecting changes early enough to act. Start with the basics: CUI verification, BPI monitoring, and payment pattern tracking. The rest follows.',
      },
    ],
  },
  {
    slug: 'monitoring-romanian-insolvency-bpi-alerts',
    title: 'Monitoring Romanian Insolvency: A Guide to BPI Alerts',
    tag: 'Strategy',
    date: 'Jan 8, 2026',
    excerpt: 'How to use Biroul de Publicitate a Insolvenței (BPI) alerts effectively in your credit risk workflow.',
    readingTime: '7 min read',
    author: {
      name: 'Alex Morgan',
      role: 'Risk Analytics Lead',
      org: 'marketrisk',
      bio: 'Writes about narrative-first reporting, trustworthy dashboards, and executive-ready decision support.',
    },
    sections: [
      {
        type: 'p',
        text: 'The Biroul de Publicitate a Insolvenței (BPI) is Romania\'s official insolvency publication. For B2B credit risk teams, BPI alerts are your earliest warning system — but only if you use them correctly.',
      },
      {
        type: 'p',
        text: 'Most teams check BPI reactively: "Did Company X go insolvent?" A better approach is proactive monitoring: "Which of our counterparties appear in today\'s BPI notices?" This shifts from detection to prevention.',
      },
      { type: 'h2', text: 'Understanding BPI notice types' },
      {
        type: 'p',
        text: 'BPI publishes several notice types, each with different implications for credit risk. Not all notices mean immediate default risk, but they all warrant attention.',
      },
      {
        type: 'ul',
        items: [
          'Opening of insolvency proceedings: Highest risk — exposure likely unrecoverable.',
          'Creditor meetings: Medium risk — company is in distress, but recovery possible.',
          'Asset sales: Medium-high risk — company is liquidating assets.',
          'Plan approval: Low-medium risk — company has a recovery plan, monitor closely.',
        ],
      },
      { type: 'h2', text: 'Setting up effective BPI monitoring' },
      {
        type: 'p',
        text: 'Manual BPI checks don\'t scale. For teams monitoring 50+ counterparties, automation is essential. The workflow should be: daily BPI scan → match against watchlist → alert on matches → escalate based on notice type.',
      },
      {
        type: 'ul',
        items: [
          'Daily checks: BPI publishes new notices every business day — weekly checks miss early signals.',
          'CUI matching: Use exact CUI matching to avoid false positives from similar company names.',
          'Alert thresholds: Immediate alert for insolvency opening, daily digest for other notices.',
          'Historical tracking: Keep a log of all BPI notices per counterparty — patterns emerge over time.',
        ],
      },
      { type: 'h2', text: 'Interpreting BPI notices in context' },
      {
        type: 'p',
        text: 'A BPI notice doesn\'t exist in isolation. Combine it with other signals: payment delays, debt increases, sector trends. A construction company entering insolvency in January is different from one in July — seasonal patterns matter.',
      },
      {
        type: 'p',
        text: 'Also consider notice timing relative to your exposure. If a counterparty enters insolvency but your exposure is small and recent, the impact differs from a long-standing relationship with high exposure.',
      },
      { type: 'h2', text: 'Action framework for BPI alerts' },
      {
        type: 'ul',
        items: [
          'Insolvency opening: Freeze new orders, review existing contracts, assess recoverability.',
          'Creditor meetings: Attend if exposure >€50,000, document all communications.',
          'Asset sales: Evaluate if asset purchase makes sense for your business.',
          'Plan approval: Monitor payment terms in recovery plan, adjust credit limits accordingly.',
        ],
      },
      { type: 'h2', text: 'Common mistakes to avoid' },
      {
        type: 'ul',
        items: [
          'Checking BPI only when problems arise — by then it\'s too late.',
          'Ignoring "low risk" notices — they often precede higher-risk events.',
          'Not cross-referencing CUI — company name changes can create false negatives.',
          'Treating all notices equally — prioritize by notice type and exposure size.',
        ],
      },
      {
        type: 'p',
        text: 'BPI monitoring isn\'t about predicting insolvency — it\'s about detecting it early enough to act. The best credit risk teams treat BPI as a daily habit, not a monthly task.',
      },
    ],
  },
  {
    slug: 'cui-credit-checks-romanian-companies',
    title: 'CUI Credit Checks: A Practical Guide for Romanian Companies',
    tag: 'Insights',
    date: 'Dec 22, 2025',
    excerpt: 'How to perform effective credit checks using Romanian CUI numbers and what to look for in the results.',
    readingTime: '8 min read',
    author: {
      name: 'Alex Morgan',
      role: 'Risk Analytics Lead',
      org: 'marketrisk',
      bio: 'Builds calm reporting systems that help teams move from noisy metrics to clear decisions.',
    },
    sections: [
      {
        type: 'p',
        text: 'The CUI (Cod Unic de Înregistrare) is the foundation of Romanian company identification. For B2B credit risk teams, understanding how to use CUI for credit checks is essential — but many teams underutilize the data available.',
      },
      {
        type: 'p',
        text: 'A CUI credit check isn\'t just "does this company exist?" It\'s a gateway to financial health, debt history, ownership structure, and risk signals. This guide covers what to check and how to interpret the results.',
      },
      { type: 'h2', text: 'What a CUI credit check reveals' },
      {
        type: 'p',
        text: 'A comprehensive CUI lookup should return: company registration status, financial statements (if available), debt records, insolvency history, and ownership information. Not all data sources provide everything — know what you\'re getting.',
      },
      {
        type: 'ul',
        items: [
          'Registration status: Is the company active, dissolved, or in liquidation?',
          'Financial data: Latest balance sheet, profit/loss, if publicly filed.',
          'Debt history: Outstanding debts, payment delays, court judgments.',
          'Insolvency records: Any BPI notices, past or current insolvency proceedings.',
          'Ownership: Shareholders, directors, related companies (useful for concentration risk).',
        ],
      },
      { type: 'h2', text: 'When to perform a CUI check' },
      {
        type: 'p',
        text: 'Credit checks have a cost (time and sometimes money). The key is timing: check early enough to prevent bad decisions, but not so early that the data becomes stale before you act.',
      },
      {
        type: 'ul',
        items: [
          'Before first order: Always check new counterparties before extending credit.',
          'When exposure increases: Re-check if exposure grows >50% or exceeds a threshold (e.g., €25,000).',
          'After payment delays: If payment is >30 days late, refresh the credit check.',
          'Quarterly for key partners: Top 20 counterparties should be checked quarterly, even if no issues.',
          'After BPI alerts: If a company appears in BPI notices, perform a full credit check immediately.',
        ],
      },
      { type: 'h2', text: 'Interpreting credit check results' },
      {
        type: 'p',
        text: 'Credit check results aren\'t binary (good/bad). They\'re signals that need context. A company with moderate debt but strong cashflow is different from one with low debt but declining revenue.',
      },
      {
        type: 'p',
        text: 'Red flags: Inactive registration, current insolvency, multiple court judgments, debt >50% of revenue. Yellow flags: Payment delays, increasing debt, sector decline, ownership changes. Green signals: Active status, stable debt, consistent payments, positive financials.',
      },
      { type: 'h2', text: 'Building a credit check workflow' },
      {
        type: 'ul',
        items: [
          'Standardize the process: Same checks for all new counterparties, same frequency for existing ones.',
          'Document decisions: Record why you approved/denied credit based on CUI results.',
          'Set thresholds: Define clear rules (e.g., "insolvency = no credit, debt >50% revenue = reduced limits").',
          'Review periodically: Credit health changes — quarterly reviews catch shifts early.',
        ],
      },
      { type: 'h2', text: 'Common pitfalls' },
      {
        type: 'ul',
        items: [
          'Checking only at onboarding: Credit risk is dynamic, not static.',
          'Ignoring related companies: Ownership structures can hide concentration risk.',
          'Over-relying on single data points: Combine CUI checks with payment behavior and sector trends.',
          'Not updating watchlists: If a CUI check reveals issues, add the company to your monitoring list.',
        ],
      },
      {
        type: 'p',
        text: 'CUI credit checks are a tool, not a solution. They provide data — your job is to interpret it in context and act. Start with clear thresholds, standardize your process, and review regularly. The goal is prevention, not detection after the fact.',
      },
    ],
  },
  {
    slug: 'building-watchlist-romanian-sme-partners',
    title: 'Building a Credit Risk Watchlist for Romanian SME Partners',
    tag: 'Strategy',
    date: 'Dec 15, 2025',
    excerpt: 'A step-by-step guide to creating and maintaining an effective watchlist for monitoring Romanian B2B credit risk.',
    readingTime: '10 min read',
    author: {
      name: 'Alex Morgan',
      role: 'Risk Analytics Lead',
      org: 'marketrisk',
      bio: 'Writes about narrative-first reporting, trustworthy dashboards, and executive-ready decision support.',
    },
    sections: [
      {
        type: 'p',
        text: 'A credit risk watchlist isn\'t a list of "bad" companies. It\'s a focused monitoring system for counterparties that matter — either because of high exposure, changing risk signals, or strategic importance.',
      },
      {
        type: 'p',
        text: 'For Romanian B2B teams, a well-built watchlist is your early warning system. It helps you catch problems before they become defaults, and it keeps monitoring manageable when you have hundreds of counterparties.',
      },
      { type: 'h2', text: 'Who belongs on your watchlist' },
      {
        type: 'p',
        text: 'Not every counterparty needs daily monitoring. Your watchlist should prioritize based on exposure, risk signals, and business importance. A small, stable customer doesn\'t need the same attention as a large, volatile partner.',
      },
      {
        type: 'ul',
        items: [
          'High exposure: Top 20 counterparties by outstanding receivables (monitor weekly).',
          'Risk signals: Companies with payment delays >30 days, increasing debt, or BPI notices (monitor daily).',
          'Strategic partners: Key suppliers or customers, even if exposure is moderate (monitor monthly).',
          'Sector concentration: If one sector represents >30% of exposure, monitor top companies in that sector.',
        ],
      },
      { type: 'h2', text: 'Setting up your watchlist structure' },
      {
        type: 'p',
        text: 'A watchlist needs structure: CUI, company name, exposure amount, risk level, last check date, next review date. Without structure, it becomes a disorganized list that nobody uses.',
      },
      {
        type: 'ul',
        items: [
          'CUI: Always include the CUI — it\'s your anchor for all data lookups.',
          'Exposure: Current outstanding receivables or credit limit (whichever is higher).',
          'Risk level: Low / Medium / High — update based on latest checks.',
          'Last check: Date of most recent credit check or BPI scan.',
          'Next review: When to check again (weekly for high risk, monthly for medium, quarterly for low).',
          'Notes: Brief context (e.g., "Payment delay resolved", "Sector decline").',
        ],
      },
      { type: 'h2', text: 'Monitoring cadence and alerts' },
      {
        type: 'p',
        text: 'Different companies need different monitoring frequencies. High-risk companies get daily BPI checks and weekly credit reviews. Low-risk companies get monthly reviews. The key is consistency — set a schedule and stick to it.',
      },
      {
        type: 'ul',
        items: [
          'Daily: BPI insolvency alerts for all watchlist companies.',
          'Weekly: Credit check refresh for high-risk companies (exposure >€50,000 or payment delays).',
          'Monthly: Credit check refresh for medium-risk companies.',
          'Quarterly: Full review of all watchlist companies, add/remove based on current status.',
        ],
      },
      { type: 'h2', text: 'When to add companies to the watchlist' },
      {
        type: 'ul',
        items: [
          'New counterparty with exposure >€25,000: Add immediately, start with medium-risk monitoring.',
          'Payment delay >30 days: Escalate to watchlist, increase monitoring frequency.',
          'BPI notice: Add immediately, set to high-risk, daily monitoring.',
          'Debt increase >20%: Add if not already on list, or increase risk level if present.',
          'Sector decline: Add top companies in declining sectors, even if individual signals are low.',
        ],
      },
      { type: 'h2', text: 'When to remove companies' },
      {
        type: 'p',
        text: 'A watchlist that only grows becomes unmanageable. Remove companies when risk normalizes, but do it deliberately — not because you forgot to check.',
      },
      {
        type: 'ul',
        items: [
          'Exposure reduced: If exposure drops below threshold and no risk signals, move to quarterly review.',
          'Risk resolved: Payment delays resolved, debt normalized, BPI cleared — downgrade risk level.',
          'Company dissolved: If company is liquidated or dissolved, archive the record but keep for historical reference.',
          'Quarterly review: Every quarter, review all watchlist entries — remove if no longer meets criteria.',
        ],
      },
      { type: 'h2', text: 'Making the watchlist actionable' },
      {
        type: 'p',
        text: 'A watchlist that sits unused is worthless. It needs to drive decisions: when to check, when to escalate, when to reduce exposure. Build it into your weekly risk review process.',
      },
      {
        type: 'ul',
        items: [
          'Weekly review: Every Monday, review high-risk companies, check BPI alerts, update risk levels.',
          'Escalation rules: Define clear thresholds (e.g., "High risk + exposure >€100,000 = executive review").',
          'Action tracking: Record what actions you took based on watchlist signals (e.g., "Reduced credit limit", "Requested payment plan").',
          'Reporting: Include watchlist summary in weekly risk reports — how many companies, risk distribution, recent changes.',
        ],
      },
      {
        type: 'p',
        text: 'A Romanian SME watchlist isn\'t about monitoring everything — it\'s about monitoring what matters. Start with your top 20 exposures, add companies based on clear criteria, review regularly, and remove when risk normalizes. Keep it focused, keep it updated, and it becomes your most valuable credit risk tool.',
      },
    ],
  },
]

export function getBlogPostBySlug(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) || null
}


