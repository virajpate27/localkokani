// src/components/admin/CronStatusIndicator.jsx
import { FiCheckCircle, FiAlertTriangle, FiClock } from "react-icons/fi";

function formatDateTime(isoString) {
  if (!isoString) return "Never run yet";
  return new Date(isoString).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function getHoursAgo(isoString) {
  if (!isoString) return null;
  return (Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60);
}

export default function CronStatusIndicator({ status }) {
  if (!status) {
    return (
      <div className="flex items-center gap-2 text-orange-500 text-xs bg-orange-50 px-3 py-2 rounded-lg">
        <FiAlertTriangle /> Automated processing has never run. Set up the daily cron job to keep promotions in sync.
      </div>
    );
  }

  const hoursAgo = getHoursAgo(status.lastRunAt);
  const isStale = hoursAgo !== null && hoursAgo > 30; // no run in over 30 hours — likely misconfigured/not deployed
  const failed = status.success === false;

  if (failed) {
    return (
      <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">
        <FiAlertTriangle /> Last automated run failed at {formatDateTime(status.lastRunAt)}: {status.errorMessage}
      </div>
    );
  }

  if (isStale) {
    return (
      <div className="flex items-center gap-2 text-orange-500 text-xs bg-orange-50 px-3 py-2 rounded-lg">
        <FiClock /> Last automated run was {formatDateTime(status.lastRunAt)} — over a day ago. Confirm the cron job is active.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-accent-dark text-xs bg-accent/10 px-3 py-2 rounded-lg">
      <FiCheckCircle /> Last automated run: {formatDateTime(status.lastRunAt)}
      {(status.expiredCount > 0 || status.activatedCount > 0) && (
        <span className="text-gray-500">
          ({status.activatedCount} activated, {status.expiredCount} expired)
        </span>
      )}
    </div>
  );
}