import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import BlogSection from '../components/BlogSection';
import TestimonialPreview from '../components/TestimonialPreview';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Projects from '../components/Projects';
import Timeline from '../components/Timeline';
import DevActivity from '../components/DevActivity';



const Home: React.FC = () => {
  return (
    <div className="relative">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Timeline />
      <DevActivity />
      <BlogSection />
      <TestimonialPreview />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;