// src/components/admin/StatCard.jsx
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function StatCard({ icon: Icon, label, value, href, accentColor = "primary" }) {
  const colorMap = {
    primary: "bg-primary/10 text-primary dark:text-white",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <Link
      href={href}
      className="card p-6 flex items-center justify-between hover:-translate-y-1 transition-transform group"
    >
      <div>
        <p className="dark:dark:text-gray-500 text-sm font-medium">{label}</p>
        <p className="font-display font-bold text-3xl text-primary dark:text-white mt-1">
          {value}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[accentColor]}`}>
          <Icon className="text-xl" />
        </div>
        <FiArrowUpRight className="text-gray-300 group-hover:text-primary dark:text-white transition-colors" />
      </div>
    </Link>
  );
}