// src/app/admin/page.js
"use client";

import { useState, useEffect } from "react";
import { FiMapPin, FiHome, FiCoffee, FiMessageSquare } from "react-icons/fi";

import {
  getDashboardStats,
  getRecentLeads,
} from "@/lib/services/dashboardService";
import StatCard from "@/components/admin/StatCard";
import RecentLeadsTable from "@/components/admin/RecentLeadsTable";
import QuickActions from "@/components/admin/QuickActions";
import DashboardSkeleton from "@/components/admin/DashboardSkeleton";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, leadsData] = await Promise.all([
          getDashboardStats(),
          getRecentLeads(5),
        ]);
        setStats(statsData);
        setRecentLeads(leadsData);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const firstName = user?.email?.split("@")[0] || "Admin";

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-primary dark:text-white capitalize">
          Welcome back, {firstName} 👋
        </h2>
        <p className="dark:text-gray-500 text-sm mt-1">
          Here's what's happening with your listings today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FiMapPin}
          label="Total Destinations"
          value={stats.destinations}
          href="/admin/destinations"
          accentColor="secondary"
        />
        <StatCard
          icon={FiHome}
          label="Total Hotels"
          value={stats.hotels}
          href="/admin/hotels"
          accentColor="primary"
        />
        <StatCard
          icon={FiCoffee}
          label="Total Restaurants"
          value={stats.restaurants}
          href="/admin/restaurants"
          accentColor="accent"
        />
        <StatCard
          icon={FiMessageSquare}
          label="Total Enquiries"
          value={stats.leads}
          href="/admin/leads"
          accentColor="secondary"
        />
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <RecentLeadsTable leads={recentLeads} />
        <QuickActions />
      </div>
    </div>
  );
}
