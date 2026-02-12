# 🚀 Kumar Nishant | Backend & DevOps Portfolio

![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.1-green?logo=springboot)
![AWS](https://img.shields.io/badge/AWS-Cloud-232F3E?logo=amazon-aws)
![Docker](https://img.shields.io/badge/Docker-Container-blue?logo=docker)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

> **"Robust systems, scalable architecture, and automated deployments."**

## 👨‍💻 Overview
This portfolio is engineered to showcase my expertise in **Backend Development** and **DevOps**. While the frontend is modern and interactive (featuring ambient music and a custom cursor), the core value lies in the **distributed systems** and **cloud infrastructure** projects I build.

## 🏗️ System Architecture (Featured Project)
Below is the high-level architecture for my **Campus Management ERP** project, demonstrating microservices communication and deployment strategy.

```mermaid
graph TD
    User[Client (Web/Mobile)] -->|HTTPS| CDN[CloudFront CDN]
    CDN -->|Static Assets| S3[AWS S3 Bucket]
    User -->|API Requests| LB[Application Load Balancer]
    
    subgraph "VPC (Private Cloud)"
        LB -->|Route Traffic| API[API Gateway]
        
        subgraph "ECS Cluster (Fargate)"
            API --> Auth[Auth Service (Spring Security)]
            API --> Core[Core Service (Spring Boot)]
            API --> Pay[Payment Service (Node.js)]
        end
        
        Auth -->|Read/Write| DB1[(PostgreSQL - Users)]
        Core -->|Read/Write| DB2[(MongoDB - Logs)]
        Core -->|Cache| Redis[(Redis - Session)]
        
        Core -->|Async Events| Kafka[Apache Kafka]
        Kafka -->|Consume| Notif[Notification Service]
    end
    
    Notif -->|Send| SES[AWS SES (Email)]
```

## 🛠️ Tech Stack
### Backend Core
*   **Languages**: Java 17, Python, TypeScript
*   **Frameworks**: Spring Boot, Express.js, Django
*   **Database**: PostgreSQL, MongoDB, Redis

### DevOps & Cloud
*   **Containerization**: Docker, Kubernetes
*   **Cloud Provider**: AWS (EC2, S3, RDS, ECS, Lambda)
*   **CI/CD**: GitHub Actions, Jenkins

### Frontend (Experience)
*   React 18 + TypeScript
*   **Ambience**: Integrated Background Music (Hans Zimmer) & Custom Interactive Cursor
*   GSAP Animations

## 🚀 Quick Start (Local DevOps)

Run both the **Frontend** (Vite) and **Backend** (Express/Node) concurrently with a single command:

```bash
# 1. Install dependencies (Root & API)
npm install
cd api && npm install && cd ..

# 2. Start the Full Stack Environment
npm run dev:all
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```

## 📂 Project Structure
```text
/
├── .github/           # CI/CD Workflows
├── api/               # Express Backend (Microservice Demo)
├── public/            # Static Assets
├── src/               # React Frontend
│   ├── components/    # Reusable UI (MusicPrompt, CustomCursor)
│   ├── pages/         # Route Views (Projects, GuestBook)
│   └── context/       # Global State (Theme, Music)
├── Dockerfile         # Container Config
└── compose.yaml       # Local orchestration
```

---
**[Download Resume](/public/previews/resume.pdf)** | **[View Engineering Projects](/projects)**
