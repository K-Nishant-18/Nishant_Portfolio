import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FiSend, FiUser, FiMail, FiPhone, FiCalendar, FiDollarSign, FiFileText } from 'react-icons/fi';

const Collaborate: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    requirements: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      [formRef.current, infoRef.current],
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://nishant-portfolio-1.onrender.com/api/collaborate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit collaboration request');
      }

      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        projectType: '',
        budget: '',
        timeline: '',
        description: '',
        requirements: '',
      });
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const projectTypes = [
    'Web Application',
    'E-commerce Platform',
    'API Development',
    'Database Design',
    'Full-Stack Development',
    'Consulting',
    'Other',
  ];

  const budgetRanges = [
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000+',
    'Let\'s discuss',
  ];

  const timelines = [
    '1-2 weeks',
    '1 month',
    '2-3 months',
    '3-6 months',
    '6+ months',
    'Flexible',
  ];

  return (
    <div className="min-h-screen pt-32 pb-16">
      <section ref={sectionRef} className="px-8 max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-8">
            Let's Collaborate
          </h1>
          <p className="text-lg font-light text-gray-600 dark:text-gray-400 max-w-2xl">
            Ready to bring your ideas to life? Let's discuss your project and create something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Project Form */}
          <div ref={formRef} className="lg:col-span-2">
            <h2 className="text-2xl font-light tracking-tight mb-8">Project Details</h2>
            
            {showSuccess && (
              <div className="mb-8 p-6 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <h3 className="font-light text-lg text-green-800 dark:text-green-200 mb-2">
                  Thank you for your interest!
                </h3>
                <p className="font-light text-green-700 dark:text-green-300">
                  I've received your project details and will get back to you within 24 hours to discuss next steps.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-light tracking-tight border-b border-gray-200 dark:border-gray-800 pb-2">
                  Contact Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-400 dark:focus:border-gray-600 transition-colors duration-300 outline-none"
                      data-cursor="pointer"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-400 dark:focus:border-gray-600 transition-colors duration-300 outline-none"
                      data-cursor="pointer"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-400 dark:focus:border-gray-600 transition-colors duration-300 outline-none"
                      data-cursor="pointer"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-400 dark:focus:border-gray-600 transition-colors duration-300 outline-none"
                      data-cursor="pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-light tracking-tight border-b border-gray-200 dark:border-gray-800 pb-2">
                  Project Information
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                      Project Type *
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-400 dark:focus:border-gray-600 transition-colors duration-300 outline-none"
                      data-cursor="pointer"
                    >
                      <option value="">Select type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                      Budget Range *
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-400 dark:focus:border-gray-600 transition-colors duration-300 outline-none"
                      data-cursor="pointer"
                    >
                      <option value="">Select budget</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                      Timeline *
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-400 dark:focus:border-gray-600 transition-colors duration-300 outline-none"
                      data-cursor="pointer"
                    >
                      <option value="">Select timeline</option>
                      {timelines.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                    Project Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-400 dark:focus:border-gray-600 transition-colors duration-300 outline-none resize-none"
                    placeholder="Describe your project, goals, and what you're looking to achieve..."
                    data-cursor="pointer"
                  />
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                    Technical Requirements
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-400 dark:focus:border-gray-600 transition-colors duration-300 outline-none resize-none"
                    placeholder="Any specific technologies, integrations, or technical requirements..."
                    data-cursor="pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center rounded-md space-x-2 px-8 py-4 bg-gray-900 dark:bg-green-700 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                data-cursor="pointer"
              >
                <FiSend size={18} />
                <span className="font-light text-lg">
                  {isSubmitting ? 'Sending...' : 'Send Project Details'}
                </span>
              </button>
            </form>
          </div>

          {/* Collaboration Info */}
          <div ref={infoRef} className="space-y-8">
            <div>
              <h2 className="text-2xl font-light tracking-tight mb-6">How I Work</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <FiUser className="text-xl mt-1" />
                  <div>
                    <h3 className="font-light text-lg mb-2">Discovery Call</h3>
                    <p className="font-light text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      We'll start with a detailed discussion about your project goals, requirements, and expectations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FiFileText className="text-xl mt-1" />
                  <div>
                    <h3 className="font-light text-lg mb-2">Proposal & Planning</h3>
                    <p className="font-light text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      I'll provide a detailed proposal with timeline, milestones, and technical approach.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FiCalendar className="text-xl mt-1" />
                  <div>
                    <h3 className="font-light text-lg mb-2">Development & Updates</h3>
                    <p className="font-light text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Regular progress updates and milestone reviews to ensure we're on track.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FiDollarSign className="text-xl mt-1" />
                  <div>
                    <h3 className="font-light text-lg mb-2">Delivery & Support</h3>
                    <p className="font-light text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Final delivery with documentation and ongoing support as needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <h3 className="text-lg font-light tracking-tight mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <a
                  href="mailto:me.knishant@gmail.com"
                  className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
                  data-cursor="pointer"
                >
                  <FiMail size={16} />
                  <span className="font-light">me.knishant@gmail.com</span>
                </a>
                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                  <FiCalendar size={16} />
                  <span className="font-light">Available for new projects</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="font-light text-lg mb-4">Response Time</h3>
              <p className="font-light text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                I typically respond to project inquiries within 24 hours. For urgent projects, 
                feel free to mention it in your message.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collaborate;