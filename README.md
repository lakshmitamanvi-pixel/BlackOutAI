# BlackOut AI — 11 PM Panic Assistant ⚡

A mobile-first, responsive single-page React web application designed for **11 PM panic use**: pitch-black room, extreme stress, arm's length readability (minimum 24px text, dark OLED `#0F172A` background, strictly constrained amber/red/green status palette).

---

## 🎯 The 3 Core Screens

### 1. Verdict (Home) — Full-Screen Immersive Diagnostic Card
- **Neutral State**: `POWER OK` (idle mains power, all neighborhood circuits live).
- **Yellow State**: `HOUSE FAULT: only you. Check MCB.` — Isolated internal breaker trip. Includes a 1-tap button opening the **Safe Steps** modal.
- **Red State**: `GRID FAULT: 14 nearby also dark. DISCOM notified.` — Sector blackout. Displays auto-ticket ID `#DSC-88219-AUTO`, lineworker dispatch status, and restoration ETA.
- **Interactive Pitch Slider**: `"Simulate Neighbours Dark (0-20)"` dynamically drives the grid vs. house fault verdict during a live pitch, complete with 1-tap quick presets (`Power OK`, `House (0 Dark)`, `Grid (14 Dark)`).

### 2. Fridge — Food Safety & Thermal Dial
- **Big Dial / Timer Display**: Circular SVG progress gauge displaying `"Above 5°C: 47 min"` with live thermal rise calculations.
- **Giant Single-Word Verdict**: `KEEP` (Green) / `EAT TODAY` (Amber) / `DISCARD` (Red).
- **Advisory Pill**: Clearly marks guidance as `"Advisory Only"`.
- **Interactive Controls**: Outage duration slider and door opening counter (`+1 Door Open` penalizes cold reserve by ~15 min).

### 3. Map — Simulated Locality Outage Heatmap
- **Simulated Label**: Prominently marked `"Simulated"` as the core DISCOM pitch visual.
- **20 Dynamic Locality Nodes**: Synced in real-time with the Neighbours Dark slider.
- **Feeder Topology**: Substation 11kV Feeder #09 spine connecting to user's meter (`YOU • #402`).
- **Node Inspector**: Tap on any neighbor to inspect address, distance, and live phase status.

---

## 🛡️ "Safe Steps" MCB Modal (1-Tap)
- **1. Light & Dry First**: Use phone torch, ensure hands and footwear are completely dry.
- **2. Spot the Tripped Switch**: Identify the breaker lever pointing down to 'OFF' or stuck in the middle.
- **3. Unplug High-Draw Appliances**: Disconnect heavy loads before resetting.
- **4. Firm Reset**: Push firmly down to reset the internal latch, then push straight up to 'ON'.
- **Mandatory Safety Caution**: *"Call an electrician if unsure; avoid risky electrical work."*

---

## 🔦 Extra Panic Perks
- **Emergency Screen Torch**: 1-tap maximum brightness pure white lantern mode to walk safely in the dark.
- **Keyboard Shortcuts**: `1` (Verdict), `2` (Fridge), `3` (Map), `T` (Torch), `M` (MCB Modal), `Esc` (Close).

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Custom OLED palette & glow effects)
- **Icons**: Lucide React
- **Typography**: Inter & JetBrains Mono

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```
