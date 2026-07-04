export const TIER = {
  FEATURED: "featured",
  LISTED: "listed",
  HIDDEN: "hidden",
};

export const projects = [
  {
    id: "learning-hub",
    path: "/sentence-starters",
    label: "Tom's Learning Hub",
    description:
      "Reading and writing tools for elementary students — sentence starters, word highlighting, and guided writing.",
    category: "Education",
    tier: TIER.FEATURED,
    featuredOrder: 1,
    external: false,
    tech: ["React", "Tailwind"],
  },
  {
    id: "simply-math",
    path: "/math",
    label: "SimplyMathHW",
    description: "Printable math worksheet generator for Grades 1–2.",
    category: "Education",
    tier: TIER.FEATURED,
    featuredOrder: 2,
    external: false,
    tech: ["React"],
  },
  {
    id: "javascript-ide",
    path: "/JavaScriptIDE",
    label: "JavaScript IDE",
    description: "In-browser code editor with live preview for quick experiments.",
    category: "Development",
    tier: TIER.FEATURED,
    featuredOrder: 3,
    external: false,
    tech: ["React", "JavaScript"],
  },
  {
    id: "spirit-quest",
    path: "/games/spirit-quest",
    label: "Spirit Quest: Spirit Sword",
    description: "Turn-based RPG with skill trees, equipment, and persistent saves.",
    category: "Games",
    tier: TIER.FEATURED,
    featuredOrder: 4,
    external: false,
    tech: ["React", "Framer Motion"],
  },
  {
    id: "truly-private-chat",
    path: "/tpc/home",
    label: "Truly Private Chat",
    description: "Peer-to-peer messaging with no central server storing your conversations.",
    category: "Communication",
    tier: TIER.FEATURED,
    featuredOrder: 5,
    external: false,
    tech: ["React", "PeerJS"],
  },
  {
    id: "plant-label-studio",
    path: "/label-maker",
    label: "Plant Label Studio",
    description: "Design and export printable plant labels for gardens and classrooms.",
    category: "Utility",
    tier: TIER.FEATURED,
    featuredOrder: 6,
    external: false,
    tech: ["React", "TypeScript", "html2canvas"],
  },
  {
    id: "progress-tracker",
    path: "/progress-tracker",
    label: "Progress Tracker",
    description: "Track project milestones with authentication and a dashboard view.",
    category: "Productivity",
    tier: TIER.FEATURED,
    featuredOrder: 7,
    external: false,
    tech: ["React", "PHP"],
  },
  {
    id: "forest-platformer",
    path: "/games/forest-platformer",
    label: "Forest Platformer",
    description: "Side-scrolling platformer with custom canvas physics and pixel art.",
    category: "Games",
    tier: TIER.LISTED,
    featuredOrder: null,
    external: false,
    tech: ["React", "Canvas"],
  },
  {
    id: "myrepbro",
    path: "http://www.myrepbro.com",
    label: "MyRepBro",
    description: "Workout and fitness tracking web app for gym enthusiasts.",
    category: "Health",
    tier: TIER.LISTED,
    featuredOrder: null,
    external: true,
    tech: ["React", "PHP", "MySQL"],
  },
  {
    id: "meal-tracker",
    path: "/meal-tracker",
    label: "Meal Tracking Guru",
    description: "Calorie and macro tracking utility.",
    category: "Health",
    tier: TIER.HIDDEN,
    featuredOrder: null,
    external: false,
    tech: ["React"],
  },
  {
    id: "simplydo",
    path: "/simplydo",
    label: "SimplyDo",
    description: "Simple to-do list with text export.",
    category: "Productivity",
    tier: TIER.HIDDEN,
    featuredOrder: null,
    external: false,
    tech: ["React"],
  },
  {
    id: "birthday-invitation-maker",
    path: "/birthday-invitation-maker",
    label: "Birthday Invitation Maker",
    description: "Custom printable birthday invitations.",
    category: "Utility",
    tier: TIER.HIDDEN,
    featuredOrder: null,
    external: false,
    tech: ["React"],
  },
  {
    id: "osrs-wilderness",
    path: "/osrs-wilderness",
    label: "OSRS Wilderness Helper",
    description: "Old School RuneScape wilderness guide.",
    category: "Gaming",
    tier: TIER.HIDDEN,
    featuredOrder: null,
    external: false,
    tech: ["React"],
  },
  {
    id: "grow-app",
    path: "/grow-app",
    label: "Grow App",
    description: "Personal growth tracker demo.",
    category: "Productivity",
    tier: TIER.HIDDEN,
    featuredOrder: null,
    external: false,
    tech: ["React"],
  },
];

export function getFeaturedProjects() {
  return projects
    .filter((p) => p.tier === TIER.FEATURED)
    .sort((a, b) => a.featuredOrder - b.featuredOrder);
}

export function getListedProjects() {
  return projects.filter((p) => p.tier === TIER.LISTED);
}

export function getVisibleProjects() {
  return projects.filter(
    (p) => p.tier === TIER.FEATURED || p.tier === TIER.LISTED,
  );
}

export function getProjectsByCategory(category) {
  return getVisibleProjects().filter((p) => p.category === category);
}

export function searchVisibleProjects(query) {
  const q = query.trim().toLowerCase();
  if (!q) return getVisibleProjects();
  return getVisibleProjects().filter(
    (p) =>
      p.label.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tech.some((t) => t.toLowerCase().includes(q)),
  );
}
