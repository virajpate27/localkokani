// src/components/admin/AdminSidebar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiMapPin, FiHome, FiMessageSquare, FiStar, FiLogOut, FiMenu, FiX, FiFileText, FiCoffee, FiUsers, FiUserCheck, FiZap, FiMail, FiSettings  } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getNewLeadsCount } from "@/lib/services/dashboardService";
import { getPendingPartnerApplicationsCount } from "@/lib/services/partnerService"; // ⬅️ ADD
import { getPendingPromotionRequestsCount } from "@/lib/services/promotionService";
import { getNewContactMessagesCount } from "@/lib/services/contactService";
import Image from "next/image"; 

const navItems = [
  { label: "Dashboard", href: "/admin", icon: FiGrid },
  { label: "Destinations", href: "/admin/destinations", icon: FiMapPin },
  { label: "Hotels", href: "/admin/hotels", icon: FiHome },
  { label: "Restaurants", href: "/admin/restaurants", icon: FiCoffee },
  { label: "Blog", href: "/admin/blog", icon: FiFileText },
  { label: "Reviews", href: "/admin/reviews", icon: FiStar },
  { label: "Leads", href: "/admin/leads", icon: FiMessageSquare },
  { label: "Partner Applications", href: "/admin/partner-applications", icon: FiUsers },
  { label: "Owners", href: "/admin/owners", icon: FiUserCheck },
  { label: "Feature & Sponsor", href: "/admin/promotions", icon: FiZap },
  { label: "Contact Messages", href: "/admin/contact-messages", icon: FiMail },
  { label: "Settings", href: "/admin/settings", icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const [pendingPartnersCount, setPendingPartnersCount] = useState(0);
  const [pendingPromotionsCount, setPendingPromotionsCount] = useState(0);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  useEffect(() => {
    getNewLeadsCount().then(setNewLeadsCount).catch(() => { });
    getPendingPartnerApplicationsCount().then(setPendingPartnersCount).catch(() => { });
    getPendingPromotionRequestsCount().then(setPendingPromotionsCount).catch(() => { });
    getNewContactMessagesCount().then(setNewMessagesCount).catch(() => { });
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const SidebarContent = (
    <>
      <div className="p-6 border-b border-white/10">
  <Link href="/admin" className="flex items-center gap-2">
    <div className="relative w-9 h-9 shrink-0">
      <Image src="/logo.png" alt="Local Kokani" fill className="object-contain" />
    </div>
    <span className="font-display font-bold text-lg text-white">
      Local<span className="text-accent">Kokani</span>
    </span>
  </Link>
  <p className="text-white/40 text-xs mt-1">Admin Panel</p>
</div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
            >
              <item.icon className={isActive ? "text-accent" : ""} />
              {item.label}
              {item.href === "/admin/leads" && newLeadsCount > 0 && (
                <span className="ml-auto bg-accent text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {newLeadsCount}
                </span>
              )}
              {item.href === "/admin/partner-applications" && pendingPartnersCount > 0 && (
                <span className="ml-auto bg-accent text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingPartnersCount}
                </span>
              )}
              {/* NEW: badge for Feature & Sponsor */}
              {item.href === "/admin/promotions" && pendingPromotionsCount > 0 && (
                <span className="ml-auto bg-accent text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingPromotionsCount}
                </span>
              )}
              {item.href === "/admin/contact-messages" && newMessagesCount > 0 && (
                <span className="ml-auto bg-accent text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {newMessagesCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-white/40 text-xs px-4 mb-2 truncate">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-white/60 hover:bg-white dark:bg-gray-900/5 hover:text-white w-full transition-colors"
        >
          <FiLogOut />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile topbar toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg"
        aria-label="Open menu"
      >
        <FiMenu />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary shrink-0 sticky top-0 h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-primary flex flex-col animate-slide-up">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-[-3rem] w-10 h-10 rounded-lg bg-white dark:bg-gray-900/10 text-white flex items-center justify-center"
              aria-label="Close menu"
            >
              <FiX />
            </button>
            {SidebarContent}
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  );
}