type IconName =
  | "eye"
  | "cross"
  | "chip"
  | "gear"
  | "microscope"
  | "aperture"
  | "target"
  | "projector"
  | "prism"
  | "screen";

type Division = { name: string; teaser: string; cards: string[] };

type DivisionGroup = {
  value: string;
  icon: IconName;
  headline: string;
  divisions: Division[];
};

const divisionGroups: DivisionGroup[] = [
  {
    value: "vision",
    icon: "eye",
    headline: "See better",
    divisions: [
      {
        name: "Vision Care",
        teaser:
          "Lenses, instruments and services that help people see clearly every day.",
        cards: [
          "Eye care professionals",
          "Consumer – nobody sees like you",
          "Plano lenses for sun protection",
        ],
      },
      {
        name: "Extended Reality",
        teaser:
          "Vision correction built into XR devices, so headsets fit every pair of eyes.",
        cards: [],
      },
    ],
  },
  {
    value: "medical",
    icon: "cross",
    headline: "Diagnose & treat",
    divisions: [
      {
        name: "Medical Technology",
        teaser:
          "Solutions for ophthalmology, microsurgery and dentistry that improve patient outcomes.",
        cards: ["Products & solutions", "Investors", "Contact"],
      },
    ],
  },
  {
    value: "smt",
    icon: "chip",
    headline: "Enabling chip manufacturers",
    divisions: [
      {
        name: "Semiconductor Manufacturing Technology",
        teaser:
          "Optics and systems that make the most advanced microchips possible.",
        cards: ["Inspiring technology", "About SMT", "Career at ZEISS SMT"],
      },
    ],
  },
  {
    value: "rqs",
    icon: "gear",
    headline: "Quality & Research",
    divisions: [
      {
        name: "Research & Quality Solutions",
        teaser:
          "Measuring, inspection and microscopy systems for industry and research.",
        cards: [
          "Systems & software",
          "Industrial Metrology Shop",
          "ZEISS Portal",
        ],
      },
    ],
  },
  {
    value: "life-sciences",
    icon: "microscope",
    headline: "Microscopy Solutions & End-to-End Workflows",
    divisions: [
      {
        name: "Life Sciences Solutions",
        teaser:
          "From sample to insight: microscopes, software and workflows for the life sciences.",
        cards: [
          "Microscopy Solutions",
          "Software & Digital Solutions",
          "Applications & Workflows",
        ],
      },
    ],
  },
  {
    value: "photo",
    icon: "aperture",
    headline: "Photograph & film",
    divisions: [
      {
        name: "Photography",
        teaser:
          "Lenses that bring out every detail, from landscapes to portraits.",
        cards: [
          "Products for photography",
          "Service & contact",
          "Dealer search",
        ],
      },
      {
        name: "Cinematography",
        teaser: "Cine lenses trusted on film sets around the world.",
        cards: [
          "Products for cinematography",
          "Service & contact",
          "Dealer and rental search",
        ],
      },
    ],
  },
  {
    value: "observe",
    icon: "target",
    headline: "Observe & experience",
    divisions: [
      {
        name: "Hunting",
        teaser:
          "Riflescopes, binoculars and rangefinders for every hunting situation.",
        cards: ["Products for hunting", "Service & contact", "Dealer search"],
      },
      {
        name: "Nature Observation",
        teaser: "Binoculars and spotting scopes for birding and nature.",
        cards: [
          "Products for nature observation",
          "Service & contact",
          "Dealer search",
        ],
      },
    ],
  },
  {
    value: "virtual",
    icon: "projector",
    headline: "Create virtual worlds",
    divisions: [
      {
        name: "Simulation Projection Solutions",
        teaser: "Projection systems for flight and driving simulators.",
        cards: ["ZEISS VELVET 4K SIM Projector", "Contact"],
      },
      {
        name: "Planetariums",
        teaser:
          "Star projectors and fulldome systems for planetariums worldwide.",
        cards: ["Planetarium Technology", "News", "Contact"],
      },
    ],
  },
  {
    value: "develop",
    icon: "prism",
    headline: "Develop & produce",
    divisions: [
      {
        name: "Spectroscopy",
        teaser:
          "Spectrometer systems, modules and optical gratings for industry and research.",
        cards: [
          "Spectrometer systems, modules and optical gratings",
          "Applications & industries",
          "Service & support",
        ],
      },
      {
        name: "OEM Solutions",
        teaser:
          "High-tech optical components built into our partners' products.",
        cards: ["Hightech components", "Microoptics", "Services OEM Solutions"],
      },
    ],
  },
  {
    value: "digital",
    icon: "screen",
    headline: "Digital impact engineering",
    divisions: [
      {
        name: "Digital Solutions",
        teaser:
          "Software and data platforms that connect ZEISS technology end to end.",
        cards: ["Industries", "Expertise", "Your advantage"],
      },
    ],
  },
];

