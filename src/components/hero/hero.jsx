import "./Hero.css";
import { motion } from "framer-motion";

import {
  FaGlobe,
  FaEnvelope,
  FaBriefcase,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const cards = [
  { icon: <FaGlobe size={18} />, text: "LinkedIn Leads" },
  { icon: <FaEnvelope size={18} />, text: "Email Outreach" },
  { icon: <FaBriefcase size={18} />, text: "Business Growth" },
  { icon: <FaUsers size={18} />, text: "Qualified Clients" },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="hero-container">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.p className="tag">Senior Business Developer</motion.p>

          <motion.h1>
            Helping Businesses Generate
            <span> Qualified Leads </span>& Scale Faster
          </motion.h1>

          <motion.p className="desc">
            Hi, I'm <strong>Talal Butt</strong>. I help Software, SaaS, IT and
            Data Engineering companies connect with decision-makers through
            LinkedIn Lead Generation, Sales Outreach and Business Development
            strategies.
          </motion.p>

          {/* Contact Button */}
          <motion.button
            className="ib-btn-ghost"
            type="button"
            onClick={() => navigate("/contact")}
            whileHover={{
              scale: 1.05,
              y: -3,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            Let's Talk
            <FaArrowRight size={16} />
          </motion.button>

          <motion.div
            className="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div>
              <h2>1.5+</h2>
              <span>Years Experience</span>
            </div>

            <div>
              <h2>1000+</h2>
              <span>Qualified Leads</span>
            </div>

            <div>
              <h2>US</h2>
              <span>Clients</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div
            className="glass"
            animate={{ y: [-10, 10, -10] }}
            transition={{
              repeat: Infinity,
              duration: 5,
            }}
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                className="card"
                whileHover={{
                  scale: 1.08,
                  rotate: 2,
                }}
              >
                {card.icon}
                <span>{card.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
