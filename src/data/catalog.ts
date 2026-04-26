import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";
import courseExcel from "@/assets/course-excel.jpg";
import courseCyber from "@/assets/course-cyber.jpg";
import courseReact from "@/assets/course-react.jpg";
import courseUiux from "@/assets/course-uiux.jpg";
import coursePowerbi from "@/assets/course-powerbi.jpg";
import courseAi from "@/assets/course-ai.jpg";
import testi1 from "@/assets/testi-1.jpg";
import testi2 from "@/assets/testi-2.jpg";
import testi3 from "@/assets/testi-3.jpg";

export type Course = {
  id: string;
  title: string;
  category: "Produktiviti" | "IT Security" | "Web & Creative" | "Pengaturcaraan" | "Data & AI";
  duration: string;
  price: number;
  groupPrice?: number;
  status: "Ada Tempat" | "Hampir Penuh" | "Penuh";
  shortDesc: string;
  image: string;
  syllabus: string[];
  prerequisites: string;
  facilitator: string;
  certificate: string;
  slots: { date: string; time: string; seats: number }[];
};

export const courses: Course[] = [
  {
    id: "ms-excel-advanced",
    title: "Microsoft Excel Lanjutan untuk Profesional",
    category: "Produktiviti",
    duration: "2 hari (16 jam)",
    price: 850,
    groupPrice: 750,
    status: "Ada Tempat",
    shortDesc: "Kuasai Pivot Table, Power Query, formula lanjutan dan automasi laporan dengan Excel.",
    image: courseExcel,
    syllabus: [
      "Formula & fungsi lanjutan (XLOOKUP, INDEX/MATCH, LET)",
      "Pivot Table & Pivot Chart untuk analisis data",
      "Power Query untuk transformasi data",
      "Power Pivot & Data Model",
      "Macro & VBA asas untuk automasi",
      "Dashboard interaktif & visualisasi",
    ],
    prerequisites: "Pengetahuan asas Microsoft Excel.",
    facilitator: "Encik Ahmad Razif — Microsoft Certified Trainer",
    certificate: "Sijil Penyertaan Synchrolab + Endorsement HRD Corp",
    slots: [
      { date: "15-16 Mei 2025", time: "9:00 pagi - 5:00 petang", seats: 8 },
      { date: "12-13 Jun 2025", time: "9:00 pagi - 5:00 petang", seats: 12 },
    ],
  },
  {
    id: "cybersecurity-fundamentals",
    title: "Asas Cybersecurity untuk Organisasi",
    category: "IT Security",
    duration: "3 hari (24 jam)",
    price: 1850,
    groupPrice: 1650,
    status: "Hampir Penuh",
    shortDesc: "Lindungi organisasi anda daripada ancaman siber dengan amalan terbaik industri.",
    image: courseCyber,
    syllabus: [
      "Landskap ancaman siber semasa di Malaysia",
      "Phishing, ransomware & social engineering",
      "Pengurusan kata laluan & MFA",
      "Network security & firewall asas",
      "Insiden response & business continuity",
      "Pematuhan PDPA & ISO 27001",
    ],
    prerequisites: "Tiada — terbuka kepada semua kakitangan IT dan bukan IT.",
    facilitator: "Puan Nurul Aisyah — CISSP, CEH",
    certificate: "Sijil Synchrolab + persediaan untuk peperiksaan CompTIA Security+",
    slots: [
      { date: "20-22 Mei 2025", time: "9:00 pagi - 5:00 petang", seats: 3 },
    ],
  },
  {
    id: "react-fullstack",
    title: "React & Node.js: Bina Aplikasi Web Lengkap",
    category: "Pengaturcaraan",
    duration: "5 hari (40 jam)",
    price: 2950,
    status: "Ada Tempat",
    shortDesc: "Bootcamp intensif untuk bina aplikasi web moden dari frontend hingga backend.",
    image: courseReact,
    syllabus: [
      "JavaScript ES6+ & TypeScript",
      "React 18: Hooks, Context, React Query",
      "Tailwind CSS & component libraries",
      "Node.js, Express & REST API",
      "Database PostgreSQL & ORM",
      "Deployment & DevOps asas",
    ],
    prerequisites: "Pengalaman HTML, CSS dan JavaScript asas.",
    facilitator: "Encik Faiz Hakim — Senior Full-Stack Developer",
    certificate: "Sijil Bootcamp Synchrolab + portfolio projek",
    slots: [
      { date: "2-6 Jun 2025", time: "9:00 pagi - 6:00 petang", seats: 15 },
    ],
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design dengan Figma",
    category: "Web & Creative",
    duration: "2 hari (16 jam)",
    price: 950,
    status: "Ada Tempat",
    shortDesc: "Reka bentuk antara muka yang cantik dan mesra pengguna menggunakan Figma.",
    image: courseUiux,
    syllabus: [
      "Prinsip design & user experience",
      "Figma: components, auto-layout, variants",
      "Wireframing & prototyping interaktif",
      "Design system & design tokens",
      "Usability testing asas",
      "Handoff ke developer",
    ],
    prerequisites: "Tiada — sesuai untuk pemula.",
    facilitator: "Cik Sarah Lim — Senior Product Designer",
    certificate: "Sijil Synchrolab",
    slots: [
      { date: "22-23 Mei 2025", time: "9:00 pagi - 5:00 petang", seats: 10 },
      { date: "26-27 Jun 2025", time: "9:00 pagi - 5:00 petang", seats: 12 },
    ],
  },
  {
    id: "data-analytics-power-bi",
    title: "Data Analytics dengan Power BI",
    category: "Data & AI",
    duration: "3 hari (24 jam)",
    price: 1650,
    groupPrice: 1450,
    status: "Ada Tempat",
    shortDesc: "Tukar data mentah kepada dashboard berimpak tinggi dengan Microsoft Power BI.",
    image: coursePowerbi,
    syllabus: [
      "Pengenalan Business Intelligence",
      "Power BI Desktop & Power Query",
      "Data modeling & DAX formula",
      "Visualisasi data berkesan",
      "Publish ke Power BI Service",
      "Row-level security & sharing",
    ],
    prerequisites: "Pengetahuan Excel asas.",
    facilitator: "Encik Daniel Tan — Microsoft Data Platform MVP",
    certificate: "Sijil Synchrolab + persediaan PL-300",
    slots: [
      { date: "10-12 Jun 2025", time: "9:00 pagi - 5:00 petang", seats: 14 },
    ],
  },
  {
    id: "ai-prompting-business",
    title: "AI & ChatGPT untuk Produktiviti Bisnes",
    category: "Data & AI",
    duration: "1 hari (8 jam)",
    price: 480,
    status: "Penuh",
    shortDesc: "Manfaatkan AI generatif untuk tingkatkan produktiviti harian organisasi anda.",
    image: courseAi,
    syllabus: [
      "Pengenalan AI generatif & LLM",
      "Teknik prompting berkesan",
      "Use case: penulisan, analisis, automasi",
      "ChatGPT, Claude, Gemini perbandingan",
      "Etika & batasan AI",
      "Hands-on workshop",
    ],
    prerequisites: "Tiada.",
    facilitator: "Dr. Zulkifli Yusof — AI Consultant",
    certificate: "Sijil Synchrolab",
    slots: [
      { date: "5 Mei 2025", time: "9:00 pagi - 5:00 petang", seats: 0 },
    ],
  },
];

