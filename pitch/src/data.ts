// All figures come from research/grid-shield.html and the RTU challenge PDFs.
// Anything marked estimate there is labelled "estimate" on the slides too.

export const TEAM = {
  name: "Matrica",
  // Fill in the team members here; leave the list empty to hide the line on the closing slide.
  members: [] as { name: string; role?: string }[],
};

export type Role = "supplier-buyer" | "delivery";
export type Country = "LV" | "EE" | "LT" | "INT";

export interface Company {
  name: string;
  logo?: string; // file in public/logos; missing = text wordmark
  country: Country;
  role: Role;
  what: string;
}

export const COMPANIES: Company[] = [
  { name: "Sadales tīkls", logo: "sadales-tikls.png", country: "LV", role: "supplier-buyer", what: "Challenge owner. Cable offcuts and concrete poles in, transformer kits out." },
  { name: "AST", logo: "ast.svg", country: "LV", role: "supplier-buyer", what: "Transmission substations, grid batteries in Rēzekne and Tume." },
  { name: "Latvenergo · Elektrum Group", logo: "elektrum-group.svg", country: "LV", role: "supplier-buyer", what: "Transformers at the Daugava hydro plants and Rīga CHPs." },
  { name: "Conexus Baltic Grid", logo: "conexus.svg", country: "LV", role: "supplier-buyer", what: "Inčukalns gas storage equipment, gas regulating stations." },
  { name: "Gaso", logo: "gaso.svg", country: "LV", role: "supplier-buyer", what: "Gas distribution regulating stations." },
  { name: "LVRTC", country: "LV", role: "supplier-buyer", what: "Broadcast and radio transmitter sites." },
  { name: "Tet", country: "LV", role: "supplier-buyer", what: "Old copper networks as material, telecom nodes to protect." },
  { name: "LMT", country: "LV", role: "supplier-buyer", what: "Mobile mast equipment." },
  { name: "Tele2", country: "LV", role: "supplier-buyer", what: "Mobile mast equipment." },
  { name: "Bite", country: "LV", role: "supplier-buyer", what: "Mobile mast equipment." },
  { name: "LDz", logo: "ldz.png", country: "LV", role: "supplier-buyer", what: "Railway signalling and power cable, traction substations." },
  { name: "Elektrilevi", country: "EE", role: "supplier-buyer", what: "Estonian distribution grid: material and sites." },
  { name: "Elering", logo: "elering.svg", country: "EE", role: "supplier-buyer", what: "Estonian transmission grid and gas." },
  { name: "Telia", country: "EE", role: "supplier-buyer", what: "Copper networks being removed in Estonia and Lithuania." },
  { name: "ESO", logo: "eso.svg", country: "LT", role: "supplier-buyer", what: "Lithuanian distribution grid: material and sites." },
  { name: "Litgrid", country: "LT", role: "supplier-buyer", what: "Lithuanian transmission grid." },
  { name: "Ignitis", logo: "ignitis.svg", country: "LT", role: "supplier-buyer", what: "Lithuanian energy group, plants and renewables." },
  { name: "Energofirma Jauda", logo: "jauda.svg", country: "LV", role: "delivery", what: "Substation builder: installs and resells kits." },
  { name: "Eltel", logo: "eltel.svg", country: "INT", role: "delivery", what: "Grid contractor across the Nordics and Baltics." },
  { name: "VINCI Energies", logo: "vinci-energies.svg", country: "INT", role: "delivery", what: "Energy contractor: installs kits in projects." },
  { name: "Eco Baltia", country: "LV", role: "delivery", what: "Recycler for the insulation and metal we don't use." },
  { name: "NKT", country: "INT", role: "delivery", what: "Cable maker: take-back story for its own cables." },
  { name: "Prysmian", logo: "prysmian.png", country: "INT", role: "delivery", what: "Cable maker: take-back story for its own cables." },
  { name: "SAF Tehnika", country: "LV", role: "delivery", what: "Counter-drone detection partner." },
  { name: "Origin Robotics", country: "LV", role: "delivery", what: "Counter-drone interceptors, bundled with our passive screen." },
];

export interface Site { n: string; c: "elec" | "gas" | "tele" | "trans"; o: string; lon: number; lat: number; risk?: boolean }

// Same points as the research map. Positions approximate, to the nearest town.
export const SITES: Site[] = [
  { n: "Grid battery, Rēzekne", c: "elec", o: "AST", lon: 27.25, lat: 56.47, risk: true },
  { n: "Grid battery, Tume", c: "elec", o: "AST", lon: 23.08, lat: 56.98 },
  { n: "110 kV substation, Daugavpils", c: "elec", o: "AST / Sadales tīkls", lon: 26.53, lat: 55.88, risk: true },
  { n: "110 kV substation, Ludza", c: "elec", o: "AST / Sadales tīkls", lon: 27.72, lat: 56.55, risk: true },
  { n: "110 kV substation, Krāslava", c: "elec", o: "AST / Sadales tīkls", lon: 27.17, lat: 55.9, risk: true },
  { n: "110 kV substation, Balvi", c: "elec", o: "AST / Sadales tīkls", lon: 27.27, lat: 57.13, risk: true },
  { n: "110 kV substation, Preiļi", c: "elec", o: "AST / Sadales tīkls", lon: 26.72, lat: 56.29 },
  { n: "HPP transformers, Pļaviņas", c: "elec", o: "Latvenergo", lon: 25.24, lat: 56.62 },
  { n: "HPP transformers, Ķegums", c: "elec", o: "Latvenergo", lon: 24.72, lat: 56.74 },
  { n: "330 kV substation, Grobiņa", c: "elec", o: "AST", lon: 21.17, lat: 56.54 },
  { n: "Gas storage equipment, Inčukalns", c: "gas", o: "Conexus", lon: 24.7, lat: 57.1 },
  { n: "Broadcast transmitter, Rīga", c: "tele", o: "LVRTC", lon: 24.13, lat: 56.93 },
];

