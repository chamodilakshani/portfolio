"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Fraunces, Manrope, Space_Mono } from "next/font/google";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                      */
/*  Theme: "Case File" — a health-informatics-flavoured hybrid of a   */
/*  clinical chart and a field dossier. Paper ground, ink type, one    */
/*  signal-red accent for the flagship, folder-tab colour coding for   */
/*  navigation and structure.                                          */
/*                                                                      */
/*  --paper   #FAF8F3   background                                     */
/*  --ink     #171B1A   primary text                                   */
/*  --ink-60  #55625C   secondary text                                 */
/*  --line    #DEDACE   hairlines / borders                            */
/*  --pine    #24504A   primary accent (structure, links)               */
/*  --pine-10 #E4ECE9   pine tint                                       */
/*  --signal  #E14A20   flagship / CTA accent                           */
/*  --signal-10 #FBE3D8 signal tint                                     */
/*  --amber   #B9860F   tertiary accent (tags)                          */
/*  --amber-10 #F5EAD2  amber tint                                      */
/*  --navy    #12181B   dark contrast section                           */
/* ------------------------------------------------------------------ */

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

/* ------------------------------------------------------------------ */
/*  DATA                                                                */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  { id: "about", label: "About", code: "CF·00" },
  { id: "projects", label: "Projects", code: "CF·01" },
  { id: "education", label: "Education", code: "CF·02" },
  { id: "contact", label: "Contact", code: "CF·03" },
] as const;

type Project = {
  id: string;
  code: string;
  accent: "signal" | "pine" | "amber" | "navy";
  monogram: string;
  title: string;
  tagline: string;
  description: string;
  role?: string;
  features?: string[];
  stack?: string[];
  highlights?: string[];
  achievement?: string;
  /**
   * Path to a real screenshot, e.g. "/projects/codeplay.png".
   * Drop an image into /public/projects and set this field —
   * until then, a labelled placeholder frame renders instead so
   * every project keeps the same visual weight.
   */
  image?: string;
  /** Replace with the real repo URL. Leave undefined to hide the button. */
  github?: string;
  /** Replace with the real live URL. Leave undefined to hide the button. */
  demo?: string;
};

const ACCENTS: Record<
  Project["accent"],
  { fg: string; bg: string; tint: string; border: string }
> = {
  signal: { fg: "#E14A20", bg: "#E14A20", tint: "#FBE3D8", border: "#F3C3AC" },
  pine: { fg: "#24504A", bg: "#24504A", tint: "#E4ECE9", border: "#BFD3CD" },
  amber: { fg: "#8A6208", bg: "#B9860F", tint: "#F5EAD2", border: "#E3CB93" },
  navy: { fg: "#12181B", bg: "#12181B", tint: "#E7E8E9", border: "#C7CACC" },
};

