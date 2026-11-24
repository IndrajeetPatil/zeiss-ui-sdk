const SHOP = "https://shop.zeiss.com";
const PNO = "https://www.zeiss.com/content/dam/pno/images/nature-observation";
const rendition = (path: string, size: string) => {
  const file = path.split("/").pop();
  return `${path}/_jcr_content/renditions/original.image_file.${size}.file/${file}`;
};

type Camera = {
  slug: string;
  name: string;
  subtitle: string;
  number: string;
  price: number;
  fieldOfView: 60 | 100;
  frontDisplay: boolean;
  removableBattery: boolean;
  image: string;
};

const cameras: Camera[] = [
  {
    slug: "secacam-1",
    name: "ZEISS Secacam 1",
    subtitle: "The essential observer",
    number: "SC-000-110-60",
    price: 99.99,
    fieldOfView: 60,
    frontDisplay: false,
    removableBattery: false,
    image: `${SHOP}/thumbnail/5b/ef/d6/1771949466/1-zeiss-secacam-1-hero-png_280x280.png?ts=1771949467`,
  },
  {
    slug: "secacam-3",
    name: "ZEISS Secacam 3",
    subtitle: "The innovative observer",
    number: "SC-000-130-60",
    price: 149.99,
    fieldOfView: 60,
    frontDisplay: true,
    removableBattery: true,
    image: `${SHOP}/thumbnail/29/af/21/1771948560/1600x1600-zs3-antenne-abgeschraubt-rechts-jpg_280x280.jpg?ts=1771948560`,
  },
  {
    slug: "secacam-3-wide-angle",
    name: "ZEISS Secacam 3 Wide-Angle",
    subtitle: "The wide-ranging observer",
    number: "SC-000-130-100",
    price: 149.99,
    fieldOfView: 100,
    frontDisplay: true,
    removableBattery: true,
    image: `${SHOP}/thumbnail/cc/d9/af/1773154082/1-zeiss-secacam-3-wa-hero-jpg_280x280.jpg?ts=1773154083`,
  },
  {
    slug: "secacam-5-wide-angle",
    name: "ZEISS Secacam 5 Wide-Angle",
    subtitle: "The compact & wide-ranging observer",
    number: "SC-000-150-100",
    price: 199.99,
    fieldOfView: 100,
    frontDisplay: false,
    removableBattery: true,
    image: `${SHOP}/thumbnail/3a/b3/23/1780406646/1-zeiss-secacam-5-wa-hero-png_280x280.png?ts=1780406648`,
  },
  {
    slug: "secacam-5",
    name: "ZEISS Secacam 5",
    subtitle: "The compact observer",
    number: "SC-000-150-60",
    price: 199.99,
    fieldOfView: 60,
    frontDisplay: false,
    removableBattery: true,
    image: `${SHOP}/thumbnail/d2/ff/96/1771950753/1-zeiss-secacam-5-hero-png_280x280.png?ts=1771950754`,
  },
  {
    slug: "secacam-7",
    name: "ZEISS Secacam 7",
    subtitle: "The professional observer",
    number: "SC-000-170-60",
    price: 249.99,
    fieldOfView: 60,
    frontDisplay: true,
    removableBattery: true,
    image: `${SHOP}/thumbnail/af/5b/9a/1780409891/1-zeiss-secacam-7-hero-png_280x280.png?ts=1780409892`,
  },
];

const wideAngleGallery = [
  "cc/d9/af/1773154082/1-zeiss-secacam-3-wa-hero-jpg",
  "3d/bc/27/1773154083/2-zeiss-secacam-3-wa-open-jpg",
  "b8/35/76/1773154083/3-zeiss-secacam-3-wa-packshot-jpg",
  "6c/76/e1/1773154084/4-zeiss-secacam-3-wa-mounting-jpg",
  "b1/35/56/1773154084/5-zeiss-secacam-3-wa-usage-jpg",
  "c6/70/bb/1773154086/6-zeiss-secacam-3-wa-usage-jpg",
  "ed/02/b0/1773154086/8-zeiss-secacam-3-wa-tree-jpg",
  "1b/84/12/1773154087/9-zeiss-secacam-3-wa-regen-jpg",
].map((path) => `${SHOP}/thumbnail/${path}_800x800.jpg`);

