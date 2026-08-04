import React, { useEffect, useRef, useState } from "react";

const GOLD = "#D9A94E";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/nav/navbar";
import Footer from "../components/footer/footer";

const styles = `
  .lg-root {
    background: #0B0A08;
    color: #F2EFE9;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .lg-section {
    max-width: 720px;
    margin: 0 auto;
    padding: 72px 24px;
  }

  .lg-eyebrow {
    color: ${GOLD};
    font-size: 12px;
    letter-spacing: 0.18em;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  /* ---------- reveal-on-scroll ---------- */
  .lg-reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .lg-reveal.in-view {
    opacity: 1;
    transform: translateY(0);
  }

  /* ---------- hero ---------- */
  .lg-hero-wrap {
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid rgba(217, 169, 78, 0.15);
  }
  .lg-hero-glow {
    position: absolute;
    top: -120px;
    right: -100px;
    width: 480px;
    height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(217, 169, 78, 0.35) 0%, rgba(217, 169, 78, 0) 70%);
    filter: blur(10px);
    animation: lg-drift 10s ease-in-out infinite;
  }
  @keyframes lg-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-16px, 18px) scale(1.06); }
  }

  .lg-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(217, 169, 78, 0.4);
    border-radius: 999px;
    padding: 6px 16px;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${GOLD};
     margin-top: 26px;

  }
  .lg-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${GOLD};
    animation: lg-pulse 1.8s ease-in-out infinite;
  }
  @keyframes lg-pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(217,169,78,0.5); }
    50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(217,169,78,0); }
  }

  .lg-h1  .lg-h1 {
    font-size: 56px;
    line-height: 1.08;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.02em;
  }
  .lg-h1 em {
    color: ${GOLD};
    font-style: italic;
  }
 
  .lg-sub {
    margin-top: 28px;
    max-width: 460px;
    font-size: 16px;
    line-height: 1.7;
    color: rgba(242, 239, 233, 0.65);
  }
 
  .lg-stats {
    display: flex;
    gap: 48px;
    margin-top: 56px;
    flex-wrap: wrap;
  }

  .lg-stat-num {
    font-size: 32px;
    font-weight: 800;
    transition: color 0.3s ease, transform 0.3s ease;
  }
  .lg-stat:hover .lg-stat-num {
    color: ${GOLD};
    transform: translateY(-2px);
  }
  .lg-stat-label {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(242, 239, 233, 0.45);
    margin-top: 4px;
  }

  .lg-h2 {
    font-size: 34px;
    font-weight: 800;
    margin: 0 0 12px;
  }
  .lg-lead {
    color: rgba(242, 239, 233, 0.6);
    font-size: 15px;
    line-height: 1.7;
    margin-bottom: 40px;
  }

  /* ---------- funnel ---------- */
  .lg-funnel {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .lg-funnel-row {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 18px 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                border-color 0.35s ease,
                background 0.35s ease,
                box-shadow 0.35s ease;
  }
  .lg-funnel-row:hover {
    transform: translateX(6px) scale(1.01);
    border-color: rgba(217, 169, 78, 0.5);
    background: rgba(217, 169, 78, 0.06);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  }
  .lg-funnel-title {
    font-weight: 700;
    font-size: 15px;
  }
  .lg-funnel-sub {
    font-size: 13px;
    color: rgba(242, 239, 233, 0.5);
    margin-top: 2px;
  }
  .lg-funnel-value {
    font-size: 22px;
    font-weight: 800;
    color: ${GOLD};
    white-space: nowrap;
    transition: transform 0.35s ease;
  }
  .lg-funnel-row:hover .lg-funnel-value {
    transform: scale(1.08);
  }

  /* ---------- process timeline ---------- */
  .lg-timeline {
    position: relative;
    padding-left: 32px;
  }
  .lg-timeline-rail {
    position: absolute;
    left: 7px;
    top: 8px;
    bottom: 8px;
    width: 1px;
    background: rgba(217, 169, 78, 0.3);
  }
  .lg-step {
    position: relative;
    padding-bottom: 40px;
  }
  .lg-step:last-child {
    padding-bottom: 0;
  }
  .lg-step-dot {
    position: absolute;
    left: -32px;
    top: 2px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 2px solid ${GOLD};
    background: #0B0A08;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  }
  .lg-step:hover .lg-step-dot {
    transform: scale(1.35);
    background: ${GOLD};
    box-shadow: 0 0 0 6px rgba(217, 169, 78, 0.18);
  }
  .lg-step-label {
    font-size: 11px;
    letter-spacing: 0.14em;
    color: ${GOLD};
    font-weight: 700;
    margin-bottom: 6px;
  }
  .lg-step-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 6px;
    transition: transform 0.3s ease;
  }
  .lg-step:hover .lg-step-title {
    transform: translateX(4px);
  }
  .lg-step-body {
    font-size: 14.5px;
    line-height: 1.7;
    color: rgba(242, 239, 233, 0.6);
  }

  /* ---------- channels ---------- */
  .lg-channels {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }
  .lg-channel-head {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 8px;
  }
  .lg-channel-name {
    font-weight: 600;
    transition: color 0.3s ease;
  }
  .lg-channel:hover .lg-channel-name {
    color: ${GOLD};
  }
  .lg-channel-pct {
    color: rgba(242, 239, 233, 0.6);
  }
  .lg-channel-track {
    height: 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }
  .lg-channel-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, ${GOLD}, #F3D98A);
    width: 0%;
    transition: width 1.1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .lg-channel:hover .lg-channel-fill {
    filter: brightness(1.15);
  }

  /* ---------- principles ---------- */
  .lg-principles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
  }
  .lg-principle {
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 20px 18px;
    background: rgba(255, 255, 255, 0.03);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                border-color 0.35s ease,
                box-shadow 0.35s ease;
  }
  .lg-principle:hover {
    transform: translateY(-6px);
    border-color: rgba(217, 169, 78, 0.5);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
  }
  .lg-principle-n {
    font-size: 12px;
    font-weight: 700;
    color: ${GOLD};
    margin-bottom: 14px;
  }
  .lg-principle-title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .lg-principle-body {
    font-size: 13px;
    line-height: 1.6;
    color: rgba(242, 239, 233, 0.55);
  }

  /* ---------- CTA ---------- */
  .lg-cta-section {
    text-align: center;
    padding-bottom: 120px;
  }
  .lg-cta-circle {
    border: 1px solid rgba(217, 169, 78, 0.3);
    border-radius: 50%;
    width: 340px;
    height: 340px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    transition: border-color 0.4s ease, box-shadow 0.4s ease;
  }
  .lg-cta-circle:hover {
    border-color: rgba(217, 169, 78, 0.7);
    box-shadow: 0 0 60px rgba(217, 169, 78, 0.15);
  }
  .lg-cta-tag {
    font-size: 11px;
    letter-spacing: 0.16em;
    color: ${GOLD};
    text-transform: uppercase;
  }
  .lg-cta-title {
    font-size: 26px;
    font-weight: 800;
    margin: 0;
    max-width: 240px;
  }
  .lg-cta-btn {
    background: ${GOLD};
    color: #241a06;
    border: none;
    border-radius: 999px;
    padding: 12px 28px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.25s ease,
                background 0.25s ease;
  }
  .lg-cta-btn:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 24px rgba(217, 169, 78, 0.35);
    background: #F3D98A;
  }
  .lg-cta-btn:active {
    transform: translateY(-1px) scale(0.98);
  }

  @media (prefers-reduced-motion: reduce) {
    .lg-reveal,
    .lg-hero-glow,
    .lg-badge-dot,
    .lg-funnel-row,
    .lg-funnel-value,
    .lg-step-dot,
    .lg-step-title,
    .lg-channel-fill,
    .lg-principle,
    .lg-cta-circle,
    .lg-cta-btn {
      animation: none !important;
      transition: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    .lg-channel-fill {
      width: var(--target-width, 0%) !important;
    }
  }
`;

