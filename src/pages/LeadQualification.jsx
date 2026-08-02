import React, { useState, useEffect, useRef, useCallback } from "react";
import "./LeadQualification.css";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Navbar from "../components/nav/navbar";
import Footer from "../components/footer/Footer";

const BASE_STATS = {
  leadsQualified: 6240,
  sqlsIdentified: 1860,
  responseRateLift: 42,
  qualificationAccuracy: 91,
};

// Researched -> Qualified -> SQL, month over month
const BASE_TREND = [
  { month: "Jan", researched: 210, qualified: 96, sql: 34 },
  { month: "Feb", researched: 260, qualified: 122, sql: 45 },
  { month: "Mar", researched: 340, qualified: 168, sql: 61 },
  { month: "Apr", researched: 410, qualified: 214, sql: 84 },
  { month: "May", researched: 480, qualified: 268, sql: 112 },
  { month: "Jun", researched: 560, qualified: 320, sql: 138 },
];

// Average score against each ICP evaluation criterion mentioned in the workflow
const BASE_CRITERIA = [
  { criterion: "Pain point", score: 82 },
  { criterion: "Buying intent", score: 76 },
  { criterion: "Company growth", score: 68 },
  { criterion: "Budget fit", score: 71 },
  { criterion: "Authority", score: 64 },
  { criterion: "Service fit", score: 79 },
];

// Where prospects were researched and verified from
const BASE_SOURCES = [
  { key: "linkedin", channel: "LinkedIn", value: 42 },
  { key: "website", channel: "Company site", value: 24 },
  { key: "database", channel: "Databases", value: 18 },
  { key: "referral", channel: "Referral", value: 10 },
  { key: "other", channel: "Other", value: 6 },
];

// Where the qualified pool lands once scored against the ICP
const BASE_FIT = [
  { key: "high", stage: "High fit", value: 1860 },
  { key: "medium", stage: "Medium fit", value: 2640 },
  { key: "low", stage: "Low fit", value: 1120 },
  { key: "none", stage: "Not qualified", value: 620 },
];

const STAGES = [
  {
    n: "01",
    title: "Research",
    icon: "search",
    body: "Researched prospects using LinkedIn, company websites, and other databases to verify business information and identify key decision-makers.",
  },
  {
    n: "02",
    title: "Evaluate",
    icon: "scale",
    body: "Evaluated leads using criteria such as pain points, buying intent, company growth, and service fit to ensure high-quality opportunities.",
  },
  {
    n: "03",
    title: "Score against ICP",
    icon: "target",
    body: "Qualified inbound and outbound leads based on the Ideal Customer Profile — business needs, company size, industry, budget, and decision-making authority.",
  },
  {
    n: "04",
    title: "Prioritize",
    icon: "flag",
    body: "Identified and prioritized sales-qualified leads (SQLs) for the business development and sales teams.",
  },
  {
    n: "05",
    title: "Handoff & CRM",
    icon: "handshake",
    body: "Maintained accurate CRM records and collaborated with sales to hand over qualified leads with complete research and relevant insights.",
  },
];

// Live activity feed sources — one per qualification-workflow action
const ACTIVITY_SOURCES = [
  { type: "research", channel: "LinkedIn", verb: "Prospect researched" },
  { type: "research", channel: "Company site", verb: "Business info verified" },
  { type: "research", channel: "Database", verb: "Decision-maker identified" },
  {
    type: "evaluate",
    channel: "Scoring",
    verb: "Pain point & intent evaluated",
  },
  { type: "qualify", channel: "ICP match", verb: "Lead qualified against ICP" },
  { type: "sql", channel: "Scoring", verb: "Marked as sales-qualified (SQL)" },
  { type: "crm", channel: "CRM", verb: "Record updated in CRM" },
  { type: "handoff", channel: "Sales", verb: "Handed to business development" },
  { type: "filter", channel: "Scoring", verb: "Unqualified lead filtered out" },
];

const FIRST_NAMES = [
  "Amara",
  "Bilal",
  "Sofia",
  "Hamza",
  "Wei",
  "Elena",
  "Omar",
  "Priya",
  "Lucas",
  "Ayesha",
  "Noah",
  "Mei",
  "Farhan",
  "Grace",
  "Yusuf",
];
const LAST_NAMES = [
  "Khan",
  "Rossi",
  "Silva",
  "Novak",
  "Ahmed",
  "Petrov",
  "Diaz",
  "Malik",
  "Nguyen",
  "Farooq",
];
const COMPANIES = [
  "Northwind",
  "Vertex Labs",
  "Bluepeak",
  "Cedar & Co",
  "Marigold Tech",
  "Orbit Systems",
  "Halcyon",
  "Redline Group",
  "Fernbridge",
  "Solace Inc",
];

