export interface Flavor {
  id: string;
  name: string;
  tag: string;
  description: string;
  cream: string;
  accent: string;
  bg: string;
}

export const FLAVORS: Flavor[] = [
  {
    id: "vanilla",
    name: "Vanilla Cloud",
    tag: "Classic",
    description:
      "Sun-ripe vanilla whipped into a cool, generous cream. Nine whisper-thin wafers around the classic, perfected.",
    cream: "#fff3d2",
    accent: "#e9a23b",
    bg: "#fdf3e1",
  },
  {
    id: "cocoa",
    name: "Midnight Cocoa",
    tag: "Dark & bold",
    description:
      "Deep Dutch cocoa pressed into dark chocolate wafers. Bittersweet, grown-up, and unapologetically rich.",
    cream: "#4a2c18",
    accent: "#8a5a2b",
    bg: "#f2e6d7",
  },
  {
    id: "strawberry",
    name: "Strawberry Swirl",
    tag: "Fruity",
    description:
      "Real berries folded into a blush-pink cream, layered through vanilla wafers. Bright, tart, gone too fast.",
    cream: "#f7a8b8",
    accent: "#e05a74",
    bg: "#fdecef",
  },
  {
    id: "caramel",
    name: "Salted Caramel",
    tag: "Best seller",
    description:
      "Slow-cooked caramel with a flake of sea salt, stacked in golden wafers. A long, buttery finish.",
    cream: "#e09b3d",
    accent: "#b96a1f",
    bg: "#f9ead6",
  },
];

export const SECTION_COUNT = 6;

/** Scene background tint per scroll section (hero, 4 flavors, outro). */
export const SECTION_BG: string[] = [
  "#fbf1de",
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
export const STATIONS: Station[] = [
  { pos: [0, 0, 0], cam: [0, 1.5, 6.8], look: [0, 1.15, 0] },
  { pos: [-2.4, 0, -10], cam: [0.5, 0.9, -5.4], look: [-1.1, 0.1, -10] },
  { pos: [2.4, 0, -20], cam: [-0.5, 0.9, -15.4], look: [1.1, 0.1, -20] },
  { pos: [-2.4, 0, -30], cam: [0.5, 0.9, -25.4], look: [-1.1, 0.1, -30] },
  { pos: [2.4, 0, -40], cam: [-0.5, 0.9, -35.4], look: [1.1, 0.1, -40] },
  { pos: [0, 0, -52], cam: [0, 1.4, -46], look: [0, 0.4, -52] },
];

export const smoothstep = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1);
  return t * t * (3 - 2 * t);
};
