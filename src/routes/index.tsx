import { createFileRoute } from "@tanstack/react-router";
import { WaferSite } from "@/components/WaferSite";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Richese & Richoco — Discover Six Wafer Flavors" },
      {
        name: "description",
        content:
          "Explore six Richese, Richoco, and Nabati wafer packs in a scroll-driven product showcase, led by creamy cheese.",
      },
      { property: "og:title", content: "Richese & Richoco — Discover Six Wafer Flavors" },
      {
        property: "og:description",
        content:
          "Explore six Richese, Richoco, and Nabati wafer packs in a scroll-driven product showcase, led by creamy cheese.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WaferSite,
});
