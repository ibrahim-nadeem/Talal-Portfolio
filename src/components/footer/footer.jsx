import React, { useEffect, useRef } from "react";
import {
  FaLinkedinIn,
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowUp,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./Footer.css";

export default function Footer() {
  const rootRef = useRef(null);
  const socialRefs = useRef([]);

  useEffect(() => {
    const elements = rootRef.current.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleMove = (e, i) => {
    const item = socialRefs.current[i];
    if (!item) return;

    const box = item.getBoundingClientRect();

    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;

    item.style.transform = `translate(${x * 0.25}px, ${y * 0.25 - 6}px)`;
  };

  const handleLeave = (i) => {
    const item = socialRefs.current[i];

    if (item) {
      item.style.transform = "translate(0,0)";
    }
  };

  const socials = [
    {
      icon: <FaLinkedinIn />,
      label: "LinkedIn",
      link: "https://www.linkedin.com/in/tallal-alam-butt-4aa7703b1/",
    },
    {
      icon: <MdEmail />,
      label: "Email",
      link: "mailto:talalbutt755@gmail.com",
    },
    {
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      link: "https://wa.me/9233179670669",
    },
  ];

  return (
    <footer ref={rootRef} className="footer">
      <div className="footer-glow" />
      <div className="footer-glow secondary" />

      <div className="footer-container">
        {/* LEFT */}
        <div className="footer-left reveal">
          <span className="eyebrow">
            <span className="dot" />
            LET'S CONNECT
          </span>

          <h2>
            Let's build your next <span>sales pipeline</span> together
          </h2>

          <p>
            Whether you need lead generation, prospect research, or a partner to
            manage outreach end to end — I'm one message away from turning
            conversations into qualified opportunities.
          </p>

          <div className="footer-social">
            {socials.map((item, index) => (
              <a
                key={item.label}
                href={item.link}
                target={item.label === "Email" ? "_self" : "_blank"}
                rel="noopener noreferrer"
                aria-label={item.label}
                ref={(el) => (socialRefs.current[index] = el)}
                onMouseMove={(e) => handleMove(e, index)}
                onMouseLeave={() => handleLeave(index)}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-links reveal">
          <h3>Quick Links</h3>

          <a href="/#about">About Me</a>

          <a href="/#services">Services</a>

          <a href="/#portfolio">Portfolio</a>

          <a href="/#testimonials">Testimonials</a>
        </div>

        {/* CONTACT */}
        <div className="footer-contact reveal">
          <h3>Get In Touch</h3>

          <p>
            <span className="icon">
              <MdEmail />
            </span>

            <a href="mailto:talalbutt755@gmail.com">talalbutt755@gmail.com</a>
          </p>

          <p>
            <span className="icon">
              <FaPhoneAlt />
            </span>

            <a href="tel:(+92)3319670664">(+92)3319670664</a>
          </p>

          <p>
            <span className="icon">
              <FaMapMarkerAlt />
            </span>
            Lahore, Pakistan
          </p>
        </div>
      </div>

      {/* BOTTOM */}

      <div className="footer-bottom reveal">
        <p>
          © 2026 <b>Talal Butt</b>. All rights reserved.
        </p>

        <button
          className="top-btn"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
}