const wideAngleSpecs: [string, string][] = [
  ["Image format", "16:9"],
  ["Resolution of photos sent", "1920 x 1440 px"],
  ["Sensor resolution", "3 MP (up to 24 MP interpolated)"],
  ["Coverage area", "up to 20 m"],
  ["Field of view", "100° angle"],
  ["Response time", "< 0.35 – 0.45 s"],
  ["Flash range", "ca. 10 m"],
  ["Number of LEDs", "60 Black LEDs (940 nm)"],
  ["Display size", '42 mm x 24 mm (1.90")'],
  ["Front display for alignment", "Yes"],
  ["Storage", "up to 32 GB internal memory"],
  ["Connections", "USB C"],
  ["Mobile network standard", "LTE / 4G"],
  ["Dimensions (HxWxD)", "143 mm x 85 mm x 85 mm"],
  ["Protection rating", "IP66"],
  ["Removable battery compartment", "Yes"],
  ["Weight", "445 g"],
];

const accessories = [
  {
    name: "ZEISS Secacam Power Pack",
    price: 69.99,
    image: `${SHOP}/thumbnail/8b/67/7d/1771948368/zpp-b-hero-jpg_280x280.jpg?ts=1771948369`,
  },
  {
    name: "ZEISS Secacam 3 metal casing",
    price: 49.99,
    image: `${SHOP}/thumbnail/cf/08/78/1771948330/metallgehaeuse-zsc3-b-hero-jpg_280x280.jpg?ts=1771948331`,
  },
  {
    name: "ZEISS Solar Panel Mini",
    price: 89.99,
    image: `${SHOP}/thumbnail/18/02/53/1771948578/1-zeiss-solar-panel-mini-hero-png_280x280.png?ts=1771948579`,
  },
  {
    name: "ZEISS cable lock with key",
    price: 34.99,
    image: `${SHOP}/thumbnail/7a/91/ea/1771949335/1-zeiss-cablelock-hero-2-png_280x280.png?ts=1771949338`,
  },
  {
    name: "ZEISS Solar Panel Pro",
    price: 129.99,
    image: `${SHOP}/thumbnail/51/5e/b9/1771948601/solar-panel-pro-hero-png_280x280.png?ts=1771948603`,
  },
  {
    name: "ZEISS Vari Mount",
    price: 39.99,
    image: `${SHOP}/thumbnail/88/f4/ec/1771948387/varimount-b-hero-jpg_280x280.jpg?ts=1771948388`,
  },
  {
    name: "ZEISS Secacam 4G Antenna",
    price: 16.99,
    image: `${SHOP}/thumbnail/11/4e/9d/1771946912/1-zeiss-secacam-4g-antenne-heroshot-png_ff7cb05d6f2e18e5_280x280.png?ts=1771946913`,
  },
  {
    name: "ZEISS Secacam tree harness (2x)",
    price: 11.99,
    image: `${SHOP}/media/be/1c/35/1771946950/1-zeiss-secacam-baumgurt-heroshot-png_f3d457c34def071b.png?ts=1783667341`,
  },
];

