const DAM = "https://www.zeiss.com/content/dam";
const HOME = `${DAM}/cco/reference-master/home/images/zng-corporate-home`;
const STORIES = `${DAM}/cco/reference-master/campaigns/stories`;

const heroImages: Record<string, string> = {
  ai: `${DAM}/cco/reference-master/about-us/future/research-and-technology/artificial-intelligence/images/ai_at_zeiss_key-visual_alt_3-1.jpg`,
  photonics: `${STORIES}/shaping-the-future-with-light/photonics_keyvisual.jpg`,
  sustainability: `${STORIES}/wind-power-with-precision/wind-precision-key-visual.jpg`,
};

const cardImages: Record<string, string[]> = {
  "Vision Care": [
    `${HOME}/vision-care/professionals-web.jpg`,
    `${HOME}/vision-care/consumer-web.jpg`,
    `${HOME}/vision-care/sunlens.jpg`,
  ],
  "Medical Technology": [
    `${HOME}/medical-technology/products.jpg`,
    `${HOME}/medical-technology/investors.jpg`,
    `${HOME}/medical-technology/contact.jpg`,
  ],
  "Semiconductor Manufacturing Technology": [
    `${HOME}/smt/inspiring-technology-smt_ohne-logo.jpg`,
    `${HOME}/smt/about-us-smt-zeiss-karriere.jpg`,
    `${HOME}/smt/karriere-zeiss-smt.jpg`,
  ],
  "Research & Quality Solutions": [
    `${HOME}/industrial-meteorology/iqs-systems_keyvisual.jpg`,
    `${HOME}/industrial-meteorology/metrology-shop_keyvisual.jpg`,
    `${HOME}/industrial-meteorology/zeiss-portal-metrology.jpg`,
  ],
  "Life Sciences Solutions": [
    `${HOME}/microscopy/microscopy_products.jpg`,
    `${HOME}/microscopy/software_and_digital_solutions.jpg`,
    `${HOME}/microscopy/microscopy_applications.jpg`,
  ],
  Photography: [
    `${HOME}/photography/zeiss-photography.jpg`,
    `${HOME}/cinematography/zeiss---consumer-products---service.jpg`,
    `${HOME}/cinematography/zeiss-consumer-products---find-a-dealer.jpg`,
  ],
  Cinematography: [
    `${HOME}/cinematography/zeiss-cinematography.jpg`,
    `${HOME}/cinematography/zeiss---consumer-products---service.jpg`,
    `${HOME}/cinematography/zeiss-consumer-products---find-a-dealer.jpg`,
  ],
  Hunting: [
    `${HOME}/hunting/zeiss-hunting.jpg`,
    `${HOME}/cinematography/zeiss---consumer-products---service.jpg`,
    `${HOME}/cinematography/zeiss-consumer-products---find-a-dealer.jpg`,
  ],
  "Nature Observation": [
    `${HOME}/nature-observation/zeiss-nature-observation.jpg`,
    `${HOME}/cinematography/zeiss---consumer-products---service.jpg`,
    `${HOME}/cinematography/zeiss-consumer-products---find-a-dealer.jpg`,
  ],
  "Simulation Projection Solutions": [
    `${HOME}/simulation-solutions/velvet_4k_sim_frontal.jpg`,
    `${HOME}/simulation-solutions/contact.jpg`,
  ],
  Planetariums: [
    `${HOME}/planetariums/products_velvet.jpg`,
    `${HOME}/planetariums/news.jpg`,
    `${HOME}/planetariums/kontakt_planetarien.jpg`,
  ],
  Spectroscopy: [
    `${HOME}/spectroscopy/collage_products_spc.jpg`,
    `${HOME}/spectroscopy/zeiss_spc_applications.jpg`,
    `${HOME}/cinematography/zeiss---consumer-products---service.jpg`,
  ],
  "OEM Solutions": [
    `${HOME}/oem-solutions/hightech-components.jpg`,
    `${HOME}/oem-solutions/zeiss_microoptics_key-visual.jpeg`,
    `${HOME}/oem-solutions/services.jpg`,
  ],
  "Digital Solutions": [
    `${HOME}/digital-innovation/teil1.jpg`,
    `${HOME}/digital-innovation/teil2.jpg`,
    `${HOME}/digital-innovation/teil3.jpg`,
  ],
};

const promoImages: Record<string, string> = {
  beyond: `${DAM}/cco/reference-master/about-us/future/research-and-technology/beyond-innovation/zeiss-beyond-innovation-long-term.jpg`,
  innovation: `${DAM}/cco/reference-master/about-us/future/innovation/innovation_stage.jpg`,
  about: `${DAM}/cco/reference-master/about-us/present/about-us/images/210506_zeiss-international-eyes-website-stage_4.jpg`,
};

const storyImages: Record<string, string> = {
  photonics: `${STORIES}/shaping-the-future-with-light/photonics_keyvisual.jpg`,
  "ai-trust": `${STORIES}/michele-finck/beyond-talk_michele-finck_interview-1.jpg`,
  healthcare: `${STORIES}/turning-hope-into-healing/vilma_methner_and_kathrin_baader_laughing.jpg`,
  nature: `${STORIES}/discovering-hidden-nature/hidden_nature_key-visual.jpg`,
  wind: `${STORIES}/wind-power-with-precision/wind-precision-key-visual.jpg`,
  "digital-twin": `${STORIES}/digitale-messtechnik/hansgrohe_stage_still.jpg`,
};

const newsImages: Record<string, string> = {
  duramax: `${DAM}/newsroom/pressphotos/products/industrial-metrology/2026/zeiss-duramax-855_prev.jpg`,
  illumion: `${DAM}/newsroom/pressphotos/products/zeiss-backs-illumion-s-technology_prev.jpg`,
  results: `${DAM}/cco/reference-master/home/images/portfolio_zeiss_2025.jpg`,
  euv: `${STORIES}/microchips/images/stage-microchips.jpg`,
  foundation: `${STORIES}/hydrogen-juelich/blick_ins_roentgenmikroskop_xradia_620_versa.jpg`,
  lens: `${STORIES}/myopia-in-kids/myopia_in_kids_1.jpg`,
};

const portfolioImage = `${DAM}/cco/reference-master/home/images/portfolio_zeiss_2025.jpg`;
const eventsImage = `${DAM}/cco/reference-master/about-us/present/events/images/zeiss-events.jpg`;

export { cardImages, eventsImage, heroImages, newsImages, portfolioImage, promoImages, storyImages };
