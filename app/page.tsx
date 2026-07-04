"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type ReactElement,
  type ReactNode,
} from "react";
import Image from "next/image";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                      */
/*  Theme: "Vital Signal" — a health-informatics dashboard aesthetic.  */
/*  Soft white-blue ground, glassmorphic panels, a blue→green vital    */
/*  gradient as the signature thread that runs through every section.  */
/*                                                                      */
/*  --bg        #F6FAFF   page background                              */
/*  --ink       #0B1220   primary text                                 */
/*  --ink-60    #5B6B7B   secondary text                                */
/*  --line      rgba(15,23,42,.08)  hairlines                          */
/*  --blue      #2F6FED   primary accent                               */
/*  --blue-soft #E7F0FF   blue tint                                     */
/*  --green     #14B981   vital / success accent                       */
/*  --green-soft#E3FBF1   green tint                                    */
/*  --violet    #7C6FEF   tertiary accent (security / tags)             */
/*  --violet-soft#EDEBFF  violet tint                                   */
/*  Signature: a flowing "pulse thread" gradient line + glass cards     */
/*  that glow softly on hover, echoing a live vitals monitor.           */
/* ------------------------------------------------------------------ */

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

/* ------------------------------------------------------------------ */
/*  DATA                                                                */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

const ROLES = [
  "Full-Stack Developer",
  "UI/UX Designer",
  "Health-Tech Enthusiast",
  "Problem Solver",
];

type Category = "Web Apps" | "E-Commerce" | "Health Informatics" |  "Other";
const CATEGORIES: Category[] = ["Web Apps", "E-Commerce", "Health Informatics","Other"];

type Project = {
  id: string;
  category: Category;
  accent: "blue" | "green" | "violet" | "orange";
  monogram: string;
  title: string;
  tagline: string;
  description: string;
  role?: string;
  features?: string[];
  stack?: string[];
  highlights?: string[];
  achievement?: string;
  image?: string;
  github?: string;
  demo?: string;
};

const ACCENTS: Record<Project["accent"], { fg: string; bg: string; tint: string; border: string }> = {
  blue: { fg: "#2F6FED", bg: "#2F6FED", tint: "#E7F0FF", border: "#C7DBFF" },
  green: { fg: "#0E9F70", bg: "#14B981", tint: "#E3FBF1", border: "#BAEBD8" },
  violet: { fg: "#6357DB", bg: "#7C6FEF", tint: "#EDEBFF", border: "#D6D2FB" },
  orange: { fg: "#F97316", bg: "#F97316", tint: "#FED7D7", border: "#FEB2B2" },
};

const PROJECTS: Project[] = [
  {
  id: "hospital-facility-management",
  category: "Health Informatics",
  accent: "orange",
  monogram: "HF",
  title: "Hospital Facility Management System",
  tagline: "Kamburupitiya Base Hospital",
  description:
    "A comprehensive hospital facility management system developed to streamline healthcare operations by managing departments, medical equipment, room availability, maintenance requests, and staff resources. The platform improves operational efficiency through a secure, user-friendly interface while supporting effective healthcare facility administration.",
  highlights: [
    "Facility & room management",
    "Equipment tracking",
    "Maintenance request system",
    "Healthcare administration"
  ],
  image: "/FMSystem.jfif",
  github: "https://github.com/chamodilakshani/hospital-facility-management",
},
  {
  id: "codeplay",
  category: "Web Apps",
  accent: "blue",
  monogram: "CP",
  title: "CodePlay",
  tagline: "An interactive coding platform that makes programming fun for children.",
  description:
    "CodePlay is a full-stack educational web platform designed to introduce children to programming through interactive lessons, coding games, and hands-on challenges. Built with Next.js, TypeScript, Clerk Authentication, PostgreSQL, and Neon, the platform provides a secure, engaging, and responsive learning environment that encourages creativity and problem-solving.",
  highlights: [
    "Interactive coding games",
    "Secure Clerk authentication",
    "PostgreSQL + Neon database",
    "Responsive learning platform"
  ],
  image: "/codeplay.png",
  github: "https://github.com/chamodilakshani/codeplay",
  demo: "https://codeplay-demo.vercel.app",
},
 {
  id: "meeya-engineering",
  category: "Web Apps",
  accent: "green",
  monogram: "ME",
  title: "Meeya Engineering",
  tagline: "A modern heavy machinery repair and service management platform.",
  description:
    "A responsive business website developed for Meeya Engineering to modernize its online presence. The platform enables customers to explore heavy machinery repair services, book appointments online, and connect with the company through an intuitive interface. Built with a bold industrial design focused on performance, reliability, and accessibility.",
  highlights: [
    "Online appointment booking",
    "Service management",
    "Responsive industrial UI"
  ],
  image: "/meeya-engineering.png",
  github: "https://github.com/chamodilakshani/meeya-engineering",
  demo: "https://meeya-engineering.vercel.app",
},
  {
  id: "zara-handmade",
  category: "E-Commerce",
  accent: "violet",
  monogram: "ZH",
  title: "Zara Handmade",
  tagline: "A handcrafted products marketplace with a modern shopping experience.",
  description:
    "Zara Handmade is a responsive e-commerce website developed to showcase and sell handcrafted products through a clean and elegant user interface. The platform allows customers to browse product collections, explore detailed product pages, and enjoy a seamless shopping experience with a design that reflects the uniqueness of handmade craftsmanship.",
  highlights: [
    "Product catalog",
    "Responsive shopping experience",
    "Modern UI/UX design",
    "Mobile-friendly interface"
  ],
  image: "/projects/zara-handmade.png",
  github: "https://github.com/chamodilakshani/zara-handmade",
  demo: "https://zara-handmade.vercel.app"
},
  
];

