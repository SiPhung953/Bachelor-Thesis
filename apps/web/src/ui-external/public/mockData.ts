export type EmploymentType = "ON_SITE" | "REMOTE" | "HYBRID";
export type JobStatus = "PENDING_APPROVAL" | "ACTIVE" | "REJECTED" | "CLOSED" | "EXPIRED" | "DELETED";

export interface Company {
  id: string;
  name: string;
  city: string;
  district?: string | null;
  description: string;
  address: string;
  logoText: string;
  logoBg: string;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  description: string;
  requirement: string;
  employmentType: EmploymentType;
  location: string;
  status: JobStatus;
  deadline: string; // ISO date string
  createdAt: string;
  stipend: string;
  skills: string[];
}

export const mockCompanies: Company[] = [
  {
    id: "google",
    name: "Google",
    city: "Mountain View",
    district: "Santa Clara County",
    address: "1600 Amphitheatre Pkwy, Mountain View, CA 94043",
    description: "Google's mission is to organize the world's information and make it universally accessible and useful. Through products and platforms like Search, Maps, Gmail, Android, Google Play, Chrome and YouTube, Google plays a meaningful role in the daily lives of billions of people and has become one of the most widely-known companies in the world.",
    logoText: "G",
    logoBg: "bg-blue-500"
  },
  {
    id: "stanford-ai-lab",
    name: "Stanford AI Lab",
    city: "Stanford",
    district: "San Mateo County",
    address: "353 Jane Stanford Way, Stanford, CA 94305",
    description: "The Stanford Artificial Intelligence Laboratory (SAIL) has been a center of excellence for AI research, teaching, theory, and practice since its founding in 1963. SAIL brings together faculty, researchers, and students to push the boundaries of what is possible in robotics, machine learning, computer vision, and NLP.",
    logoText: "S",
    logoBg: "bg-red-700"
  },
  {
    id: "mckinsey",
    name: "McKinsey & Company",
    city: "New York",
    district: "Manhattan",
    address: "3 World Trade Center, New York, NY 10007",
    description: "McKinsey & Company is a global management consulting firm. We are the trusted advisor to the world's leading businesses, governments, and institutions. We help our clients make distinctive, lasting, and substantial improvements in their performance and realize their most important goals.",
    logoText: "M",
    logoBg: "bg-indigo-950"
  },
  {
    id: "figma",
    name: "Figma",
    city: "San Francisco",
    district: "San Francisco County",
    address: "760 Market St, San Francisco, CA 94102",
    description: "Figma is a leading collaborative web application for interface design, with additional offline features enabled by desktop applications. Figma connects everyone in the design process so teams can deliver better products, faster.",
    logoText: "F",
    logoBg: "bg-orange-500"
  },
  {
    id: "stripe",
    name: "Stripe",
    city: "South San Francisco",
    district: "San Mateo County",
    address: "354 Oyster Point Blvd, South San Francisco, CA 94080",
    description: "Stripe is a financial infrastructure platform for the internet. Millions of companies—from the world's largest enterprises to the most ambitious startups—use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.",
    logoText: "S",
    logoBg: "bg-violet-600"
  },
  {
    id: "vercel",
    name: "Vercel",
    city: "Remote",
    district: null,
    address: "Remote (US/Canada)",
    description: "Vercel provides the developer experience and infrastructure to build, deploy, and scale the web. Vercel enables developers to host websites and web applications that deploy instantly and scale automatically.",
    logoText: "V",
    logoBg: "bg-black"
  },
  {
    id: "acme-corp",
    name: "ACME Corp",
    city: "Desert City",
    district: "Red Rocks",
    address: "101 Anvil Road, Desert City, UT 84701",
    description: "ACME Corporation is a fictional company that features prominently in many Warner Bros. Looney Tunes and Merrie Melodies cartoons. It is famous for manufacturing outlandish and hazardous products that fail catastrophically at the worst possible times.",
    logoText: "A",
    logoBg: "bg-amber-600"
  }
];

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Software Engineer Intern",
    companyId: "google",
    description: "We are looking for a Software Engineer Intern to join our core infrastructure team. In this role, you will work on scaling our cloud services, implementing new frontend features in React, and building highly reliable APIs. You will work closely with senior mentors, participate in design discussions, and write clean, tested code that impacts millions of users.",
    requirement: "• Currently pursuing a Bachelor's, Master's, or PhD in Computer Science or a related technical field.\n• Experience with JavaScript/TypeScript, React, or Python.\n• Solid understanding of data structures, algorithms, and software design principles.\n• Strong communication skills and ability to work in a collaborative team environment.",
    employmentType: "HYBRID",
    location: "Mountain View, CA",
    status: "ACTIVE",
    deadline: "2026-08-31T23:59:59Z",
    createdAt: "2026-06-11T08:00:00Z",
    stipend: "$45 - $60 / hr",
    skills: ["React", "TypeScript", "Python"]
  },
  {
    id: "2",
    title: "Graduate AI Research Assistant",
    companyId: "stanford-ai-lab",
    description: "The Stanford AI Lab invites applications for a Graduate Research Assistant. You will work on state-of-the-art Natural Language Processing (NLP) models, focusing on efficiency, alignment, and multi-modal integration. This position involves training large-scale language models, evaluating them on benchmark datasets, and contributing to high-impact academic publications.",
    requirement: "• Currently enrolled in a graduate program (MS or PhD) in Computer Science, AI, or equivalent.\n• Strong background in deep learning, PyTorch, and NLP library ecosystems (Transformers, Hugging Face).\n• Experience running experiments on GPU/TPU clusters.\n• Previous research publications in conferences like NeurIPS, ACL, or CVPR is a major plus.",
    employmentType: "ON_SITE",
    location: "Stanford, CA",
    status: "ACTIVE",
    deadline: "2026-07-15T23:59:59Z",
    createdAt: "2026-06-12T09:00:00Z",
    stipend: "$32 - $42 / hr",
    skills: ["PyTorch", "NLP", "Machine Learning"]
  },
  {
    id: "3",
    title: "Associate Consultant (New Grad)",
    companyId: "mckinsey",
    description: "As an Associate Consultant, you will work in teams of 3 to 5 colleagues, playing an active role in all aspects of client engagement. This includes gathering and analyzing information, formulating and testing hypotheses, and developing and communicating recommendations. You will present results to client management and implement recommendations in collaboration with client team members.",
    requirement: "• Recently graduated or in the final year of a Bachelor's or Master's degree in any field (STEM, Business, Humanities).\n• Strong analytical and quantitative problem-solving skills.\n• Excellent leadership, communication, and interpersonal skills.\n• Ability to work collaboratively in a team and adapt to client requirements.",
    employmentType: "HYBRID",
    location: "New York, NY",
    status: "ACTIVE",
    deadline: "2026-09-30T23:59:59Z",
    createdAt: "2026-06-08T10:00:00Z",
    stipend: "$110k - $130k / yr",
    skills: ["Problem Solving", "Analytics", "Strategy"]
  },
  {
    id: "4",
    title: "Product Design Co-op",
    companyId: "figma",
    description: "Figma is seeking a Product Design Co-op to help build the future of collaborative design tools. You will work side-by-side with senior designers, product managers, and engineers to design new features, build high-fidelity interactive prototypes, and conduct user research. This is a hands-on design role where your work will ship directly to millions of active Figma users.",
    requirement: "• Currently enrolled in a Design, Human-Computer Interaction (HCI), or related program.\n• Outstanding portfolio demonstrating strong visual design, interaction design, and product thinking.\n• Proficiency in Figma (components, auto layout, prototyping).\n• Passion for collaborative tools and empowering creative teams.",
    employmentType: "HYBRID",
    location: "San Francisco, CA",
    status: "ACTIVE",
    deadline: "2026-08-15T23:59:59Z",
    createdAt: "2026-06-10T11:00:00Z",
    stipend: "$40 - $55 / hr",
    skills: ["Figma", "UI/UX Design", "Prototyping"]
  },
  {
    id: "5",
    title: "Data Analyst Intern",
    companyId: "stripe",
    description: "Stripe's data analysts design and analyze experiments, build dashboards, and model complex systems to help business partners make strategic data-driven decisions. You will work with SQL, Python, and business intelligence tools to extract insights from financial transactions, user logs, and product metrics, and translate findings into product recommendations.",
    requirement: "• Pursuing a degree in Statistics, Mathematics, Computer Science, Economics, or related quantitative field.\n• Strong SQL skills (joins, window functions, query optimization).\n• Experience with scripting in Python or R for data cleaning and statistical analysis.\n• Excellent communication skills to explain complex analysis to non-technical stakeholders.",
    employmentType: "REMOTE",
    location: "Seattle, WA (Remote)",
    status: "ACTIVE",
    deadline: "2026-08-01T23:59:59Z",
    createdAt: "2026-06-13T14:00:00Z",
    stipend: "$38 - $50 / hr",
    skills: ["SQL", "Python", "Tableau"]
  },
  {
    id: "6",
    title: "Junior Full-Stack Engineer",
    companyId: "vercel",
    description: "Vercel is looking for a Junior Full-Stack Engineer to join our developer experience team. You will help build and maintain Next.js templates, improve developer workflows, optimize static and dynamic rendering pipelines, and enhance our deployment dashboard. This is a fast-paced role where you will work on the bleeding edge of modern web development.",
    requirement: "• Strong understanding of HTML, CSS, JavaScript, and TypeScript.\n• Hands-on experience building web applications with Next.js, React, and Tailwind CSS.\n• Familiarity with serverless architectures, REST/GraphQL APIs, and Git flows.\n• Self-motivated learner with a strong interest in open-source and frontend performance.",
    employmentType: "REMOTE",
    location: "Remote (US/Canada)",
    status: "ACTIVE",
    deadline: "2026-08-20T23:59:59Z",
    createdAt: "2026-06-09T12:00:00Z",
    stipend: "$90k - $120k / yr",
    skills: ["Next.js", "Tailwind CSS", "Node.js"]
  },
  {
    id: "7",
    title: "Site Reliability Engineer",
    companyId: "google",
    description: "We are looking for a Site Reliability Engineer to keep Google's critical infrastructure fast, secure, and highly available. You will write software to automate cluster management, debug complex distributed systems, and design disaster recovery protocols.",
    requirement: "• Experience with Go, C++, or Java.\n• Strong understanding of Linux internals, networking protocols, and systems architecture.\n• Passion for automation and elimination of toil.",
    employmentType: "ON_SITE",
    location: "Mountain View, CA",
    status: "CLOSED",
    deadline: "2026-05-31T23:59:59Z",
    createdAt: "2026-04-01T08:00:00Z",
    stipend: "$65 - $80 / hr",
    skills: ["Go", "Linux", "Kubernetes"]
  },
  {
    id: "8",
    title: "Deep Learning Research Intern",
    companyId: "stanford-ai-lab",
    description: "Join our computer vision group to research neural rendering and 3D Gaussian Splatting algorithms. You will train new generative models and present research updates to the group.",
    requirement: "• Deep learning experience with PyTorch/TensorFlow.\n• Understanding of 3D computer vision concepts.\n• Ability to write clean experimental code.",
    employmentType: "ON_SITE",
    location: "Stanford, CA",
    status: "EXPIRED",
    deadline: "2026-05-15T23:59:59Z",
    createdAt: "2026-03-10T09:00:00Z",
    stipend: "$35 - $45 / hr",
    skills: ["PyTorch", "NeRF", "Computer Vision"]
  },
  {
    id: "9",
    title: "Summer Business Analyst",
    companyId: "mckinsey",
    description: "A 10-week summer internship program that offers undergraduate students the opportunity to experience the day-to-day work of management consulting.",
    requirement: "• Undergrad junior student with strong academic performance.\n• Leadership and active involvement in campus organizations.",
    employmentType: "HYBRID",
    location: "New York, NY",
    status: "REJECTED",
    deadline: "2026-04-30T23:59:59Z",
    createdAt: "2026-02-15T10:00:00Z",
    stipend: "$85k / yr pro-rated",
    skills: ["Analytics", "Strategy", "Excel"]
  },
  {
    id: "10",
    title: "Senior Anvil Design Specialist",
    companyId: "acme-corp",
    description: "We are seeking a senior designer who can create solid iron anvils that can withstand repeated impacts, drop test configurations, and fall from high cliffs without cracking. Must be comfortable working under pressure and with high velocity impact scenarios.",
    requirement: "• 10+ years experience in heavy metal forging and stress testing.\n• Background in mechanical engineering with specialized knowledge of drop dynamics.\n• High tolerance for cartoonish gravity rules.",
    employmentType: "ON_SITE",
    location: "Desert City, UT",
    status: "CLOSED",
    deadline: "2026-01-01T00:00:00Z",
    createdAt: "2025-10-15T10:00:00Z",
    stipend: "$150k - $200k / yr",
    skills: ["Forging", "Stress Testing", "Heavy Machinery"]
  },
  {
    id: "11",
    title: "Rocket Propulsion Engineer",
    companyId: "acme-corp",
    description: "Responsible for designing and mounting solid fuel rocket thrusters onto roller skates or wearable backpacks. Must ensure that thrusters ignite instantly and reach speeds exceeding 100 mph within 2 seconds.",
    requirement: "• Master's or PhD in Aerospace Engineering or Pyrotechnics.\n• Hands-on experience with solid rocket propellants.\n• Comprehensive life insurance policy is mandatory before onboarding.",
    employmentType: "ON_SITE",
    location: "Desert City, UT",
    status: "DELETED",
    deadline: "2026-06-01T23:59:59Z",
    createdAt: "2026-04-01T10:00:00Z",
    stipend: "$180k - $220k / yr",
    skills: ["Rocketry", "Propulsion", "Skate Design"]
  }
];
