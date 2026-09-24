import cheeseAsset from "@/assets/products/richese-cheese.png.asset.json";
import strawberryAsset from "@/assets/products/richese-strawberry-cheesecake.png.asset.json";
import sweetPotatoAsset from "@/assets/products/gogumalava-sweet-potato.png.asset.json";
import chocolateAsset from "@/assets/products/richoco-chocolate.png.asset.json";
import milkVanillaAsset from "@/assets/products/richoco-milk-vanilla.png.asset.json";
import cookiesCreamAsset from "@/assets/products/richoco-cookies-cream.png.asset.json";

export interface Flavor {
  id: string;
  name: string;
  tag: string;
  description: string;
  cream: string;
  accent: string;
  bg: string;
  image: string;
}

export const FLAVORS: Flavor[] = [
  {
    id: "cheese",
    name: "Creamy Cheese",
    tag: "Richese · Signature",
    description:
      "Crisp golden wafers layered with bold, creamy cheese — the unmistakable Richese original.",
    cream: "#f5b51b",
    accent: "#ee2029",
    bg: "#fff4b8",
    image: cheeseAsset.url,
  },
  {
    id: "strawberry-cheesecake",
    name: "Strawberry Cheese Cake",
    tag: "Richese · Fruity",
    description:
      "Sweet strawberry cheesecake cream tucked between crisp golden wafer layers.",
    cream: "#f083a9",
    accent: "#e6192b",
    bg: "#fde2ec",
    image: strawberryAsset.url,
  },
  {
    id: "gogumalava",
    name: "Gogumalava",
    tag: "Nabati · Korean Goguma",
    description:
      "A playful Korean sweet potato wafer with silky cream and vivid purple crunch.",
    cream: "#eee5cf",
    accent: "#7b43b3",
    bg: "#eee4fa",
    image: sweetPotatoAsset.url,
  },
  {
    id: "chocolate",
    name: "Chocolate",
    tag: "Richoco · Classic",
    description:
      "Chocolate wafers and smooth cocoa cream for a deep, satisfying chocolate bite.",
    cream: "#5b2c18",
    accent: "#9a5e16",
    bg: "#f2dfcb",
    image: chocolateAsset.url,
  },
  {
    id: "milk-vanilla",
    name: "Milk Vanilla",
    tag: "Richoco · Creamy",
    description:
      "Golden wafers filled with light milk-vanilla cream for a mellow, familiar crunch.",
    cream: "#fff4d7",
    accent: "#e3a70c",
    bg: "#fff3c7",
    image: milkVanillaAsset.url,
  },
  {
    id: "cookies-cream",
    name: "Cookies & Cream",
    tag: "Richoco · Crunchy",
    description:
      "Dark cookie wafers meet smooth white cream in a crisp cookies-and-cream stack.",
    cream: "#f5f2e9",
    accent: "#17499d",
    bg: "#dfe9fa",
    image: cookiesCreamAsset.url,
  },
];

export const SECTION_COUNT = FLAVORS.length + 2;

/** Scene background tint per scroll section (hero, 4 flavors, outro). */
export const SECTION_BG: string[] = [
  FLAVORS[0]?.bg ?? "#fff4b8",
  ...FLAVORS.map((f) => f.bg),
  "#fbf1de",
];

/** Shared scroll progress, 0..1 across the whole page. Written by the DOM side, read per frame in the scene. */
export const scrollState = { progress: 0 };

export interface Station {
  pos: [number, number, number];
  cam: [number, number, number];
  look: [number, number, number];
}

/**
 * Camera + product stations along the scroll path.
 * Hero stack at origin, four flavors alternating left/right, outro trio last.
 * The look point is offset from the product so it sits on one side of the
 * frame and the DOM copy can own the other side.
 */
export const STATIONS: Station[] = Array.from({ length: SECTION_COUNT }, (_, index) => {
  const z = index === SECTION_COUNT - 1 ? -(index * 10 + 2) : -index * 10;
  const side = index > 0 && index < SECTION_COUNT - 1 ? (index % 2 ? -2.2 : 2.2) : 0;
  return {
    pos: [side, 0, z],
    cam: [side === 0 ? 0 : -side * 0.2, 1.15, z + 7.2],
    look: [side * 0.55, 0.1, z],
  };
});

export const smoothstep = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1);
  return t * t * (3 - 2 * t);
};
