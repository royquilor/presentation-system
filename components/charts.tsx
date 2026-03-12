"use client";

const COLORS = {
  electricBlue: "#002BFE",
  admiralBlue: "#00167F",
  midnight: "#000A14",
  white: "#FFFFFF",
  grey50: "#666666",
  grey30: "#999999",
  grey15: "#D4D4D4",
  grey05: "#F2F2F2",
  success: "#00875A",
  warning: "#DE350B",
  amber: "#FF991F",
  teal: "#00B8D9",
  purple: "#5243AA",
};

export function ROIBarChart() {
  const barWidth = 64;
  const chartHeight = 260;
  const chartWidth = 480;
  const leftPad = 80;
  const topPad = 24;
  const gap = 32;

  const maxVal = 78;
  const scale = (v: number) => (v / maxVal) * (chartHeight - topPad);

  const bars = [
    { label: "Year-1 Cost\n(low)", value: 0.905, color: COLORS.grey50 },
    { label: "Year-1 Cost\n(high)", value: 1.685, color: COLORS.grey30 },
    { label: "MS Copilot\n(annual)", value: 3.9, color: COLORS.amber },
    { label: "Value\n(conservative)", value: 15.6, color: COLORS.electricBlue },
    { label: "Value\n(optimistic)", value: 78, color: COLORS.admiralBlue },
  ];

  const totalWidth = leftPad + bars.length * (barWidth + gap);

  return (
    <svg viewBox={`0 0 ${totalWidth + 20} ${chartHeight + 80}`} className="w-full max-w-xl" role="img" aria-label="ROI and cost comparison bar chart">
      <text x={totalWidth / 2 + leftPad / 2} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Annual Value vs. Cost (NZD Millions)
      </text>

      {[0, 10, 20, 40, 60, 78].map((tick) => {
        const y = chartHeight - scale(tick);
        return (
          <g key={tick}>
            <line x1={leftPad - 4} y1={y} x2={totalWidth} y2={y} stroke="currentColor" strokeOpacity={0.08} />
            <text x={leftPad - 8} y={y + 4} textAnchor="end" fontSize="10" className="fill-foreground/40">
              ${tick}M
            </text>
          </g>
        );
      })}

      {bars.map((bar, i) => {
        const x = leftPad + i * (barWidth + gap);
        const h = scale(bar.value);
        const y = chartHeight - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={h} fill={bar.color} rx={4} />
            <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-foreground">
              ${bar.value >= 10 ? bar.value.toFixed(0) : bar.value.toFixed(1)}M
            </text>
            {bar.label.split("\n").map((line, li) => (
              <text
                key={li}
                x={x + barWidth / 2}
                y={chartHeight + 16 + li * 13}
                textAnchor="middle"
                fontSize="9"
                className="fill-foreground/50"
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function FeatureMaturityPieChart() {
  const data = [
    { label: "Shipped", value: 14, color: COLORS.electricBlue },
    { label: "Planned", value: 10, color: COLORS.teal },
    { label: "Blocked", value: 1, color: COLORS.warning },
    { label: "POC", value: 1, color: COLORS.amber },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 140;
  const cy = 140;
  const r = 100;
  const innerR = 60;

  let cumAngle = -Math.PI / 2;
  const slices = data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle;
    cumAngle = endAngle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(endAngle);
    const iy1 = cy + innerR * Math.sin(endAngle);
    const ix2 = cx + innerR * Math.cos(startAngle);
    const iy2 = cy + innerR * Math.sin(startAngle);
    const large = angle > Math.PI ? 1 : 0;

    const midAngle = startAngle + angle / 2;
    const labelR = r + 20;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);

    const pct = Math.round((d.value / total) * 100);
    return { ...d, path: `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${ix1},${iy1} A${innerR},${innerR} 0 ${large} 0 ${ix2},${iy2} Z`, lx, ly, pct };
  });

  return (
    <svg viewBox="0 0 340 300" className="w-full max-w-xs" role="img" aria-label="Feature maturity donut chart">
      <text x={170} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Platform Feature Maturity
      </text>
      {slices.map((s, i) => (
        <g key={i}>
          <path d={s.path} fill={s.color} />
          <text x={s.lx} y={s.ly + 4} textAnchor="middle" fontSize="9" className="fill-foreground/60">
            {s.label} ({s.value})
          </text>
        </g>
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="700" className="fill-foreground">
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" className="fill-foreground/40">
        Features
      </text>

      <g transform={`translate(40, 270)`}>
        {slices.map((d, i) => (
          <g key={i} transform={`translate(${i * 80}, 0)`}>
            <rect width={10} height={10} rx={2} fill={d.color} />
            <text x={14} y={9} fontSize="9" className="fill-foreground/60">{d.label} ({d.pct}%)</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function RiskSeverityScatter() {
  const chartW = 440;
  const chartH = 280;
  const padL = 80;
  const padB = 48;
  const padT = 32;
  const padR = 20;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const likelihoodLabels = ["Low", "Medium", "High"];
  const impactLabels = ["Low", "Medium", "High", "Medium/High"];

  const risks = [
    { name: "TLS Certs", likelihood: 2, impact: 3, color: COLORS.warning, blocked: true },
    { name: "Public Azure", likelihood: 1.5, impact: 3, color: COLORS.warning, blocked: true },
    { name: "No IaC", likelihood: 1, impact: 1, color: COLORS.amber, blocked: false },
    { name: "Vuln Alerts", likelihood: 2, impact: 0.5, color: COLORS.teal, blocked: false },
    { name: "No Logging", likelihood: 2, impact: 2.5, color: COLORS.warning, blocked: true },
    { name: "Data Controls", likelihood: 1, impact: 1.5, color: COLORS.amber, blocked: false },
    { name: "Prod Access", likelihood: 1, impact: 2, color: COLORS.warning, blocked: true },
  ];

  const xScale = (v: number) => padL + (v / 2) * plotW;
  const yScale = (v: number) => padT + plotH - (v / 3) * plotH;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full max-w-lg" role="img" aria-label="Risk severity scatter plot">
      <text x={chartW / 2} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Production Risk Matrix — Likelihood vs. Impact
      </text>

      {[0, 1, 2].map((i) => {
        const x = xScale(i);
        return (
          <g key={`xl-${i}`}>
            <line x1={x} y1={padT} x2={x} y2={chartH - padB} stroke="currentColor" strokeOpacity={0.06} />
            <text x={x} y={chartH - padB + 16} textAnchor="middle" fontSize="9" className="fill-foreground/40">
              {likelihoodLabels[i]}
            </text>
          </g>
        );
      })}
      <text x={padL + plotW / 2} y={chartH - 4} textAnchor="middle" fontSize="9" className="fill-foreground/40">
        Likelihood →
      </text>

      {[0, 1, 2, 3].map((i) => {
        const y = yScale(i);
        return (
          <g key={`yl-${i}`}>
            <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="currentColor" strokeOpacity={0.06} />
            <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="9" className="fill-foreground/40">
              {impactLabels[i]}
            </text>
          </g>
        );
      })}
      <text x={12} y={padT + plotH / 2} textAnchor="middle" fontSize="9" className="fill-foreground/40" transform={`rotate(-90, 12, ${padT + plotH / 2})`}>
        Impact →
      </text>

      <rect x={xScale(1.3)} y={yScale(3)} width={xScale(2) - xScale(1.3) + padR} height={yScale(2) - yScale(3)} fill={COLORS.warning} fillOpacity={0.06} rx={4} />

      {risks.map((r, i) => (
        <g key={i}>
          <circle cx={xScale(r.likelihood)} cy={yScale(r.impact)} r={8} fill={r.color} fillOpacity={0.9} stroke={r.blocked ? COLORS.midnight : "none"} strokeWidth={r.blocked ? 2 : 0} strokeDasharray={r.blocked ? "3 2" : "none"} />
          <text x={xScale(r.likelihood) + 12} y={yScale(r.impact) + 3} fontSize="8" className="fill-foreground/60">
            {r.name}
          </text>
        </g>
      ))}

      <g transform={`translate(${padL}, ${padT - 6})`}>
        <circle cx={0} cy={0} r={4} fill={COLORS.warning} />
        <text x={8} y={3} fontSize="8" className="fill-foreground/40">Blocked on Group Tech</text>
        <circle cx={140} cy={0} r={4} fill={COLORS.amber} />
        <text x={148} y={3} fontSize="8" className="fill-foreground/40">Actionable</text>
        <circle cx={230} cy={0} r={4} fill={COLORS.teal} />
        <text x={238} y={3} fontSize="8" className="fill-foreground/40">In Progress</text>
      </g>
    </svg>
  );
}

export function CostComparisonChart() {
  const barH = 36;
  const gap = 16;
  const chartW = 480;
  const padL = 120;
  const padR = 60;
  const plotW = chartW - padL - padR;

  const items = [
    { label: "Conver Infra", value: 35, color: COLORS.electricBlue, displayValue: "$35K" },
    { label: "Conver Year 1 (low)", value: 905, color: COLORS.electricBlue, displayValue: "$905K" },
    { label: "Conver Year 1 (high)", value: 1685, color: COLORS.admiralBlue, displayValue: "$1.7M" },
    { label: "MS Copilot", value: 3900, color: COLORS.grey50, displayValue: "$3.9M" },
  ];

  const maxVal = 3900;
  const scale = (v: number) => (v / maxVal) * plotW;

  return (
    <svg viewBox={`0 0 ${chartW} ${items.length * (barH + gap) + 60}`} className="w-full max-w-lg" role="img" aria-label="Annual cost comparison chart">
      <text x={chartW / 2} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Annual Cost Comparison (NZD)
      </text>
      {items.map((item, i) => {
        const y = 40 + i * (barH + gap);
        const w = Math.max(scale(item.value), 4);
        return (
          <g key={i}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fontSize="10" className="fill-foreground/60">
              {item.label}
            </text>
            <rect x={padL} y={y} width={w} height={barH} fill={item.color} rx={4} />
            <text x={padL + w + 6} y={y + barH / 2 + 4} fontSize="10" fontWeight="600" className="fill-foreground">
              {item.displayValue}
            </text>
          </g>
        );
      })}
      <text x={padL + plotW / 2} y={items.length * (barH + gap) + 56} textAnchor="middle" fontSize="9" className="fill-foreground/30">
        Conver infrastructure is 99% cheaper than Microsoft Copilot for the same 6,500 users
      </text>
    </svg>
  );
}

export function TimelineChart() {
  const milestones = [
    { date: "Apr 2025", label: "Pilot Begins", done: true },
    { date: "Sep 2025", label: "Migration to Production", done: true },
    { date: "Nov 2025", label: "Risk Review (7 active)", done: true },
    { date: "Jan 2026", label: "Business Case Documented", done: true },
    { date: "Mar 2026", label: "Token Audit Initiated", done: true },
    { date: "Q2 2026", label: "Full Rollout (6,500)", done: false },
    { date: "Q3 2026", label: "ISO 27001 Audit Ready", done: false },
  ];

  const w = 520;
  const h = 120;
  const padL = 20;
  const padR = 20;
  const lineY = 50;
  const plotW = w - padL - padR;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xl" role="img" aria-label="Project timeline">
      <text x={w / 2} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Conver Platform Timeline
      </text>
      <line x1={padL} y1={lineY} x2={w - padR} y2={lineY} stroke="currentColor" strokeOpacity={0.15} strokeWidth={2} />
      {milestones.map((m, i) => {
        const x = padL + (i / (milestones.length - 1)) * plotW;
        return (
          <g key={i}>
            <circle cx={x} cy={lineY} r={6} fill={m.done ? COLORS.electricBlue : "none"} stroke={m.done ? COLORS.electricBlue : COLORS.grey30} strokeWidth={2} />
            {m.done && <path d={`M${x - 3} ${lineY} l2 3 l4 -5`} stroke={COLORS.white} strokeWidth={1.5} fill="none" />}
            <text x={x} y={lineY + 20} textAnchor="middle" fontSize="8" fontWeight="600" className="fill-foreground/70">
              {m.date}
            </text>
            <text x={x} y={lineY + 32} textAnchor="middle" fontSize="7" className="fill-foreground/40">
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function EfficiencyGainsChart() {
  const scenarios = [
    { label: "1 hr/week", hours: "312K", value: "$15.6M", pct: 20 },
    { label: "3 hrs/week", hours: "936K", value: "$46.8M", pct: 60 },
    { label: "5 hrs/week", hours: "1.56M", value: "$78M", pct: 100 },
  ];

  const w = 480;
  const padL = 90;
  const padR = 80;
  const barH = 40;
  const gap = 24;
  const plotW = w - padL - padR;

  return (
    <svg viewBox={`0 0 ${w} ${scenarios.length * (barH + gap) + 70}`} className="w-full max-w-lg" role="img" aria-label="Efficiency gains scenarios">
      <text x={w / 2} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Productivity Gain Scenarios — Annual Value (NZD)
      </text>
      <text x={w / 2} y={30} textAnchor="middle" fontSize="8" className="fill-foreground/30">
        6,500 employees × 48 weeks × $50 NZD loaded cost/hour
      </text>
      {scenarios.map((s, i) => {
        const y = 48 + i * (barH + gap);
        const barW = (s.pct / 100) * plotW;
        return (
          <g key={i}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fontSize="10" className="fill-foreground/60">
              {s.label}
            </text>
            <rect x={padL} y={y} width={barW} height={barH} fill={i === 0 ? COLORS.teal : i === 1 ? COLORS.electricBlue : COLORS.admiralBlue} rx={4} />
            <text x={padL + barW + 6} y={y + 16} fontSize="12" fontWeight="700" className="fill-foreground">
              {s.value}
            </text>
            <text x={padL + barW + 6} y={y + 30} fontSize="9" className="fill-foreground/40">
              {s.hours} hours saved
            </text>
          </g>
        );
      })}
      <text x={padL + plotW / 2} y={scenarios.length * (barH + gap) + 60} textAnchor="middle" fontSize="9" className="fill-foreground/30">
        Break-even: only 0.1% of an employee&apos;s time needed to cover per-user cost
      </text>
    </svg>
  );
}

export function AdoptionGrowthChart() {
  const periods = [
    { label: "2024\n(Nov–Dec)", value: 1217, display: "1,217" },
    { label: "2025 Q1\n(Jan–Mar)", value: 3700, display: "3,700" },
    { label: "2025 Q2\n(Apr–Jun)", value: 10090, display: "10,090" },
    { label: "2025 Q3\n(Jul 1–8)", value: 1455, display: "1,455" },
  ];

  const w = 420;
  const padL = 40;
  const padR = 20;
  const padT = 36;
  const padB = 50;
  const plotW = w - padL - padR;
  const plotH = 180;
  const maxVal = 11000;

  const barW = 56;
  const gap = (plotW - periods.length * barW) / (periods.length + 1);
  const scale = (v: number) => (v / maxVal) * plotH;

  return (
    <svg viewBox={`0 0 ${w} ${padT + plotH + padB + 10}`} className="w-full max-w-md" role="img" aria-label="Conversation volume growth">
      <text x={w / 2} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Conversation Volume Growth (~600% YoY)
      </text>
      {periods.map((p, i) => {
        const x = padL + gap + i * (barW + gap);
        const h = scale(p.value);
        const y = padT + plotH - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} fill={COLORS.electricBlue} fillOpacity={0.2 + (i / periods.length) * 0.8} rx={4} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-foreground">
              {p.display}
            </text>
            {p.label.split("\n").map((line, li) => (
              <text key={li} x={x + barW / 2} y={padT + plotH + 16 + li * 12} textAnchor="middle" fontSize="8" className="fill-foreground/40">
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function CoffeeBreakROI() {
  const w = 420;
  const h = 300;
  const cupW = 120;
  const cupH = 160;
  const cx = w / 2;
  const cupTop = 60;

  const fillPct = 0.12;
  const fillH = cupH * fillPct;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-sm" role="img" aria-label="Coffee break ROI metaphor">
      <text x={cx} y={20} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Time to Pay for Itself
      </text>

      <rect x={cx - cupW / 2} y={cupTop} width={cupW} height={cupH} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={2} />
      <rect x={cx - cupW / 2 + 4} y={cupTop + cupH - fillH - 4} width={cupW - 8} height={fillH} rx={4} fill={COLORS.electricBlue} fillOpacity={0.7} />

      <path d={`M${cx + cupW / 2} ${cupTop + 20} Q${cx + cupW / 2 + 30} ${cupTop + 40} ${cx + cupW / 2} ${cupTop + 60}`} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={2} />

      <text x={cx} y={cupTop + cupH / 2 + 4} textAnchor="middle" fontSize="28" fontWeight="700" className="fill-foreground">
        5 min
      </text>
      <text x={cx} y={cupTop + cupH / 2 + 20} textAnchor="middle" fontSize="9" className="fill-foreground/40">
        per day per person
      </text>

      <text x={cx} y={cupTop + cupH + 28} textAnchor="middle" fontSize="10" className="fill-foreground/60">
        That&apos;s a coffee break. That&apos;s all it takes.
      </text>
      <text x={cx} y={cupTop + cupH + 44} textAnchor="middle" fontSize="9" className="fill-foreground/30">
        0.1% of an employee&apos;s time covers the entire platform cost
      </text>
    </svg>
  );
}

export function WaffleChart({ filled, total, label, sublabel }: { filled: number; total: number; label: string; sublabel: string }) {
  const cols = 10;
  const rows = Math.ceil(total / cols);
  const cellSize = 18;
  const gap = 3;
  const w = cols * (cellSize + gap) + gap;
  const h = rows * (cellSize + gap) + gap + 50;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xs" role="img" aria-label={label}>
      <text x={w / 2} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        {label}
      </text>
      {Array.from({ length: total }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = gap + col * (cellSize + gap);
        const y = 28 + row * (cellSize + gap);
        const isFilled = i < filled;
        return (
          <rect key={i} x={x} y={y} width={cellSize} height={cellSize} rx={3} fill={isFilled ? COLORS.electricBlue : "currentColor"} fillOpacity={isFilled ? 0.85 : 0.06} />
        );
      })}
      <text x={w / 2} y={h - 8} textAnchor="middle" fontSize="9" className="fill-foreground/40">
        {sublabel}
      </text>
    </svg>
  );
}

export function RadialGauge({ value, max, label, sublabel, color }: { value: number; max: number; label: string; sublabel: string; color?: string }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2 + 16;
  const r = 70;
  const stroke = 14;
  const startAngle = -210;
  const endAngle = 30;
  const totalArc = endAngle - startAngle;
  const pct = Math.min(value / max, 1);
  const valAngle = startAngle + totalArc * pct;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (start: number, end: number, radius: number) => {
    const s = { x: cx + radius * Math.cos(toRad(start)), y: cy + radius * Math.sin(toRad(start)) };
    const e = { x: cx + radius * Math.cos(toRad(end)), y: cy + radius * Math.sin(toRad(end)) };
    const large = end - start > 180 ? 1 : 0;
    return `M${s.x},${s.y} A${radius},${radius} 0 ${large} 1 ${e.x},${e.y}`;
  };

  return (
    <svg viewBox={`0 0 ${size} ${size + 20}`} className="w-full max-w-[180px]" role="img" aria-label={label}>
      <path d={arcPath(startAngle, endAngle, r)} fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={stroke} strokeLinecap="round" />
      <path d={arcPath(startAngle, valAngle, r)} fill="none" stroke={color || COLORS.electricBlue} strokeWidth={stroke} strokeLinecap="round" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="24" fontWeight="700" className="fill-foreground">
        {label}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" className="fill-foreground/40">
        {sublabel}
      </text>
    </svg>
  );
}

export function FunnelChart() {
  const w = 400;
  const h = 280;
  const cx = w / 2;
  const stages = [
    { label: "6,500 employees", width: 300, color: COLORS.grey15 },
    { label: "3,000+ active users", width: 240, color: COLORS.teal },
    { label: "195 analysed", width: 180, color: COLORS.electricBlue },
    { label: "73 core adopters", width: 130, color: COLORS.admiralBlue },
    { label: "54 power users", width: 80, color: COLORS.midnight },
  ];
  const stageH = 38;
  const gap = 6;
  const topY = 32;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-sm" role="img" aria-label="Adoption funnel">
      <text x={cx} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Adoption Funnel — No Mandate Required
      </text>
      {stages.map((s, i) => {
        const y = topY + i * (stageH + gap);
        const nextW = stages[i + 1]?.width ?? s.width * 0.6;
        return (
          <g key={i}>
            <path
              d={`M${cx - s.width / 2},${y} L${cx + s.width / 2},${y} L${cx + nextW / 2},${y + stageH} L${cx - nextW / 2},${y + stageH} Z`}
              fill={s.color}
              fillOpacity={i === 0 ? 0.3 : 0.85}
            />
            <text x={cx} y={y + stageH / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="600" className={i === 0 ? "fill-foreground/60" : "fill-white"}>
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function StackedValueBreakdown() {
  const w = 460;
  const h = 200;
  const padL = 10;
  const barH = 48;
  const barW = w - padL * 2;
  const y = 50;

  const segments = [
    { label: "Azure", value: 35, color: COLORS.grey30 },
    { label: "Tokens", value: 625, color: COLORS.teal },
    { label: "Staff (4 FTE)", value: 700, color: COLORS.electricBlue },
    { label: "Overhead", value: 325, color: COLORS.admiralBlue },
  ];
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumX = padL;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg" role="img" aria-label="Cost breakdown stacked bar">
      <text x={w / 2} y={20} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Where the $1.685M Goes — 100% of Investment Breakdown
      </text>
      {segments.map((seg, i) => {
        const segW = (seg.value / total) * barW;
        const x = cumX;
        cumX += segW;
        return (
          <g key={i}>
            <rect x={x} y={y} width={segW} height={barH} fill={seg.color} rx={i === 0 ? 6 : 0} />
            {segW > 40 && (
              <>
                <text x={x + segW / 2} y={y + barH / 2 - 2} textAnchor="middle" fontSize="10" fontWeight="600" fill="white">
                  {seg.label}
                </text>
                <text x={x + segW / 2} y={y + barH / 2 + 12} textAnchor="middle" fontSize="9" fill="white" fillOpacity={0.7}>
                  ${seg.value >= 1000 ? (seg.value / 1000).toFixed(1) + "M" : seg.value + "K"}
                </text>
              </>
            )}
          </g>
        );
      })}
      <rect x={padL} y={y} width={barW} height={barH} fill="none" stroke="currentColor" strokeOpacity={0.15} rx={6} />

      <line x1={padL} y1={y + barH + 20} x2={padL + (15.6 / total) * barW * 10} y2={y + barH + 20} stroke={COLORS.electricBlue} strokeWidth={3} strokeLinecap="round" />
      <text x={padL} y={y + barH + 38} fontSize="9" className="fill-foreground/50">
        $15.6M return = 826% ROI (conservative)
      </text>
      <text x={padL} y={y + barH + 52} fontSize="9" className="fill-foreground/30">
        Return line shown at relative scale — cost bar above is 100% of $1.685M
      </text>
    </svg>
  );
}

export function DepartmentImpactBubbles() {
  const w = 440;
  const h = 260;

  const depts = [
    { name: "IT Support", metric: "Tickets/person ↑", size: 60, x: 110, y: 100, color: COLORS.electricBlue },
    { name: "HR", metric: "Query resolution ↑", size: 50, x: 230, y: 80, color: COLORS.teal },
    { name: "Development", metric: "Code velocity ↑", size: 55, x: 340, y: 110, color: COLORS.admiralBlue },
    { name: "Legal", metric: "Doc review time ↓", size: 35, x: 160, y: 190, color: COLORS.purple },
    { name: "Marketing", metric: "Content output ↑", size: 40, x: 290, y: 185, color: COLORS.success },
  ];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md" role="img" aria-label="Department impact bubbles">
      <text x={w / 2} y={20} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Phase 1 Department Impact — Measurable Gains
      </text>
      {depts.map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r={d.size} fill={d.color} fillOpacity={0.15} stroke={d.color} strokeWidth={2} />
          <text x={d.x} y={d.y - 4} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-foreground/80">
            {d.name}
          </text>
          <text x={d.x} y={d.y + 10} textAnchor="middle" fontSize="8" className="fill-foreground/40">
            {d.metric}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function ShadowAIRiskGauge() {
  const w = 400;
  const h = 200;
  const cx = w / 2;
  const cy = 140;
  const r = 80;
  const stroke = 16;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arc = (s: number, e: number) => {
    const sx = cx + r * Math.cos(toRad(s));
    const sy = cy + r * Math.sin(toRad(s));
    const ex = cx + r * Math.cos(toRad(e));
    const ey = cy + r * Math.sin(toRad(e));
    return `M${sx},${sy} A${r},${r} 0 ${e - s > 180 ? 1 : 0} 1 ${ex},${ey}`;
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-sm" role="img" aria-label="Shadow AI risk meter">
      <text x={cx} y={20} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Shadow AI Risk — Without Conver
      </text>

      <path d={arc(-180, -60)} fill="none" stroke={COLORS.success} strokeWidth={stroke} strokeLinecap="round" strokeOpacity={0.6} />
      <path d={arc(-60, -10)} fill="none" stroke={COLORS.amber} strokeWidth={stroke} strokeLinecap="round" strokeOpacity={0.6} />
      <path d={arc(-10, 0)} fill="none" stroke={COLORS.warning} strokeWidth={stroke} strokeLinecap="round" strokeOpacity={0.6} />

      <line x1={cx} y1={cy} x2={cx + (r - 20) * Math.cos(toRad(-15))} y2={cy + (r - 20) * Math.sin(toRad(-15))} stroke={COLORS.warning} strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={5} fill={COLORS.warning} />

      <text x={cx} y={cy + 28} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-foreground/60">
        Without Conver: employees use ungoverned tools
      </text>
      <text x={cx} y={cy + 42} textAnchor="middle" fontSize="9" className="fill-foreground/30">
        Data leakage · Compliance violations · No audit trail
      </text>
    </svg>
  );
}

export function AgentLibPerformanceChart() {
  const w = 480;
  const h = 220;
  const padL = 120;
  const padR = 80;
  const barH = 32;
  const gap = 12;
  const plotW = w - padL - padR;

  const items = [
    { label: "Before (baseline)", value: 5000, display: "5,000ms", color: COLORS.grey50 },
    { label: "After (optimised)", value: 12, display: "12ms", color: COLORS.electricBlue },
  ];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg" role="img" aria-label="Performance improvement">
      <text x={w / 2} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        API Response Time — 400x Improvement
      </text>
      {items.map((item, i) => {
        const y = 40 + i * (barH + gap + 20);
        const maxVal = 5000;
        const barW = Math.max((item.value / maxVal) * plotW, 4);
        return (
          <g key={i}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fontSize="10" className="fill-foreground/60">
              {item.label}
            </text>
            <rect x={padL} y={y} width={barW} height={barH} fill={item.color} rx={4} />
            <text x={padL + barW + 6} y={y + barH / 2 + 4} fontSize="11" fontWeight="600" className="fill-foreground">
              {item.display}
            </text>
          </g>
        );
      })}
      <text x={w / 2} y={h - 8} textAnchor="middle" fontSize="9" className="fill-foreground/30">
        VNet peering + optimised DB connectivity eliminated 99.8% of latency
      </text>
    </svg>
  );
}

export function AgentLibSecurityChart() {
  const w = 380;
  const h = 260;
  const cx = 140;
  const cy = 130;
  const r = 80;
  const innerR = 50;

  const data = [
    { label: "HIGH fixed", value: 4, color: COLORS.success },
    { label: "MEDIUM fixed", value: 1, color: COLORS.teal },
    { label: "LOW fixed", value: 3, color: COLORS.electricBlue },
    { label: "Accepted", value: 10, color: COLORS.grey30 },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);
  let cumAngle = -Math.PI / 2;
  const slices = data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle;
    cumAngle = endAngle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(endAngle);
    const iy1 = cy + innerR * Math.sin(endAngle);
    const ix2 = cx + innerR * Math.cos(startAngle);
    const iy2 = cy + innerR * Math.sin(startAngle);
    const large = angle > Math.PI ? 1 : 0;
    const pct = Math.round((d.value / total) * 100);
    return { ...d, path: `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${ix1},${iy1} A${innerR},${innerR} 0 ${large} 0 ${ix2},${iy2} Z`, pct };
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xs" role="img" aria-label="Security findings donut">
      <text x={w / 2} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Pen Test Findings — 18 Total
      </text>
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="700" className="fill-foreground">
        8/18
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" className="fill-foreground/40">
        Remediated
      </text>
      <g transform={`translate(20, ${h - 20})`}>
        {slices.map((d, i) => (
          <g key={i} transform={`translate(${i * 90}, 0)`}>
            <rect width={10} height={10} rx={2} fill={d.color} />
            <text x={14} y={9} fontSize="8" className="fill-foreground/60">{d.label} ({d.pct}%)</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function AgentLibWAFChart() {
  const w = 400;
  const h = 200;
  const padL = 120;
  const padR = 60;
  const barH = 24;
  const gap = 10;
  const plotW = w - padL - padR;

  const pillars = [
    { label: "Security", score: 9, color: COLORS.electricBlue },
    { label: "Reliability", score: 8.5, color: COLORS.electricBlue },
    { label: "Operational", score: 8.5, color: COLORS.electricBlue },
    { label: "Cost", score: 8.5, color: COLORS.electricBlue },
    { label: "Performance", score: 7, color: COLORS.teal },
  ];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md" role="img" aria-label="WAF score breakdown">
      <text x={w / 2} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Azure Well-Architected Framework — 8.5/10 (A-)
      </text>
      {pillars.map((p, i) => {
        const y = 36 + i * (barH + gap);
        const barW = (p.score / 10) * plotW;
        return (
          <g key={i}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fontSize="10" className="fill-foreground/60">
              {p.label}
            </text>
            <rect x={padL} y={y} width={barW} height={barH} fill={p.color} rx={3} fillOpacity={0.8} />
            <text x={padL + barW + 6} y={y + barH / 2 + 4} fontSize="10" fontWeight="600" className="fill-foreground">
              {p.score}/10
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function AgentLibDevVelocityChart() {
  const w = 460;
  const h = 240;
  const padL = 40;
  const padR = 20;
  const padT = 36;
  const padB = 50;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const weeks = [
    { label: "Week 1\nJul 25", features: 22 },
    { label: "Week 2\nAug 1", features: 35 },
    { label: "Week 3\nAug 8", features: 30 },
    { label: "Week 4\nAug 15", features: 33 },
    { label: "Week 5\nAug 22", features: 30 },
  ];

  const maxVal = 40;
  const barW = 48;
  const gap = (plotW - weeks.length * barW) / (weeks.length + 1);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md" role="img" aria-label="Development velocity">
      <text x={w / 2} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        Development Velocity — 150+ Features in 34 Days
      </text>
      {weeks.map((wk, i) => {
        const x = padL + gap + i * (barW + gap);
        const barH = (wk.features / maxVal) * plotH;
        const y = padT + plotH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill={COLORS.electricBlue} fillOpacity={0.3 + (i / weeks.length) * 0.7} rx={4} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-foreground">
              {wk.features}
            </text>
            {wk.label.split("\n").map((line, li) => (
              <text key={li} x={x + barW / 2} y={padT + plotH + 16 + li * 12} textAnchor="middle" fontSize="8" className="fill-foreground/40">
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function ModelPortfolioChart() {
  const providers = [
    { name: "Azure OpenAI", count: 7, color: COLORS.electricBlue },
    { name: "Google Gemini", count: 3, color: COLORS.success },
    { name: "Anthropic", count: 1, color: COLORS.purple },
    { name: "AWS Bedrock", count: 2, color: COLORS.amber },
  ];

  const total = providers.reduce((s, p) => s + p.count, 0);
  const w = 400;
  const barH = 24;
  const padL = 100;
  const padR = 60;
  const gap = 12;
  const plotW = w - padL - padR;
  const maxCount = 7;
  const scale = (v: number) => (v / maxCount) * plotW;

  return (
    <svg viewBox={`0 0 ${w} ${providers.length * (barH + gap) + 50}`} className="w-full max-w-md" role="img" aria-label="AI model portfolio chart">
      <text x={w / 2} y={16} textAnchor="middle" className="fill-foreground text-xs font-semibold" fontSize="11">
        AI Model Portfolio ({total} models across {providers.length} providers)
      </text>
      {providers.map((p, i) => {
        const y = 36 + i * (barH + gap);
        return (
          <g key={i}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fontSize="10" className="fill-foreground/60">
              {p.name}
            </text>
            <rect x={padL} y={y} width={scale(p.count)} height={barH} fill={p.color} rx={3} />
            <text x={padL + scale(p.count) + 8} y={y + barH / 2 + 4} fontSize="10" fontWeight="600" className="fill-foreground">
              {p.count}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Cost Analysis Charts ─────────────────────────────────── */

export function CostScenarioChart() {
  const scenarios = [
    { label: "Low ($5/user)", variable: 390, fixed: 515, total: 905, perUser: "$5" },
    { label: "Medium ($10/user)", variable: 780, fixed: 515, total: 1295, perUser: "$10" },
    { label: "High ($15/user)", variable: 1170, fixed: 515, total: 1685, perUser: "$15" },
  ];
  const w = 480, h = 220, padL = 105, padR = 80, padT = 30, padB = 20;
  const plotW = w - padL - padR;
  const barH = 32, gap = 20;
  const maxVal = 1800;
  const scale = (v: number) => (v / maxVal) * plotW;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg" role="img" aria-label="Cost scenario comparison">
      <text x={w / 2} y={16} textAnchor="middle" fontSize="11" className="fill-foreground text-xs font-semibold">
        Year-1 Total Cost by Scenario (NZD $K)
      </text>
      {scenarios.map((s, i) => {
        const y = padT + i * (barH + gap);
        return (
          <g key={i}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fontSize="10" className="fill-foreground/60">{s.label}</text>
            <rect x={padL} y={y} width={scale(s.fixed)} height={barH} fill={COLORS.admiralBlue} rx={3} />
            <rect x={padL + scale(s.fixed)} y={y} width={scale(s.variable)} height={barH} fill={COLORS.electricBlue} rx={0} ry={0} />
            <rect x={padL + scale(s.fixed) + scale(s.variable) - 3} y={y} width={3} height={barH} fill={COLORS.electricBlue} rx={0} ry={3} />
            <text x={padL + scale(s.total) + 8} y={y + barH / 2 + 4} fontSize="11" fontWeight="700" className="fill-foreground">${s.total.toLocaleString()}K</text>
          </g>
        );
      })}
      <g transform={`translate(${padL}, ${h - 8})`}>
        <rect width={10} height={10} fill={COLORS.admiralBlue} rx={2} />
        <text x={14} y={9} fontSize="9" className="fill-foreground/50">Fixed ($515K)</text>
        <rect x={90} width={10} height={10} fill={COLORS.electricBlue} rx={2} />
        <text x={104} y={9} fontSize="9" className="fill-foreground/50">Variable (tokens)</text>
      </g>
    </svg>
  );
}

export function CostBreakdownChart() {
  const items = [
    { label: "Infrastructure", value: 35, color: COLORS.teal, desc: "Azure hosting, storage, Defender" },
    { label: "Personnel (4 FTE)", value: 480, color: COLORS.admiralBlue, desc: "Product, Dev, Support, Governance" },
    { label: "Tokens (Medium)", value: 780, color: COLORS.electricBlue, desc: "Variable, charged back to LoBs" },
  ];
  const total = items.reduce((a, b) => a + b.value, 0);
  const w = 420, barH = 32, padT = 28;

  let x = 0;
  return (
    <svg viewBox={`0 0 ${w} ${barH + padT + 80}`} className="w-full max-w-md" role="img" aria-label="Cost structure breakdown">
      <text x={w / 2} y={16} textAnchor="middle" fontSize="11" className="fill-foreground text-xs font-semibold">
        Year-1 Cost Structure — Medium Scenario ($1.3M NZD)
      </text>
      {items.map((item, i) => {
        const segW = (item.value / total) * w;
        const rx = i === 0 ? 4 : 0;
        const seg = (
          <g key={i}>
            <rect x={x} y={padT} width={segW} height={barH} fill={item.color} rx={rx} />
            {segW > 40 && <text x={x + segW / 2} y={padT + barH / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="600" fill="white">${item.value}K</text>}
          </g>
        );
        x += segW;
        return seg;
      })}
      {items.map((item, i) => (
        <g key={`leg-${i}`} transform={`translate(0, ${padT + barH + 16 + i * 18})`}>
          <rect width={10} height={10} fill={item.color} rx={2} />
          <text x={16} y={9} fontSize="10" className="fill-foreground/60">{item.label} — {item.desc}</text>
        </g>
      ))}
    </svg>
  );
}

export function TokenCostAllocationChart() {
  const models = [
    { name: "GPT-4o-mini", usage: 70, costPct: 6, color: COLORS.teal },
    { name: "GPT-4o", usage: 25, costPct: 38, color: COLORS.electricBlue },
    { name: "GPT-o3", usage: 5, costPct: 56, color: COLORS.warning },
  ];
  const w = 440, h = 180;
  const barH = 20, padL = 90, padR = 50, gap = 16;
  const plotW = (w - padL - padR) / 2 - 20;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg" role="img" aria-label="Token usage vs cost allocation">
      <text x={padL + plotW / 2} y={16} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-foreground/50">% of Usage</text>
      <text x={padL + plotW + 40 + plotW / 2} y={16} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-foreground/50">% of Cost</text>
      {models.map((m, i) => {
        const y = 30 + i * (barH + gap);
        const usageW = (m.usage / 100) * plotW;
        const costW = (m.costPct / 100) * plotW;
        return (
          <g key={i}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fontSize="10" className="fill-foreground/60">{m.name}</text>
            <rect x={padL} y={y} width={usageW} height={barH} fill={m.color} rx={3} opacity={0.5} />
            <text x={padL + usageW + 6} y={y + barH / 2 + 4} fontSize="10" fontWeight="600" className="fill-foreground">{m.usage}%</text>
            <rect x={padL + plotW + 40} y={y} width={costW} height={barH} fill={m.color} rx={3} />
            <text x={padL + plotW + 40 + costW + 6} y={y + barH / 2 + 4} fontSize="10" fontWeight="700" className="fill-foreground">{m.costPct}%</text>
          </g>
        );
      })}
      <text x={w / 2} y={h - 4} textAnchor="middle" fontSize="9" className="fill-foreground/30">
        GPT-o3 is 5% of usage but 56% of cost — model selection drives spend
      </text>
    </svg>
  );
}

export function ROIMatrixChart() {
  const costs = ["$905K", "$1.3M", "$1.7M"];
  const savings = ["1 hr/wk ($15.6M)", "3 hr/wk ($46.8M)", "5 hr/wk ($78M)"];
  const roi = [
    ["1,623%", "5,071%", "8,520%"],
    ["1,100%", "3,504%", "5,908%"],
    ["826%", "2,678%", "4,530%"],
  ];
  const netBenefit = [
    ["$14.7M", "$45.9M", "$77.1M"],
    ["$14.3M", "$45.5M", "$76.7M"],
    ["$13.9M", "$45.1M", "$76.3M"],
  ];
  const w = 440, cellW = 100, cellH = 52, padL = 100, padT = 50;

  return (
    <svg viewBox={`0 0 ${w} ${padT + costs.length * cellH + 10}`} className="w-full max-w-lg" role="img" aria-label="ROI projection matrix">
      {savings.map((s, j) => (
        <text key={`h-${j}`} x={padL + j * cellW + cellW / 2} y={padT - 28} textAnchor="middle" fontSize="8" className="fill-foreground/40">{s}</text>
      ))}
      <text x={padL + (savings.length * cellW) / 2} y={14} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-foreground/50">Productivity Scenario</text>
      <text x={4} y={padT + (costs.length * cellH) / 2} fontSize="10" fontWeight="600" className="fill-foreground/50" transform={`rotate(-90, 10, ${padT + (costs.length * cellH) / 2})`}>Cost</text>
      {costs.map((c, i) => (
        <g key={`row-${i}`}>
          <text x={padL - 8} y={padT + i * cellH + cellH / 2 + 2} textAnchor="end" fontSize="10" className="fill-foreground/50">{c}</text>
          {savings.map((_, j) => {
            const intensity = i === 0 && j >= 1 ? 0.15 : i === 0 && j === 0 ? 0.1 : 0.06;
            return (
              <g key={`cell-${i}-${j}`}>
                <rect x={padL + j * cellW} y={padT + i * cellH} width={cellW} height={cellH} fill={COLORS.electricBlue} opacity={intensity} stroke="currentColor" strokeOpacity={0.05} />
                <text x={padL + j * cellW + cellW / 2} y={padT + i * cellH + 22} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-foreground">{roi[i][j]}</text>
                <text x={padL + j * cellW + cellW / 2} y={padT + i * cellH + 38} textAnchor="middle" fontSize="9" className="fill-foreground/40">{netBenefit[i][j]} net</text>
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}
