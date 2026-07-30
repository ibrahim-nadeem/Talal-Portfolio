import Navbar from "../components/nav/navbar";
import Hero from "../components/hero/Hero";
import About from "../components/about/About";
import Skills from "../components/skills/Skills";
import Testimonials from "../components/testimonials/Testimonials";
 import Footer from "../components/footer/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Testimonials />
       <Footer />
    </>
  );
}