type IconProps = { className?: string };

function StethoscopeIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M5 3v4.5a3 3 0 006 0V3M8 7.5v2a4 4 0 004 4 4 4 0 004-4v-1.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="7.3" r="1.4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="15.5" r="1.7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function PaletteIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2.5a7.2 7.2 0 100 14.4c.9 0 1.5-.7 1.5-1.5 0-.4-.15-.75-.4-1a1.4 1.4 0 011-2.4h1.4A3.5 3.5 0 0017 8.5 6.2 6.2 0 0010 2.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="6.7" cy="8" r="0.9" fill="currentColor" />
      <circle cx="9.3" cy="5.8" r="0.9" fill="currentColor" />
      <circle cx="12.7" cy="6.5" r="0.9" fill="currentColor" />
    </svg>
  );
}
function BookIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M3 4.2c1.6-.6 3.6-.7 7-.1v11.6c-3.4-.6-5.4-.5-7 .1V4.2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M17 4.2c-1.6-.6-3.6-.7-7-.1v11.6c3.4-.6 5.4-.5 7 .1V4.2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function CodeTagIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M7 5.5L2.8 10 7 14.5M13 5.5L17.2 10 13 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GithubIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2a8 8 0 00-2.53 15.6c.4.07.55-.17.55-.38v-1.5c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.9-1.17-.9-1.17-.73-.5.06-.5.06-.5.82.06 1.25.84 1.25.84.72 1.24 1.9.88 2.36.67.07-.53.28-.88.5-1.08-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.58.82-2.14-.08-.2-.36-1.02.08-2.13 0 0 .67-.22 2.2.82a7.5 7.5 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.27.82 2.14 0 3.07-1.88 3.75-3.66 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0010 2z"
        fill="currentColor"
      />
    </svg>
  );
}
function ExternalIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6.5 4.5H4.5a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 2.5H13.5V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 9L13.3 2.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MailIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M3 5h14a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 6l7.5 5.5L17.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function LinkedinIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 8v8M4 4.5v.01M8.5 16V8m0 3c0-2 1.5-3 3-3s3 1 3 3v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function PulseIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M2 10h3.5l1.8-5 3 10 1.8-5H18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type EducationEntry = {
  title: string;
  primary?: boolean;
  subtitle?: string;
  institution?: string;
  period?: string;
  description?: string;
  icon: (p: IconProps) => ReactElement;
};

const EDUCATION: EducationEntry[] = [
  {
    title: "Bachelor of Health Science (Honours)",
    primary: true,
    subtitle: "Health Information & Communication Technology",
    institution: "Gampaha Wickramaarachchi University of Indigenous Medicine",
    period: "2023 — Present",
    icon: StethoscopeIcon,
  },
  {
    title: "Diploma in Graphic Design",
    period: "2021 — 2022",
    description:
      "Branding, typography, and Adobe Photoshop & Illustrator — the foundation for a design-first approach to development.",
    icon: PaletteIcon,
  },
  {
    title: "Diploma in English",
    period: "2020 — 2021",
    description: "Applied written and spoken communication, refined for professional and client-facing work.",
    icon: BookIcon,
  },
  {
    title: "Certificate in Full Stack Web Development",
    period: "2024",
    description: "End-to-end web fundamentals — from database design to deployed, working interfaces.",
    icon: CodeTagIcon,
  },
];

type SkillLevel = { name: string; level: number };

const SKILL_RINGS: { label: string; value: number; color: string; description: string }[] = [
  { label: "Frontend", value: 86, color: "#2F6FED", description: "React, Tailwind, and building interfaces that feel fast and clear." },
  { label: "Backend", value: 76, color: "#14B981", description: "APIs, auth, and databases that hold up past the demo." },
  { label: "UI / UX", value: 82, color: "#7C6FEF", description: "Design-first thinking, carried over from a graphic design background." },
  { label: "DevOps", value: 62, color: "#F0A63A", description: "Docker, Git workflows, and shipping consistently across environments." },
];

