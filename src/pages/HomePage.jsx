import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import RibbonDivider from '../components/RibbonDivider';
import WhyChooseUs from '../components/WhyChooseUs';
import ServiceCards from '../components/ServiceCards';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import Process from '../components/Process';
import HomeCTA from '../components/HomeCTA';
import About from '../components/About';
import LuxeEvents from '../components/LuxeEvents';
import LuxeConfectioneries from '../components/LuxeConfectioneries';
import LuxeDesigns from '../components/LuxeDesigns';
import Portfolio from '../components/Portfolio';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <WhyChooseUs />
        <ServiceCards />
        <Portfolio preview />
        <Process />
        <HomeCTA />
        <RibbonDivider />
        <About />
        <RibbonDivider />
        <LuxeEvents />
        <LuxeConfectioneries />
        <LuxeDesigns />
        <RibbonDivider />
        <TestimonialsCarousel />
        <RibbonDivider flip />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