/* ------------------------------------------------------------------ */
/* Reveal-on-scroll wrapper                                            */
/* ------------------------------------------------------------------ */
function Reveal({ as: Tag = "div", className = "", style, children, ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`lg-reveal ${inView ? "in-view" : ""} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */
const funnelStages = [
  {
    label: "Reach",
    sub: "Cold audience touched across channels",
    value: "50,000",
    width: "100%",
  },
  {
    label: "Engaged",
    sub: "Clicked, replied or watched",
    value: "9,400",
    width: "86%",
  },
  {
    label: "Leads",
    sub: "Shared contact / booked interest",
    value: "2,150",
    width: "72%",
  },
  {
    label: "Qualified",
    sub: "Budget, need and timing verified",
    value: "610",
    width: "58%",
  },
  { label: "Clients", sub: "Signed and onboarded", value: "180", width: "44%" },
];

const steps = [
  {
    n: "01",
    title: "Deep research",
    body: "I map your ideal customer — industry, pain points, buying triggers — and figure out where they actually spend attention. No guessing, every list is built from intent signals.",
  },
  {
    n: "02",
    title: "Offer engineering",
    body: "A weak offer kills good traffic. I sharpen the promise, proof and risk-reversal until the message converts before a single ad rupee is spent.",
  },
  {
    n: "03",
    title: "Multi-channel outreach",
    body: "Cold email, LinkedIn, paid social and content run in parallel — same message, different rooms. Volume with personalisation at scale.",
  },
  {
    n: "04",
    title: "Nurture automation",
    body: "Every lead enters a sequence that educates and builds trust automatically, so nothing leaks while you're busy delivering.",
  },
  {
    n: "05",
    title: "Qualify & close",
    body: "Leads are scored before they hit your calendar. You only talk to people who can buy, want to buy, and are ready now.",
  },
  {
    n: "06",
    title: "Measure & scale",
    body: "Weekly reporting on cost per lead, reply rate and close rate. Winners get more budget, losers get cut. That's the whole growth loop.",
  },
];

const channels = [
  { label: "Cold email systems", pct: 88 },
  { label: "LinkedIn outbound", pct: 76 },
  { label: "Paid social funnels", pct: 64 },
  { label: "Content & SEO", pct: 58 },
  { label: "Referral loops", pct: 42 },
];

const principles = [
  {
    n: "01",
    title: "Data first",
    body: "Every decision is backed by numbers — not opinions, not trends, not vibes.",
  },
  {
    n: "02",
    title: "Systems, not hacks",
    body: "Repeatable machines that keep producing leads after the campaign ends.",
  },
  {
    n: "03",
    title: "Human copy",
    body: "Messages that sound like a person, because that's what gets replies.",
  },
  {
    n: "04",
    title: "Full transparency",
    body: "Live dashboards and weekly reports. You always know what's working.",
  },
];

/* ------------------------------------------------------------------ */
/* Channel bar — animates its width in only once it's on screen        */
/* ------------------------------------------------------------------ */
function ChannelBar({ c }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lg-channel" ref={ref}>
      <div className="lg-channel-head">
        <span className="lg-channel-name">{c.label}</span>
        <span className="lg-channel-pct">{c.pct}%</span>
      </div>
      <div className="lg-channel-track">
        <div
          className="lg-channel-fill"
          style={{
            width: inView ? `${c.pct}%` : "0%",
            "--target-width": `${c.pct}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function LeadGenShowcase() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="lg-root">
        <style>{styles}</style>

        {/* HERO */}
        <div className="lg-hero-wrap">
          <div className="lg-hero-glow" />
          <div
            className="lg-section"
            style={{ paddingTop: 96, paddingBottom: 80, position: "relative" }}
          >
            <span className="lg-badge">
              <span className="lg-badge-dot" />
              Lead generation strategy
            </span>

            <h1 className="lg-h1">
              How I work.
              <br />
              How I generate
              <br />
              <em>leads that grow you.</em>
            </h1>

            <p className="lg-sub">
              A transparent look at the exact system I run — from research and
              offer design to outreach, nurture and closing. Built to fill your
              pipeline predictably, month after month.
            </p>

            <div className="lg-stats">
              {[
                ["50K+", "Prospects reached"],
                ["2,150", "Leads generated"],
                ["3.4x", "Average ROI"],
              ].map(([num, label]) => (
                <div key={label} className="lg-stat">
                  <div className="lg-stat-num">{num}</div>
                  <div className="lg-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FUNNEL */}
        <div className="lg-section">
          <Reveal>
            <p className="lg-eyebrow">The funnel</p>
          </Reveal>
          <Reveal as="h2" className="lg-h2">
            From stranger to signed client
          </Reveal>
          <Reveal as="p" className="lg-lead">
            Every stage is measured. When a number drops, we know exactly which
            layer to fix instead of rebuilding the whole thing.
          </Reveal>

          <div className="lg-funnel">
            {funnelStages.map((s, i) => (
              <Reveal
                key={s.label}
                className="lg-funnel-row"
                style={{ width: s.width, transitionDelay: `${i * 60}ms` }}
              >
                <div>
                  <div className="lg-funnel-title">{s.label}</div>
                  <div className="lg-funnel-sub">{s.sub}</div>
                </div>
                <div className="lg-funnel-value">{s.value}</div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* PROCESS */}
        <div className="lg-section">
          <Reveal>
            <p className="lg-eyebrow">The process</p>
          </Reveal>
          <Reveal as="h2" className="lg-h2" style={{ marginBottom: 40 }}>
            Six steps, run every single month
          </Reveal>

          <div className="lg-timeline">
            <div className="lg-timeline-rail" />
            {steps.map((s, i) => (
              <Reveal
                key={s.n}
                as="div"
                className="lg-step"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="lg-step-dot" />
                <div className="lg-step-label">STEP {s.n}</div>
                <div className="lg-step-title">{s.title}</div>
                <div className="lg-step-body">{s.body}</div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CHANNELS */}
        <div className="lg-section">
          <Reveal>
            <p className="lg-eyebrow">The channels</p>
          </Reveal>
          <Reveal as="h2" className="lg-h2" style={{ marginBottom: 40 }}>
            Where the leads actually come from
          </Reveal>

          <div className="lg-channels">
            {channels.map((c) => (
              <ChannelBar key={c.label} c={c} />
            ))}
          </div>
        </div>

        {/* PRINCIPLES */}
        <div className="lg-section">
          <Reveal>
            <p className="lg-eyebrow">The principles</p>
          </Reveal>
          <Reveal as="h2" className="lg-h2" style={{ marginBottom: 40 }}>
            What I refuse to compromise on
          </Reveal>

          <div className="lg-principles">
            {principles.map((p, i) => (
              <Reveal
                key={p.n}
                className="lg-principle"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="lg-principle-n">{p.n}</div>
                <div className="lg-principle-title">{p.title}</div>
                <div className="lg-principle-body">{p.body}</div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="lg-section lg-cta-section">
          <Reveal className="lg-cta-circle">
            <span className="lg-cta-tag">Next step</span>
            <h2 className="lg-cta-title">Let's build your lead machine</h2>
            <button
              onClick={() => navigate("/contact")}
              style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "0.85rem 1.6rem",
                borderRadius: "999px",
                border: "1.5px solid transparent",
                cursor: "pointer",
                background: "#e8a33d",
                color: "#10151c",
                transition:
                  "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 24px -8px rgba(232, 163, 61, 0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Book a strategy call
            </button>{" "}
          </Reveal>
        </div>
      </div>
      <Footer />
    </>
  );
}
