import "./Testimonials.css";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Michael Johnson",
    role: "CEO • SaaS Company",
    review:
      "Talal consistently delivered high-quality leads and helped us connect with key decision-makers. His outreach strategy significantly improved our sales pipeline.",
  },
  {
    name: "Sarah Williams",
    role: "Sales Director",
    review:
      "Professional, proactive, and highly organised. Our LinkedIn campaigns generated excellent meetings thanks to Talal's expertise.",
  },
  {
    name: "David Brown",
    role: "Founder • IT Agency",
    review:
      "Outstanding communication and business development skills. Talal became an important part of our client acquisition process.",
  },
  {
    name: "Emily Carter",
    role: "Growth Manager",
    review:
      "His prospect research and email outreach delivered qualified opportunities every week. Highly recommended for B2B growth.",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <motion.div
        className="testimonial-heading"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="section-tag">TESTIMONIALS</span>

        <h2>
          What My <span>Clients Say</span>
        </h2>

        <p>
          Building long-term relationships through strategic outreach, quality
          lead generation and measurable business growth.
        </p>
      </motion.div>

      <div className="slider">
        <motion.div
          className="slider-track"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...testimonials, ...testimonials].map((item, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              whileHover={{
                y: -12,
                scale: 1.03,
              }}
            >
              <FaQuoteLeft className="quote" size={34} />

              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={16} color="currentColor" />
                ))}
              </div>

              <p className="review">"{item.review}"</p>

              <div className="client">
                <div className="avatar">{item.name.charAt(0)}</div>

                <div>
                  <h4>{item.name}</h4>
                  <span>{item.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
