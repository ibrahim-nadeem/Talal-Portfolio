import React, { useEffect, useRef, useState } from "react";
import "./EmailOutreach.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/nav/navbar";
import Footer from "../components/footer/Footer";

const EnvelopeIcon = (props) => (
  <svg viewBox="0 0 48 32" width="28" height="19" {...props}>
    <rect
      x="1"
      y="1"
      width="46"
      height="30"
      rx="3"
      fill="currentColor"
      opacity="0.15"
    />
    <path
      d="M2 3 L24 20 L46 3"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="1"
      y="1"
      width="46"
      height="30"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const ArrowIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
    <path
      d="M4 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
    <path
      d="M4 13l5 5L20 6"
      stroke="currentColor"
      strokeWidth="2.6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- stage data ---------- */

const STAGES = [
  {
    code: "01",
    title: "Draft",
    copy: "Write once. Personalize every line with a name, a company, a reason you noticed them at all.",
    anim: "draft",
  },
  {
    code: "02",
    title: "Send",
    copy: "Queued, spaced, and paced so your domain stays trusted and your messages stay welcome.",
    anim: "send",
  },
  {
    code: "03",
    title: "Land",
    copy: "Straight to the primary inbox, not the promotions pile, the spam folder, or the void.",
    anim: "land",
  },
  {
    code: "04",
    title: "Reply",
    copy: "A real question gets a real answer. You'll know within minutes, not next quarter.",
    anim: "reply",
  },
  {
    code: "05",
    title: "Convert",
    copy: "A reply becomes a call, a call becomes a customer. The whole route, tracked end to end.",
    anim: "convert",
  },
];

const STATS = [
  { value: 62, suffix: "%", label: "Open rate" },
  { value: 18, suffix: "%", label: "Reply rate" },
  { value: 340, suffix: "+", label: "Meetings booked" },
  { value: 12, suffix: "hrs", label: "Saved per week" },
];

/* ---------- count-up stat ---------- */

function StatCounter({ value, suffix, label }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1200;
            const start = performance.now();
            const step = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(Math.round(eased * value));
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="stat" ref={ref}>
      <div className="stat-value">
        {display}
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ---------- one stage row ---------- */

function Stage({ stage, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const side = index % 2 === 0 ? "left" : "right";

  return (
    <div
      ref={ref}
      className={`stage stage-${side} ${visible ? "is-visible" : ""}`}
      data-stage-index={index}
    >
      <div className="stage-card">
        <span className="stamp">{stage.code}</span>
        <h3 className="stage-title">{stage.title}</h3>
        <p className="stage-copy">{stage.copy}</p>
        <div
          className={`mini-anim mini-anim--${stage.anim}`}
          aria-hidden="true"
        >
          {stage.anim === "draft" && (
            <div className="draft-lines">
              <span className="draft-line l1" />
              <span className="draft-line l2" />
              <span className="draft-line l3" />
              <span className="draft-cursor" />
            </div>
          )}
          {stage.anim === "send" && (
            <div className="send-track">
              <EnvelopeIcon className="send-plane" />
              <span className="send-dash" />
            </div>
          )}
          {stage.anim === "land" && (
            <div className="land-scene">
              <EnvelopeIcon className="land-envelope" />
              <span className="land-tray" />
            </div>
          )}
          {stage.anim === "reply" && (
            <div className="reply-scene">
              <span className="reply-bubble">
                <ArrowIcon />
              </span>
            </div>
          )}
          {stage.anim === "convert" && (
            <div className="convert-scene">
              <span className="convert-stamp">
                <CheckIcon />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- flight path that draws itself + carries a marker ---------- */

function FlightPath({ pathD, containerRef }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const pathEl = pathRef.current;
    const markerEl = markerRef.current;
    const containerEl = containerRef.current;
    if (!pathEl || !markerEl || !containerEl) return;

    const total = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = `${total}`;
    pathEl.style.strokeDashoffset = `${total}`;

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = containerEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = pathEl.getTotalLength();

      // progress: 0 when section top hits bottom of viewport, 1 when section bottom hits top
      const start = vh * 0.85;
      const end = -rect.height + vh * 0.15;
      const raw = (start - rect.top) / (start - end);
      const progress = Math.min(Math.max(raw, 0), 1);

      pathEl.style.strokeDashoffset = `${total * (1 - progress)}`;

      const point = pathEl.getPointAtLength(total * progress);
      markerEl.style.transform = `translate(${point.x}px, ${point.y}px)`;
      markerEl.style.opacity =
        progress > 0.01 && progress < 0.999 ? "1" : "0.6";
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef]);

  return (
    <svg
      ref={svgRef}
      className="flight-path-svg"
      viewBox="0 0 100 500"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className="flight-path-ghost" d={pathD} fill="none" />
      <path ref={pathRef} className="flight-path-live" d={pathD} fill="none" />
      <g ref={markerRef} className="flight-marker">
        <circle r="3.2" className="flight-marker-dot" />
      </g>
    </svg>
  );
}

/* ---------- page ---------- */

export default function EmailOutreach() {
  const navigate = useNavigate();
  const journeyRef = useRef(null);

  const pathD =
    "M50 0 C 20 40, 80 70, 50 110 S 15 180, 50 220 S 85 290, 50 330 S 15 400, 50 440 S 80 480, 50 500";

  return (
    <>
      <div className="eo-page">
        <Navbar />

        <section className="hero">
          <div className="hero-inner">
            <p className="eyebrow">TRACKING NO. 014 — OUTREACH ROUTE</p>
            <h1 className="hero-title">
              Outreach, <em>delivered.</em>
            </h1>
            <p className="hero-sub">
              Every cold email is a small package: it has to be written well,
              sent at the right pace, and actually arrive. Here's the route from
              draft to customer.
            </p>
            <div className="hero-cta">
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
                Plan your Route
              </button>
            </div>
          </div>
          <div className="hero-envelope-wrap" aria-hidden="true">
            <div className="hero-envelope">
              <div className="hero-envelope-body">
                <div className="hero-envelope-flap" />
                <div className="hero-envelope-seal" />
              </div>
              <div className="hero-envelope-trail" />
            </div>
          </div>
        </section>

        <section className="journey" ref={journeyRef}>
          <div className="journey-intro">
            <span className="eyebrow">THE ROUTE</span>
            <h2>Five stops, one delivery.</h2>
          </div>
          <div className="journey-track">
            <FlightPath pathD={pathD} containerRef={journeyRef} />
            <div className="stage-list">
              {STAGES.map((stage, i) => (
                <Stage stage={stage} index={i} key={stage.code} />
              ))}
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="stats-inner">
            {STATS.map((s) => (
              <StatCounter key={s.label} {...s} />
            ))}
          </div>
        </section>

        <footer className="cta-footer">
          <div className="perforation" aria-hidden="true" />
          <h2>Ready to send your first campaign?</h2>
          <p className="cta-footer-sub">
            Plan the route, write the drafts, and let the send-and-track loop do
            the rest.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="cta-footer-btn"
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
              marginTop: "1.25rem",
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
            Plan your Route
          </button>

          <div className="cta-footer-grid">
            <div>
              <h4>What I set up</h4>
              <p>
                Personalized drafts, warmed-up sending domains, and a paced
                queue that keeps deliverability high.
              </p>
            </div>
            <div>
              <h4>Tooling</h4>
              <p>
                Sequencing tools, inbox rotation, deliverability monitoring, and
                CRM sync for every reply.
              </p>
            </div>
            <div>
              <h4>Outcome</h4>
              <p>
                Higher open and reply rates, tracked end to end from first send
                to booked meeting.
              </p>
            </div>
          </div>

          <div className="cta-footer-bottom"></div>
        </footer>
      </div>
      <Footer />
    </>
  );
}
