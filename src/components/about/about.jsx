import "./About.css";
import { motion } from "framer-motion";
import {
  FaGlobe,
  FaEnvelope,
  FaUsers,
  FaBullseye,
  FaCalendarCheck,
} from "react-icons/fa";

const skills = [
  { icon: <FaGlobe size={20} />, title: "LinkedIn Lead Generation" },
  { icon: <FaEnvelope size={20} />, title: "Email Outreach" },
  { icon: <FaUsers size={20} />, title: "Lead Qualification" },
  { icon: <FaBullseye size={20} />, title: "Business Strategy" },
];

export default function About() {
  return (
    <section className="about" id="about">
      {/* signature signal-pipeline motif */}
      <div className="signal-track">
        <div className="signal-path one">
          <div className="signal-dot" />
        </div>
        <div className="signal-path two">
          <div className="signal-dot" />
        </div>
      </div>

      <div className="about-container">
        {/* Left Side */}
        <motion.div
          className="about-left"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="profile-card"
            whileHover={{ y: -12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="profile-circle">
              <div className="profile-circle-inner">
                <img
                  src="/images/Talal imae new.png"
                  alt="Talal Butt"
                  className="profile-image"
                />
              </div>
            </div>

            <h2>Talal Butt</h2>
            <span className="role">Senior Business Development Specialist</span>

            <div className="experience-box">
              <span className="pulse-dot" />
              <FaCalendarCheck size={18} />
              <span>1.5 Years Experience</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          className="about-right"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-tag">About Me</span>

          <h2>
            Helping clients build
            <br />
            <span className="accent">strong sales pipelines</span>
          </h2>

          <p>
            Hello, I'm <strong>Talal Butt</strong>, a Senior Business
            Development Specialist with <strong>1.5 years</strong> of experience
            working with US-based clients.
          </p>

          <p>
            I specialize in LinkedIn Lead Generation, Prospect Research, Sales
            Outreach, Lead Qualification, Meeting Scheduling, and Appointment
            Setting for Software, SaaS, IT, and Data Engineering experts.
          </p>

          <p>
            My goal is to help businesses connect with the right
            decision-makers, generate qualified opportunities, and build
            long-term client relationships that drive sustainable growth.
          </p>

          <div className="skill-grid">
            {skills.map((item, index) => (
              <motion.div
                key={index}
                className="skill-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="skill-icon">{item.icon}</div>
                <h4>{item.title}</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
