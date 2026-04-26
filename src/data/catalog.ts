// Image map keyed by slug. Real product data comes from the database; we keep
// imagery local for performance and visual consistency.
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
import fallback from "@/assets/hero-training.jpg";

export const courseImageBySlug: Record<string, string> = {
  "ms-excel-advanced": courseExcel,
  "cybersecurity-fundamentals": courseCyber,
  "react-fullstack": courseReact,
  "ui-ux-design": courseUiux,
  "data-analytics-power-bi": coursePowerbi,
  "ai-prompting-business": courseAi,
};

export const roomImageBySlug: Record<string, string> = {
  "lab-utama": room1,
  "bilik-bengkel": room2,
  "auditorium": room3,
};

export const getCourseImage = (slug: string) => courseImageBySlug[slug] ?? fallback;
export const getRoomImage = (slug: string) => roomImageBySlug[slug] ?? fallback;

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

export const categories = [
  "Semua",
  "Produktiviti",
  "IT Security",
  "Web & Creative",
  "Pengaturcaraan",
  "Data & AI",
] as const;
