export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string; // URL or local path to certificate image
  verificationUrl: string;
  tags: string[];
}

export const CERTIFICATIONS_DATA: Certification[] = [
  {
    id: 'aws-sa-assoc',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: 'Jan 2025',
    image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000&auto=format&fit=crop', // Beautiful minimal placeholder
    verificationUrl: 'https://aws.amazon.com/verification',
    tags: ['Cloud', 'AWS', 'Architecture']
  },
  {
    id: 'oracle-java-se17',
    title: 'Oracle Certified Professional: Java SE 17',
    issuer: 'Oracle Corporation',
    date: 'Nov 2024',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
    verificationUrl: 'https://www.credly.com/org/oracle',
    tags: ['Java', 'Backend', 'Oracle']
  },
  {
    id: 'docker-k8s-ckad',
    title: 'Certified Kubernetes Application Developer',
    issuer: 'CNCF / Linux Foundation',
    date: 'Aug 2024',
    image: 'https://images.unsplash.com/photo-1667372335854-c5269594a5c5?q=80&w=1000&auto=format&fit=crop',
    verificationUrl: 'https://www.cncf.io/certification/ckad/',
    tags: ['Kubernetes', 'Docker', 'DevOps']
  },
  {
    id: 'spring-boot-certified',
    title: 'Spring Certified Enterprise Developer',
    issuer: 'Broadcom / Spring Academy',
    date: 'May 2024',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    verificationUrl: 'https://spring.academy/',
    tags: ['Spring Boot', 'Microservices', 'API']
  },
  {
    id: 'postman-api-expert',
    title: 'Postman API Fundamentals Student Expert',
    issuer: 'Postman',
    date: 'Mar 2024',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    verificationUrl: 'https://badgr.com/public/badges/postman-api-expert',
    tags: ['REST API', 'Testing', 'Postman']
  },
  {
    id: 'hackerrank-problem-solving',
    title: 'HackerRank Problem Solving (Advanced)',
    issuer: 'HackerRank',
    date: 'Feb 2024',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1000&auto=format&fit=crop',
    verificationUrl: 'https://www.hackerrank.com/certificates/',
    tags: ['Algorithms', 'Data Structures', 'Java']
  }
];
