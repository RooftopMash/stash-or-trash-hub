import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { SotHomeHero } from "@/components/SotHomeHero";
import coinsWatermark from "@/assets/watermark-coins.png";
import binsWatermark from "@/assets/watermark-bins.png";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      {/* Split-screen brand watermark: gold coins (Stash) on the left, falling bins (Trash) on the right (Continuous Waterfall Rain) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="sot-watermark-rain-coins absolute inset-y-0 left-0 w-1/2 opacity-20"
          style={{
            backgroundImage: `url(${coinsWatermark})`,
            backgroundSize: "340px 340px",
            backgroundRepeat: "repeat",
            maskImage: "linear-gradient(to right, black 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, black 55%, transparent 100%)",
          }}
        />
        <div
          className="sot-watermark-rain-bins absolute inset-y-0 right-0 w-1/2 opacity-20"
          style={{
            backgroundImage: `url(${binsWatermark})`,
            backgroundSize: "340px 340px",
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
