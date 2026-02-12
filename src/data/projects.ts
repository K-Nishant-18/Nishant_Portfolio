export interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    longDescription: string;
    tech: string[];
    year: string;
    status: string;
    image: string;
    github: string;
    live: string | null;
    impact?: string[];
    size?: 'small' | 'medium' | 'large';
    color: string;
}

export const projects: Project[] = [
    {
        id: '01',
        title: 'Collegia',
        category: 'Full-Stack Platform',
        description: 'Comprehensive academic management system with real-time collaboration.',
        longDescription: 'Collegia is a full-featured student management platform that streamlines academic processes. Built with Java Spring MVC and React.js, it features user authentication, course management, assignment tracking, and real-time notifications.',
        tech: ['Java', 'Spring MVC', 'React.js', 'MySQL', 'Spring Security'],
        year: '2024',
        status: 'Live',
        image: '/collegiaMockup.png',
        github: 'https://github.com/K-Nishant-18',
        live: 'https://github.com/K-Nishant-18',
        impact: ['500+ Students', '15+ Institutions', '99.9% Uptime'],
        size: 'large',
        color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
        id: '02',
        title: 'The Cultural Circuit',
        category: 'Community',
        description: 'Preserving heritage through digital storytelling and community engagement.',
        longDescription: 'The Cultural Circuit connects communities through cultural preservation. Features include cultural event management, heritage documentation, community forums, and multimedia galleries to share traditions.',
        tech: ['MERN Stack', 'AWS S3', 'Socket.io', 'JWT'],
        year: '2024',
        status: 'Development',
        image: '/cultural.png',
        github: 'https://github.com/K-Nishant-18',
        live: null,
        impact: ['Cultural Preservation', 'Community Building', 'Heritage Documentation'],
        size: 'medium',
        color: 'from-orange-500/20 to-red-500/20'
    },
    {
        id: '03',
        title: '0xKid',
        category: 'EdTech',
        description: 'Gamified coding platform for children with AI mentorship.',
        longDescription: '0xKid makes learning programming exciting for children through gamified challenges and AI-powered mentorship. The platform offers structured lessons, real-time feedback, and a visual learning environment.',
        tech: ['Spring Boot', 'React.js', 'MongoDB', 'OpenAI API'],
        year: '2024',
        status: 'Development',
        image: '/0xkidMockup.png',
        github: '#',
        live: '#',
        impact: ['Gamified Learning', 'AI Mentorship', 'Child-Friendly UI'],
        size: 'medium',
        color: 'from-purple-500/20 to-pink-500/20'
    },
    {
        id: '04',
        title: 'SkillBloom+',
        category: 'LMS',
        description: 'Advanced learning platform with GitHub tracking.',
        longDescription: 'SkillBloom+ tracks student progress through GitHub integration. Features include course management, skill assessments, progress tracking, and automated certificate generation based on code commits.',
        tech: ['Spring Boot', 'PostgreSQL', 'Docker', 'GitHub API'],
        year: '2023',
        status: 'Live',
        image: '/skillbloom.png',
        github: 'https://github.com/K-Nishant-18',
        live: 'https://github.com/K-Nishant-18',
        impact: ['1000+ Learners', 'GitHub Integration', 'Automated Assessments'],
        size: 'medium',
        color: 'from-green-500/20 to-emerald-500/20'
    },
    {
        id: '05',
        title: 'E-Commerce API',
        category: 'Backend',
        description: 'Robust RESTful API with advanced security and payment integration.',
        longDescription: 'A production-ready e-commerce API featuring user management, product catalog, order processing, and Stripe payment integration. Includes comprehensive security measures and optimized database queries.',
        tech: ['Spring Security', 'JWT', 'Stripe API', 'MySQL'],
        year: '2023',
        status: 'Live',
        image: 'https://images.pexels.com/photos/5650040/pexels-photo-5650040.jpeg',
        github: 'https://github.com/K-Nishant-18',
        live: null,
        impact: ['Secure Payments', 'RESTful Design', 'Scalable Architecture'],
        size: 'small',
        color: 'from-slate-500/20 to-gray-500/20'
    },
    {
        id: '06',
        title: 'Portfolio',
        category: 'Frontend',
        description: 'The site you are looking at right now.',
        longDescription: 'A fully responsive personal portfolio designed to highlight professional skills and projects. Built with a focus on clean design, smooth GSAP animations, and user-friendly navigation.',
        tech: ['React.js', 'GSAP', 'Tailwind CSS', 'Vite'],
        year: '2023',
        status: 'Live',
        image: '/portfolio.png',
        github: 'https://github.com/K-Nishant-18',
        live: 'https://github.com/K-Nishant-18',
        impact: ['Showcased Skills', 'Professional Branding', 'Interactive UI/UX'],
        size: 'small',
        color: 'from-indigo-500/20 to-violet-500/20'
    },
];
