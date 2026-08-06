// src/components/admin/RecentLeadsTable.jsx
import Link from "next/link";
import { FiArrowRight, FiClock } from "react-icons/fi";

const statusStyles = {
  new: "bg-secondary/10 text-secondary",
  contacted: "bg-accent/10 text-accent",
  closed: "dark:bg-gray-800 dark:text-gray-500",
};

function formatRelativeTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function RecentLeadsTable({ leads = [] }) {
  if (leads.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="dark:dark:text-gray-500">No enquiries yet</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b dark:border-gray-800">
        <h3 className="font-display font-semibold text-primary dark:text-white">
          Recent Enquiries
        </h3>
        <Link
          href="/admin/leads"
          className="text-secondary text-sm font-medium flex items-center gap-1 hover:underline"
        >
          View all <FiArrowRight />
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="p-5 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-primary dark:text-white truncate">{lead.name}</p>
              <p className="dark:dark:text-gray-500 text-sm truncate">
                {lead.hotelName} · {lead.phone}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1 dark:dark:text-gray-500 text-xs">
                <FiClock /> {formatRelativeTime(lead.createdAt)}
              </span>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${statusStyles[lead.status] || statusStyles.new}`}
              >
                {lead.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}