function randomName() {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
}
function randomCompany() {
  return COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
}
function fmtNumber(n) {
  return n.toLocaleString("en-US");
}
function timeAgo(ts, now) {
  const s = Math.max(0, Math.floor((now - ts) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

// Counts up from 0 to target once on mount, then tracks further live updates directly
function useCountUp(target, duration = 900) {
  const [display, setDisplay] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      setDisplay(target);
      return;
    }
    hasRun.current = true;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}

const Icon = ({ name, size = 16 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "scale":
      return (
        <svg {...common}>
          <path d="M12 3v18M7 7l-4 6a4 4 0 0 0 8 0l-4-6ZM17 7l-4 6a4 4 0 0 0 8 0l-4-6ZM5 21h14" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="0.8" fill="currentColor" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M6 21V4" />
          <path d="M6 4h12l-3 4 3 4H6" />
        </svg>
      );
    case "handshake":
      return (
        <svg {...common}>
          <path d="M2 12h4l3-3 4 4 3-3h6" />
          <path d="M9 13l2 2 6-6" />
        </svg>
      );
    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
          <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
        </svg>
      );
    case "filter":
      return (
        <svg {...common}>
          <path d="M4 5h16l-6 8v5l-4 2v-7L4 5z" />
        </svg>
      );
    default:
      return null;
  }
};

const FEED_ICON = {
  research: "search",
  evaluate: "scale",
  qualify: "target",
  sql: "flag",
  crm: "database",
  handoff: "handshake",
  filter: "filter",
};

// ---------------------------------------------------------------------------
// Chart components — defined right here, no external chart file
// ---------------------------------------------------------------------------
const CHART_COLORS = ["#22c55e", "#3b82f6", "#f97316", "#ec4899", "#06b6d4"];

const tooltipStyle = {
  backgroundColor: "#1a2030",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  color: "#e6e9ef",
  fontSize: "12px",
};

// Area chart: researched -> qualified -> SQL, over time
function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="researchedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="qualifiedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="sqlFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.08)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ stroke: "rgba(255,255,255,0.12)" }}
        />
        <Area
          type="monotone"
          dataKey="researched"
          name="Researched"
          stroke="#f97316"
          strokeWidth={2}
          fill="url(#researchedFill)"
        />
        <Area
          type="monotone"
          dataKey="qualified"
          name="Qualified"
          stroke="#22c55e"
          strokeWidth={2.5}
          fill="url(#qualifiedFill)"
        />
        <Area
          type="monotone"
          dataKey="sql"
          name="SQL"
          stroke="#3b82f6"
          strokeWidth={2.5}
          fill="url(#sqlFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Radar chart: average score across ICP evaluation criteria
function CriteriaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis
          dataKey="criterion"
          tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11.5 }}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Radar
          dataKey="score"
          name="Avg score"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.35}
          strokeWidth={2}
          animationDuration={900}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// Donut: where prospects are sourced/verified from
function SourceChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="channel"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={3}
          stroke="none"
          animationDuration={900}
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.key}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

