import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiInstagram, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer: React.FC = () => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: "LINKEDIN", url: "https://linkedin.com/in/k-nishant-18", icon: <FiLinkedin /> },
    { name: "GITHUB", url: "https://github.com/K-Nishant-18", icon: <FiGithub /> },
    { name: "EMAIL", url: "mailto:me.knishant@gmail.com", icon: <FiMail /> },
    { name: "INSTAGRAM", url: "https://instagram.com/nishant_kumar_18", icon: <FiInstagram /> },
  ];

  const navLinks = [
    { name: "HOME", action: () => scrollToTop() },
    { name: "ABOUT", action: () => scrollToSection('about') },
    { name: "WORK", action: () => scrollToSection('projects') },
    { name: "CONTACT", action: () => scrollToSection('contact') }, // Assuming contact section exists or just footer
  ];

  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white border-t border-black/10 dark:border-white/10 font-sans">
      <div className="max-w-[1800px] mx-auto grid grid-cols-2 md:grid-cols-4 min-h-[400px]">
        {/* Column 1: Brand & Context (Full Width on Mobile) */}
        <div className="col-span-2 md:col-span-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 flex flex-col justify-between">
          <div>
            <Link to="/" onClick={scrollToTop} className="block group">
              <div className="flex items-center text-4xl sm:text-4xl md:text-3xl lg:text-4xl tracking-tighter">
                <span className="text-red-600 font-bold">KUMAR</span>
                <span className="font-light ml-2 dark:text-white">NISHANT</span>
                <span className="text-red-600 font-bold ml-1">.</span>
              </div>
            </Link>
            <p className="font-mono text-xs mt-6 text-gray-500 uppercase tracking-widest">
              Digital Craftsman<br />
              Backend & DevOps Engineer
            </p>
          </div>
          <div className="mt-12 md:mt-0 font-mono text-xs uppercase text-gray-400">
            <div className="mb-1">Based in India</div>
            <div className="text-black dark:text-white">{time} IST</div>
          </div>
        </div>

        {/* Column 2: Index (Half Width on Mobile, Left) */}
        <div className="col-span-1 md:col-span-1 p-6 md:p-12 border-b md:border-b-0 border-r border-black/10 dark:border-white/10 flex flex-col">
          <div className="font-mono text-xs text-gray-500 mb-8 uppercase tracking-widest">Index</div>
          <ul className="space-y-4 flex-grow">
            {navLinks.map((link) => (
              <li key={link.name}>
                <button
                  onClick={link.action}
                  className="text-xl md:text-3xl font-light hover:italic hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group"
                >
                  {link.name}
                  <span className="opacity-0 group-hover:opacity-100 text-sm transition-opacity duration-300">→</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Socials (Half Width on Mobile, Right) */}
        <div className="col-span-1 md:col-span-1 p-6 md:p-12 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 flex flex-col">
          <div className="font-mono text-xs text-gray-500 mb-8 uppercase tracking-widest">Connect</div>
          <ul className="space-y-4 flex-grow">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl md:text-3xl font-light hover:italic hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group"
                >
                  {link.name}
                  <FiArrowUpRight className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
            ))}
          </ul>
        </div>


        {/* Column 4: Status & CTA (Full Width on Mobile) */}
        <div className="col-span-2 md:col-span-1 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs text-gray-500 mb-8 uppercase tracking-widest">Status</div>
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="font-mono text-sm font-bold animate-pulse">OPEN FOR WORK</span>
            </div>
          </div>

          <div className="mt-12 md:mt-0">
            <button
              onClick={scrollToTop}
              className="group flex flex-col items-start gap-2"
            >
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest group-hover:text-black dark:group-hover:text-white transition-colors">Back to Top</span>
              <div className="w-10 h-10 border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
                ↑
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10 dark:border-white/10 py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] md:text-xs font-mono uppercase text-gray-500 tracking-widest">
        <div>
          &copy; {new Date().getFullYear()} Kumar Nishant. All Rights Reserved.
        </div>
        <div className="flex gap-6">
          <span>Designed & Built by Me</span>
          <span>System Status: Operational</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;