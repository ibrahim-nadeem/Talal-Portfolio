import React, { useEffect, useRef, useState } from "react";
import "./StrategyPage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/nav/navbar";
import Footer from "../components/footer/Footer";

/* ---------- inline icons ---------- */

const CompassNeedle = (props) => (
  <svg viewBox="0 0 100 100" {...props}>
    <polygon points="50,6 58,50 50,54 42,50" className="needle-north" />
    <polygon points="50,94 58,50 50,46 42,50" className="needle-south" />
  </svg>
);

const CheckMark = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
    <path
      d="M4 13l5 5L20 6"
      stroke="currentColor"
      strokeWidth="2.4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- data ---------- */

const QUADRANTS = [
  {
    dir: "N",
    name: "Survey",
    angle: 0,
    copy: "Map the terrain honestly — market, competitors, and your own position, plotted without flattery.",
  },
  {
    dir: "E",
    name: "Position",
    angle: 90,
    copy: "Choose the route only you can take: the one your strengths and constraints actually make possible.",
  },
  {
    dir: "S",
    name: "Commit",
    angle: 180,
    copy: "Put real resources behind the route. A strategy that risks nothing has decided nothing.",
  },
  {
    dir: "W",
    name: "Adapt",
    angle: 270,
    copy: "Watch the terrain change as you move, and adjust the route — never the destination.",
  },
];

const WAYPOINTS = [
  { label: "Survey complete", x: 40, y: 210 },
  { label: "Route staked", x: 160, y: 150 },
  { label: "Resources committed", x: 280, y: 170 },
  { label: "Course corrected", x: 400, y: 90 },
  { label: "Position held", x: 520, y: 60 },
];

const STATS = [
  { value: 3.2, decimals: 1, suffix: "x", label: "Faster strategic decisions" },
  { value: 68, suffix: "%", label: "Fewer false starts" },
  { value: 12, suffix: "qtrs", label: "Extra runway from a clear route" },
  {
    value: 94,
    suffix: "%",
    label: "Report clarity on \u201cwhat we're not doing\u201d",
  },
];

/* ---------- count-up stat ---------- */

function StatCounter({ value, suffix, label, decimals = 0 }) {
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
              setDisplay(eased * value);
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
        {display.toFixed(decimals)}
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ---------- compass quadrant section ---------- */

function CompassQuadrants() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { threshold: 0.55 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  return (
    <div className="quadrant-grid">
      {QUADRANTS.map((q, i) => (
        <div
          key={q.dir}
          ref={(el) => (refs.current[i] = el)}
          className={`quadrant quadrant-${q.dir.toLowerCase()} ${
            active === i ? "is-active" : ""
          }`}
        >
          <span className="quadrant-dir">{q.dir}</span>
          <h3>{q.name}</h3>
          <p>{q.copy}</p>
        </div>
      ))}
      <div className="compass-center" aria-hidden="true">
        <div className="compass-ring">
          <span className="tick tick-n">N</span>
          <span className="tick tick-e">E</span>
          <span className="tick tick-s">S</span>
          <span className="tick tick-w">W</span>
          <CompassNeedle
            className="compass-needle"
            style={{ transform: `rotate(${QUADRANTS[active].angle}deg)` }}
          />
          <span className="compass-pin" />
        </div>
      </div>
    </div>
  );
}

/* ---------- field-notes route chart ---------- */

function RouteChart() {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const [drawn, setDrawn] = useState(false);

  const points = WAYPOINTS.map((w) => `${w.x},${w.y}`).join(" L ");
  const d = `M ${points}`;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setDrawn(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="route-chart" ref={wrapRef}>
      <svg viewBox="0 0 560 240" className="route-svg">
        <path
          ref={pathRef}
          d={d}
          className={`route-line ${drawn ? "is-drawn" : ""}`}
          fill="none"
        />
        {WAYPOINTS.map((w, i) => (
          <g
            key={w.label}
            className={`waypoint ${drawn ? "is-visible" : ""}`}
            style={{ transitionDelay: `${0.25 + i * 0.22}s` }}
          >
            <circle cx={w.x} cy={w.y} r="6" className="waypoint-dot" />
            <text
              x={w.x}
              y={w.y - 14}
              className="waypoint-label"
              textAnchor="middle"
            >
              {w.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ---------- page ---------- */

export default function StrategyPage() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="bs-page">
        <div className="contour-field" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`contour contour-${i}`} />
          ))}
        </div>

        <section className="hero">
          <div className="hero-inner">
            <p className="eyebrow">FIELD MANUAL &mdash; STRATEGIC PLANNING</p>
            <h1 className="hero-title">
              Know the terrain <em>before</em> you move.
            </h1>
            <p className="hero-sub">
              Good strategy isn't a slide deck. It's a map of where you stand,
              where you're headed, and the route between the two &mdash; drawn
              honestly enough to actually follow.
            </p>
            <div className="hero-cta">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/contact")}
              >
                Plan your Route
              </button>{" "}
            </div>
          </div>
          <div className="hero-compass" aria-hidden="true">
            <div className="hero-compass-ring">
              <CompassNeedle className="hero-needle" />
            </div>
          </div>
        </section>

        <section className="moves">
          <div className="moves-intro">
            <span className="eyebrow">THE FOUR MOVES</span>
            <h2>Strategy has a direction for each move.</h2>
          </div>
          <CompassQuadrants />
        </section>

        <section className="route">
          <div className="route-intro">
            <span className="eyebrow">FIELD NOTES</span>
            <h2>
              The route rarely runs straight &mdash; it still has to run
              somewhere.
            </h2>
            <p>
              Each waypoint is a decision that held. The line only bends forward
              because the destination stayed fixed even when the path didn't.
            </p>
          </div>
          <RouteChart />
        </section>

        <section className="stats">
          <div className="stats-inner">
            {STATS.map((s) => (
              <StatCounter key={s.label} {...s} />
            ))}
          </div>
        </section>

        <footer className="cta-footer">
          <div className="legend-line" aria-hidden="true" />
          <h2>Ready to chart your own route?</h2>
        </footer>
      </div>
      <Footer />
    </>
  );
}
