import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import html2canvas from "html2canvas";

interface LabelData {
  name: string;
  variety: string;
  icon: string;
  sun: string;
  water: string;
  notes: string;
  color: string;
}

interface Theme {
  id: string;
  name: string;
  shell: string;
  panel: string;
  card: string;
  text: string;
  accent: string;
  glow: string;
}

const THEMES: Theme[] = [
  {
    id: "lush",
    name: "Lush Modern",
    shell: "from-slate-950 via-emerald-950 to-slate-900",
    panel: "from-white/15 to-white/5",
    card: "from-emerald-100 via-lime-50 to-cyan-100",
    text: "text-emerald-950",
    accent: "from-emerald-400 via-teal-400 to-cyan-400",
    glow: "bg-emerald-400/35",
  },
  {
    id: "sunset",
    name: "Sunset Bloom",
    shell: "from-[#170f1f] via-[#352140] to-[#1a2a3d]",
    panel: "from-white/20 to-white/5",
    card: "from-rose-100 via-amber-50 to-orange-100",
    text: "text-rose-950",
    accent: "from-rose-400 via-fuchsia-400 to-orange-300",
    glow: "bg-fuchsia-400/35",
  },
  {
    id: "night",
    name: "Midnight Neon",
    shell: "from-[#070b16] via-[#101d3b] to-[#0d1024]",
    panel: "from-white/15 to-white/0",
    card: "from-slate-100 via-indigo-50 to-cyan-50",
    text: "text-slate-900",
    accent: "from-cyan-400 via-blue-400 to-violet-400",
    glow: "bg-cyan-400/30",
  },
];

const PRESETS: { name: string; data: LabelData }[] = [
  {
    name: "🍅 Tomato",
    data: {
      name: "Cherry Tomato",
      variety: "Solanum lycopersicum",
      icon: "🍅",
      sun: "Full Sun",
      water: "Every 2-3 days",
      notes: "Support with stake. Loves rich, warm soil.",
      color: "#22c55e",
    },
  },
  {
    name: "🌿 Basil",
    data: {
      name: "Sweet Basil",
      variety: "Ocimum basilicum",
      icon: "🌿",
      sun: "Full Sun",
      water: "Every 1-2 days",
      notes: "Pinch tops often for a fuller plant.",
      color: "#10b981",
    },
  },
  {
    name: "🌻 Sunflower",
    data: {
      name: "Mammoth Sunflower",
      variety: "Helianthus annuus",
      icon: "🌻",
      sun: "Full Sun",
      water: "Every 3-5 days",
      notes: "Space generously and shelter from strong wind.",
      color: "#facc15",
    },
  },
  {
    name: "🌸 Lavender",
    data: {
      name: "English Lavender",
      variety: "Lavandula angustifolia",
      icon: "🌸",
      sun: "Full Sun",
      water: "Every 7-10 days",
      notes: "Excellent drainage keeps roots healthy.",
      color: "#a78bfa",
    },
  },
  {
    name: "🥒 Cucumber",
    data: {
      name: "Marketmore Cucumber",
      variety: "Cucumis sativus",
      icon: "🥒",
      sun: "Full Sun",
      water: "Every 2 days",
      notes: "Trellising improves airflow and fruit shape.",
      color: "#4ade80",
    },
  },
  {
    name: "🥕 Carrot",
    data: {
      name: "Nantes Carrot",
      variety: "Daucus carota",
      icon: "🥕",
      sun: "Full Sun",
      water: "Every 4-5 days",
      notes: "Loose, stone-free soil makes straight roots.",
      color: "#f59e0b",
    },
  },
];

const FLOATERS = [
  { left: "7%", top: "16%", icon: "🌿", speed: 13, delay: 0 },
  { left: "83%", top: "20%", icon: "✨", speed: 11, delay: 0.6 },
  { left: "18%", top: "72%", icon: "🍃", speed: 16, delay: 0.2 },
  { left: "72%", top: "68%", icon: "🌱", speed: 14, delay: 0.8 },
  { left: "48%", top: "10%", icon: "🪴", speed: 12, delay: 0.4 },
];

async function fetchAiTip(plant: string, variety: string) {
  const prompt = `Give one short and practical care tip for ${plant} (${variety}) that beginners can follow.`;
  const response = await fetch(
    "https://api-inference.huggingface.co/models/distilgpt2",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: prompt }),
    },
  );

  if (!response.ok) {
    throw new Error("AI service error");
  }

  const data = await response.json();
  const text =
    Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text
      : "";
  return text.replace(prompt, "").trim().replace(/^[:\-\s]+/, "");
}