const SKILL_PANELS: { name: string; color: string; tint: string; skills: SkillLevel[] }[] = [
  {
    name: "Languages & Frontend",
    color: "#2F6FED",
    tint: "#E7F0FF",
    skills: [
      { name: "JavaScript", level: 85 },
      { name: "React.js", level: 82 },
      { name: "Tailwind CSS", level: 88 },
      { name: "HTML5 & CSS3", level: 92 },
      { name: "PHP", level: 68 },
      { name: "Figma", level: 78 },
    ],
  },
  {
    name: "Backend & Tools",
    color: "#14B981",
    tint: "#E3FBF1",
    skills: [
      { name: "Node.js / Express", level: 78 },
      { name: "REST APIs", level: 80 },
      { name: "MongoDB / MySQL", level: 76 },
      { name: "Docker", level: 65 },
      { name: "Git & GitHub", level: 85 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  HOOKS                                                               */
/* ------------------------------------------------------------------ */

function useTypewriter(words: string[], typingSpeed = 65, deletingSpeed = 35, pause = 1600) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const word = words[index];
    if (subIndex === word.length && !deleting) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const t = setTimeout(
      () => setSubIndex((prev) => prev + (deleting ? -1 : 1)),
      deleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(t);
  }, [subIndex, deleting, index, words, typingSpeed, deletingSpeed, pause]);

  useEffect(() => {
    const t = setInterval(() => setBlink((v) => !v), 500);
    return () => clearInterval(t);
  }, []);

  return { text: words[index].slice(0, subIndex), blink };
}

/* ------------------------------------------------------------------ */
/*  BACKGROUND — gradient mesh, floating blobs, particles               */
/* ------------------------------------------------------------------ */

const PARTICLES = Array.from({ length: 18 }).map((_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 3 + (i % 4),
  duration: 14 + (i % 6) * 3,
  delay: (i % 9) * 0.6,
  drift: i % 2 === 0 ? 1 : -1,
}));

function AmbientBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        bgRef.current?.style.setProperty("--scrollY", String(window.scrollY));
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={bgRef} className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="blob blob-a" style={{ transform: "translate3d(0, calc(var(--scrollY, 0) * -0.05px), 0)" }} />
      <div className="blob blob-b" style={{ transform: "translate3d(0, calc(var(--scrollY, 0) * 0.04px), 0)" }} />
      <div className="blob blob-c" style={{ transform: "translate3d(0, calc(var(--scrollY, 0) * -0.03px), 0)" }} />
      <div className="mesh-grid" />
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ["--drift" as string]: p.drift,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PRIMITIVES                                                          */
/* ------------------------------------------------------------------ */

function PrimaryButton({
  children,
  href,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      type={href ? undefined : type}
      aria-disabled={disabled}
      className="btn-glow group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#2F6FED] to-[#14B981] px-6 py-3.5 text-[0.86rem] font-bold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6FED] disabled:opacity-60"
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Tag>
  );
}

function SecondaryButton({
  children,
  onClick,
  href,
  target,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
}) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className="glass-btn relative inline-flex items-center gap-2 rounded-full border border-[rgba(15,23,42,0.12)] bg-white/60 px-6 py-3.5 text-[0.86rem] font-bold text-[#0B1220] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2F6FED] hover:shadow-[0_10px_30px_-12px_rgba(47,111,237,0.45)]"
    >
      {children}
    </Tag>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-label={label}
      className="icon-link group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-[#2F6FED] hover:to-[#14B981]"
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  TILT CARD — 3D hover tilt used by project cards                    */
/* ------------------------------------------------------------------ */

function TiltCard({ children, className, style, onClick }: { children: ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-6px) scale(1.015)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ transition: "transform 0.25s ease-out", transformStyle: "preserve-3d", ...style }}
      className={className}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PROJECT CARD + MODAL                                                */
/* ------------------------------------------------------------------ */

