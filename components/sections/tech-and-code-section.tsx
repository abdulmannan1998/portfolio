"use client";

import { Variant1CommandCenter } from "./variants/variant-1-command-center";
import { Variant2AsymmetricPanels } from "./variants/variant-2-asymmetric-panels";
import { Variant3NewspaperEditorial } from "./variants/variant-3-newspaper-editorial";
import { Variant4DashboardTiles } from "./variants/variant-4-dashboard-tiles";
import { Variant5BrutalistMagazine } from "./variants/variant-5-brutalist-magazine";

const variants = [
  {
    id: 1,
    name: "Command Center",
    description:
      "2/3 tech grid + 1/3 terminal-style GitHub panel with header bars",
    component: Variant1CommandCenter,
  },
  {
    id: 2,
    name: "Asymmetric Panels",
    description:
      "Horizontal inline tech rows + thick orange divider + GitHub sidebar",
    component: Variant2AsymmetricPanels,
  },
  {
    id: 3,
    name: "Newspaper Editorial",
    description:
      "Dense classified-style tech columns + DISPATCH sidebar for GitHub",
    component: Variant3NewspaperEditorial,
  },
  {
    id: 4,
    name: "Dashboard Tiles",
    description:
      "Equal-height dashboard panels with chip-style tech + status board GitHub",
    component: Variant4DashboardTiles,
  },
  {
    id: 5,
    name: "Brutalist Magazine",
    description:
      "Magazine spread with oversized ghost headers + diagonal orange stripe junction",
    component: Variant5BrutalistMagazine,
  },
];

export function TechAndCodeSection() {
  return (
    <div>
      {variants.map(({ id, name, description, component: Component }) => (
        <div key={id} className="relative">
          {/* Variant label — sticky banner */}
          <div className="sticky top-0 z-40 bg-orange-500 text-black px-6 md:px-12 py-3 flex items-center gap-4">
            <span className="text-2xl font-black">VARIANT {id}</span>
            <span className="font-black text-lg">{name}</span>
            <span className="font-mono text-xs opacity-70 hidden md:block">
              {description}
            </span>
          </div>
          <Component />
        </div>
      ))}
    </div>
  );
}