function AmbientLayer() {
  return (
    <>
      <motion.div
        className="absolute -top-32 -left-16 w-[32rem] h-[32rem] rounded-full blur-3xl bg-emerald-400/25"
        animate={{ scale: [1, 1.25, 1], x: [0, 30, -10, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 right-[-8rem] w-[30rem] h-[30rem] rounded-full blur-3xl bg-cyan-400/20"
        animate={{ scale: [1, 1.15, 1], x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      {FLOATERS.map((item, index) => (
        <motion.div
          key={index}
          className="absolute pointer-events-none opacity-50 text-2xl md:text-4xl"
          style={{ left: item.left, top: item.top }}
          animate={{ y: [0, -22, 0], rotate: [0, 8, -8, 0], opacity: [0.3, 0.65, 0.3] }}
          transition={{
            duration: item.speed,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </>
  );
}

const GardenLabelMaker: React.FC = () => {
  const [label, setLabel] = useState<LabelData>(PRESETS[0].data);
  const [labelsBatch, setLabelsBatch] = useState<LabelData[]>([]);
  const [themeId, setThemeId] = useState(THEMES[0].id);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [pngLoading, setPngLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const activeTheme = useMemo(
    () => THEMES.find((theme) => theme.id === themeId) || THEMES[0],
    [themeId],
  );

  const slug = useMemo(() => {
    const next = label.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return next || "plant-label";
  }, [label.name]);

  const loadPreset = (data: LabelData) => {
    controls
      .start({
        scale: [1, 1.02, 1],
        rotate: [0, 1.5, 0],
        transition: { duration: 0.45, ease: "easeOut" },
      })
      .catch(() => undefined);
    setLabel(data);
  };

  const suggestAiTip = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const tip = await fetchAiTip(label.name, label.variety);
      if (tip) {
        setLabel((prev) => ({ ...prev, notes: tip }));
      }
    } catch {
      setAiError("Could not fetch a tip right now. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const downloadPng = async () => {
    if (!previewRef.current) return;
    setPngLoading(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `plant-label-${slug}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setPngLoading(false);
    }
  };

  const copySummary = async () => {
    const summary = `${label.icon} ${label.name} (${label.variety})\nSun: ${label.sun}\nWater: ${label.water}\nNotes: ${label.notes}`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${activeTheme.shell} text-white`}
    >
      <AmbientLayer />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <header className="mb-8 md:mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
              <Link
                to="/apps"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
              >
                <span aria-hidden>←</span> Back to apps
              </Link>
            </motion.div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/70">
              Premium Label Design Studio
            </div>
          </div>

          <motion.div
            className="mt-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
          >
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              Garden Label Maker
              <span className={`block mt-1 bg-gradient-to-r ${activeTheme.accent} bg-clip-text text-transparent`}>
                Modern, Animated, and Print-Ready
              </span>
            </h1>
            <p className="mt-3 max-w-3xl text-white/80 text-sm md:text-base leading-relaxed">
              Create labels that look great for home gardens, classrooms, plant shops, and gifts.
              Customize details, generate AI care tips, print instantly, or export polished PNG assets.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
          <motion.aside
            className={`xl:col-span-5 rounded-3xl border border-white/20 bg-gradient-to-b ${activeTheme.panel} backdrop-blur-2xl p-5 md:p-6 shadow-2xl`}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg md:text-xl font-bold">Build your label</h2>
              <button
                type="button"
                onClick={() => setLabelsBatch([])}
                className="text-xs px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
              >
                Clear batch ({labelsBatch.length})
              </button>
            </div>

            <div className="mb-5">
              <p className="text-xs uppercase tracking-wide text-white/70 mb-2">Visual themes</p>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeId(theme.id)}
                    className={`rounded-xl px-3 py-2 text-xs border transition-all ${
                      theme.id === activeTheme.id
                        ? "border-white/70 bg-white/20"
                        : "border-white/15 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs uppercase tracking-wide text-white/70 mb-2">Quick presets</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESETS.map((preset) => (
                  <motion.button
                    key={preset.name}
                    type="button"
                    onClick={() => loadPreset(preset.data)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-2 py-2 text-left"
                  >
                    <div className="text-lg">{preset.data.icon}</div>
                    <div className="text-xs text-white/90 mt-0.5">{preset.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-white/75 mb-1">Plant name</label>
                <input
                  value={label.name}
                  onChange={(event) =>
                    setLabel((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2.5 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
                  placeholder="e.g. Cherry Tomato"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-white/75 mb-1">Variety</label>
                <input
                  value={label.variety}
                  onChange={(event) =>
                    setLabel((prev) => ({ ...prev, variety: event.target.value }))
                  }
                  className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2.5 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
                  placeholder="Botanical name or cultivar"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-white/75 mb-1">Sun</label>
                  <input
                    value={label.sun}
                    onChange={(event) =>
                      setLabel((prev) => ({ ...prev, sun: event.target.value }))
                    }
                    className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2.5 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-white/75 mb-1">Water</label>
                  <input
                    value={label.water}
                    onChange={(event) =>
                      setLabel((prev) => ({ ...prev, water: event.target.value }))
                    }
                    className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2.5 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs uppercase tracking-wide text-white/75">Care notes</label>
                  <button
                    type="button"
                    onClick={suggestAiTip}
                    disabled={aiLoading}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-emerald-200/60 bg-emerald-200/20 hover:bg-emerald-200/30 disabled:opacity-60"
                  >
                    {aiLoading ? "Generating..." : "AI tip"}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={label.notes}
                  onChange={(event) =>
                    setLabel((prev) => ({ ...prev, notes: event.target.value }))
                  }
                  className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2.5 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
                />
                {aiError && <p className="mt-1 text-xs text-rose-300">{aiError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setLabelsBatch((prev) => [...prev, { ...label }])}
                  className="rounded-xl py-2.5 text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Add to batch
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-xl py-2.5 text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition-colors"
                >
                  Print
                </button>
              </div>
            </div>
          </motion.aside>

          <motion.main
            className="xl:col-span-7"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.04 }}
          >
            <div className="relative rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl p-4 md:p-6 shadow-2xl">
              <motion.div
                className={`absolute -inset-8 blur-3xl rounded-full ${activeTheme.glow}`}
                animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.08, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div animate={controls} className="relative">
                <div className="relative max-w-xl mx-auto">
                  <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-white/70 via-white/20 to-white/70 opacity-80 blur-sm" />
                  <div
                    ref={previewRef}
                    className={`relative rounded-[2rem] border border-white/60 p-7 md:p-10 bg-gradient-to-br ${activeTheme.card} ${activeTheme.text} shadow-[0_35px_90px_rgba(0,0,0,0.35)]`}
                  >
                    <div className="flex items-center justify-between mb-5 text-xs uppercase tracking-[0.18em] opacity-70">
                      <span>Plant Label Studio</span>
                      <span>{new Date().getFullYear()}</span>
                    </div>

                    <motion.div
                      className="text-7xl md:text-8xl text-center leading-none"
                      animate={{ y: [0, -3, 0], rotate: [0, 2, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {label.icon}
                    </motion.div>

                    <h2 className="mt-2 text-center text-3xl md:text-4xl font-black tracking-tight">
                      {label.name}
                    </h2>
                    <p className="text-center italic mt-1 text-sm md:text-base opacity-75">{label.variety}</p>

                    <div className="grid grid-cols-2 gap-2 mt-5">
                      <div className="rounded-xl bg-white/70 px-3 py-2 text-center text-xs md:text-sm font-semibold">
                        ☀️ {label.sun}
                      </div>
                      <div className="rounded-xl bg-white/70 px-3 py-2 text-center text-xs md:text-sm font-semibold">
                        💧 {label.water}
                      </div>
                    </div>

                    <p className="mt-4 rounded-2xl bg-white/85 p-4 text-center text-sm md:text-base leading-relaxed">
                      {label.notes}
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="relative mt-5 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={downloadPng}
                  disabled={pngLoading}
                  className="rounded-xl px-4 py-2 text-sm font-semibold border border-white/30 bg-white/15 hover:bg-white/25 transition-colors disabled:opacity-60"
                >
                  {pngLoading ? "Rendering..." : "Download PNG"}
                </button>
                <button
                  type="button"
                  onClick={copySummary}
                  className="rounded-xl px-4 py-2 text-sm font-semibold border border-white/30 bg-white/15 hover:bg-white/25 transition-colors"
                >
                  {copied ? "Copied" : "Copy care summary"}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {labelsBatch.length > 0 && (
                  <motion.div
                    key="batch"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="relative mt-6 rounded-2xl border border-white/20 bg-black/20 p-3"
                  >
                    <div className="text-xs uppercase tracking-[0.18em] text-white/70 mb-2">Batch queue</div>
                    <div className="flex flex-wrap gap-2">
                      {labelsBatch.map((item, index) => (
                        <motion.div
                          key={`${item.name}-${index}`}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-900"
                          style={{ backgroundColor: item.color }}
                          title={item.name}
                        >
                          {item.icon} {item.name}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default GardenLabelMaker;