export type Room = {
  id: string;
  name: string;
  capacity: number;
  hourlyRate: number;
  dailyRate: number;
  facilities: string[];
  image: string;
  description: string;
};

export const rooms: Room[] = [
  {
    id: "lab-utama",
    name: "Lab Latihan Utama",
    capacity: 24,
    hourlyRate: 180,
    dailyRate: 1200,
    facilities: ["24 unit komputer", "Projektor 4K", "WiFi 1 Gbps", "Papan putih besar", "Sistem audio", "Penghawa dingin"],
    image: room1,
    description: "Bilik latihan utama dengan kelengkapan IT lengkap, sesuai untuk kursus teknikal dan workshop berskala sederhana.",
  },
  {
    id: "bilik-bengkel",
    name: "Bilik Bengkel Eksekutif",
    capacity: 10,
    hourlyRate: 120,
    dailyRate: 800,
    facilities: ["Meja bulat", "Smart TV 75 inci", "WiFi laju", "Kerusi eksekutif", "Pantry mini", "Penghawa dingin"],
    image: room2,
    description: "Ruang bengkel selesa untuk perbincangan strategik, mesyuarat eksekutif dan sesi mentoring.",
  },
  {
    id: "auditorium",
    name: "Auditorium Synchrolab",
    capacity: 120,
    hourlyRate: 350,
    dailyRate: 2400,
    facilities: ["Pentas & podium", "Skrin gergasi", "Sistem PA profesional", "Mikrofon wireless", "Pencahayaan teater", "Bilik kawalan"],
    image: room3,
    description: "Auditorium berkapasiti besar untuk seminar, persidangan, taklimat dan majlis korporat.",
  },
];

export const categories = [
  "Semua",
  "Produktiviti",
  "IT Security",
  "Web & Creative",
  "Pengaturcaraan",
  "Data & AI",
] as const;

export type Testimonial = {
  name: string;
  role: string;
  text: string;
  image: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Aizat Rahman",
    role: "IT Manager, Petronas Subsidiary",
    text: "Kursus Cybersecurity Synchrolab sangat praktikal. Trainer beri contoh kes sebenar di Malaysia. Highly recommended!",
    image: testi1,
  },
  {
    name: "Nurin Sofea",
    role: "Data Analyst, CIMB",
    text: "Selepas kursus Power BI 3 hari, saya dah boleh bina dashboard sendiri untuk pasukan. Bahan kursus pun lengkap.",
    image: testi2,
  },
  {
    name: "Daniel Wong",
    role: "Founder, TechStartup MY",
    text: "Sewa auditorium untuk product launch — kemudahan top notch, harga berpatutan, staff sangat helpful.",
    image: testi3,
  },
];
