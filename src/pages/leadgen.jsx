import React, { useState, useEffect, useRef, useCallback } from "react";
import "./LeadGen.css";
import { GrowthChart, ChannelChart, FunnelChart } from "../components/charts";
import Navbar from "../components/nav/navbar";

const BASE_STATS = {
  leadsCaptured: 18420,
  leadToMqlRate: 37,
  costPerLead: 12,
  campaignsRun: 64,
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const BASE_GROWTH = [
  { month: "Jan", total: 120, qualified: 90 },
  { month: "Feb", total: 180, qualified: 130 },
  { month: "Mar", total: 260, qualified: 175 },
  { month: "Apr", total: 360, qualified: 230 },
  { month: "May", total: 520, qualified: 320 },
  { month: "Jun", total: 640, qualified: 420 },
];

const CHANNELS = [
  { key: "seo", label: "SEO", pct: 34, color: "#22c55e" },
  { key: "ads", label: "Ads", pct: 26, color: "#3b82f6" },
  { key: "email", label: "Email", pct: 18, color: "#f97316" },
  { key: "social", label: "Social", pct: 14, color: "#ec4899" },
  { key: "referral", label: "Referral", pct: 8, color: "#06b6d4" },
];

const FUNNEL_BASE = [
  { key: "visitors", label: "Visitors", value: 49600, color: "#22c55e" },
  { key: "leads", label: "Leads", value: 18420, color: "#3b82f6" },
  { key: "mql", label: "MQL", value: 6816, color: "#f97316" },
  { key: "customers", label: "Customers", value: 1240, color: "#ec4899" },
];

const STAGES = [
  {
    n: "01",
    title: "Attract",
    icon: "target",
    body: "Intent-led landing pages and paid campaigns tuned to the keywords buyers actually search.",
  },
  {
    n: "02",
    title: "Qualify",
    icon: "filter",
    body: "Behavioural scoring ranks activity before anyone picks up the phone.",
  },
  {
    n: "03",
    title: "Nurture",
    icon: "bolt",
    body: "Triggered email and retargeting sequences keep warm leads engaged without manual follow-up.",
  },
  {
    n: "04",
    title: "Convert",
    icon: "user",
    body: "Sales receives a prioritised list with full context on every conversation and touchpoint.",
  },
];

// Sources for the live activity feed
const ACTIVITY_SOURCES = [
  { type: "lead", channel: "SEO", verb: "New lead captured" },
  { type: "lead", channel: "Ads", verb: "New lead captured" },
  { type: "lead", channel: "Referral", verb: "New lead captured" },
  { type: "email", channel: "Email", verb: "Nurture email sent" },
  { type: "email", channel: "Email", verb: "Follow-up email opened" },
  { type: "mql", channel: "Scoring", verb: "Lead qualified to MQL" },
  { type: "call", channel: "Sales", verb: "Discovery call booked" },
  { type: "social", channel: "Social", verb: "New lead captured" },
  { type: "customer", channel: "Sales", verb: "Deal closed - new customer" },
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

function randomName() {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
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

// Counts up from 0 to `target` once on mount, then just follows target directly
// (no re-animating on every small live update).
function useCountUp(target, duration = 900) {
  const [display, setDisplay] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      // already finished the intro count-up: just track further changes directly
      setDisplay(target);
      return;
    }
    hasRun.current = true;
    const start = performance.now();
    const from = 0;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(from + (target - from) * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}

// ---------------------------------------------------------------------------
// Small icon set (inline SVG, no external deps)
// ---------------------------------------------------------------------------
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
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="0.8" fill="currentColor" />
        </svg>
      );
    case "filter":
      return (
        <svg {...common}>
          <path d="M4 5h16l-6 8v5l-4 2v-7L4 5z" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 3 5 13h5l-1 8 9-11h-5l1-7z" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20c1.4-4 4.2-6 7-6s5.6 2 7 6" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "trend":
      return (
        <svg {...common}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M15 7h6v6" />
        </svg>
      );
    case "coin":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1 3 2.2c0 2.8-6 1.3-6 4.1 0 1.3 1.3 2.2 3 2.2s3-1 3-2.3" />
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
    default:
      return null;
  }
};

// ---------------------------------------------------------------------------
// Small toolbar shown on hover of each chart card, matching the reference UI
// ---------------------------------------------------------------------------
function CardToolbar() {
  return (
    <div className="lg-toolbar" aria-hidden="true">
      <button type="button" title="Refresh">
        <Icon name="trend" size={13} />
      </button>
      <span>T</span>
      <span>✎</span>
      <span>💬</span>
    </div>
  );
}
export default function LeadGenPage() {
    <Navbar />
  // live counters, seeded from the static baseline
  const [stats, setStats] = useState(BASE_STATS);
  const [growth, setGrowth] = useState(BASE_GROWTH);
  const [funnel, setFunnel] = useState(FUNNEL_BASE);
  const [channels, setChannels] = useState(CHANNELS);
  const [feed, setFeed] = useState([]);
  const [now, setNow] = useState(Date.now());

  // "this month" incremental counters — what the user asked for:
  // how many new leads / emails / calls etc have come in "this month"
  const [monthCounts, setMonthCounts] = useState({
    lead: 0,
    email: 0,
    mql: 0,
    call: 0,
    social: 0,
    customer: 0,
  });

  const idRef = useRef(0);
  const feedRef = useRef(null);

  const pushActivity = useCallback((entry) => {
    idRef.current += 1;
    const item = { id: idRef.current, ts: Date.now(), ...entry };
    setFeed((prev) => [item, ...prev].slice(0, 40));
    setMonthCounts((prev) => ({
      ...prev,
      [entry.type]: (prev[entry.type] || 0) + 1,
    }));
  }, []);

  // tick the "time ago" labels
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // simulate incoming activity
  useEffect(() => {
    const spawn = () => {
      const src =
        ACTIVITY_SOURCES[Math.floor(Math.random() * ACTIVITY_SOURCES.length)];
      const name = randomName();
      pushActivity({
        type: src.type,
        channel: src.channel,
        verb: src.verb,
        name,
      });

      // roll the headline stats forward for lead / mql / customer events
      setStats((prev) => {
        if (src.type === "lead" || src.type === "social") {
          return { ...prev, leadsCaptured: prev.leadsCaptured + 1 };
        }
        return prev;
      });

      setFunnel((prev) =>
        prev.map((stage) => {
          if (src.type === "lead" || src.type === "social") {
            if (stage.key === "visitors")
              return { ...stage, value: stage.value + 3 };
            if (stage.key === "leads")
              return { ...stage, value: stage.value + 1 };
          }
          if (src.type === "mql" && stage.key === "mql") {
            return { ...stage, value: stage.value + 1 };
          }
          if (src.type === "customer" && stage.key === "customers") {
            return { ...stage, value: stage.value + 1 };
          }
          return stage;
        }),
      );

      setGrowth((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (src.type === "lead" || src.type === "social") {
          next[next.length - 1] = {
            ...last,
            total: last.total + 1,
            qualified:
              src.type !== "social"
                ? last.qualified + (Math.random() > 0.5 ? 1 : 0)
                : last.qualified,
          };
        }
        return next;
      });

      if (src.type === "lead" || src.type === "social") {
        setChannels((prev) =>
          prev.map((c) =>
            c.label.toLowerCase() === src.channel.toLowerCase()
              ? { ...c, pct: c.pct } // percentages stay stable (display-only), volume tracked separately
              : c,
          ),
        );
      }
    };

    const interval = setInterval(spawn, 3200);
    return () => clearInterval(interval);
  }, [pushActivity]);

  // shape live state into the props recharts components expect
  const growthChartData = growth.map((g) => ({
    month: g.month,
    leads: g.total,
    qualified: g.qualified,
  }));
  const channelChartData = channels.map((c) => ({
    channel: c.label,
    value: c.pct,
  }));
  const funnelChartData = funnel.map((f) => ({
    stage: f.label,
    value: f.value,
  }));

  const totalNewThisMonth =
    monthCounts.lead +
    monthCounts.social +
    monthCounts.email +
    monthCounts.mql +
    monthCounts.call +
    monthCounts.customer;

  const leadsDisplay = useCountUp(stats.leadsCaptured, 900);

  return (
    
    <div className="lg-root">
      <header className="lg-topbar">
        <div className="lg-topbar-left">
          <span className="lg-dot" />
          <span className="lg-brand">Lead Magnet Studio</span>
          <Icon name="trend" size={13} />
        </div>

        <div className="lg-topbar-right">
          <span className="lg-pulse-badge">
            <span className="lg-pulse-dot" />
            live
          </span>
        </div>
      </header>

      <main className="lg-main">
        <nav className="lg-breadcrumb">
          Portfolio <span className="lg-chev">›</span> Lead Generation
        </nav>

        <h1 className="lg-title">Lead Generation</h1>
        <p className="lg-subtitle">
          How I build and measure a capture-to-conversion funnel — the
          structure, the channel mix and the numbers that come out of it.
        </p>
        <div className="lg-service-badge">Service · 2024—2026</div>

        <hr className="lg-hr" />

        {/* ---------------- Top stats ---------------- */}
        <section className="lg-stats-row">
          <div className="lg-stat">
            <div className="lg-stat-value">{fmtNumber(leadsDisplay)}</div>
            <div className="lg-stat-label">Leads captured</div>
          </div>
          <div className="lg-stat">
            <div className="lg-stat-value">{stats.leadToMqlRate}%</div>
            <div className="lg-stat-label">Lead-to-MQL rate</div>
          </div>
          <div className="lg-stat">
            <div className="lg-stat-value">${stats.costPerLead}</div>
            <div className="lg-stat-label">Cost per lead</div>
          </div>
          <div className="lg-stat">
            <div className="lg-stat-value">{stats.campaignsRun}</div>
            <div className="lg-stat-label">Campaigns run</div>
          </div>
        </section>

        {/* ---------------- New this month strip ---------------- */}
        <section className="lg-month-strip">
          <div className="lg-month-head">
            <h2>New this month</h2>
            <p>Counts roll up live as activity streams in below.</p>
          </div>
          <div className="lg-month-grid">
            <MonthTile
              icon="user"
              label="New leads"
              value={monthCounts.lead + monthCounts.social}
            />
            <MonthTile
              icon="mail"
              label="Emails sent"
              value={monthCounts.email}
            />
            <MonthTile
              icon="filter"
              label="Qualified to MQL"
              value={monthCounts.mql}
            />
            <MonthTile
              icon="phone"
              label="Calls booked"
              value={monthCounts.call}
            />
            <MonthTile
              icon="handshake"
              label="Customers won"
              value={monthCounts.customer}
            />
            <MonthTile
              icon="flag"
              label="Total events"
              value={totalNewThisMonth}
              accent
            />
          </div>
        </section>

        {/* ---------------- Funnel performance ---------------- */}
        <h2 className="lg-section-title">Funnel performance</h2>
        <p className="lg-section-sub">
          Every stage is instrumented, so the effect of a change is visible
          within days.
        </p>

        <div className="lg-grid-2">
          <div className="lg-card">
            <CardToolbar />
            <h3 className="lg-card-title">Lead growth</h3>
            <p className="lg-card-sub">Total vs. qualified, last 6 months</p>
            <GrowthChart data={growthChartData} />
            <div className="lg-legend">
              <span>
                <i style={{ background: "var(--chart-1)" }} />
                Total leads
              </span>
              <span>
                <i style={{ background: "var(--chart-2)" }} />
                Qualified
              </span>
            </div>
          </div>

          <div className="lg-card">
            <h3 className="lg-card-title">Channel mix</h3>
            <p className="lg-card-sub">Share of qualified leads</p>
            <ChannelChart data={channelChartData} />
            <div className="lg-channel-list">
              {channels.map((c) => (
                <span key={c.key}>
                  <i style={{ background: c.color }} />
                  {c.label} · {c.pct}%
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg-card lg-funnel-card">
          <CardToolbar />
          <h3 className="lg-card-title">Conversion funnel</h3>
          <p className="lg-card-sub">
            From first visit to closed customer this quarter
          </p>
          <FunnelChart data={funnelChartData} />
        </div>

        {/* ---------------- Live activity feed ---------------- */}
        <h2 className="lg-section-title">Live activity</h2>
        <p className="lg-section-sub">
          Every lead, email, call and conversion as it happens.
        </p>

        <div className="lg-card lg-feed-card" ref={feedRef}>
          {feed.length === 0 && (
            <div className="lg-feed-empty">Waiting for the first event…</div>
          )}
          <ul className="lg-feed-list">
            {feed.map((item) => (
              <li key={item.id} className={`lg-feed-item lg-feed-${item.type}`}>
                <span className="lg-feed-icon">
                  <Icon
                    name={
                      item.type === "email"
                        ? "mail"
                        : item.type === "call"
                          ? "phone"
                          : item.type === "mql"
                            ? "filter"
                            : item.type === "customer"
                              ? "handshake"
                              : "user"
                    }
                    size={14}
                  />
                </span>
                <span className="lg-feed-text">
                  <strong>{item.verb}</strong>
                  <span className="lg-feed-name"> — {item.name}</span>
                  <span className="lg-feed-channel"> · {item.channel}</span>
                </span>
                <span className="lg-feed-time">{timeAgo(item.ts, now)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- Four stages ---------------- */}
        <h2 className="lg-section-title">The four stages</h2>
        <div className="lg-stages">
          {STAGES.map((s) => (
            <div className="lg-stage-row" key={s.n}>
              <div className="lg-stage-icon">
                <Icon name={s.icon} size={16} />
              </div>
              <div className="lg-stage-title">
                <span className="lg-stage-n">{s.n}</span> {s.title}
              </div>
              <div className="lg-stage-body">{s.body}</div>
            </div>
          ))}
        </div>

        {/* ---------------- Footer columns ---------------- */}
        <div className="lg-footer-grid">
          <div>
            <h4>What I measure</h4>
            <p>
              Traffic quality, form completion, lead score distribution, MQL
              rate and cost per acquired customer — reviewed weekly, not
              quarterly.
            </p>
          </div>
          <div>
            <h4>Tooling</h4>
            <p>
              React landing pages, event tracking, CRM sync and automated
              scoring rules wired into email and ad platforms.
            </p>
          </div>
          <div>
            <h4>Typical timeline</h4>
            <p>
              Two weeks to instrument and baseline, four weeks to optimise copy
              and targeting, ongoing iteration from there.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function MonthTile({ icon, label, value, accent }) {
  return (
    <div className={`lg-month-tile${accent ? " lg-month-tile-accent" : ""}`}>
      <span className="lg-month-tile-icon">
        <Icon name={icon} size={15} />
      </span>
      <div>
        <div className="lg-month-tile-value">{fmtNumber(value)}</div>
        <div className="lg-month-tile-label">{label}</div>
      </div>
    </div>
    
  );
}
