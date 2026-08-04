import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import Contact from "./pages/contact";
import LeadGenPage from "./pages/leadgen";
import LeadQualificationPage from "./pages/LeadQualification";
import EmailOutreach from "./pages/EmailOutreach";
import StrategyPage from "./pages/Strategy";
import ScrollToTop from "./components/ScrollToTop";
import PricingSection from "./pages/pricing";
function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/lead-gen" element={<LeadGenPage />} />
        <Route path="/Lead-Qualification" element={<LeadQualificationPage />} />
        <Route path="/email-outreach" element={<EmailOutreach />} />
        <Route path="/strategy" element={<StrategyPage />} />
        <Route path="/pricing" element={<PricingSection />} />
      </Routes>
    </>
  );
}

export default App;
