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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

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

  const fetchEntries = async () => {
    try {
      const res = await fetch('https://nishant-portfolio-1.onrender.com/api/guestbook');
      const data = await res.json();
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to fetch guestbook entries:', err);
    }
  };

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
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://nishant-portfolio-1.onrender.com/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit testimonial');
      }

      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        role: '',
        message: '',
        rating: 5,
      });
      setTimeout(() => setShowSuccess(false), 3000);

      fetchEntries();
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
              What People Say ({testimonials.length})
            </h2>
            
            <div className="space-y-8">
              {testimonials.map((testimonial) => (
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