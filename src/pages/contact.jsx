import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";
import Navbar from "../components/nav/navbar";
import Footer from "../components/footer/footer";

const Dropdown = ({
  label,
  name,
  value,
  onSelect,
  options,
  required,
  openDropdown,
  setOpenDropdown,
  error,
}) => {
  const isOpen = openDropdown === name;
  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        if (isOpen) setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, setOpenDropdown]);

  const toggleOpen = () => setOpenDropdown(isOpen ? null : name);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen();
    } else if (e.key === "Escape") {
      setOpenDropdown(null);
    }
  };

  return (
    <div
      className={`field select-field ${error ? "has-error" : ""}`}
      ref={wrapperRef}
    >
      <label htmlFor={name}>{label}</label>

      <button
        type="button"
        id={name}
        className={`dropdown-trigger ${isOpen ? "open" : ""} ${
          value ? "has-value" : ""
        }`}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={!!error}
      >
        <span>{value || "Select"}</span>
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* hidden input keeps native form validation working */}
      <input type="hidden" name={name} value={value} required={required} />

      {isOpen && (
        <ul className="dropdown-menu" role="listbox">
          {options.map((option) => (
            <li
              key={option}
              role="option"
              aria-selected={value === option}
              className={`dropdown-option ${value === option ? "selected" : ""}`}
              onClick={() => onSelect(name, option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    budget: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // clear the error for this field as soon as the user edits it
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleFocus = (e) => setFocusedField(e.target.name);
  const handleBlur = () => setFocusedField(null);

  const handleSelect = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setOpenDropdown(null);

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const isActive = (field) =>
    formData[field] !== "" || focusedField === field ? "active" : "";

  // ---- validation ----
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a project type.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please add some project details.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setShowPopup(true);
    setPopupSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("https://formspree.io/f/xqeropln", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          subject: formData.subject,
          budget: formData.budget,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          budget: "",
          message: "",
        });

        setLoading(false);
        setPopupSuccess(true);

        setTimeout(() => {
          setShowPopup(false);
          setPopupSuccess(false);
        }, 2000);
      } else {
        setLoading(false);
        setShowPopup(false);
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error(error);

      setLoading(false);
      setShowPopup(false);

      alert("Something went wrong.");
    }
  };

  return (
    <>
      <Navbar />

      <section className="contact-section">
        <div className="aurora-bg" aria-hidden="true">
          <span className="aurora-blob blob-teal"></span>
          <span className="aurora-blob blob-violet"></span>
          <span className="aurora-blob blob-pink"></span>
        </div>

        <div className="contact-shell-wrapper">
          <div className="mascot">
            <img
              src="/images/Talal imae new.png"
              alt="AI assistant pointing toward the contact form"
              className="mascot-img"
            />
            <p className="mascot-text">Want to talk with me?</p>
          </div>

          <div className="contact-shell">
            <div className="contact-info">
              <span className="eyebrow">CONTACT</span>

              <h2 className="info-heading">
                Let's build
                <br />
                something worth
                <br />
                <span className="accent">shipping.</span>
              </h2>

              <p className="info-copy">
                Have an idea? Need a modern website or AI chatbot? Send over the
                details and I'll get back to you within a day.
              </p>

              <div className="status-badge">
                <span className="status-dot"></span>
                Available for new projects
              </div>

              <ul className="info-list">
                <li>
                  <span className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 6.5C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="m4 6 8 6 8-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="info-label">Email</p>
                    <p className="info-value">talalbutt755@gmail.com</p>
                  </div>
                </li>

                <li>
                  <span className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6.6 10.5c1.4 2.8 3.6 5 6.4 6.4l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V19c0 .6-.4 1-1 1C10.6 20 4 13.4 4 5c0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1L6.6 10.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="info-label">Phone</p>
                    <p className="info-value">+92 3094227256</p>
                  </div>
                </li>

                <li>
                  <span className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 21s7-6.1 7-11.4A7 7 0 0 0 5 9.6C5 14.9 12 21 12 21Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="9.5"
                        r="2.3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="info-label">Location</p>
                    <p className="info-value">Lahore, Pakistan</p>
                  </div>
                </li>
              </ul>

              <div className="stats-row">
                <div className="stat">
                  <p className="stat-num">1000+</p>
                  <p className="stat-label">Leads Generated</p>
                </div>

                <div className="stat">
                  <p className="stat-num">1.5+</p>
                  <p className="stat-label">Years Experience</p>
                </div>

                <div className="stat">
                  <p className="stat-num">50+</p>
                  <p className="stat-label">Qualified Meetings</p>
                </div>
              </div>
            </div>

            {/* ============ FORM PANEL ============ */}
            <div className="contact-form-panel">
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div
                    className={`field ${isActive("name")} ${
                      errors.name ? "has-error" : ""
                    }`}
                  >
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.name}
                      required
                    />
                    <label htmlFor="name">Full Name</label>

                    {errors.name && (
                      <p className="error-message">{errors.name}</p>
                    )}
                  </div>

                  <div
                    className={`field ${isActive("email")} ${
                      errors.email ? "has-error" : ""
                    }`}
                  >
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.email}
                      required
                    />

                    <label htmlFor="email">Your Email Address</label>

                    {errors.email && (
                      <p className="error-message">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className={`field ${isActive("phone")}`}>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />

                    <label htmlFor="phone">Phone Number</label>
                  </div>

                  <div className={`field ${isActive("company")}`}>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={formData.company}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />

                    <label htmlFor="company">Company Name</label>
                  </div>
                </div>

                <div className="form-row">
                  <Dropdown
                    label="Service Required"
                    name="subject"
                    value={formData.subject}
                    onSelect={handleSelect}
                    options={[
                      "LinkedIn Lead Generation",
                      "B2B Lead Generation",
                      "Sales Outreach Campaign",
                      "Email Marketing",
                      "Business Development Strategy",
                      "Appointment Setting",
                      "Other",
                    ]}
                    required
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    error={errors.subject}
                  />

                  <Dropdown
                    label="Company Size"
                    name="budget"
                    value={formData.budget}
                    onSelect={handleSelect}
                    options={[
                      "Startup (1-10 Employees)",
                      "Small Business (10-50 Employees)",
                      "Medium Business (50-250 Employees)",
                      "Enterprise (250+ Employees)",
                    ]}
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                  />
                </div>

                <div
                  className={`field textarea-field ${isActive(
                    "message",
                  )} ${errors.message ? "has-error" : ""}`}
                >
                  <textarea
                    rows="6"
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.message}
                    required
                  />

                  <label htmlFor="message">Business Requirements</label>

                  {errors.message && (
                    <p className="error-message">{errors.message}</p>
                  )}
                </div>

                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Inquiry"}

                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 12h15M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            {!popupSuccess ? (
              <>
                <div className="popup-loader"></div>
                <h3>Sending Message...</h3>
              </>
            ) : (
              <>
                <div className="popup-check">✓</div>

                <h3>Message Sent!</h3>

                <p>Thank you for contacting me.</p>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Contact;
