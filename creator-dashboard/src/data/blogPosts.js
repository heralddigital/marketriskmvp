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
      org: 'MarketRisk',
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
      org: 'MarketRisk',
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
      org: 'MarketRisk',
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
]

export function getBlogPostBySlug(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) || null
}


