import { useEffect, useState } from "react";
import { WaferScene } from "@/components/WaferScene";
import { FLAVORS, MORE_PRODUCTS, SECTION_COUNT, scrollState } from "@/lib/scroll-store";

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

        {/* Vertical product lineup appears after the opening. */}
        <aside
          aria-label="Wafer lineup"
          className={`pointer-events-auto fixed right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-1 border-l border-cocoa/20 pl-2 transition-opacity duration-500 sm:right-5 sm:gap-2 sm:pl-3 ${active > 0 && active < SECTION_COUNT - 1 ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          {FLAVORS.map((flavor, idx) => (
            <a
              key={flavor.id}
              href={`#section-${idx + 1}`}
              aria-label={`View ${flavor.name}`}
              aria-current={active === idx + 1 ? "step" : undefined}
              title={flavor.name}
              className={`flex size-10 items-center justify-center border-l-2 transition-all duration-300 sm:size-14 ${active === idx + 1 ? "border-caramel opacity-100" : "border-transparent opacity-45 hover:opacity-100"}`}
            >
              <img src={flavor.image} alt="" className="max-h-8 max-w-8 object-contain sm:max-h-12 sm:max-w-12" />
            </a>
          ))}
        </aside>

        <main>
          {/* Product-free opening */}
          <section
            id="section-0"
            className="flex h-screen items-start justify-center px-6 pt-[14vh]"
          >
            <div
              className="max-w-2xl text-center"
              style={{ opacity: opacityFor(0), transform: `translateY(${shiftFor(0)}px)` }}
            >
              <h1 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-cocoa sm:text-6xl">
                Meet the crunch.
                <br />
                <em className="font-semibold italic text-caramel">Discover fun flavors!</em>
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
                    className="max-w-sm"
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
                    <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-cocoa sm:text-4xl">
                      {f.name}
                    </h2>
                    <p className="mt-4 text-pretty text-cocoa/70">{f.description}</p>
                  </div>
                </div>
              </section>
            );
          })}

          {/* Entire range, including the three newly added products */}
           <section id={`section-${SECTION_COUNT - 1}`} className="flex min-h-screen items-center justify-center px-4 py-20 sm:px-10">
            <div
               className="mx-auto w-full max-w-5xl text-center"
              style={{
                opacity: opacityFor(SECTION_COUNT - 1),
                transform: `translateY(${shiftFor(SECTION_COUNT - 1)}px)`,
              }}
            >
               <h2 className="font-display text-3xl font-bold text-cocoa sm:text-5xl">
                 Ready to explore more?
              </h2>
               <div className="mt-6 grid grid-cols-3 items-end gap-x-2 gap-y-5 sm:mt-10 sm:gap-x-6 sm:gap-y-8">
                 {[...FLAVORS, ...MORE_PRODUCTS].map((product) => (
                   <div key={product.id} className="flex min-w-0 flex-col items-center justify-end gap-2">
                     <div className="flex h-20 w-full items-center justify-center sm:h-36">
                       <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain drop-shadow-md" />
                     </div>
                     <span className="text-center text-[10px] font-semibold leading-tight text-cocoa sm:text-sm">{product.name}</span>
                   </div>
                 ))}
               </div>
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
