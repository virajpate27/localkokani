// src/components/layout/Navbar.jsx


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiSearch, FiMapPin, FiHeart } from "react-icons/fi";
import SearchAutosuggest from "@/components/search/SearchAutosuggest";

import { useWishlist } from "@/context/WishlistContext";
import ThemeToggle from "@/components/ui/ThemeToggle"; 

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Hotels", href: "/hotels" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setIsOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
    scrolled
      ? "bg-white dark:bg-gray-900 dark:bg-gray-900 shadow-card"
      : "bg-white dark:bg-gray-900/80 dark:bg-gray-900/80 backdrop-blur-md"
  }`}
    >
      <nav className="container-custom flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <FiMapPin className="text-white text-xl" />
          </div>
          <span className="font-display font-bold text-xl sm:text-2xl text-primary dark:text-white dark:text-white whitespace-nowrap">
    Stay<span className="text-accent-dark dark:text-accent">Finder</span>
  </span>
        </Link>

        {/* Desktop Links + inline search */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center max-w-md mx-8">
          {searchOpen ? (
            <SearchAutosuggest variant="default" />
          ) : (
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`font-medium transition-colors relative whitespace-nowrap ${pathname === link.href ? "text-primary dark:text-white" : "dark:text-gray-300 hover:text-primary dark:text-white"
                      }`}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent rounded-full" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
    <ThemeToggle />
    <button onClick={() => setSearchOpen((prev) => !prev)} className="w-11 h-11 rounded-full flex items-center justify-center dark:bg-gray-800 dark:bg-gray-800 hover:bg-secondary hover:text-white transition-colors" aria-label="Toggle search">
      {searchOpen ? <FiX /> : <FiSearch />}
    </button>
    <Link href="/destinations" className="btn-primary whitespace-nowrap">
      Explore Stays
    </Link>
  </div>

        <button
          className="md:hidden text-2xl text-primary dark:text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 dark:bg-gray-900 border-t dark:border-gray-800 dark:border-gray-800 animate-slide-up">
          <div className="flex items-center justify-between p-4">
        <SearchAutosuggest variant="default" />
        <ThemeToggle className="ml-3 shrink-0" />
      </div>
          <ul className="flex flex-col px-4 pb-4 gap-1">
            {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl font-medium ${
                pathname === link.href
                  ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-white dark:text-primary dark:text-white-light"
                  : "dark:text-gray-300 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}

            <li className="pt-2">
              <div >
                <Link
                  href="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950"
                >
                  <FiHeart className="text-secondary" />
                  Wishlist {count > 0 && <span className="text-accent font-semibold">({count})</span>}
                </Link>
              </div>
            </li>
            <li className="pt-2">
              <Link
                href="/destinations"
                onClick={() => setIsOpen(false)}
                className="btn-primary block text-center"
              >
                Explore Stays
              </Link>
            </li>
          </ul>

        </div>
      )}
    </header>
  );
}