function CardImage({ project }: { project: Project }) {
  const a = ACCENTS[project.accent];
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !project.image || failed;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[22px] border-b border-slate-200/70 bg-[linear-gradient(145deg,#f8fbff_0%,#eef5ff_100%)]">
      {!showPlaceholder && (
        <Image
          src={project.image as string}
          alt={`${project.title} — project screenshot`}
          fill
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105 sm:p-3"
          sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
          onError={() => setFailed(true)}
        />
      )}
      {showPlaceholder && (
        <div className="flex h-full w-full items-center justify-center" style={{ background: `linear-gradient(150deg, ${a.tint}, #fff)` }}>
          <span className="font-[family-name:var(--font-display)] text-4xl font-bold" style={{ color: a.fg }}>
            {project.monogram}
          </span>
        </div>
      )}
      <span
        className="absolute left-3 top-3 rounded-full px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.62rem] font-bold uppercase tracking-wide text-white shadow-md"
        style={{ background: a.bg }}
      >
        {project.category}
      </span>
    </div>
  );
}

function ProjectCard({ project, onOpen, index }: { project: Project; onOpen: (p: Project) => void; index: number }) {
  const a = ACCENTS[project.accent];
  return (
    <TiltCard
      className="group relative"
      style={{ animationDelay: `${index * 90}ms` }}
      onClick={() => onOpen(project)}
    >
      <div
        data-reveal
        style={{ transitionDelay: `${index * 80}ms` }}
        className="glass-card relative flex cursor-pointer flex-col overflow-hidden rounded-[22px] border bg-white/70 text-left shadow-[0_8px_30px_-18px_rgba(15,23,42,0.25)] backdrop-blur-xl"
      >
        <div className="glow-border" style={{ ["--glow" as string]: a.fg }} />
        <CardImage project={project} />
        <div className="flex flex-1 flex-col gap-2 px-5 py-4">
          <h3 className="font-[family-name:var(--font-display)] text-[1.05rem] font-bold leading-tight text-[#0B1220]">
            {project.title}
          </h3>
          <p className="text-[0.82rem] leading-relaxed text-[#5B6B7B]">{project.tagline}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {(project.stack ?? project.highlights ?? []).slice(0, 2).map((s) => (
                <span key={s} className="rounded-full px-2 py-0.5 font-[family-name:var(--font-mono)] text-[0.62rem] font-semibold" style={{ background: a.tint, color: a.fg }}>
                  {s}
                </span>
              ))}
            </div>
            <svg className="h-4 w-4 flex-shrink-0 text-[#5B6B7B] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#0B1220]" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const a = ACCENTS[project.accent];
  const closeRef = useRef<HTMLButtonElement>(null);
  const points = project.features ?? project.highlights ?? [];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay fixed inset-0 z-[200] flex items-center justify-center bg-[#0B1220]/60 p-4 backdrop-blur-md sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-panel relative w-full max-w-[640px] overflow-hidden rounded-[28px] border border-white/60 bg-white/90 shadow-2xl backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white sm:px-8" style={{ background: `linear-gradient(90deg, ${a.fg}, #14B981)` }}>
          <span className="font-[family-name:var(--font-mono)]">{project.category}</span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
              <path d="M4 4L12 12M12 4L4 12" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto">
          <div className="relative aspect-[16/9] w-full">
            <CardImage project={project} />
          </div>

          <div className="px-6 py-7 sm:px-8">
            <h2 id="modal-title" className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#0B1220]">
              {project.title}
            </h2>
            <p className="mt-1.5 text-[0.92rem] font-semibold" style={{ color: a.fg }}>
              {project.tagline}
            </p>

            {(project.github || project.demo) && (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {project.github && (
                  <SecondaryButton href={project.github} target="_blank">
                    <GithubIcon />
                    View on GitHub
                  </SecondaryButton>
                )}
                {project.demo && (
                  <PrimaryButton href={project.demo}>
                    <ExternalIcon />
                    Live demo
                  </PrimaryButton>
                )}
              </div>
            )}

            <p className="mt-6 text-[0.95rem] leading-relaxed text-[#5B6B7B]">{project.description}</p>

            {project.role && (
              <div className="mt-6 border-l-2 pl-4" style={{ borderColor: a.bg }}>
                <span className="block font-[family-name:var(--font-mono)] text-[0.66rem] font-bold uppercase tracking-[0.1em] text-[#8A94A6]">Role</span>
                <span className="text-[0.92rem] font-semibold text-[#0B1220]">{project.role}</span>
              </div>
            )}

            {points.length > 0 && (
              <div className="mt-6">
                <span className="mb-2.5 block font-[family-name:var(--font-mono)] text-[0.66rem] font-bold uppercase tracking-[0.1em] text-[#8A94A6]">Highlights</span>
                <ul className="space-y-2">
                  {points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-[0.88rem] leading-relaxed text-[#33414F]">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: a.bg }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.stack && (
              <div className="mt-6">
                <span className="mb-2.5 block font-[family-name:var(--font-mono)] text-[0.66rem] font-bold uppercase tracking-[0.1em] text-[#8A94A6]">Built with</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <span key={s} className="rounded-lg border font-[family-name:var(--font-mono)] px-2.5 py-1.5 text-[0.76rem] font-semibold text-[#33414F]" style={{ borderColor: a.border }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.achievement && (
              <div className="mt-7 flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-[0.85rem] leading-relaxed" style={{ background: a.tint, borderColor: a.border, color: "#20304a" }}>
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L12.2 7.2L18 7.8L13.6 11.6L14.9 17.2L10 14.2L5.1 17.2L6.4 11.6L2 7.8L7.8 7.2L10 2Z" stroke={a.fg} strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
                <span>
                  <b style={{ color: a.fg }}>Recognition — </b>
                  {project.achievement}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SKILLS — circular rings + lab-style bars                            */
/* ------------------------------------------------------------------ */

function CircularSkill({ label, value, color, description }: { label: string; value: number; color: string; description: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (visible ? value / 100 : 0) * c;

  return (
    <div ref={ref} className="group relative flex flex-col items-center gap-3">
      <div className="relative h-[108px] w-[108px]">
        <svg viewBox="0 0 104 104" className="h-full w-full -rotate-90">
          <circle cx="52" cy="52" r={r} fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="8" />
          <circle
            cx="52"
            cy="52"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-mono)] text-[0.95rem] font-bold" style={{ color }}>
          {visible ? value : 0}%
        </span>
      </div>
      <span className="text-[0.85rem] font-semibold text-[#0B1220]">{label}</span>

      <div className="tooltip pointer-events-none absolute -top-2 left-1/2 w-52 -translate-x-1/2 -translate-y-full rounded-xl border border-white/70 bg-white/95 p-3 text-center text-[0.72rem] leading-relaxed text-[#5B6B7B] opacity-0 shadow-xl backdrop-blur transition-all duration-300 group-hover:-translate-y-[112%] group-hover:opacity-100">
        {description}
      </div>
    </div>
  );
}

function SkillReading({ skill, color }: { skill: SkillLevel; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[0.82rem] font-semibold text-[#33414F]">{skill.name}</span>
        <span className="font-[family-name:var(--font-mono)] text-[0.64rem] font-bold" style={{ color }}>
          {skill.level}%
        </span>
      </div>
      <div className="h-[6px] w-full overflow-hidden rounded-full bg-[rgba(15,23,42,0.06)]">
        <div data-reveal className="skill-fill h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}, #14B981)`, ["--fill" as string]: `${skill.level}%` }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO PORTRAIT — click-to-flip photo card, no floating animation    */
/* ------------------------------------------------------------------ */

function FlipPortrait() {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-label="Flip portrait photo"
      title="Click to flip"
      className="flip-card relative block aspect-[4/5] w-full max-w-[360px] cursor-pointer"
    >
      <div className={`flip-card-inner relative h-full w-full rounded-[42px] shadow-2xl ${flipped ? "is-flipped" : ""}`}>
        <div className="flip-card-face flip-card-front absolute inset-0 overflow-hidden rounded-[42px] border-4 border-white/80">
          <Image src="/pose-about.png" alt="Portrait of Chamodi Lakshani" fill className="object-cover" priority sizes="360px" />
        </div>
        <div className="flip-card-face flip-card-back absolute inset-0 overflow-hidden rounded-[42px] border-4 border-white/80">
          <Image src="/pose-projects.png" alt="Alternate portrait of Chamodi Lakshani" fill className="object-cover" sizes="360px" />
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<"All" | Category>("All");

  const navRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const navListRef = useRef<HTMLUListElement>(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const filterRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const filterListRef = useRef<HTMLDivElement>(null);
  const [filterUnderline, setFilterUnderline] = useState({ left: 0, width: 0 });

  const { text: typedRole, blink } = useTypewriter(ROLES);

  const handleOpenProject = useCallback((p: Project) => setOpenProject(p), []);
  const handleCloseProject = useCallback(() => setOpenProject(null), []);

  const visibleProjects = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter]
  );

  // Section-tracking observer + scroll listener — set up once.
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Reveal-on-scroll observer — re-run whenever the filtered project list
  // changes, so newly-rendered cards (e.g. after switching filters) also
  // get observed instead of staying stuck at opacity: 0.
  useEffect(() => {
    const revealEls = document.querySelectorAll("[data-reveal]:not(.is-visible)");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, [visibleProjects]);

  useEffect(() => {
    const el = navRefs.current[activeSection];
    const parent = navListRef.current;
    if (el && parent) {
      const elRect = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      setUnderline({ left: elRect.left - parentRect.left, width: elRect.width });
    }
  }, [activeSection]);

  useEffect(() => {
    const el = filterRefs.current[filter];
    const parent = filterListRef.current;
    if (el && parent) {
      const elRect = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      setFilterUnderline({ left: elRect.left - parentRect.left, width: elRect.width });
    }
  }, [filter, visibleProjects.length]);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = 84;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main
      className={`${display.variable} ${body.variable} ${mono.variable} relative w-full min-h-screen bg-[#F6FAFF] text-[#0B1220] overflow-x-hidden font-[family-name:var(--font-body)]`}
    >
      <style jsx global>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-22px) translateX(10px); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.06); }
        }
        @keyframes drift {
          0% { transform: translateY(0) translateX(0); opacity: 0.35; }
          50% { opacity: 0.8; }
          100% { transform: translateY(calc(var(--drift, 1) * -60px)) translateX(calc(var(--drift, 1) * 24px)); opacity: 0.35; }
        }
        @keyframes wavePan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(47,111,237,0.35); }
          50% { box-shadow: 0 0 0 10px rgba(47,111,237,0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes flowDash {
          to { stroke-dashoffset: -200; }
        }

        [data-reveal] {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        [data-reveal-group] > * {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        [data-reveal-group].is-visible > * { opacity: 1; transform: translateY(0); }
        [data-reveal-group].is-visible > *:nth-child(1) { transition-delay: 0.04s; }
        [data-reveal-group].is-visible > *:nth-child(2) { transition-delay: 0.1s; }
        [data-reveal-group].is-visible > *:nth-child(3) { transition-delay: 0.16s; }
        [data-reveal-group].is-visible > *:nth-child(4) { transition-delay: 0.22s; }

        [data-reveal].skill-fill {
          opacity: 1; transform: none; width: 0;
          transition: width 1.1s cubic-bezier(0.22, 1, 0.36, 1);
        }
        [data-reveal].skill-fill.is-visible { width: var(--fill); }

        .blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          animation: floatSlow 16s ease-in-out infinite;
        }
        .blob-a { top: -10%; left: -8%; width: 480px; height: 480px; background: radial-gradient(circle, rgba(47,111,237,0.28), transparent 70%); }
        .blob-b { top: 30%; right: -12%; width: 520px; height: 520px; background: radial-gradient(circle, rgba(20,185,129,0.24), transparent 70%); animation-delay: -6s; }
        .blob-c { bottom: -15%; left: 20%; width: 460px; height: 460px; background: radial-gradient(circle, rgba(124,111,239,0.18), transparent 70%); animation-delay: -11s; }

        .mesh-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%);
        }

        .particle {
          position: absolute;
          border-radius: 9999px;
          background: linear-gradient(135deg, #2F6FED, #14B981);
          opacity: 0.5;
          animation-name: drift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .hero-wave-bg {
          background: linear-gradient(120deg, #E7F0FF, #F6FAFF, #E3FBF1, #F6FAFF);
          background-size: 300% 300%;
          animation: wavePan 14s ease-in-out infinite;
        }

        /* Portrait — static (no floating), click-to-flip */
        .flip-card {
          perspective: 1600px;
          -webkit-tap-highlight-color: transparent;
        }
        .flip-card-inner {
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .flip-card-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .flip-card-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }

        .glass-card {
          transition: box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .glow-border {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          box-shadow: 0 0 0 0 var(--glow, transparent);
          transition: box-shadow 0.35s ease;
          z-index: 1;
        }
        .glass-card:hover .glow-border {
          box-shadow: 0 0 0 2px var(--glow, transparent), 0 20px 45px -20px var(--glow, transparent);
        }

        .glass-btn:hover { animation: pulseGlow 1.4s ease-out; }
        .btn-glow:hover { animation: pulseGlow 1.4s ease-out; }

        .modal-overlay { animation: fadeIn 0.2s ease; }
        .modal-panel { animation: popIn 0.3s cubic-bezier(0.22, 1, 0.36, 1); }

        .nav-underline {
          position: absolute;
          bottom: -1px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #2F6FED, #14B981);
          transition: left 0.35s cubic-bezier(0.22,1,0.36,1), width 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .filter-underline {
          position: absolute;
          top: 0; bottom: 0;
          border-radius: 9999px;
          background: linear-gradient(90deg, #2F6FED, #14B981);
          transition: left 0.35s cubic-bezier(0.22,1,0.36,1), width 0.35s cubic-bezier(0.22,1,0.36,1);
          z-index: 0;
        }

        .flow-line { animation: flowDash 3.5s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal], [data-reveal-group] > *, .modal-overlay, .modal-panel,
          .blob, .particle, .hero-wave-bg, .flow-line, .flip-card-inner {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <AmbientBackground />

      {openProject && <ProjectModal project={openProject} onClose={handleCloseProject} />}

      {/* ---------------------------------------------------------------- */}
      {/* NAV                                                               */}
      {/* ---------------------------------------------------------------- */}
      <header className={`fixed top-0 left-0 z-[100] w-full transition-all duration-300 ${scrolled ? "border-b border-[rgba(15,23,42,0.06)] bg-white/70 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl" : "bg-transparent"}`}>
        <nav className="flex h-[76px] items-center justify-between px-[5%] md:px-[9%]">
          <button onClick={() => scrollToSection("about")} className="flex items-center gap-2.5 font-[family-name:var(--font-display)] text-[1.1rem] font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2F6FED] to-[#14B981] text-[0.72rem] font-[family-name:var(--font-mono)] font-bold text-white">
              CL
            </span>
            Chamodi Lakshani
          </button>

          <ul ref={navListRef} className="relative hidden items-center gap-1 md:flex">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  ref={(el) => { navRefs.current[s.id] = el; }}
                  onClick={() => scrollToSection(s.id)}
                  className={`relative px-4 py-2 font-[family-name:var(--font-mono)] text-[0.74rem] font-bold uppercase tracking-wider transition-colors ${activeSection === s.id ? "text-[#0B1220]" : "text-[#5B6B7B] hover:text-[#0B1220]"}`}
                >
                  {s.label}
                </button>
              </li>
            ))}
            <span className="nav-underline" style={{ left: underline.left, width: underline.width }} />
          </ul>

          <div className="hidden md:block">
            <SecondaryButton onClick={() => scrollToSection("contact")}>Let&apos;s talk</SecondaryButton>
          </div>

          <button onClick={() => setMenuOpen((v) => !v)} aria-label="Open menu" className="flex flex-col gap-1.5 p-2 md:hidden">
            <span className="h-0.5 w-5 rounded-full bg-[#0B1220]" />
            <span className="h-0.5 w-5 rounded-full bg-[#0B1220]" />
            <span className="h-0.5 w-5 rounded-full bg-[#0B1220]" />
          </button>
        </nav>

        {menuOpen && (
          <div className="flex flex-col border-b border-[rgba(15,23,42,0.08)] bg-white/90 px-[5%] pb-5 pt-2 shadow-lg backdrop-blur-xl md:hidden">
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => scrollToSection(s.id)} className="border-b border-[rgba(15,23,42,0.06)] py-3.5 text-left font-[family-name:var(--font-mono)] text-sm font-bold text-[#5B6B7B] last:border-none">
                {s.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* ABOUT / HERO                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section id="about" className="hero-wave-bg relative flex min-h-screen w-full items-center px-[5%] pb-20 pt-[130px] scroll-mt-20 md:px-[9%]">
        <div className="relative z-10 grid w-full grid-cols-1 items-center gap-14 md:grid-cols-[1.05fr_0.8fr]">
          <div>
            <span data-reveal className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(47,111,237,0.25)] bg-white/60 px-3.5 py-1.5 font-[family-name:var(--font-mono)] text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#2F6FED] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#14B981] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#14B981]" />
              </span>
              Open to opportunities
            </span>

            <h1 data-reveal className="mb-3 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight md:text-[3.5rem]">
              Building where <span className="bg-gradient-to-r from-[#2F6FED] to-[#14B981] bg-clip-text text-transparent">healthcare</span> meets code.
            </h1>

            <div data-reveal className="mb-6 flex h-8 items-center font-[family-name:var(--font-mono)] text-[1.05rem] font-semibold text-[#2F6FED]">
              {typedRole}
              <span className={`ml-0.5 inline-block h-5 w-[2px] bg-[#14B981] ${blink ? "opacity-100" : "opacity-0"}`} />
            </div>

            <p data-reveal className="mb-7 max-w-[54ch] text-[1.02rem] leading-[1.75] text-[#5B6B7B]">
              I&apos;m a full-stack developer and UI/UX designer studying Health Information &amp;
              Communication Technology. I started in graphic design and now write production
              code — I care about interfaces that stay clear under pressure, and systems that
              hold up past the demo.
            </p>

            <div data-reveal className="mb-9 flex flex-wrap items-center gap-3">
              <PrimaryButton href="/cv.pdf">Download CV</PrimaryButton>
              <SecondaryButton onClick={() => scrollToSection("projects")}>View Projects</SecondaryButton>
            </div>

            <div data-reveal data-reveal-group className="grid max-w-[540px] grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="glass-card rounded-2xl border border-white/60 bg-white/55 p-4 backdrop-blur-md transition-transform hover:-translate-y-1">
                <div className="glow-border" style={{ ["--glow" as string]: "#2F6FED" }} />
                <span className="mb-1.5 block font-[family-name:var(--font-mono)] text-[0.66rem] font-bold uppercase tracking-wider text-[#2F6FED]">Focus</span>
                <p className="text-[0.82rem] leading-relaxed text-[#5B6B7B]">Digital tools that make everyday healthcare and learning tasks simpler to use.</p>
              </div>
              <div className="glass-card rounded-2xl border border-white/60 bg-white/55 p-4 backdrop-blur-md transition-transform hover:-translate-y-1">
                <div className="glow-border" style={{ ["--glow" as string]: "#14B981" }} />
                <span className="mb-1.5 block font-[family-name:var(--font-mono)] text-[0.66rem] font-bold uppercase tracking-wider text-[#14B981]">Trajectory</span>
                <p className="text-[0.82rem] leading-relaxed text-[#5B6B7B]">Growing into a full-stack specialist in health &amp; education technology.</p>
              </div>
            </div>
          </div>

          <div data-reveal className="relative flex justify-center">
            <div className="pointer-events-none absolute -right-8 -top-10 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(47,111,237,0.18),transparent_70%)] blur-md" />

            <div className="relative w-full max-w-[360px]">
              <FlipPortrait />

              <div className="glass-card absolute -left-6 top-6 flex items-center gap-1.5 rounded-xl border border-white/70 bg-white/80 px-3.5 py-2 text-[0.68rem] font-bold text-[#14B981] shadow-lg backdrop-blur-md font-[family-name:var(--font-mono)]">
                <PulseIcon className="h-3.5 w-3.5" />
                Vitals stable
              </div>

              <div className="glass-card absolute -bottom-4 -right-4 rounded-xl border border-white/70 bg-white/80 px-3.5 py-2 text-[0.68rem] font-bold text-[#7C6FEF] shadow-lg backdrop-blur-md font-[family-name:var(--font-mono)]">
                MINISCOPE 2026 exhibitor
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* PROJECTS                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section id="projects" className="relative w-full px-[5%] py-24 scroll-mt-20 md:px-[9%]">
        <div data-reveal className="mb-10 grid grid-cols-1 items-end gap-8 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <span className="mb-2.5 block font-[family-name:var(--font-mono)] text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#2F6FED]">Selected Work</span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">Recent builds.</h2>
            <p className="mt-3 max-w-[54ch] text-[0.95rem] leading-relaxed text-[#5B6B7B]">Tap any card to open the full case — description, stack, and links to the code and live demo.</p>
          </div>
        </div>

        <div data-reveal ref={filterListRef} className="relative mb-10 inline-flex flex-wrap gap-1 rounded-full border border-[rgba(15,23,42,0.08)] bg-white/60 p-1.5 backdrop-blur-md">
          <span className="filter-underline" style={{ left: filterUnderline.left, width: filterUnderline.width }} />
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              ref={(el) => { filterRefs.current[c] = el; }}
              onClick={() => setFilter(c)}
              className={`relative z-10 rounded-full px-4 py-2 font-[family-name:var(--font-mono)] text-[0.72rem] font-bold uppercase tracking-wide transition-colors duration-300 ${filter === c ? "text-white" : "text-[#5B6B7B] hover:text-[#0B1220]"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} onOpen={handleOpenProject} index={i} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* EDUCATION                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section id="education" className="relative w-full border-y border-[rgba(15,23,42,0.06)] bg-white/40 px-[5%] py-24 backdrop-blur-sm scroll-mt-20 md:px-[9%]">
        <div data-reveal className="mb-14">
          <span className="mb-2.5 block font-[family-name:var(--font-mono)] text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#7C6FEF]">Record</span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">Education.</h2>
        </div>

        <div className="relative mx-auto max-w-[720px] pl-10">
          <svg className="absolute bottom-1 left-0 top-1 h-[calc(100%-8px)] w-8" viewBox="0 0 32 100" preserveAspectRatio="none" fill="none">
            <path d="M16 0 V26 L21 22 L25 34 L19 40 L16 36 V100" stroke="rgba(15,23,42,0.1)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path
              className="flow-line"
              d="M16 0 V26 L21 22 L25 34 L19 40 L16 36 V100"
              stroke="url(#flowGradient)"
              strokeWidth="2.5"
              strokeDasharray="14 10"
              vectorEffect="non-scaling-stroke"
            />
            <defs>
              <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2F6FED" />
                <stop offset="100%" stopColor="#14B981" />
              </linearGradient>
            </defs>
          </svg>

          {EDUCATION.map((e, i) => (
            <div key={e.title} data-reveal style={{ transitionDelay: `${i * 100}ms` }} className={`relative ${i < EDUCATION.length - 1 ? "pb-9" : ""}`}>
              <span
                className="absolute -left-10 top-0.5 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-[0_6px_16px_-4px_rgba(47,111,237,0.5)]"
                style={{ background: e.primary ? "linear-gradient(135deg,#2F6FED,#14B981)" : "#8A94A6" }}
              >
                <e.icon className="h-3.5 w-3.5" />
              </span>

              <div className="glass-card group rounded-2xl border border-white/60 bg-white/55 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/75">
                <div className="glow-border" style={{ ["--glow" as string]: e.primary ? "#2F6FED" : "#7C6FEF" }} />
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <h3 className={`font-bold ${e.primary ? "text-lg" : "text-base"}`}>{e.title}</h3>
                  {e.period && <span className="font-[family-name:var(--font-mono)] text-[0.66rem] font-bold text-[#8A94A6]">{e.period}</span>}
                </div>
                {e.primary ? (
                  <>
                    <div className="mb-0.5 text-[0.82rem] font-semibold text-[#7C6FEF]">{e.subtitle}</div>
                    <div className="text-[0.8rem] text-[#5B6B7B]">{e.institution}</div>
                  </>
                ) : (
                  <p className="text-[0.82rem] leading-relaxed text-[#5B6B7B]">{e.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SKILLS                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section id="skills" className="relative w-full px-[5%] py-24 scroll-mt-20 md:px-[9%]">
        <div data-reveal className="mb-14">
          <span className="mb-2.5 block font-[family-name:var(--font-mono)] text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#14B981]">Diagnostics</span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">Skills.</h2>
        </div>

        <div data-reveal data-reveal-group className="mb-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {SKILL_RINGS.map((r) => (
            <CircularSkill key={r.label} {...r} />
          ))}
        </div>

        <div data-reveal data-reveal-group className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SKILL_PANELS.map((panel) => (
            <div key={panel.name} className="glass-card relative rounded-2xl border border-white/60 bg-white/55 p-6 backdrop-blur-md">
              <div className="glow-border" style={{ ["--glow" as string]: panel.color }} />
              <div className="mb-4 flex items-center justify-between">
                <span className="font-[family-name:var(--font-mono)] text-[0.72rem] font-bold" style={{ color: panel.color }}>{panel.name}</span>
                <span className="rounded-full px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[0.62rem] font-bold uppercase tracking-wide" style={{ background: panel.tint, color: panel.color }}>Panel normal</span>
              </div>
              <div className="flex flex-col gap-3.5">
                {panel.skills.map((s) => (
                  <SkillReading key={s.name} skill={s} color={panel.color} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CONTACT                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section id="contact" className="relative w-full overflow-hidden bg-[#0B1220] px-[5%] pb-[90px] pt-24 text-center text-white scroll-mt-20 md:px-[9%]">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(47,111,237,0.3),transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(20,185,129,0.28),transparent_70%)] blur-2xl" />

        <div className="relative z-10 mx-auto max-w-[520px]">
          <span data-reveal className="mb-3.5 block font-[family-name:var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] text-[#7FD6B4]">Get in touch</span>
          <h2 data-reveal className="mx-auto mb-4 max-w-[18ch] font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">
            Let&apos;s build something worth <span className="bg-gradient-to-r from-[#7FD6B4] to-[#8FB4FF] bg-clip-text text-transparent">shipping</span>.
          </h2>
          <p data-reveal className="mx-auto mb-10 max-w-[44ch] text-[0.98rem] leading-relaxed text-white/60">
            Open to full-stack development, UI/UX design opportunities, and collaborations —
            reach out directly through any of the channels below.
          </p>

          <div data-reveal data-reveal-group className="mb-10 flex flex-wrap justify-center gap-3.5">
            <IconLink href="mailto:chamodilakshani474@gmail.com" label="Email">
              <MailIcon className="h-4 w-4" />
            </IconLink>
            <IconLink href="https://linkedin.com/in/chamodilakshani" label="LinkedIn">
              <LinkedinIcon className="h-4 w-4" />
            </IconLink>
            <IconLink href="https://github.com/chamodilakshani" label="GitHub">
              <GithubIcon className="h-4 w-4" />
            </IconLink>
          </div>

          <div data-reveal>
            <PrimaryButton href="mailto:chamodilakshani474@gmail.com">
              <MailIcon className="h-4 w-4" />
              Email me directly
            </PrimaryButton>
          </div>

          <footer className="mt-[70px] space-y-1 border-t border-white/10 pt-6 text-[0.78rem] text-white/40">
            <p>© {new Date().getFullYear()} Chamodi Lakshani. All rights reserved.</p>
            <p className="italic text-white/30">&quot;Creating innovative digital experiences through design, development, and continuous learning.&quot;</p>
          </footer>
        </div>
      </section>
    </main>
  );
}