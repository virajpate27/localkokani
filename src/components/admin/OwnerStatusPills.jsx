// src/components/admin/OwnerStatusPills.jsx
export default function OwnerStatusPills({ approved, pending, rejected }) {
  return (
    <div className="flex items-center gap-1.5">
      {approved > 0 && (
        <span className="text-xs font-medium bg-accent/10 text-accent-dark px-2 py-0.5 rounded-md">
          {approved} approved
        </span>
      )}
      {pending > 0 && (
        <span className="text-xs font-medium bg-secondary/10 text-secondary px-2 py-0.5 rounded-md">
          {pending} pending
        </span>
      )}
      {rejected > 0 && (
        <span className="text-xs font-medium bg-red-50 text-red-500 px-2 py-0.5 rounded-md">
          {rejected} rejected
        </span>
      )}
      {approved === 0 && pending === 0 && rejected === 0 && (
        <span className="text-xs text-gray-400">No applications yet</span>
      )}
    </div>
  );
}