import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FiSend, FiHeart, FiUser } from 'react-icons/fi';

interface Testimonial {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  message: string;
  rating: number;
  date: string;
  approved: boolean;
}

const GuestBook: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'Prashant Kumar',
      email: 'prashant@example.com',
      company: 'Tech Startup',
      role: 'Product Manager',
      message: 'Nishant delivered exceptional work on our platform. His attention to detail and technical expertise made all the difference. The project was completed on time and exceeded our expectations.',
      rating: 4,
      date: '2024-12-10',
      approved: true,
    },
    {
      id: '2',
      name: 'Gaurav Shaw',
      email: 'gaurav@example.com',
      company: 'Software Solutions',
      role: 'Senior Developer',
      message: 'Working with Nishant was a pleasure. He brings innovative solutions and maintains high code quality throughout. His communication skills are excellent.',
      rating: 5,
      date: '2024-12-08',
      approved: true,
    },
    {
      id: '3',
      name: 'Tripti Sharma',
      email: 'tripti@example.com',
      company: 'Design Agency',
      role: 'UI/UX Designer',
      message: 'Nishant perfectly translated our designs into functional, beautiful web applications. His understanding of both design and development is impressive.',
      rating: 4,
      date: '2024-12-05',
      approved: true,
    },
    {
      id: '4',
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      company: 'E-commerce Startup',
      role: 'CTO',
      message: 'Outstanding full-stack development skills. Nishant built our entire e-commerce platform with robust security and excellent performance.',
      rating: 3,
      date: '2024-12-01',
      approved: true,
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: '',
    rating: 5,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      [formRef.current, testimonialsRef.current],
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      approved: false, // Would be approved by admin
    };

    setTestimonials(prev => [newTestimonial, ...prev]);
    setFormData({
      name: '',
      email: '',
      company: '',
      role: '',
      message: '',
      rating: 5,
    });

    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
            className={`${
              star <= rating ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'
            } ${interactive ? 'hover:text-red-500 cursor-pointer' : ''} transition-colors duration-200`}
            data-cursor="pointer"
          >
            <FiHeart size={16} fill={star <= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <section ref={sectionRef} className="px-8 max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-8">
            Guest Book
          </h1>
          <p className="text-lg font-light text-gray-600 dark:text-gray-400 max-w-2xl">
            Share your experience working with me. Your feedback helps me grow and helps others understand my work approach.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Testimonial Form */}
          <div ref={formRef}>
            <h2 className="text-2xl font-light tracking-tight mb-8">Leave a Testimonial</h2>
            
            {showSuccess && (
              <div className="mb-6 p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                <p className="font-light">Thank you for your testimonial! It will be reviewed and published soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                    Name *
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
                    Email *
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
                    Company
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
                  <label htmlFor="role" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-400 dark:focus:border-gray-600 transition-colors duration-300 outline-none"
                    data-cursor="pointer"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-4">
                  {renderStars(formData.rating, true, (rating) => setFormData(prev => ({ ...prev, rating })))}
                  <span className="text-sm font-light text-gray-600 dark:text-gray-400">
                    {formData.rating} out of 5
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-light tracking-wide text-gray-500 dark:text-gray-500 uppercase mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-400 dark:focus:border-gray-600 transition-colors duration-300 outline-none resize-none"
                  placeholder="Share your experience working with me..."
                  data-cursor="pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center rounded-md space-x-2 px-8 py-3 bg-gray-900 dark:bg-green-700 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                data-cursor="pointer"
              >
                <FiSend size={16} />
                <span className="font-light">
                  {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
                </span>
              </button>
            </form>
          </div>

          {/* Testimonials Display */}
          <div ref={testimonialsRef}>
            <h2 className="text-2xl font-light tracking-tight mb-8">
              What People Say ({testimonials.filter(t => t.approved).length})
            </h2>
            
            <div className="space-y-8">
              {testimonials.filter(t => t.approved).map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-300"
                  data-cursor="pointer"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      <FiUser size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-light text-lg">{testimonial.name}</h3>
                          {testimonial.role && testimonial.company && (
                            <p className="text-sm font-light text-gray-500 dark:text-gray-500">
                              {testimonial.role} at {testimonial.company}
                            </p>
                          )}
                        </div>
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="font-light leading-relaxed text-gray-700 dark:text-gray-300 mb-3">
                        "{testimonial.message}"
                      </p>
                      <p className="text-xs font-light text-gray-500 dark:text-gray-500">
                        {new Date(testimonial.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuestBook;