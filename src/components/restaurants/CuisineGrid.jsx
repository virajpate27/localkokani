// src/components/restaurants/CuisineGrid.jsx
import {
  GiShrimp, GiChiliPepper, GiBowlOfRice, GiChopsticks,
  GiKnifeFork, GiTacos, GiNoodles, GiChickenLeg,
  GiHotDog, GiCarrot, GiCupcake, GiBarbecue, GiCurledLeaf,
} from "react-icons/gi";

// Maps common cuisine tag strings to icons — falls back to a generic fork/knife icon
const CUISINE_ICONS = {
  seafood: GiShrimp,
  goan: GiChiliPepper,
  "north indian": GiChickenLeg,
  mughlai: GiChickenLeg,
  "south indian": GiBowlOfRice,
  chinese: GiChopsticks,
  continental: GiKnifeFork,
  italian: GiNoodles,
  mexican: GiTacos,
  thai: GiNoodles,
  "street food": GiHotDog,
  vegan: GiCarrot,
  vegetarian: GiCarrot,
  "bakery & desserts": GiCupcake,
  bakery: GiCupcake,
  desserts: GiCupcake,
  "bbq & grill": GiBarbecue,
  bbq: GiBarbecue,
  grill: GiBarbecue,
  salad: GiCurledLeaf,
};

export function getCuisineIcon(cuisine) {
  const key = cuisine.toLowerCase();
  const match = Object.keys(CUISINE_ICONS).find((k) => key.includes(k));
  return match ? CUISINE_ICONS[match] : GiKnifeFork; // generic fork/knife fallback
}

export default function CuisineGrid({ cuisine = [] }) {
  if (cuisine.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {cuisine.map((c) => {
        const Icon = getCuisineIcon(c);
        return (
          <div
            key={c}
            className="flex items-center gap-3 bg-gray-50 dark:bg-gray-950 rounded-xl px-4 py-3"
          >
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Icon className="text-accent-dark" />
            </div>
            <span className="text-sm dark:text-gray-300">{c}</span>
          </div>
        );
      })}
    </div>
  );
}