// Each project deliberately carries the same shape of information
// (tagline, description, points, stack) so no single card reads as
// more "important" than another — image placeholders reinforce that.
const PROJECTS: Project[] = [
  {
    id: "codeplay",
    code: "CF-01",
    accent: "signal",
    monogram: "</>",
    title: "CodePlay",
    tagline: "Teaches kids to code through short, gamified challenges.",
    description:
      "An interactive platform that turns programming lessons into structured, bite-sized challenges with visible progress — built so kids build momentum instead of hitting a wall of syntax on day one. I designed and built the product end to end, from the database schema to the session logic to the dashboard a student sees when they log back in.",
    role: "Full-stack developer — schema, API, and UI",
    features: [
      "Interactive lessons broken into short, structured challenges",
      "Progress-tracking dashboard with visible milestones",
      "JWT-based session handling for signed-in learners",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
    achievement:
      "Exhibited live at MINISCOPE 2026 — an IT & Biomedical Innovation Exhibition — presented to industry judges and visitors.",
    image: "/codeplay.jpg",
    github: "https://github.com/yourusername/codeplay",
    demo: "https://codeplay-demo.vercel.app",
  },
  {
    id: "learntrack",
    code: "CF-02",
    accent: "pine",
    monogram: "LT",
    title: "LearnTrack Pro",
    tagline: "A learning management system built around a calendar.",
    description:
      "A modern LMS with a built-in calendar system and a student dashboard, designed for a clean, distraction-free view of upcoming coursework rather than a buried list of assignments. The interface prioritises what's due next and keeps everything else out of the way.",
    highlights: ["Student dashboard", "Built-in calendar", "Coursework tracking"],
    image: "/projects/learntrack.png",
    
  },
  {
    id: "mobile-store",
    code: "CF-03",
    accent: "amber",
    monogram: "MA",
    title: "Mobile Accessories Store",
    tagline: "An e-commerce catalog built to feel fast on any screen.",
    description:
      "An e-commerce site with a full product catalog and shopping layout, built so browsing stays quick and legible whether it's opened on a phone in a shop aisle or a desktop at home. The layout was the focus: predictable grids, clear pricing, and minimal friction between browsing and checkout.",
    highlights: ["Full product catalog", "Responsive layout", "Shopping flow"],
    image: "/gizmo.jpeg",
   
  },
  {
    id: "secure-login",
    code: "CF-04",
    accent: "navy",
    monogram: "SL",
    title: "Secure Login System",
    tagline: "Backend authentication, built from the ground up.",
    description:
      "A backend authentication architecture built with PHP and MySQL, covering registration, session handling, and database integration. No auth-as-a-service — the point of the project was understanding exactly what happens between a submitted password and a valid session.",
    role: "Backend developer",
    stack: ["PHP", "MySQL"],
    highlights: ["Registration", "Session handling", "Database integration"],
    image: "/projects/secure-login.png",
    github: "https://github.com/yourusername/secure-login-system",
    // No live demo for this one — it's a backend-only system, so the button is simply omitted.
  },
];

/* ------------------------------------------------------------------ */
/*  SMALL PRIMITIVES                                                    */
/* ------------------------------------------------------------------ */

function EkgLine({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      className={`ekg-draw ${className}`}
      viewBox="0 0 400 40"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 20 H130 L145 6 L160 34 L172 20 H210 L222 12 L234 28 L246 20 H400"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PrimaryButton({
  children,
  href,
  onClick,
  download,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  download?: boolean;
}) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      download={download}
      className="btn-primary group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#E14A20] px-6 py-3.5 text-[0.86rem] font-bold text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E14A20]"
    >
      <span className="btn-shine" aria-hidden="true" />
      <span className="relative z-10">{children}</span>
      <svg
        className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Tag>
  );
}

function SecondaryButton({
  children,
  onClick,
  href,
  target,
}: {
  children: React.ReactNode;
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
      className="btn-secondary relative inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#171B1A] px-6 py-3.5 text-[0.86rem] font-bold text-[#171B1A] transition-all duration-300 hover:-translate-y-0.5 hover:text-[#FAF8F3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171B1A]"
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Tag>
  );
}

function GhostLink({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="ghost-link relative inline-flex items-center gap-1.5 py-3.5 text-[0.86rem] font-bold text-[#E14A20]">
      {children}
      <span className="ghost-underline" aria-hidden="true" />
    </button>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-label={label}
      className="icon-link group relative flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-[0.85rem] font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#E14A20] hover:bg-[#E14A20]"
    >
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/15">
        {children}
      </span>
      {label}
    </a>
  );
}

function GithubIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2a8 8 0 00-2.53 15.6c.4.07.55-.17.55-.38v-1.5c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.9-1.17-.9-1.17-.73-.5.06-.5.06-.5.82.06 1.25.84 1.25.84.72 1.24 1.9.88 2.36.67.07-.53.28-.88.5-1.08-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.58.82-2.14-.08-.2-.36-1.02.08-2.13 0 0 .67-.22 2.2.82a7.5 7.5 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.27.82 2.14 0 3.07-1.88 3.75-3.66 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0010 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function LiveDemoIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6.5 4.5H4.5a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 2.5H13.5V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 9L13.3 2.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  PROJECT CARD (compact — image + name only) + DETAIL POPUP           */
/* ------------------------------------------------------------------ */

