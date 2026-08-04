import React from "react";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import "./Pricing.css";
import Navbar from "../components/nav/navbar";
import Footer from "../components/footer/footer";

const plans = [
  {
    id: 1,
    badge: "Basic Plan",
    title: "Basic",
    price: "15,000 Rs",
    duration: "PKR / Month",
    featured: false,
     features: [
      "LinkedIn Profile Handling",
      "Part-Time – 4 Hours Work",
      "Weekly Updates",
      "Daily Task Report",
      "CV Optimization",
      "Profile Optimization",
    ],
  },
  {
    id: 2,
    badge: "premium  Plan",
    title: "Premium",
    price: "20,000 Rs",
    duration: "PKR / Month",
    featured: true,
    features: [
      "Full-Time – 8 Hours Work",
      "LinkedIn Profile Handling",
      "Weekly Report",
      "Daily Task Report",
      "CV Optimization",
      "Profile Optimization",
    ],
  },
];

const Pricing = () => {
  const handleCheckout = (link) => {
    if (!link || link.includes("REPLACE_WITH_YOUR_PAYMENT_REQUEST")) {
      console.warn(
        "Payoneer payment link abhi set nahi hua. Pricing.jsx mein payoneerLink update karein.",
      );
      return;
    }
    window.location.href = link;
  };

  return (
    <>
      <Navbar />
      <section className="pricing">
        {/* Background signal animation — same motif as About section */}
        <div className="signal-track">
          <div className="signal-path">
            <span className="signal-dot"></span>
          </div>
          <div className="signal-path two">
            <span className="signal-dot"></span>
          </div>
        </div>

        <div className="pricing-container">
          <div className="pricing-heading">
            <span className="section-tag">Pricing</span>

            <h2>
              Affordable <span className="accent">Pricing Plans</span>
            </h2>

            <p>
              Select the package that best suits your business and start growing
              with professional lead generation services.
            </p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`pricing-card ${plan.featured ? "featured-card" : ""}`}
              >
                {plan.featured && (
                  <span className="glow-ring" aria-hidden="true"></span>
                )}

                <span
                  className={`plan-badge ${plan.featured ? "featured-badge" : ""}`}
                >
                  {plan.badge}
                </span>

                <h3>{plan.title}</h3>

                <div className="divider"></div>

                <ul className="feature-list">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="check-icon">
                        <FiCheck size={14} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="divider"></div>

                <div className="pricing-footer">
                  <div className="price">
                    <h4>{plan.price}</h4>
                    <span>{plan.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Pricing;
