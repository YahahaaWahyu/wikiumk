import HeroMarquee from "@/components/HeroMarquee";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="relative">
      {/* Toggle floating di pojok kanan atas, sama posisinya dengan navbar halaman lain */}
      <div className="absolute right-6 top-5 z-20 lg:right-[120px]">
        <ThemeToggle variant="hero" />
      </div>
      <HeroMarquee />
    </div>
  );
}
