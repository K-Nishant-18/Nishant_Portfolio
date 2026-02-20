export interface ProjectArchitecture {
    hld: string;
    lld: string;
    classDiagram: string;
    dataFlow: string;
    infrastructure: string;
    erDiagram: string;
}

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
    challenges?: { title: string; description: string; solution: string }[];
    size?: 'small' | 'medium' | 'large';
    color: string;
    architecture?: ProjectArchitecture;
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
        challenges: [
            {
                title: 'High Concurrency Access',
                description: 'Handling thousands of students accessing exam modules simultaneously caused database bottlenecks.',
                solution: 'Implemented database sharding and read-replicas, reducing query latency by 60% during peak loads.'
            },
            {
                title: 'Real-time System Updates',
                description: 'Need to push grades and notifications instantly without page refreshes.',
                solution: 'Built a WebSocket layer using Spring WebFlux for bi-directional communication.'
            }
        ],
        size: 'large',
        color: 'from-blue-500/20 to-cyan-500/20',
        architecture: {
            hld: `flowchart TB
    Client["React.js SPA"]
    GW["Spring Security / JWT"]
    BL["Business Logic Layer\nCourseService | AuthService"]
    DA["Data Access\nSpring JPA / Hibernate"]
    DB[("MySQL Primary")]
    RC[("Redis Cache")]
    WS["WebSocket\nNotifications"]

    Client -->|HTTPS| GW
    GW -->|Authorized| BL
    BL --> DA
    DA --> DB
    BL --> RC
    BL --> WS
    WS -->|Push Events| Client`,

            lld: `flowchart LR
    subgraph Controllers
        AC["AuthController\nPOST /login\nPOST /register"]
        CC["CourseController\nGET /courses\nPOST /enroll"]
        ASC["AssignmentController\nPOST /submit\nPOST /grade"]
    end
    subgraph Services
        AS["AuthService"]
        CS["CourseService"]
        NS["NotificationService"]
    end
    subgraph Repository
        AR["AssignmentRepo"]
        CR["CourseRepo"]
        UR["UserRepo"]
    end

    AC --> AS
    CC --> CS
    ASC --> NS
    AS --> UR
    CS --> CR
    NS --> AR`,

            classDiagram: `classDiagram
    class User {
        +Long id
        +String name
        +String email
        +Role role
        +List~Course~ courses
        +enroll(course)
        +getGrades()
        +updateProfile()
    }
    class Course {
        +Long id
        +String title
        +int credits
        +User instructor
        +List~User~ students
        +addStudent(user)
        +getAssignments()
    }
    class Assignment {
        +Long id
        +String title
        +Date dueDate
        +int maxScore
        +Course course
        +submit(content)
        +grade(score)
    }
    User "1" --> "*" Course : enrolls
    Course "1" --> "*" Assignment : has`,

            dataFlow: `sequenceDiagram
    participant C as React Client
    participant S as Spring Security
    participant AC as AssignmentController
    participant SVC as AssignmentService
    participant DB as MySQL
    participant WS as WebSocket

    C->>S: POST /grade (JWT Bearer)
    S->>AC: Validated & Authorized
    AC->>SVC: grade(userId, assignmentId, score)
    SVC->>DB: UPDATE assignments SET score=?
    DB-->>SVC: OK
    SVC->>WS: Push grade event
    WS-->>C: Live grade notification
    AC-->>C: 200 OK {grade, feedback}`,

            infrastructure: `flowchart TB
    subgraph Internet
        User["User Browser"]
    end
    subgraph Cloud["AWS / VPS"]
        CDN["CloudFront CDN\nStatic Assets"]
        LB["Load Balancer\nNginx"]
        subgraph App["App Servers"]
            API1["Spring Boot\nInstance 1"]
            API2["Spring Boot\nInstance 2"]
        end
        subgraph Data["Data Layer"]
            MySQL[("MySQL Primary")]
            Replica[("MySQL Replica")]
            Redis[("Redis Cache")]
        end
    end

    User --> CDN
    CDN --> LB
    LB --> API1
    LB --> API2
    API1 --> MySQL
    API2 --> MySQL
    MySQL --> Replica
    API1 --> Redis
    API2 --> Redis`,

            erDiagram: `erDiagram
    USER {
        bigint id PK
        varchar name
        varchar email
        varchar password_hash
        enum role
        timestamp created_at
    }
    COURSE {
        bigint id PK
        varchar title
        int credits
        bigint instructor_id FK
    }
    ENROLLMENT {
        bigint id PK
        bigint user_id FK
        bigint course_id FK
        date enrolled_at
    }
    ASSIGNMENT {
        bigint id PK
        bigint course_id FK
        varchar title
        date due_date
        int max_score
    }
    SUBMISSION {
        bigint id PK
        bigint assignment_id FK
        bigint user_id FK
        text content
        int score
        timestamp submitted_at
    }
    USER ||--o{ ENROLLMENT : enrolls
    COURSE ||--o{ ENROLLMENT : has
    COURSE ||--o{ ASSIGNMENT : contains
    USER ||--o{ SUBMISSION : submits
    ASSIGNMENT ||--o{ SUBMISSION : receives`
        }
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
        challenges: [
            {
                title: 'Digital Preservation',
                description: 'Standardizing diverse cultural artifacts into a coherent digital format.',
                solution: 'Developed a flexible metadata schema and used IPFS for decentralized, permanent storage.'
            },
            {
                title: 'Community Engagement',
                description: 'Encouraging active participation from non-technical users.',
                solution: 'Created an intuitive "Story Studio" editor that simplifies rich-media content creation.'
            }
        ],
        size: 'medium',
        color: 'from-orange-500/20 to-red-500/20',
        architecture: {
            hld: `flowchart TB
    Client["React.js SPA\nSocket.io Client"]
    API["Express.js API\nJWT Middleware"]
    S3["AWS S3\nMedia Storage"]
    SIO["Socket.io Server\nReal-time Rooms"]
    MDB[("MongoDB Atlas")]

    Client -->|REST + JWT| API
    Client -->|Socket Events| SIO
    API -->|PutObject| S3
    S3 -->|Signed URL| API
    API --> MDB
    SIO --> MDB`,

            lld: `flowchart LR
    subgraph Routes
        SR["StoryRouter\nCRUD /stories"]
        MR["MediaRouter\nUpload to S3"]
        CR["CommunityRouter\n/forums /events"]
    end
    subgraph Handlers
        SH["SocketHandler\nonConnect\njoinRoom\nemitUpdate"]
    end
    subgraph Storage
        S3["AWS S3"]
        MG["MongoDB"]
    end

    SR --> MG
    MR --> S3
    CR --> MG
    SH --> MG`,

            classDiagram: `classDiagram
    class Story {
        +ObjectId _id
        +String title
        +String content
        +String[] mediaUrls
        +User author
        +publish()
        +addMedia(url)
        +archive()
    }
    class User {
        +ObjectId _id
        +String name
        +String email
        +Story[] stories
        +createStory()
        +joinForum()
        +followUser()
    }
    class Event {
        +ObjectId _id
        +String title
        +Date date
        +String location
        +User organizer
        +register(user)
        +notify()
    }
    User "1" --> "*" Story : authors
    User "1" --> "*" Event : organizes`,

            dataFlow: `sequenceDiagram
    participant C as React Client
    participant API as Express API
    participant M as Multer
    participant S3 as AWS S3
    participant DB as MongoDB
    participant SIO as Socket.io

    C->>API: POST /upload (multipart)
    API->>M: Parse & validate file
    M->>S3: PutObject to bucket
    S3-->>API: Signed S3 URL
    API->>DB: Save Story with S3 URL
    DB-->>API: Story saved
    API->>SIO: Broadcast new story event
    SIO-->>C: Community feed update
    API-->>C: 201 Created {story, mediaUrl}`,

            infrastructure: `flowchart TB
    subgraph Client["Client Side"]
        Browser["React SPA\nSocket.io Client"]
    end
    subgraph AWS["AWS Infrastructure"]
        CF["CloudFront"]
        S3["S3 Bucket\nMedia Storage"]
        EC2["EC2 Instance\nExpress API"]
    end
    subgraph Atlas["MongoDB Atlas"]
        MDB[("MongoDB\nM10 Cluster")]
    end
    SIO["Socket.io\nServer (EC2)"]

    Browser --> CF
    CF --> EC2
    CF --> S3
    EC2 --> S3
    EC2 --> MDB
    EC2 --> SIO
    SIO --> Browser`,

            erDiagram: `erDiagram
    USER {
        objectid _id PK
        string name
        string email
        string avatar_url
        datetime joined_at
    }
    STORY {
        objectid _id PK
        string title
        text content
        string[] media_urls
        objectid author_id FK
        boolean published
        datetime created_at
    }
    EVENT {
        objectid _id PK
        string title
        string location
        date event_date
        objectid organizer_id FK
    }
    MEDIA {
        objectid _id PK
        string s3_url
        string mime_type
        objectid story_id FK
    }
    USER ||--o{ STORY : authors
    USER ||--o{ EVENT : organizes
    STORY ||--o{ MEDIA : contains`
        }
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
        challenges: [
            {
                title: 'Safe Code Execution',
                description: 'Running untrusted user-submitted code securely in the browser.',
                solution: 'Engineered a sandboxed execution environment using WebAssembly (Wasm) to isolate code runtime.'
            },
            {
                title: 'AI Cost Optimization',
                description: 'Providing personalized AI mentorship was becoming cost-prohibitive at scale.',
                solution: 'Implemented a semantic caching layer to serve cached responses for common coding queries.'
            }
        ],
        size: 'medium',
        color: 'from-purple-500/20 to-pink-500/20',
        architecture: {
            hld: `flowchart TB
    Client["React.js UI\nMonaco Editor"]
    WASM["WebAssembly\nSandbox Runtime"]
    API["Spring Boot API\nSpring Security"]
    AI["OpenAI GPT-4o\nAI Mentorship"]
    Cache[("Redis\nSemantic Cache")]
    DB[("MongoDB\nProgress & Challenges")]

    Client -->|Run Code| WASM
    WASM -->|stdout / errors| Client
    Client -->|Submit| API
    API -->|Hint Request| Cache
    Cache -->|Miss| AI
    AI -->|Response| Cache
    Cache -->|Hint| API
    API --> DB`,

            lld: `flowchart LR
    subgraph Controllers
        CC["ChallengeController\nGET /challenges\nPOST /submit"]
        AIC["AIController\nPOST /hint\nPOST /review"]
    end
    subgraph Services
        ES["ExecutionSandbox\ncompileWasm\nrunSandboxed"]
        PS["ProgressService\nawardXP\nunlockBadge"]
        AIS["AIService\ncacheCheck\ncallOpenAI"]
    end

    CC --> ES
    CC --> PS
    AIC --> AIS`,

            classDiagram: `classDiagram
    class Kid {
        +String id
        +String username
        +int xp
        +int level
        +String[] badges
        +String[] completed
        +attemptChallenge(id)
        +askHint()
        +viewProgress()
    }
    class Challenge {
        +String id
        +String title
        +Enum difficulty
        +String starterCode
        +TestCase[] testCases
        +int xpReward
        +validate(submission)
        +runTests(code)
    }
    class AISession {
        +String id
        +String kidId
        +Message[] history
        +String cacheKey
        +ask(prompt)
        +getFromCache()
        +storeInCache()
    }
    Kid "1" --> "*" AISession : has
    Kid "*" --> "*" Challenge : attempts`,

            dataFlow: `sequenceDiagram
    participant E as Monaco Editor
    participant W as Wasm Runtime
    participant C as React Client
    participant API as Spring Boot API
    participant R as Redis Cache
    participant OAI as OpenAI GPT-4o

    E->>W: Compile & run code (sandboxed)
    W-->>C: stdout / errors (no server trip)
    C->>API: POST /submit {code, challengeId}
    API->>W: Run test cases
    W-->>API: All tests pass
    API-->>C: XP awarded + badge unlocked
    C->>API: POST /hint {challengeId, code}
    API->>R: Check semantic cache
    alt Cache Hit
        R-->>API: Cached hint
    else Cache Miss
        API->>OAI: GPT-4o prompt
        OAI-->>API: Contextual hint
        API->>R: Store in cache
    end
    API-->>C: Hint response`,

            infrastructure: `flowchart TB
    subgraph Client
        Browser["React SPA\nMonaco + Wasm"]
    end
    subgraph Render["Render.com / Railway"]
        SB["Spring Boot API\nDocker Container"]
        RD[("Redis\nSemantic Cache")]
    end
    subgraph Atlas["MongoDB Atlas"]
        DB[("MongoDB Cluster")]
    end
    OAI["OpenAI API\ngpt-4o"]

    Browser -->|HTTPS| SB
    Browser -->|Wasm runtime| Browser
    SB --> RD
    SB --> DB
    SB -->|Cache miss| OAI`,

            erDiagram: `erDiagram
    KID {
        string _id PK
        string username
        string email
        int xp
        int level
        string[] badges
    }
    CHALLENGE {
        string _id PK
        string title
        enum difficulty
        string starter_code
        int xp_reward
    }
    ATTEMPT {
        string _id PK
        string kid_id FK
        string challenge_id FK
        string submitted_code
        boolean passed
        datetime attempted_at
    }
    AI_SESSION {
        string _id PK
        string kid_id FK
        string cache_key
        json[] messages
        datetime created_at
    }
    KID ||--o{ ATTEMPT : makes
    CHALLENGE ||--o{ ATTEMPT : receives
    KID ||--o{ AI_SESSION : has`
        }
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
        challenges: [
            {
                title: 'Authentic Assessment',
                description: 'Verifying that code submissions actually represent student work.',
                solution: 'Integrated GitHub Webhooks to analyze commit velocity and coding patterns for authenticity.'
            },
            {
                title: 'Scalable Leaderboards',
                description: 'Real-time ranking updates became slow with growing user base.',
                solution: 'Utilized Redis Sorted Sets to handle leaderboard operations with O(log(N)) time complexity.'
            }
        ],
        size: 'medium',
        color: 'from-green-500/20 to-emerald-500/20',
        architecture: {
            hld: `flowchart TB
    GH["GitHub Repository\nWebhook Push"]
    Nginx["Nginx Reverse Proxy\nDocker Network"]
    API["Spring Boot API\nJWT Auth"]
    Redis[("Redis\nLeaderboard SortedSet")]
    PG[("PostgreSQL\nACID Transactions")]
    Cert["Certificate\nGenerator"]

    GH -->|Webhook POST| Nginx
    Nginx --> API
    API -->|ZADD score| Redis
    API -->|UPDATE learner| PG
    API --> Cert
    Cert --> PG`,

            lld: `flowchart LR
    subgraph Ingress
        WH["WebhookHandler\nonPush\nanalyzeCommits"]
    end
    subgraph Core
        CS["CourseController\nenroll / progress"]
        LS["LeaderboardService\naddScore\ngetTopN"]
        CERT["CertificateService\ngenerate\nverify"]
    end
    subgraph Storage
        RD["Redis Sorted Sets"]
        PG["PostgreSQL"]
    end

    WH --> CS
    WH --> LS
    CS --> CERT
    LS --> RD
    CERT --> PG`,

            classDiagram: `classDiagram
    class Learner {
        +UUID id
        +String name
        +String githubHandle
        +int totalXP
        +Course[] enrolled
        +enroll(course)
        +linkGitHub(token)
        +getCertificates()
    }
    class Course {
        +UUID id
        +String title
        +int requiredCommits
        +Module[] modules
        +checkCompletion(learner)
        +issueCertificate()
        +getLeaderboard()
    }
    class Certificate {
        +UUID id
        +UUID learnerId
        +UUID courseId
        +Date issuedAt
        +String verifyHash
        +verify()
        +share()
    }
    Learner "1" --> "*" Course : enrolls in
    Learner "1" --> "*" Certificate : earns`,

            dataFlow: `sequenceDiagram
    participant GH as GitHub
    participant WH as WebhookHandler
    participant GHAPI as GitHub API
    participant PS as ProgressService
    participant RD as Redis
    participant PG as PostgreSQL
    participant CERT as CertificateService

    GH->>WH: POST /webhook (push event)
    WH->>GHAPI: GET /commits/{sha} verify authenticity
    GHAPI-->>WH: Commit metadata
    WH->>PS: Increment XP + commit count
    PS->>RD: ZADD leaderboard {score} {userId}
    PS->>PG: UPDATE learner SET xp=?, commits=?
    PS->>CERT: Threshold met? Generate certificate
    CERT->>PG: INSERT certificate {verifyHash}`,

            infrastructure: `flowchart TB
    GH["GitHub Repositories"]
    subgraph Docker["Docker Compose"]
        Nginx["Nginx\nReverse Proxy\n:443"]
        SB["Spring Boot\nApp Container\n:8080"]
        PG[("PostgreSQL\nContainer")]
        RD[("Redis\nContainer")]
    end
    GHAPI["GitHub API\nWebhook Receiver"]

    GH -->|Webhook POST| Nginx
    Nginx --> SB
    SB --> PG
    SB --> RD
    SB --> GHAPI`,

            erDiagram: `erDiagram
    LEARNER {
        uuid id PK
        varchar name
        varchar github_handle
        int total_xp
        timestamp joined_at
    }
    COURSE {
        uuid id PK
        varchar title
        int required_commits
    }
    ENROLLMENT {
        uuid id PK
        uuid learner_id FK
        uuid course_id FK
        int commits_done
        boolean completed
    }
    CERTIFICATE {
        uuid id PK
        uuid learner_id FK
        uuid course_id FK
        varchar verify_hash
        timestamp issued_at
    }
    LEARNER ||--o{ ENROLLMENT : has
    COURSE ||--o{ ENROLLMENT : tracks
    LEARNER ||--o{ CERTIFICATE : earns
    COURSE ||--o{ CERTIFICATE : grants`
        }
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
        challenges: [
            {
                title: 'Transaction Integrity',
                description: 'Ensuring inventory stays accurate during simultaneous purchases.',
                solution: 'Used database row-level locking and ACID compliant transactions to prevent race conditions.'
            },
            {
                title: 'Security Compliance',
                description: 'Meeting PCI-DSS requirements for handling payment data.',
                solution: 'Offloaded sensitive data handling to Stripe elements and implemented strict JWT authorization policies.'
            }
        ],
        size: 'small',
        color: 'from-slate-500/20 to-gray-500/20',
        architecture: {
            hld: `flowchart TB
    Client["Client / Storefront"]
    SEC["Spring Security\nJWT Filter Chain"]
    CTRL["API Controllers\nProduct | Order | Payment | User"]
    Stripe["Stripe API\nCheckout + Webhooks"]
    DB[("MySQL\nACID Transactions")]

    Client -->|HTTPS + JWT| SEC
    SEC --> CTRL
    CTRL -->|Create Session| Stripe
    Stripe -->|Webhook Event| CTRL
    CTRL -->|SQL Transactions| DB`,

            lld: `flowchart LR
    subgraph Controllers
        PC["ProductController\nGET/POST/PUT/DELETE"]
        OC["OrderController\nPOST /orders\nCANCEL"]
        PAY["PaymentController\nPOST /checkout\nPOST /webhook"]
        UC["UserController\nRegister / Login"]
    end
    subgraph Services
        OS["OrderService\ncalcTotal\nconfirm\nrefund"]
        PS["PaymentService\ncreateSession\nverifyWebhook"]
        StockS["StockService\nlock\ndecrement"]
    end

    PAY --> PS
    OC --> OS
    OS --> StockS`,

            classDiagram: `classDiagram
    class Product {
        +Long id
        +String name
        +BigDecimal price
        +int stock
        +Category category
        +decrementStock(qty)
        +isAvailable()
        +applyDiscount(pct)
    }
    class Order {
        +Long id
        +User user
        +OrderItem[] items
        +BigDecimal total
        +OrderStatus status
        +String stripeSessionId
        +calculateTotal()
        +confirm()
        +cancel()
        +refund()
    }
    class OrderItem {
        +Long id
        +Product product
        +int quantity
        +BigDecimal unitPrice
        +getSubtotal()
        +validate()
    }
    Order "1" --> "*" OrderItem : contains
    OrderItem "*" --> "1" Product : references`,

            dataFlow: `sequenceDiagram
    participant C as Client
    participant API as PaymentController
    participant Stripe as Stripe API
    participant WH as Webhook Handler
    participant OS as OrderService
    participant DB as MySQL

    C->>API: POST /checkout/create-session {orderId}
    API->>Stripe: Create Checkout Session
    Stripe-->>API: Session URL
    API-->>C: Redirect to Stripe Checkout
    C->>Stripe: User completes payment
    Stripe->>WH: POST /webhook payment_intent.succeeded
    WH->>OS: verify signature + confirm(orderId)
    OS->>DB: BEGIN TX decrement stock UPDATE status COMMIT
    DB-->>OS: Committed
    OS-->>C: Order confirmation`,

            infrastructure: `flowchart TB
    Client["Client / Mobile App"]
    subgraph Spring["Spring Boot App"]
        SEC["Security Filter"]
        API["REST Controllers"]
    end
    Stripe["Stripe\nPayment Gateway"]
    subgraph DB["Database"]
        MySQL[("MySQL\nRDS Instance")]
        CP["Connection Pool\nHikariCP"]
    end

    Client -->|HTTPS + JWT| SEC
    SEC --> API
    API -->|Checkout Session| Stripe
    Stripe -->|Webhook| API
    API --> CP
    CP --> MySQL`,

            erDiagram: `erDiagram
    USER {
        bigint id PK
        varchar name
        varchar email
        varchar password_hash
        enum role
    }
    PRODUCT {
        bigint id PK
        varchar name
        decimal price
        int stock
        bigint category_id FK
    }
    ORDER {
        bigint id PK
        bigint user_id FK
        decimal total
        enum status
        varchar stripe_session_id
        timestamp created_at
    }
    ORDER_ITEM {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        int quantity
        decimal unit_price
    }
    CATEGORY {
        bigint id PK
        varchar name
    }
    USER ||--o{ ORDER : places
    ORDER ||--o{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : referenced_in
    CATEGORY ||--o{ PRODUCT : groups`
        }
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
        challenges: [
            {
                title: 'Performance vs. Visuals',
                description: 'Balancing high-end animations with smooth 60fps performance.',
                solution: 'Optimized React rendering with useMemo and utilized GSAP for GPU-accelerated animations.'
            },
            {
                title: 'Theme Consistency',
                description: 'Managing complex dark/light mode transitions across dynamic components.',
                solution: 'Built a centralized ThemeContext with CSS variables for seamless state-driven styling.'
            }
        ],
        size: 'small',
        color: 'from-indigo-500/20 to-violet-500/20',
        architecture: {
            hld: `flowchart TB
    Entry["Vite Entry\nindex.html + main.tsx"]
    Shell["App Shell\nReact Router + Contexts"]
    Pages["Pages\nHome | ProjectDetail | Contact"]
    Comps["Components\nNav | Hero | Projects | About | Footer"]
    GSAP["GSAP Engine\nScrollTrigger + SplitText"]
    CSS["CSS Layer\nTailwind + CSS Variables"]

    Entry --> Shell
    Shell --> Pages
    Pages --> Comps
    Comps --> GSAP
    Shell --> CSS`,

            lld: `flowchart LR
    subgraph Contexts
        TC["ThemeContext\ntoggleTheme\napplyTheme"]
        MC["MusicContext\ntoggle\nvolume"]
    end
    subgraph Pages
        PD["ProjectDetail\nloadData\ntabSwitch\ninitGSAP"]
        HP["HomePage\nscrollSections"]
    end
    subgraph Animation
        ST["ScrollTrigger\nrevealOnScroll"]
        SPT["SplitText\nletterReveal"]
    end

    PD --> ST
    HP --> SPT
    PD --> TC`,

            classDiagram: `classDiagram
    class Project {
        +String id
        +String title
        +String category
        +String[] tech
        +String[] impact
        +Challenge[] challenges
        +ProjectArchitecture architecture
    }
    class ProjectArchitecture {
        +String hld
        +String lld
        +String classDiagram
        +String dataFlow
    }
    class ThemeContext {
        +boolean isDark
        +toggleTheme()
        +applyTheme(mode)
        +useTheme()
    }
    class MusicContext {
        +boolean isPlaying
        +number volume
        +toggle()
        +useMusic()
    }
    Project "1" --> "1" ProjectArchitecture : has`,

            dataFlow: `sequenceDiagram
    participant U as User
    participant RR as React Router
    participant PD as ProjectDetail
    participant DS as projects.ts
    participant GSAP as GSAP Engine
    participant TC as ThemeContext

    U->>RR: Navigate to /projects/01
    RR->>PD: Render with useParams({id})
    PD->>DS: projects.find(p => p.id === id)
    DS-->>PD: Project data
    PD->>GSAP: useLayoutEffect register animations
    GSAP->>GSAP: ScrollTrigger bind to .content-block
    TC->>PD: isDark state
    PD-->>U: Fully animated page rendered`,

            infrastructure: `flowchart TB
    subgraph Dev["Development"]
        Vite["Vite Dev Server\nlocalhost:5173"]
        BE["Express Backend\nlocalhost:3001"]
    end
    subgraph Prod["Production - Vercel"]
        Edge["Vercel Edge Network\nGlobal CDN"]
        Static["Static Assets\nHTML + JS + CSS"]
    end
    GH["GitHub\nSource Repo"]

    GH -->|Push to main| Edge
    Edge --> Static
    Vite -->|npm run build| Static
    BE -->|API Proxy| Vite`,

            erDiagram: `erDiagram
    PROJECT {
        string id PK
        string title
        string category
        string[] tech
        string year
        string status
    }
    ARCHITECTURE {
        string project_id FK
        string hld
        string lld
        string class_diagram
        string data_flow
        string infrastructure
        string er_diagram
    }
    CHALLENGE {
        string id PK
        string project_id FK
        string title
        string description
        string solution
    }
    PROJECT ||--|| ARCHITECTURE : has
    PROJECT ||--o{ CHALLENGE : overcame`
        }
    },
];