// Horizontal bar: ICP fit distribution across the qualified pool
function FitChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 18, right: 16 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.08)"
          horizontal={false}
        />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          width={92}
          tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "rgba(255,255,255,0.06)" }}
        />
        <Bar
          dataKey="value"
          radius={[6, 6, 6, 6]}
          barSize={22}
          animationDuration={900}
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.key}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Fades a section in on mount, staggered by delay
function Reveal({ children, delay = 0, className = "" }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className={`lq-reveal ${visible ? "lq-reveal-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

function CardToolbar() {
  return (
    <div className="lq-toolbar" aria-hidden="true">
      <span>T</span>
      <span>✎</span>
      <span>💬</span>
    </div>
  );
}

function MonthTile({ icon, label, value, accent }) {
  return (
    <div className={`lq-month-tile${accent ? " lq-month-tile-accent" : ""}`}>
      <span className="lq-month-tile-icon">
        <Icon name={icon} size={15} />
      </span>
      <div>
        <div className="lq-month-tile-value">{fmtNumber(value)}</div>
        <div className="lq-month-tile-label">{label}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function LeadQualificationPage() {
  const [stats, setStats] = useState(BASE_STATS);
  const [trend, setTrend] = useState(BASE_TREND);
  const [criteria] = useState(BASE_CRITERIA);
  const [sources] = useState(BASE_SOURCES);
  const [fit, setFit] = useState(BASE_FIT);
  const [feed, setFeed] = useState([]);
  const [now, setNow] = useState(Date.now());

  const [monthCounts, setMonthCounts] = useState({
    research: 0,
    evaluate: 0,
    qualify: 0,
    sql: 0,
    crm: 0,
    handoff: 0,
    filter: 0,
  });

  const idRef = useRef(0);

  const pushActivity = useCallback((entry) => {
    idRef.current += 1;
    const item = { id: idRef.current, ts: Date.now(), ...entry };
    setFeed((prev) => [item, ...prev].slice(0, 40));
    setMonthCounts((prev) => ({
      ...prev,
      [entry.type]: (prev[entry.type] || 0) + 1,
    }));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const spawn = () => {
      const src =
        ACTIVITY_SOURCES[Math.floor(Math.random() * ACTIVITY_SOURCES.length)];
      pushActivity({
        type: src.type,
        channel: src.channel,
        verb: src.verb,
        name: randomName(),
        company: randomCompany(),
      });

      if (src.type === "qualify") {
        setStats((prev) => ({
          ...prev,
          leadsQualified: prev.leadsQualified + 1,
        }));
        setTrend((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            ...next[next.length - 1],
            qualified: next[next.length - 1].qualified + 1,
          };
          return next;
        });
      }
      if (src.type === "sql") {
        setStats((prev) => ({
          ...prev,
          sqlsIdentified: prev.sqlsIdentified + 1,
        }));
        setTrend((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            ...next[next.length - 1],
            sql: next[next.length - 1].sql + 1,
          };
          return next;
        });
        setFit((prev) =>
          prev.map((f) =>
            f.key === "high" ? { ...f, value: f.value + 1 } : f,
          ),
        );
      }
      if (src.type === "research") {
        setTrend((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            ...next[next.length - 1],
            researched: next[next.length - 1].researched + 1,
          };
          return next;
        });
      }
      if (src.type === "filter") {
        setFit((prev) =>
          prev.map((f) =>
            f.key === "none" ? { ...f, value: f.value + 1 } : f,
          ),
        );
      }
    };

    const interval = setInterval(spawn, 3400);
    return () => clearInterval(interval);
  }, [pushActivity]);

  const leadsDisplay = useCountUp(stats.leadsQualified, 900);
  const sqlDisplay = useCountUp(stats.sqlsIdentified, 900);

  const totalThisMonth =
    monthCounts.research +
    monthCounts.evaluate +
    monthCounts.qualify +
    monthCounts.sql +
    monthCounts.crm +
    monthCounts.handoff +
    monthCounts.filter;

  return (
    <>
      <div className="lq-root">
        <Navbar />

        <main className="lq-main">
          <nav className="lq-breadcrumb">
            Portfolio <span className="lq-chev">›</span> Lead Qualification
          </nav>

          <Reveal delay={0}>
            <h1 className="lq-title">Lead Qualification</h1>
          </Reveal>
          <Reveal delay={80}>
            <p className="lq-subtitle">
              How I score, verify, and prioritize inbound and outbound leads
              against the Ideal Customer Profile — before they ever reach sales.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="lq-service-badge">Process · Ongoing</div>
          </Reveal>

          <hr className="lq-hr" />

          {/* ---------------- Top stats ---------------- */}
          <section className="lq-stats-row">
            <Reveal delay={0} className="lq-stat">
              <div className="lq-stat-value">{fmtNumber(leadsDisplay)}</div>
              <div className="lq-stat-label">Leads qualified</div>
            </Reveal>
            <Reveal delay={60} className="lq-stat">
              <div className="lq-stat-value">{fmtNumber(sqlDisplay)}</div>
              <div className="lq-stat-label">SQLs identified</div>
            </Reveal>
            <Reveal delay={120} className="lq-stat">
              <div className="lq-stat-value">+{stats.responseRateLift}%</div>
              <div className="lq-stat-label">Response rate lift</div>
            </Reveal>
            <Reveal delay={180} className="lq-stat">
              <div className="lq-stat-value">
                {stats.qualificationAccuracy}%
              </div>
              <div className="lq-stat-label">Qualification accuracy</div>
            </Reveal>
          </section>

          {/* ---------------- New this month strip ---------------- */}
          <Reveal delay={100}>
            <section className="lq-month-strip">
              <div className="lq-month-head">
                <h2>Activity this month</h2>
                <p>
                  Every research, scoring, and handoff event rolls up live as it
                  happens.
                </p>
              </div>
              <div className="lq-month-grid">
                <MonthTile
                  icon="search"
                  label="Prospects researched"
                  value={monthCounts.research}
                />
                <MonthTile
                  icon="scale"
                  label="Leads evaluated"
                  value={monthCounts.evaluate}
                />
                <MonthTile
                  icon="target"
                  label="Qualified to ICP"
                  value={monthCounts.qualify}
                />
                <MonthTile
                  icon="flag"
                  label="Marked as SQL"
                  value={monthCounts.sql}
                />
                <MonthTile
                  icon="database"
                  label="CRM records updated"
                  value={monthCounts.crm}
                />
                <MonthTile
                  icon="flag"
                  label="Total events"
                  value={totalThisMonth}
                  accent
                />
              </div>
            </section>
          </Reveal>

          {/* ---------------- Charts ---------------- */}
          <h2 className="lq-section-title">Qualification performance</h2>
          <p className="lq-section-sub">
            From first research touch to a sales-ready, ICP-matched opportunity.
          </p>

          <div className="lq-grid-2">
            <Reveal delay={0} className="lq-card">
              <CardToolbar />
              <h3 className="lq-card-title">Research to SQL trend</h3>
              <p className="lq-card-sub">
                Researched, qualified, and SQL volume — last 6 months
              </p>
              <TrendChart data={trend} />
              <div className="lq-legend">
                <span>
                  <i style={{ background: "#f97316" }} />
                  Researched
                </span>
                <span>
                  <i style={{ background: "#22c55e" }} />
                  Qualified
                </span>
                <span>
                  <i style={{ background: "#3b82f6" }} />
                  SQL
                </span>
              </div>
            </Reveal>

            <Reveal delay={100} className="lq-card">
              <h3 className="lq-card-title">Lead source mix</h3>
              <p className="lq-card-sub">
                Where researched leads are verified from
              </p>
              <SourceChart data={sources} />
              <div className="lq-channel-list">
                {sources.map((s, i) => (
                  <span key={s.key}>
                    <i
                      style={{
                        background: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                    {s.channel} · {s.value}%
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lq-grid-2">
            <Reveal delay={0} className="lq-card">
              <CardToolbar />
              <h3 className="lq-card-title">ICP evaluation criteria</h3>
              <p className="lq-card-sub">
                Average score across pain point, intent, growth, budget,
                authority, and fit
              </p>
              <CriteriaChart data={criteria} />
            </Reveal>

            <Reveal delay={100} className="lq-card">
              <h3 className="lq-card-title">ICP fit distribution</h3>
              <p className="lq-card-sub">
                Where the qualified pool lands, this quarter
              </p>
              <FitChart data={fit} />
            </Reveal>
          </div>

          {/* ---------------- Live activity feed ---------------- */}
          <h2 className="lq-section-title">Live activity</h2>
          <p className="lq-section-sub">
            Research, evaluation, scoring, and handoff events as they happen.
          </p>

          <Reveal delay={0}>
            <div className="lq-card lq-feed-card">
              {feed.length === 0 && (
                <div className="lq-feed-empty">
                  Waiting for the first event…
                </div>
              )}
              <ul className="lq-feed-list">
                {feed.map((item) => (
                  <li
                    key={item.id}
                    className={`lq-feed-item lq-feed-${item.type}`}
                  >
                    <span className="lq-feed-icon">
                      <Icon name={FEED_ICON[item.type] || "search"} size={14} />
                    </span>
                    <span className="lq-feed-text">
                      <strong>{item.verb}</strong>
                      <span className="lq-feed-name">
                        {" "}
                        — {item.name}, {item.company}
                      </span>
                      <span className="lq-feed-channel"> · {item.channel}</span>
                    </span>
                    <span className="lq-feed-time">
                      {timeAgo(item.ts, now)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* ---------------- Process stages ---------------- */}
          <h2 className="lq-section-title">How I qualify a lead</h2>
          <div className="lq-stages">
            {STAGES.map((s, i) => (
              <Reveal delay={i * 70} key={s.n} className="lq-stage-row">
                <div className="lq-stage-icon">
                  <Icon name={s.icon} size={16} />
                </div>
                <div className="lq-stage-title">
                  <span className="lq-stage-n">{s.n}</span> {s.title}
                </div>
                <div className="lq-stage-body">{s.body}</div>
              </Reveal>
            ))}
          </div>
        </main>

        {/* ---------------- Footer ---------------- */}
        <footer className="lq-footer">
          <div className="lq-footer-grid">
            <div>
              <h4>What I evaluate</h4>
              <p>
                ICP fit, business needs, company size, industry, budget, and
                decision-making authority — verified before a lead ever reaches
                sales.
              </p>
            </div>
            <div>
              <h4>Tooling</h4>
              <p>
                LinkedIn, company websites, and prospecting databases for
                research; CRM for qualification status, engagement history, and
                handoff notes.
              </p>
            </div>
            <div>
              <h4>Outcome</h4>
              <p>
                Filtering out unqualified prospects improved response rates and
                handed the sales team a shorter, higher-confidence list to work.
              </p>
            </div>
          </div>
          <div className="lq-footer-bottom"></div>
        </footer>
      </div>
      <Footer />
    </>
  );
}
