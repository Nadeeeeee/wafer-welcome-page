import { useEffect, useState } from "react";
import { WaferScene } from "@/components/WaferScene";
import { FLAVORS, SECTION_COUNT, scrollState } from "@/lib/scroll-store";

const FADE_K = 1.4;

export function WaferSite() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      scrollState.progress = p;
      setProgress(p);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const t = progress * (SECTION_COUNT - 1);
  const active = Math.min(Math.round(t), SECTION_COUNT - 1);
  const opacityFor = (i: number) => Math.max(0, 1 - Math.abs(t - i) * FADE_K);
  const shiftFor = (i: number) => (t - i) * 60;
  return (
    <div className="relative">
      {/* Fixed 3D scene behind everything */}
      <div className="fixed inset-0">
        <WaferScene />
      </div>

      {/* Scrolling DOM layer */}
      <div className="pointer-events-none relative z-10">
        <nav className="pointer-events-auto absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 sm:px-10">
          <a
            href="#section-0"
            className="font-display text-lg font-bold tracking-tight text-cocoa"
          >
            Nabati Wafers<span className="text-caramel">.</span>
          </a>
          <div className="flex items-center gap-7 text-sm font-medium text-cocoa/80">
            <a href="#section-1" className="hidden transition-colors hover:text-caramel sm:block">
              Flavors
            </a>
            <a
              href={`#section-${SECTION_COUNT - 1}`}
              className="rounded-full bg-cocoa px-4 py-2 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
            >
              Find a pack
            </a>
          </div>
        </nav>

        {/* Section progress dots */}
        <div className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
          {Array.from({ length: SECTION_COUNT }).map((_, i) => (
            <span
              key={i}
              className={`size-2 rounded-full transition-colors duration-300 ${
                i === active ? "bg-cocoa" : "bg-cocoa/25"
              }`}
            />
          ))}
        </div>

        <main>
          {/* Hero */}
          <section
            id="section-0"
            className="flex h-screen items-start justify-center px-6 pt-[14vh]"
          >
            <div
              className="max-w-2xl text-center"
              style={{ opacity: opacityFor(0), transform: `translateY(${shiftFor(0)}px)` }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-cocoa/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cocoa">
                Nabati Wafers · Six flavors
              </span>
              <h1 className="mt-5 font-display text-4xl font-black leading-[0.95] tracking-tight text-cocoa sm:text-7xl">
                Meet the crunch.
                <br />
                <em className="font-semibold italic text-caramel">Discover six bold flavors!</em>
              </h1>
              <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-cocoa/50">
                ↓ scroll
              </div>
            </div>
          </section>

          {/* Flavors */}
          {FLAVORS.map((f, idx) => {
            const i = idx + 1;
            const textRight = idx > 0 && idx % 2 === 1; // later products alternate with their copy
            return (
              <section
                key={f.id}
                id={`section-${i}`}
                className={`flex h-screen items-start px-6 sm:px-16 ${idx === 0 ? "pt-24 sm:pt-[18vh]" : "pt-28 sm:items-center sm:pt-0"}`}
              >
                <div
                  className={`mx-auto flex w-full max-w-6xl ${
                    textRight ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={idx === 0 ? "max-w-sm" : "max-w-sm"}
                    style={{ opacity: opacityFor(i), transform: `translateY(${shiftFor(i)}px)` }}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cocoa/50">
                       Flavor {String(idx + 1).padStart(2, "0")} / {String(FLAVORS.length).padStart(2, "0")}
                    </span>
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: f.accent }}
                      />
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cocoa/60">
                        {f.tag}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-cocoa sm:text-5xl">
                      {f.name}
                    </h2>
                    <p className="mt-4 text-pretty text-cocoa/70">{f.description}</p>
                  </div>
                </div>
              </section>
            );
          })}

          {/* Outro */}
           <section id={`section-${SECTION_COUNT - 1}`} className="flex h-screen items-end justify-center px-6 pb-[18vh]">
            <div
              className="text-center"
              style={{
                opacity: opacityFor(SECTION_COUNT - 1),
                transform: `translateY(${shiftFor(SECTION_COUNT - 1)}px)`,
              }}
            >
              <h2 className="font-display text-4xl font-black tracking-tight text-cocoa sm:text-6xl">
                Grab a pack.
              </h2>
              <p className="mx-auto mt-4 max-w-[40ch] text-pretty text-cocoa/70">
                 Six flavors, one impossible snap. Find us in the cookie aisle —
                or we'll bring the crunch to you.
              </p>
              <a
                href="#section-0"
                className="pointer-events-auto mt-8 inline-flex rounded-full bg-cocoa px-7 py-3 text-sm font-semibold text-cream transition-all hover:-translate-y-0.5 hover:bg-caramel"
              >
                Back to the top
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
