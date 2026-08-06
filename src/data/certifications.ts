export interface Certification {
  id: string;
  code: string;
  title: string;
  issuer: string;
  date: string;
  image: string; // URL or local path to certificate image
  verificationUrl: string;
  tags: string[];
  accentColor: string;
}

export const CERTIFICATIONS_DATA: Certification[] = [
  {
    id: 'oracle-oci-foundations',
    code: 'OCI-01',
    title: 'Oracle Cloud Infrastructure Foundations Associate',
    issuer: 'Oracle Corporation',
    date: 'Aug 2026',
    image: 'https://i.ibb.co/7xTMWGzd/OCI-Foundation-Certificate.png',
    verificationUrl: 'https://catalog-education.oracle.com/',
    tags: ['Cloud', 'Oracle', 'Infrastructure'],
    accentColor: '#F80000'
  },
  {
    id: 'nptel-soft-computing',
    code: 'AI-02',
    title: 'Soft Computing Techniques',
    issuer: 'NPTEL / IIT Kharagpur',
    date: 'Apr 2025',
    image: 'https://i.ibb.co/sfGMyV0/NPTEL-Soft-computing-Certificate.png',
    verificationUrl: 'https://nptel.ac.in/noc',
    tags: ['AI', 'Fuzzy Logic', 'Neural Networks'],
    accentColor: '#C1272D'
  },
  {
    id: 'hackerrank-sql-advanced',
    code: 'SQL-03',
    title: 'SQL (Advanced)',
    issuer: 'HackerRank',
    date: 'Aug 2025',
    image: 'https://i.ibb.co/N6pXQWjf/SQL-Certificate.png',
    verificationUrl: 'https://www.hackerrank.com/certificates/',
    tags: ['SQL', 'Databases', 'Backend'],
    accentColor: '#00EA64'
  },
  {
    id: 'coursera-data-structures',
    code: 'DSA-04',
    title: 'Data Structures',
    issuer: 'UC San Diego (Coursera)',
    date: 'Jul 2023',
    image: 'https://i.ibb.co/RGfsJF8g/Coursera-DSA-Certificate.png',
    verificationUrl: 'https://coursera.org/verify/9QXESA6NJETF',
    tags: ['Data Structures', 'Algorithms', 'Computer Science'],
    accentColor: '#0056D2'
  },
  {
    id: 'datacamp-github-foundations',
    code: 'GIT-05',
    title: 'GitHub Foundations',
    issuer: 'DataCamp',
    date: 'Aug 2026',
    image: 'https://i.ibb.co/8Dtkbmgx/Git-Hub-Foundation-Certificate.png',
    verificationUrl: 'https://www.datacamp.com/certificate',
    tags: ['Git', 'GitHub', 'Version Control'],
    accentColor: '#03EF62'
  },
  {
    id: 'redis-getting-started',
    code: 'DB-06',
    title: 'Getting Started with Redis',
    issuer: 'Redis',
    date: 'Aug 2026',
    image: 'https://i.ibb.co/RTBvw7Tx/Redis-Certificate.png',
    verificationUrl: 'https://redis.io/university/',
    tags: ['Redis', 'Caching', 'Database'],
    accentColor: '#FF4438'
  }
];