function CardImage({ project }: { project: Project }) {
  const a = ACCENTS[project.accent];
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !project.image || failed;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      {!showPlaceholder && (
        <Image
          src={project.image as string}
          alt={`${project.title} — project screenshot`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
          onError={() => setFailed(true)}
        />
      )}

      {showPlaceholder && (
        <div
          className="relative flex h-full w-full flex-col items-center justify-center gap-2"
          style={{ background: `linear-gradient(150deg, ${a.tint}, #fff)` }}
        >
          <span className="placeholder-stripes pointer-events-none absolute inset-0" style={{ color: a.border }} />
          <span
            className="relative z-10 font-[family-name:var(--font-display)] text-4xl font-bold italic transition-transform duration-500 group-hover:scale-110"
            style={{ color: a.fg }}
          >
            {project.monogram}
          </span>
        </div>
      )}

      {/* code tag, top-left corner */}
      <span
        className="absolute left-2.5 top-2.5 rounded-md px-2 py-1 font-[family-name:var(--font-mono)] text-[0.6rem] font-bold uppercase tracking-wide text-white"
        style={{ background: a.bg }}
      >
        {project.code}
      </span>
    </div>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const a = ACCENTS[project.accent];
  return (
    <button
      data-reveal
      onClick={() => onOpen(project)}
      className="case-card group relative flex flex-col overflow-hidden rounded-2xl border bg-white text-left transition-all duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ borderColor: a.border }}
    >
      <CardImage project={project} />
      <div className="flex items-center justify-between gap-2 px-3.5 py-3">
        <h3 className="font-[family-name:var(--font-display)] text-[0.98rem] font-bold leading-tight text-[#171B1A]">
          {project.title}
        </h3>
        <svg
          className="h-3.5 w-3.5 flex-shrink-0 text-[#8A9490] transition-transform duration-300 group-hover:translate-x-0.5"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
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
      className="modal-overlay fixed inset-0 z-[200] flex items-center justify-center bg-[#12181B]/70 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-panel relative w-full max-w-[640px] overflow-hidden rounded-[26px] bg-[#FAF8F3] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white font-[family-name:var(--font-mono)] sm:px-8"
          style={{ background: a.bg }}
        >
          <span>{project.code} · Case File</span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
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
            <h2 id="modal-title" className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#171B1A]">
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
                    <LiveDemoIcon className="relative z-10 h-3.5 w-3.5" />
                    Live demo
                  </PrimaryButton>
                )}
              </div>
            )}

            <p className="mt-6 text-[0.95rem] leading-relaxed text-[#55625C]">{project.description}</p>

            {project.role && (
              <div className="mt-6 border-l-2 pl-4" style={{ borderColor: a.bg }}>
                <span className="block font-[family-name:var(--font-mono)] text-[0.66rem] font-bold uppercase tracking-[0.1em] text-[#8A9490]">
                  Role
                </span>
                <span className="text-[0.92rem] font-semibold text-[#171B1A]">{project.role}</span>
              </div>
            )}

            {points.length > 0 && (
              <div className="mt-6">
                <span className="mb-2.5 block font-[family-name:var(--font-mono)] text-[0.66rem] font-bold uppercase tracking-[0.1em] text-[#8A9490]">
                  Highlights
                </span>
                <ul className="space-y-2">
                  {points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-[0.88rem] leading-relaxed text-[#33403A]">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: a.bg }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.stack && (
              <div className="mt-6">
                <span className="mb-2.5 block font-[family-name:var(--font-mono)] text-[0.66rem] font-bold uppercase tracking-[0.1em] text-[#8A9490]">
                  Built with
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border font-[family-name:var(--font-mono)] px-2.5 py-1.5 text-[0.76rem] font-semibold text-[#33403A]"
                      style={{ borderColor: a.border }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.achievement && (
              <div
                className="mt-7 flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-[0.85rem] leading-relaxed"
                style={{ background: a.tint, borderColor: a.border, color: "#3A2A20" }}
              >
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
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const handleOpenProject = useCallback((p: Project) => setOpenProject(p), []);
  const handleCloseProject = useCallback(() => setOpenProject(null), []);

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

    const revealEls = document.querySelectorAll("[data-reveal]");
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

    return () => {
      sectionObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = 84;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setMenuOpen(false);
  };

  const accentFor = (id: string) => {
    if (id === "about") return "#E14A20";
    if (id === "projects") return "#24504A";
    if (id === "education") return "#B9860F";
    return "#12181B";
  };

  return (
    <main
      className={`${display.variable} ${body.variable} ${mono.variable} relative w-full min-h-screen bg-[#FAF8F3] text-[#171B1A] overflow-x-hidden font-[family-name:var(--font-body)]`}
    >
      <style jsx global>{`
        @keyframes drawEkg {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes shine {
          0% {
            transform: translateX(-120%) skewX(-12deg);
          }
          100% {
            transform: translateX(220%) skewX(-12deg);
          }
        }
        .ekg-draw path {
          stroke-dasharray: 460;
          stroke-dashoffset: 460;
          animation: drawEkg 1.8s ease-out 0.3s forwards;
        }
        [data-reveal] {
          opacity: 0;
          transform: translateY(22px);
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
        [data-reveal-group].is-visible > * {
          opacity: 1;
          transform: translateY(0);
        }
        [data-reveal-group].is-visible > *:nth-child(1) { transition-delay: 0.04s; }
        [data-reveal-group].is-visible > *:nth-child(2) { transition-delay: 0.1s; }
        [data-reveal-group].is-visible > *:nth-child(3) { transition-delay: 0.16s; }
        [data-reveal-group].is-visible > *:nth-child(4) { transition-delay: 0.22s; }

        .placeholder-stripes {
          background-image: repeating-linear-gradient(
            135deg,
            currentColor 0,
            currentColor 1.5px,
            transparent 1.5px,
            transparent 14px
          );
          opacity: 0.4;
        }

        .btn-shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 30%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
          transform: translateX(-120%) skewX(-12deg);
        }
        .btn-primary:hover .btn-shine {
          animation: shine 0.9s ease forwards;
        }
        .btn-primary {
          box-shadow: 0 12px 28px -10px rgba(225, 74, 32, 0.55);
        }
        .btn-secondary::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: #171B1A;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
          z-index: 0;
        }
        .btn-secondary:hover::before {
          transform: scaleX(1);
        }
        .ghost-underline {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 10px;
          height: 2px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }
        .ghost-link:hover .ghost-underline {
          transform: scaleX(1);
          transform-origin: left;
        }
        .case-card {
          box-shadow: 0 1px 0 rgba(0,0,0,0.02);
        }
        .case-card:hover {
          box-shadow: 0 16px 32px -16px rgba(23, 27, 26, 0.25);
        }
        .modal-overlay {
          animation: fadeIn 0.2s ease;
        }
        .modal-panel {
          animation: popIn 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.2);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal], [data-reveal-group] > *, .ekg-draw path, .modal-overlay, .modal-panel {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
            stroke-dashoffset: 0 !important;
          }
        }
      `}</style>

      {openProject && <ProjectModal project={openProject} onClose={handleCloseProject} />}

      {/* ---------------------------------------------------------------- */}
      {/* NAV — folder-tab index                                           */}
      {/* ---------------------------------------------------------------- */}
      <header className="fixed top-0 left-0 z-[100] w-full border-b border-[#DEDACE] bg-[#FAF8F3]/85 backdrop-blur-md">
        <nav className="flex h-[76px] items-center justify-between px-[5%] md:px-[9%]">
          <button
            onClick={() => scrollToSection("about")}
            className="flex items-center gap-2.5 font-[family-name:var(--font-display)] text-[1.15rem] font-bold italic tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#171B1A] text-[0.68rem] font-[family-name:var(--font-mono)] font-bold not-italic">
              CL
            </span>
            Chamodi Lakshani
          </button>

          <ul className="hidden items-center md:flex">
            {SECTIONS.map((s) => (
              <li key={s.id} className="relative">
                <button
                  onClick={() => scrollToSection(s.id)}
                  className="group relative flex flex-col items-center px-4 py-2 font-[family-name:var(--font-mono)] text-[0.72rem] font-bold uppercase tracking-wider text-[#55625C] transition-colors hover:text-[#171B1A]"
                >
                  <span
                    className="mb-1 rounded px-1.5 py-0.5 text-white opacity-0 transition-opacity"
                    style={{
                      background: accentFor(s.id),
                      opacity: activeSection === s.id ? 1 : 0,
                    }}
                  >
                    {s.code}
                  </span>
                  <span style={{ color: activeSection === s.id ? accentFor(s.id) : undefined }}>{s.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <SecondaryButton onClick={() => scrollToSection("contact")}>Let&apos;s talk</SecondaryButton>
          </div>

          <button onClick={() => setMenuOpen((v) => !v)} aria-label="Open menu" className="flex flex-col gap-1.5 p-2 md:hidden">
            <span className="h-0.5 w-5 rounded-full bg-[#171B1A]" />
            <span className="h-0.5 w-5 rounded-full bg-[#171B1A]" />
            <span className="h-0.5 w-5 rounded-full bg-[#171B1A]" />
          </button>
        </nav>

        {menuOpen && (
          <div className="flex flex-col border-b border-[#DEDACE] bg-white px-[5%] pb-5 pt-2 shadow-lg md:hidden">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className="border-b border-[#EDEAE0] py-3.5 text-left font-[family-name:var(--font-mono)] text-sm font-bold text-[#55625C] last:border-none"
              >
                <span style={{ color: accentFor(s.id) }}>{s.code}</span> · {s.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* ABOUT / HERO                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section id="about" className="flex min-h-screen w-full items-center px-[5%] pb-20 pt-[130px] scroll-mt-20 md:px-[9%]">
        <div className="grid w-full grid-cols-1 items-center gap-14 md:grid-cols-[1.05fr_0.8fr]">
          {/* Left column */}
          <div>
            <span data-reveal className="mb-4 inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#E14A20]">
              File No. 2026-CL &nbsp;·&nbsp; Status: Active
            </span>

            <h1 data-reveal className="mb-3 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight md:text-[3.6rem]">
              Building where <span className="italic text-[#24504A]">healthcare</span> meets <span className="italic text-[#E14A20]">code</span>.
            </h1>

            <div data-reveal className="mb-5 h-8 w-[220px] text-[#24504A]">
              <EkgLine />
            </div>

            <p data-reveal className="mb-6 max-w-[54ch] text-[1.02rem] leading-[1.75] text-[#55625C]">
              I&apos;m a full-stack developer and UI/UX designer studying Health Information &amp;
              Communication Technology. I started in graphic design and now write production
              code — I care about interfaces that stay clear under pressure, and systems that
              hold up past the demo.
            </p>

            <div data-reveal className="mb-9 flex flex-wrap items-center gap-3">
              <PrimaryButton href="/cv.pdf" download>
                Download CV
              </PrimaryButton>
              <SecondaryButton onClick={() => scrollToSection("projects")}>View Projects</SecondaryButton>
              <GhostLink onClick={() => scrollToSection("contact")}>Contact me</GhostLink>
            </div>

            <div data-reveal data-reveal-group className="grid max-w-[540px] grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#DEDACE] bg-white p-4 transition-transform hover:-translate-y-1">
                <span className="mb-1.5 block font-[family-name:var(--font-mono)] text-[0.66rem] font-bold uppercase tracking-wider text-[#24504A]">
                  Focus
                </span>
                <p className="text-[0.82rem] leading-relaxed text-[#55625C]">
                  Digital tools that make everyday healthcare and learning tasks simpler to use.
                </p>
              </div>
              <div className="rounded-2xl border border-[#DEDACE] bg-white p-4 transition-transform hover:-translate-y-1">
                <span className="mb-1.5 block font-[family-name:var(--font-mono)] text-[0.66rem] font-bold uppercase tracking-wider text-[#E14A20]">
                  Trajectory
                </span>
                <p className="text-[0.82rem] leading-relaxed text-[#55625C]">
                  Growing into a full-stack specialist in health &amp; education technology.
                </p>
              </div>
            </div>
          </div>

          {/* Right column — portrait */}
          <div data-reveal className="relative flex justify-center">
            <div className="pointer-events-none absolute -right-8 -top-10 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#E4ECE9,transparent_70%)] blur-md" />

            <div className="relative w-full max-w-[360px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[50px] border-4 border-white shadow-2xl">
                <Image src="/pose-about.png" alt="Portrait of Chamodi Lakshani" fill className="object-cover" priority sizes="360px" />
              </div>

              <div className="absolute -left-5 top-6 flex items-center gap-1.5 rounded-xl border border-[#DEDACE] bg-white px-3.5 py-2 text-[0.68rem] font-bold text-[#24504A] shadow-lg font-[family-name:var(--font-mono)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#24504A] opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#24504A]" />
                </span>
                Open to opportunities
              </div>

              <div className="absolute -bottom-4 -right-4 rounded-xl border border-[#F3C3AC] bg-[#FBE3D8] px-3.5 py-2 text-[0.68rem] font-bold text-[#E14A20] shadow-lg font-[family-name:var(--font-mono)]">
                MINISCOPE 2026 exhibitor
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* PROJECTS — small image-first cards, click for full case file     */}
      {/* ---------------------------------------------------------------- */}
      <section id="projects" className="w-full border-y border-[#DEDACE] bg-[#F3F1E9] px-[5%] py-24 scroll-mt-20 md:px-[9%]">
        <div data-reveal className="mb-12 grid grid-cols-1 items-end gap-8 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <span className="mb-2.5 block font-[family-name:var(--font-mono)] text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#E14A20]">
              CF·01 — Selected Work
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">
              Four case files.
            </h2>
            <p className="mt-3 max-w-[54ch] text-[0.95rem] leading-relaxed text-[#55625C]">
              Tap any card to open the full record — description, stack, and links to the code
              and live demo.
            </p>
          </div>

          
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={handleOpenProject} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* EDUCATION                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section id="education" className="w-full px-[5%] py-24 scroll-mt-20 md:px-[9%]">
        <div data-reveal className="mb-12">
          <span className="mb-2.5 block font-[family-name:var(--font-mono)] text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#B9860F]">
            CF·02 — Record
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">
            Education &amp; skills.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-14 md:grid-cols-[0.68fr_1fr]">
          {/* Portrait + timeline */}
          <div data-reveal className="flex flex-col gap-7">
            <div className="relative aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-[24px] border-4 border-white shadow-xl">
              <Image src="/pose-projects.png" alt="Chamodi Lakshani holding a tablet" fill className="object-cover" sizes="300px" />
            </div>

            <div className="relative pl-7">
              <div className="absolute bottom-1.5 left-[5px] top-1.5 w-0.5 bg-[#DEDACE]" />

              <div className="relative pb-8">
                <span className="absolute -left-7 top-1 h-3 w-3 rounded-full bg-[#B9860F] shadow-[0_0_0_5px_#F5EAD2]" />
                <h3 className="mb-1 text-lg font-bold">Bachelor of Health Science (Honours)</h3>
                <div className="mb-0.5 text-[0.82rem] font-semibold text-[#B9860F]">
                  Health Information &amp; Communication Technology
                </div>
                <div className="text-[0.8rem] text-[#8A9490]">Gampaha Wickramaarachchi University of Indigenous Medicine</div>
              </div>

              <div className="relative">
                <span className="absolute -left-7 top-1 h-3 w-3 rounded-full bg-[#8A9490] shadow-[0_0_0_5px_#F3F1E9]" />
                <h3 className="mb-1 text-base font-bold">Diploma in Graphic Design</h3>
                <p className="text-[0.82rem] leading-relaxed text-[#8A9490]">
                  Branding, typography, and Adobe Photoshop &amp; Illustrator — the foundation for
                  a design-first approach to development.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-7 top-1 h-3 w-3 rounded-full bg-[#8A9490] shadow-[0_0_0_5px_#F3F1E9]" />
                <h3 className="mb-1 text-base font-bold">Diploma in English</h3>
                <p className="text-[0.82rem] leading-relaxed text-[#8A9490]">
                  Branding, typography, and Adobe Photoshop &amp; Illustrator — the foundation for
                  a design-first approach to development.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-7 top-1 h-3 w-3 rounded-full bg-[#8A9490] shadow-[0_0_0_5px_#F3F1E9]" />
                <h3 className="mb-1 text-base font-bold">Certificate in Full Stack Web Development</h3>
                <p className="text-[0.82rem] leading-relaxed text-[#8A9490]">
                  Branding, typography, and Adobe Photoshop &amp; Illustrator — the foundation for
                  a design-first approach to development.
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div data-reveal data-reveal-group>
            <div className="mb-3.5 rounded-2xl border border-[#DEDACE] bg-white p-5">
              <span className="mb-2.5 block font-[family-name:var(--font-mono)] text-[0.7rem] font-bold text-[#24504A]">
                LANGUAGES &amp; FRONTEND
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["HTML5", "CSS3", "JavaScript", "PHP", "Java", "SQL", "React.js", "Bootstrap", "Tailwind CSS", "Figma"].map((s) => (
                  <span key={s} className="rounded-lg bg-[#F3F1E9] px-2.5 py-1.5 text-[0.78rem] text-[#33403A]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-3.5 rounded-2xl border border-[#DEDACE] bg-white p-5">
              <span className="mb-2.5 block font-[family-name:var(--font-mono)] text-[0.7rem] font-bold text-[#E14A20]">
                BACKEND &amp; TOOLS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["Node.js", "Express.js", "REST APIs", "MongoDB", "MySQL", "Docker", "Postman", "Git", "GitHub"].map((s) => (
                  <span key={s} className="rounded-lg bg-[#F3F1E9] px-2.5 py-1.5 text-[0.78rem] text-[#33403A]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#12181B] p-5 text-white">
              <span className="mb-2 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[0.7rem] font-bold text-[#F0975A]">
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L9.5 6H14.5L10.5 9L12 14L8 11L4 14L5.5 9L1.5 6H6.5L8 1Z" fill="currentColor" />
                </svg>
                CURRENTLY LEARNING
              </span>
              <p className="m-0 text-[0.85rem] leading-relaxed text-[#D8DAF0]">
                Advanced React.js, Next.js, cloud computing, DevOps fundamentals, UI animation,
                and AI integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CONTACT                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section id="contact" className="relative w-full overflow-hidden bg-[#12181B] px-[5%] pb-[90px] pt-24 text-center text-white scroll-mt-20 md:px-[9%]">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(225,74,32,0.25),transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(36,80,74,0.35),transparent_70%)]" />

        <div className="relative z-10">
          <span data-reveal className="mb-3.5 block font-[family-name:var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] text-[#F0975A]">
            CF·03 — Close the file
          </span>
          <h2 data-reveal className="mx-auto mb-4 max-w-[18ch] font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">
            Let&apos;s build something worth <span className="italic text-[#F0975A]">shipping</span>.
          </h2>
          <p data-reveal className="mx-auto mb-9 max-w-[44ch] text-[0.98rem] leading-relaxed text-[#B7BAB6]">
            Open to full-stack development, UI/UX design opportunities, and collaborations.
          </p>

          <div data-reveal data-reveal-group className="mb-[70px] flex flex-wrap justify-center gap-3.5">
            <IconLink href="mailto:chamodilakshani474@gmail.com" label="chamodilakshani474@gmail.com">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                <path d="M3 5h14a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" />
                <path d="M2.5 6l7.5 5.5L17.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </IconLink>
            <IconLink href="https://linkedin.com/in/chamodilakshani" label="LinkedIn">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                <path d="M4 8v8M4 4.5v.01M8.5 16V8m0 3c0-2 1.5-3 3-3s3 1 3 3v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </IconLink>
            <IconLink href="https://github.com/chamodilakshani" label="GitHub">
              <GithubIcon className="h-4 w-4" />
            </IconLink>
          </div>

          <footer className="space-y-1 border-t border-white/10 pt-6 text-[0.78rem] text-[#8488AC]">
            <p>© {new Date().getFullYear()} Chamodi Lakshani. All rights reserved.</p>
            <p className="italic text-[#6B6F92]">
              &quot;Creating innovative digital experiences through design, development, and
              continuous learning.&quot;
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}