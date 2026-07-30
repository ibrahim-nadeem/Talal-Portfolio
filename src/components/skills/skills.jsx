import "./Skills.css";
import { motion } from "framer-motion";
import {
  FaGlobe,
  FaEnvelope,
  FaUsers,
  FaBullseye,
  FaSearch,
  FaCalendarCheck,
  FaHandshake,
  FaBriefcase,
  FaDatabase,
  FaChartBar,
  FaCommentDots,
} from "react-icons/fa";

const skills = [
  {
    icon: <FaGlobe size={30} />,
    title: "LinkedIn Lead Generation",
    level: "98%",
  },
  {
    icon: <FaEnvelope size={30} />,
    title: "Email Outreach",
    level: "95%",
  },
  {
    icon: <FaUsers size={30} />,
    title: "Lead Qualification",
    level: "94%",
  },
  {
    icon: <FaSearch size={30} />,
    title: "Prospect Research",
    level: "96%",
  },
  {
    icon: <FaBullseye size={30} />,
    title: "Sales Outreach",
    level: "95%",
  },
  {
    icon: <FaCalendarCheck size={30} />,
    title: "Meeting Scheduling",
    level: "92%",
  },
  {
    icon: <FaHandshake size={30} />,
    title: "Client Relationship",
    level: "94%",
  },
  {
    icon: <FaBriefcase size={30} />,
    title: "Business Development",
    level: "97%",
  },
  {
    icon: <FaDatabase size={30} />,
    title: "CRM Management",
    level: "90%",
  },
  {
    icon: <FaChartBar size={30} />,
    title: "Business Strategy",
    level: "91%",
  },
  {
    icon: <FaCommentDots size={30} />,
    title: "Cold Emailing",
    level: "93%",
  },
  {
    icon: <FaGlobe size={30} />,
    title: "US Market Research",
    level: "95%",
  },
];

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <motion.div
        className="skills-heading"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="section-tag">MY EXPERTISE</span>

        <h2>
          Skills That Drive <span>Business Growth</span>
        </h2>

        <p>
          I help companies identify high-value prospects, connect with the right
          decision-makers, and generate qualified business opportunities through
          strategic outreach and relationship building.
        </p>
      </motion.div>

      <div className="skills-grid">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            className="skill-box"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
            }}
            whileHover={{
              y: -10,
              scale: 1.03,
            }}
          >
            <div className="skill-icon">{skill.icon}</div>

            <h3>{skill.title}</h3>

            <div className="progress-info">
              <span>Proficiency</span>
              <strong>{skill.level}</strong>
            </div>

            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                whileInView={{ width: skill.level }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.2,
                  delay: 0.2,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