const trailCameraModels = [
  {
    name: "ZEISS Secacam 1",
    tagline: "The essential observer.",
    fov: "60°",
    range: "up to 25 m",
    sensor: "3 MP (up 24 MP interpolated)",
    features: ["Integrated Memory", "Test Image Button", "Fast & Easy Set-up"],
    isNew: true,
    image: rendition(
      `${PNO}/products/trail-cameras/_products/zeiss-secacam-1.jpg`,
      "360.270",
    ),
  },
  {
    name: "ZEISS Secacam 3",
    tagline: "The allround observer.",
    fov: "60° − 100°*",
    range: "up to 25 m",
    sensor: "3 MP (up 24 MP interpolated)",
    features: [
      'Hinged 1.9" Display',
      "Fast & Easy Setup",
      "Low-power Data Processing",
    ],
    isNew: false,
    image: rendition(
      `${PNO}/products/trail-cameras/_products/zeiss-secacam-3.jpg`,
      "360.270",
    ),
  },
  {
    name: "ZEISS Secacam 5",
    tagline: "The compact observer.",
    fov: "60° − 100°*",
    range: "up to 25 m",
    sensor: "5 MP (up 12 MP interpolated)",
    features: [
      "Wide-Angle Version Available",
      "Small and Compact",
      "Plug and Play Functionality",
    ],
    isNew: false,
    image: rendition(
      `${PNO}/products/trail-cameras/_products/zeiss-secacam-5.jpg`,
      "360.270",
    ),
  },
  {
    name: "ZEISS Secacam 7",
    tagline: "The professional observer.",
    fov: "60°",
    range: "up to 25 m",
    sensor: "5 MP (up 12 MP interpolated)",
    features: [
      "Simple Maintenance",
      "Reliable App-Connectivity",
      "Built to Withstand the Elements",
    ],
    isNew: false,
    image: rendition(
      `${PNO}/products/trail-cameras/_products/zeiss-secacam-7.jpg`,
      "360.270",
    ),
  },
];

const pnoImages = {
  natureHero: rendition(
    `${PNO}/_home/stage/zeiss-nature-observation-stage.jpg`,
    "1440.480",
  ),
  productsTile: rendition(
    `${PNO}/_home/teaser/zeiss-nature-observation-products.jpg`,
    "1024.576",
  ),
  cooperationsTile: rendition(
    `${PNO}/_home/teaser/zeiss-nature-observation-cooperations.jpg`,
    "768.576",
  ),
  productsHero: rendition(
    `${PNO}/products/_stage/zeiss-nature-observation-products-stage.jpg`,
    "1440.480",
  ),
  binoculars: rendition(
    `${PNO}/products/_products/zeiss-binoculars.jpg`,
    "768.384",
  ),
  spottingScopes: `${PNO}/products/spotting-scopes/conquest-apia/teaser/zeiss_apia_nature_teaser.jpg/_jcr_content/renditions/original.image_file.768.432.0,0,6182,3479.file/zeiss_apia_nature_teaser.jpg`,
  trailCameras: rendition(
    `${PNO}/products/_products/zeiss-trail-cameras.jpg`,
    "768.384",
  ),
  monoculars: `${PNO}/products/_products/zeiss-monoculars.jpg/_jcr_content/renditions/original.image_file.768.384.0,120,3840,2040.file/zeiss-monoculars.jpg`,
  trailHero: rendition(
    `${PNO}/products/trail-cameras/_stage/zeiss-trail-cameras-stage.jpg`,
    "1440.480",
  ),
  accessories: rendition(
    `${PNO}/products/trail-cameras/_products/zeiss-trail-cameras-accessories.jpg`,
    "768.432",
  ),
};

const shopImages = {
  promo: `${SHOP}/media/cb/e7/6d/1794814129/1920x200%20EN%20EUR%20GBP%201.jpg?ts=1794814129`,
};

const SHIPPING = 0;
const VAT_RATE = 0.19;

function formatPrice(value: number) {
  return `€${value.toFixed(2)}*`;
}

export {
  SHIPPING,
  VAT_RATE,
  accessories,
  cameras,
  formatPrice,
  pnoImages,
  shopImages,
  trailCameraModels,
  wideAngleGallery,
  wideAngleSpecs,
};
export type { Camera };
