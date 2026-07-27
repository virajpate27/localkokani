// src/components/ui/Breadcrumbs.jsx
import Link from "next/link";
import { FiChevronRight, FiHome } from "react-icons/fi";
import JsonLd from "./JsonLd";
import { generateBreadcrumbSchema } from "@/utils/helpers";

export default function Breadcrumbs({ items }) {
  // items: [{ name: "Destinations", url: "/destinations" }, { name: "Goa", url: "/destinations/goa" }]
  const schemaItems = [
    { name: "Home", url: "/" },
    ...items,
  ];

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(schemaItems)} />
      <nav aria-label="Breadcrumb" className="container-custom pt-6">
        <ol className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500">
          <li className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-primary flex items-center gap-1">
              <FiHome /> Home
            </Link>
            <FiChevronRight className="text-gray-300" />
          </li>
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center gap-1.5">
              {index === items.length - 1 ? (
                <span className="text-primary font-medium">{item.name}</span>
              ) : (
                <>
                  <Link href={item.url} className="hover:text-primary">
                    {item.name}
                  </Link>
                  <FiChevronRight className="text-gray-300" />
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}