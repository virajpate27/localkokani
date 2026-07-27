// src/components/ui/EmptyState.jsx
export default function EmptyState({ title, description }) {
  return (
    <div className="text-center py-16">
      <p className="font-display font-semibold text-xl text-gray-400">
        {title}
      </p>
      {description && (
        <p className="text-gray-400 text-sm mt-2">{description}</p>
      )}
    </div>
  );
}