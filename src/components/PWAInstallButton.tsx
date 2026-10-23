import { useState } from "react";
import { Download, Smartphone, X } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Button } from "@/components/ui/button";

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide the button
  if (isInstalled) {
    return null;
  }

  // Android / Windows / Desktop / Chrome flow
  if (isInstallable) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => void install()}
        className="h-8 shrink-0 gap-1.5 border-[#d6a928]/40 bg-[#d6a928]/10 text-xs font-bold text-slate-900 hover:bg-[#d6a928]/20 dark:text-[#d6a928]"
        title="Install SOrT App to Home Screen"
      >
        <Download className="h-3.5 w-3.5 text-[#d6a928]" />
        <span className="hidden sm:inline">Install App</span>
      </Button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowIOSGuide(true)}
          className="h-8 shrink-0 gap-1.5 border-[#d6a928]/40 bg-[#d6a928]/10 text-xs font-bold text-slate-900 hover:bg-[#d6a928]/20 dark:text-[#d6a928]"
          title="Install SOrT on iPhone or iPad"
        >
          <Smartphone className="h-3.5 w-3.5 text-[#d6a928]" />
          <span className="hidden sm:inline">Get App</span>
        </Button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d6a928]/20 text-[#d6a928]">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Install on iPhone / iPad
                  </h3>
                  <p className="text-xs text-slate-500">Run full-screen without app store limits</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <p className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    1
                  </span>
                  <span>
                    Tap the <strong>Share</strong> button at the bottom of Safari.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    2
                  </span>
                  <span>
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    3
                  </span>
                  <span>
                    Tap <strong>Add</strong> in the top-right corner to launch SOrT as a native app!
                  </span>
                </p>
              </div>

              <Button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full bg-slate-950 font-bold text-[#d6a928] hover:bg-slate-900"
              >
                Got It
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
