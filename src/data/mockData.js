// Simulated locality neighbors for DISCOM smart meter mesh
export const NEIGHBOR_HOUSES = [
  { id: 1, name: "Villa #12", street: "Oak Ridge Ln", dist: "18m", x: 42, y: 38 },
  { id: 2, name: "Apt 2B", street: "Oak Ridge Ln", dist: "25m", x: 35, y: 45 },
  { id: 3, name: "House #14", street: "Oak Ridge Ln", dist: "32m", x: 55, y: 40 },
  { id: 4, name: "Villa #16", street: "Crestview Ave", dist: "48m", x: 65, y: 32 },
  { id: 5, name: "Apt 301", street: "Green Glen", dist: "60m", x: 28, y: 55 },
  { id: 6, name: "Villa #08", street: "Green Glen", dist: "75m", x: 20, y: 62 },
  { id: 7, name: "House #21", street: "Crestview Ave", dist: "85m", x: 72, y: 25 },
  { id: 8, name: "Apt 1A", street: "Valley Way", dist: "95m", x: 48, y: 68 },
  { id: 9, name: "Villa #03", street: "Valley Way", dist: "110m", x: 58, y: 74 },
  { id: 10, name: "House #09", street: "Ridge Road", dist: "130m", x: 80, y: 45 },
  { id: 11, name: "Apt 4C", street: "Ridge Road", dist: "145m", x: 82, y: 58 },
  { id: 12, name: "Villa #27", street: "Highland Dr", dist: "160m", x: 15, y: 30 },
  { id: 13, name: "House #33", street: "Highland Dr", dist: "175m", x: 18, y: 20 },
  { id: 14, name: "Apt 102", street: "East Gate", dist: "190m", x: 38, y: 18 },
  { id: 15, name: "Villa #41", street: "East Gate", dist: "210m", x: 52, y: 15 },
  { id: 16, name: "House #05", street: "South Loop", dist: "225m", x: 70, y: 80 },
  { id: 17, name: "Apt 502", street: "South Loop", dist: "240m", x: 35, y: 82 },
  { id: 18, name: "Villa #19", street: "Pine Terrace", dist: "260m", x: 88, y: 68 },
  { id: 19, name: "House #50", street: "Pine Terrace", dist: "280m", x: 85, y: 18 },
  { id: 20, name: "Apt 6B", street: "Metro View", dist: "310m", x: 10, y: 78 }
];

// Exactly 3-4 plain-language, liability-safe MCB checks
export const SAFE_MCB_CHECKS = [
  {
    step: "1",
    title: "Light & Dry First",
    instruction: "Use your phone torch. Ensure your hands and footwear are completely dry before approaching the breaker box.",
    subtext: "Never touch metal panels in darkness or with wet hands."
  },
  {
    step: "2",
    title: "Spot the Tripped Switch",
    instruction: "Open your distribution board. Look for a switch lever that is flipped DOWN to 'OFF' or stuck in the MIDDLE.",
    subtext: "All normal operational switches point UP to 'ON'."
  },
  {
    step: "3",
    title: "Unplug High-Draw Appliances",
    instruction: "Before flipping any breaker, unplug heavy appliances on that circuit (geyser, microwave, heater, or AC).",
    subtext: "Prevents immediate re-tripping or electrical surge."
  },
  {
    step: "4",
    title: "Firm Push Down, Then UP",
    instruction: "Push the tripped lever all the way DOWN until you hear a firm click, then push it straight UP to 'ON'.",
    subtext: "If it trips again immediately, STOP. Do not force it."
  }
];

// Perishable food items for Fridge advisory
export const FRIDGE_ITEMS = [
  { name: "Fresh Milk & Yogurt", safeThresholdMin: 120, criticalThresholdMin: 240, category: "High Risk" },
  { name: "Raw Meat & Poultry", safeThresholdMin: 120, criticalThresholdMin: 240, category: "High Risk" },
  { name: "Cooked Leftovers & Rice", safeThresholdMin: 150, criticalThresholdMin: 270, category: "High Risk" },
  { name: "Opened Cheese & Butter", safeThresholdMin: 240, criticalThresholdMin: 360, category: "Moderate" },
  { name: "Condiments, Bread & Fruit", safeThresholdMin: 480, criticalThresholdMin: 720, category: "Low Risk" },
];

