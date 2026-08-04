import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const links = [
  { name: "Home", id: "hero", type: "scroll" },
  { name: "About", id: "about", type: "scroll" },
  { name: "Skills", id: "skills", type: "scroll" },
  { name: "Testimonials", id: "testimonials", type: "scroll" },
  { name: "Pricing", id: "pricing", type: "route", path: "/pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState("hero");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      if (location.pathname !== "/") return;

      const sections = document.querySelectorAll("section");

      sections.forEach((section) => {
        const top = section.offsetTop - 120;
        const height = section.offsetHeight;

        if (window.scrollY >= top && window.scrollY < top + height) {
          setActive(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/pricing") {
      setActive("pricing");
    } else if (location.pathname === "/") {
      setActive("hero");
    }
  }, [location.pathname]);

  const handleNavigation = (item) => {
    setMobile(false);

    if (item.type === "route") {
      navigate(item.path);
      return;
    }

    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document.getElementById(item.id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    } else {
      document.getElementById(item.id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const goContact = () => {
    setMobile(false);
    navigate("/contact");
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={scrolled ? "navbar scrolled" : "navbar"}
    >
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        <img
          src="/images/bizzlinks.jpg"
          alt="Talal Logo"
          className="logo-img"
        />
      </div>

      {/* Navigation */}
      <ul className={mobile ? "nav-links active" : "nav-links"}>
        {links.map((item) => (
          <li key={item.name}>
            <button
              onClick={() => handleNavigation(item)}
              className={active === item.id ? "active" : ""}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>

      <div className="nav-right">
        {/* CTA */}
        <motion.button
          onClick={goContact}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          className="cta"
        >
          Let's Talk
        </motion.button>

        {/* Mobile Menu */}
        <div
          className={mobile ? "menu open" : "menu"}
          onClick={() => setMobile(!mobile)}
        >
          {mobile ? <FaTimes size={22} /> : <FaBars size={22} />}
        </div>
      </div>
    </motion.nav>
  );
}