const heroSlides = [
  {
    id: "ai",
    eyebrow: "Artificial Intelligence at ZEISS",
    title: "Visionary minds. Enhanced by AI",
    cta: "Learn more about AI at ZEISS",
    tone: "ai",
  },
  {
    id: "photonics",
    eyebrow: "Innovation at ZEISS",
    title: "Shaping the future with light",
    cta: "Discover photonics at ZEISS",
    tone: "photonics",
  },
  {
    id: "sustainability",
    eyebrow: "Sustainability at ZEISS",
    title: "Responsibility for future generations",
    cta: "Read our sustainability strategy",
    tone: "sustainability",
  },
];

const promos = [
  { id: "beyond", kicker: "Initiative", title: "Beyond Innovation" },
  {
    id: "innovation",
    kicker: "Innovation at ZEISS",
    title: "Shaping the future with technology",
  },
  { id: "about", kicker: "About ZEISS", title: "What drives us" },
];

type Topic = "innovation" | "digitalization" | "sustainability";

const topics: { value: Topic; label: string }[] = [
  { value: "innovation", label: "Innovation" },
  { value: "digitalization", label: "Digitalization" },
  { value: "sustainability", label: "Sustainability" },
];

const stories: { id: string; topic: Topic; title: string }[] = [
  {
    id: "photonics",
    topic: "innovation",
    title:
      "Shaping the future with light: What photonics makes possible at ZEISS",
  },
  {
    id: "ai-trust",
    topic: "digitalization",
    title: "Data, trust, and human-centered AI",
  },
  {
    id: "healthcare",
    topic: "innovation",
    title: "Enabling healthcare innovation",
  },
  {
    id: "nature",
    topic: "sustainability",
    title: "Nature protection begins with knowledge",
  },
  {
    id: "wind",
    topic: "sustainability",
    title:
      "Wind power with precision: how ZEISS technologies are driving the growth of renewable energies",
  },
  {
    id: "digital-twin",
    topic: "digitalization",
    title: "Digital twins in the measuring room",
  },
];

const news = [
  {
    id: "duramax",
    date: "19 November 2026",
    title:
      "ZEISS DuraMax 8/5/5 expands the possibilities for shop floor quality assurance",
  },
  {
    id: "illumion",
    date: "28 October 2026",
    title:
      "ZEISS invests in Illumion to support next-generation battery imaging technology",
  },
  {
    id: "results",
    date: "15 October 2026",
    title: "ZEISS Group reports results for the fiscal year",
  },
  {
    id: "euv",
    date: "2 October 2026",
    title: "High-NA EUV optics reach volume production milestone",
  },
  {
    id: "foundation",
    date: "18 September 2026",
    title: "Carl Zeiss Foundation funds new research in quantum sensing",
  },
  {
    id: "lens",
    date: "4 September 2026",
    title: "New ZEISS SmartLife lens portfolio launches in 30 countries",
  },
];

const events = [
  {
    id: "salon",
    name: "Salon Matériaux 2026",
    date: "18 – 20 November 2026",
    place: "Grenoble",
    about:
      "Trade fair for materials science and characterization. Meet our microscopy experts at booth B12.",
  },
  {
    id: "carrefour",
    name: "Carrefour Pathologie 2026",
    date: "18 – 20 November 2026",
    place: "La Défense",
    about:
      "Congress for pathology. See digital slide scanning and AI-assisted analysis.",
  },
  {
    id: "aao",
    name: "AAO 2026",
    date: "9 – 11 December 2026",
    place: "Orlando",
    about:
      "Annual meeting of the American Academy of Ophthalmology, with ZEISS surgical workflows on show.",
  },
];

const areas = [
  "ZEISS Group",
  ...divisionGroups.flatMap((group) =>
    group.divisions.map((division) => division.name),
  ),
];

const websites = [
  "Global website (English)",
  "Deutschland (Deutsch)",
  "France (Français)",
  "日本 (日本語)",
  "United States (English)",
];

export {
  areas,
  divisionGroups,
  events,
  heroSlides,
  news,
  promos,
  stories,
  topics,
  websites,
};
export type { IconName, Topic };
