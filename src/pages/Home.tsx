import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import BlogSection from '../components/BlogSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Projects from '../components/Projects';
import DevActivity from '../components/DevActivity';
import Certifications from '../components/Certifications';

interface HomeProps {
  startAnimation?: boolean;
}

const Home: React.FC<HomeProps> = ({ startAnimation = false }) => {
  return (
    <div className="relative overflow-x-hidden">
      <Hero startAnimation={startAnimation} />
      <About />
      <Skills />
      <Projects />
      <DevActivity />
      <Certifications />
      <BlogSection />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