export const HUBS = [
  { n: "Rīga hub", lon: 24.11, lat: 56.95 },
  { n: "Tallinn hub", lon: 24.75, lat: 59.44 },
  { n: "Vilnius / Kaunas hub", lon: 24.6, lat: 54.8 },
];

// Six criteria scored 0-10: critical, fit, exposure, volume, safety, payer
export const OBJECTS: [string, string, number, number, number, number, number, number][] = [
  ["110/20 kV substation transformers", "AST / Sadales tīkls", 9, 8, 7, 8, 5, 9],
  ["Grid battery storage containers", "AST", 9, 9, 8, 2, 7, 9],
  ["Gas regulating and metering stations", "Conexus / Gaso", 7, 9, 6, 7, 8, 7],
  ["20/0.4 kV kiosks feeding hospitals and water", "Sadales tīkls", 6, 10, 5, 9, 8, 7],
  ["Drinking-water pumping stations", "Municipal utilities", 8, 9, 5, 8, 9, 5],
  ["Broadcast transmitter sites", "LVRTC", 8, 7, 6, 4, 7, 7],
  ["Mobile base station cabinets", "LMT / Tet / Tele2 / Bite", 7, 8, 6, 10, 8, 5],
  ["Synchronous condensers", "AST", 9, 5, 6, 2, 6, 9],
  ["Airport navigation aids", "LGS", 8, 7, 4, 3, 8, 7],
  ["Railway traction substations", "LDz", 7, 8, 6, 5, 6, 6],
  ["Small district-heating boiler houses", "Municipal", 7, 6, 5, 7, 8, 5],
  ["Data-centre cooling and generator yards", "Tet and others", 7, 8, 4, 4, 8, 7],
];

export const EU_FUNDS = [
  { n: "Latvian dual-use programme", d: "LIAA / ALTUM, EU co-financed" },
  { n: "LIFE", d: "Circular economy, material reuse" },
  { n: "Horizon Europe Cluster 3", d: "Critical infrastructure protection" },
  { n: "EIC Accelerator", d: "Grant + equity to scale" },
  { n: "Interreg Baltic Sea Region", d: "Three-country rollout" },
];

export const SOURCES = [
  ["Sadales tīkls challenge brief and stock list", "Climathon 2026 RTU materials (this repo)"],
  ["Ukraine: three levels of energy protection", "https://war.ukraine.ua/war-news/ukraine-protection-russias-attacks-energy-infrastructure/"],
  ["EIB €86M to Ukrenergo for anti-drone protection", "https://en.interfax.com.ua/news/general/1036088.html"],
  ["Ukraine netted 822 km of roads in 2025", "https://www.yahoo.com/news/world/articles/ukraine-lined-roads-enough-anti-062209532.html"],
  ["Lithuania's Gižai substation, €48M+ hardening", "https://eutoday.net/lithuania-drone-proof-harmony-link-eu-grid-security/"],
  ["AST batteries in Rēzekne and Tume", "https://www.ess-news.com/2025/10/30/latvia-adds-big-batteries-to-complete-grid-sync-with-europe-two-major-estonian-projects-secure-finance"],
  ["Anti-drone net mesh sizes and twine ratings", "https://ahcebrian.com/en/blog/passive-anti-drone-nets-explained/"],
  ["EU CER Directive, Latvian transposition", "https://www.iem.gov.lv/en/article/government-strengthens-critical-infrastructure-resilience-and-national-security"],
  ["Baltic defence and dual-use investors", "https://www.vestbee.com/insights/articles/europes-defence-and-dual-use-investors"],
  ["Full research with all sources", "research/grid-shield.html"],
];

export const CREDITS = [
  ["Cable scrap pile", "GeorgHH, CC BY-SA 4.0, Wikimedia Commons: Elektrokabelschrott 0109.jpg"],
  ["Substation before/after", "Tiia Monto, CC BY-SA 4.0, Wikimedia Commons: Milovice - transformer station.jpg. The after image is an AI edit with Qwen-Image-Edit, shared under CC BY-SA 4.0."],
  ["110/20 kV transformer", "Kreuzschnabel, CC BY-SA 3.0, Wikimedia Commons: Transformer 110 kV 20 kV.jpg"],
  ["Storm damage, Arlington", "Arlington County, CC BY-SA 2.0, Wikimedia Commons: Storm Downed power lines and trees from Storm Sandy (8138919297).jpg"],
  ["Gabion wall", "Encik Tekateki, CC0, Wikimedia Commons: Gabion Wall.jpg"],
  ["Hydraulic cable cutter", "S.J. de Waard, CC BY-SA 3.0, Wikimedia Commons: Cable cutting device.JPG"],
  ["Country outlines", "mledoze/countries (GitHub), ODbL, from Natural Earth"],
  ["Company logos", "Wikimedia Commons and the companies' own websites. Logos belong to their owners."],
  ["Explainer video", "Matrica, made with Remotion (github.com/remotion-dev/remotion)"],
];
