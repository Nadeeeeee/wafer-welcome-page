import { createFileRoute } from "@tanstack/react-router";
import { WaferSite } from "@/components/WaferSite";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Snap & Crumble — Impossibly Crisp Wafer Biscuits" },
      {
        name: "description",
        content:
          "Nine whisper-thin wafer layers, one slow-whipped cream. Scroll through four flavors of impossibly crisp wafer biscuits.",
      },
      { property: "og:title", content: "Snap & Crumble — Impossibly Crisp Wafer Biscuits" },
      {
        property: "og:description",
        content:
          "Nine whisper-thin wafer layers, one slow-whipped cream. Scroll through four flavors of impossibly crisp wafer biscuits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WaferSite,
});
