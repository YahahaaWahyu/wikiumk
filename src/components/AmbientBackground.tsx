export default function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Liquid blob kiri atas */}
      <div
        className="absolute -left-24 -top-24 h-[440px] w-[480px] bg-slate-400/45 blur-[75px] dark:bg-zinc-600/30"
        style={{ animation: "liquid-morph-1 18s ease-in-out infinite alternate" }}
      />
      {/* Liquid blob kanan atas/tengah */}
      <div
        className="absolute -right-24 top-1/4 h-[400px] w-[440px] bg-white/85 blur-[70px] dark:bg-zinc-500/25"
        style={{ animation: "liquid-morph-2 22s ease-in-out infinite alternate" }}
      />
      {/* Liquid blob tengah bawah */}
      <div
        className="absolute -bottom-24 left-1/4 h-[420px] w-[460px] bg-zinc-400/40 blur-[80px] dark:bg-zinc-700/30"
        style={{ animation: "liquid-morph-3 20s ease-in-out infinite alternate" }}
      />
      {/* Liquid blob aksen halus di kanan bawah */}
      <div
        className="absolute bottom-10 right-1/4 h-[320px] w-[360px] bg-slate-300/50 blur-[75px] dark:bg-zinc-600/20"
        style={{ animation: "liquid-morph-1 25s ease-in-out infinite alternate-reverse" }}
      />
    </div>
  );
}
