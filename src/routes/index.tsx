import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { SotHomeHero } from "@/components/SotHomeHero";
import coinsWatermark from "@/assets/watermark-coins.png";
import binsWatermark from "@/assets/watermark-bins.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      {/* Split-screen brand watermark: gold coins (Stash) on the left, falling bins (Trash) on the right */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 w-1/2 opacity-[0.07]"
          style={{
            backgroundImage: `url(${coinsWatermark})`,
            backgroundSize: "320px 320px",
            backgroundRepeat: "repeat",
            maskImage: "linear-gradient(to right, black 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, black 55%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2 opacity-[0.07]"
          style={{
            backgroundImage: `url(${binsWatermark})`,
            backgroundSize: "320px 320px",
            backgroundRepeat: "repeat",
            maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, black 55%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <Header />
        <SotHomeHero />
      </div>
    </div>
  );
}
