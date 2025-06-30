// import React, { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// const Testimonials: React.FC = () => {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const cardsRef = useRef<HTMLDivElement>(null);

//   const testimonials = [
//     {
//       name: 'Prashant Kumar',
//       role: 'Product Manager',
//       company: 'Tech Startup',
//       testimonial: 'Nishant delivered exceptional work on our platform. His attention to detail and technical expertise made all the difference.',
//       initial: 'P',
//       color: 'bg-blue-500',
//     },
//     {
//       name: 'Gaurav Shaw',
//       role: 'Senior Developer',
//       company: 'Software Solutions',
//       testimonial: 'Working with Nishant was a pleasure. He brings innovative solutions and maintains high code quality throughout.',
//       initial: 'G',
//       color: 'bg-green-500',
//     },
//     {
//       name: 'Tripti Sharma',
//       role: 'UI/UX Designer',
//       company: 'Design Agency',
//       testimonial: 'Nishant perfectly translated our designs into functional, beautiful web applications. Highly recommended!',
//       initial: 'T',
//       color: 'bg-purple-500',
//     },
//   ];

//   useEffect(() => {
//     gsap.fromTo(
//       cardsRef.current?.children,
//       { rotationY: 90, opacity: 0 },
//       {
//         rotationY: 0,
//         opacity: 1,
//         duration: 0.8,
//         stagger: 0.2,
//         ease: 'power2.out',
//         scrollTrigger: {
//           trigger: cardsRef.current,
//           start: 'top 80%',
//         },
//       }
//     );

//     // Animate initial badges
//     cardsRef.current?.querySelectorAll('.initial-badge').forEach((badge, index) => {
//       gsap.fromTo(
//         badge,
//         { scale: 0, rotation: -180 },
//         {
//           scale: 1,
//           rotation: 0,
//           duration: 0.6,
//           ease: 'back.out(1.7)',
//           delay: index * 0.2 + 0.5,
//           scrollTrigger: {
//             trigger: badge,
//             start: 'top 80%',
//           },
//         }
//       );
//     });
//   }, []);

//   return (
//     <section
//       id="testimonials"
//       ref={sectionRef}
//       className="py-20 px-6 relative"
//       style={{
//         backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop)',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundAttachment: 'fixed',
//       }}
//     >
//       <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
//       <div className="max-w-7xl mx-auto relative z-10">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
//             Reflections and Raves
//           </h2>
//           <p className="text-lg text-gray-300">
//             What people say about working with me
//           </p>
//         </div>

//         <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {testimonials.map((testimonial, index) => (
//             <div
//               key={index}
//               className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative"
//             >
//               <div
//                 className={`initial-badge absolute -top-4 -left-4 w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
//               >
//                 {testimonial.initial}
//               </div>

//               <div className="pt-4">
//                 <p className="text-gray-600 dark:text-gray-400 mb-6 italic">
//                   "{testimonial.testimonial}"
//                 </p>

//                 <div>
//                   <h4 className="font-bold text-lg">{testimonial.name}</h4>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     {testimonial.role}
//                   </p>
//                   <p className="text-sm text-red-600 font-medium">
//                     {testimonial.company}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;