// src/components/ui/EmptyState.jsx
export default function EmptyState({ title, description }) {
  return (
    <div className="text-center py-16">
      <p className="font-display font-semibold text-xl dark:dark:text-gray-500">
        {title}
      </p>
      {description && (
        <p className="dark:dark:text-gray-500 text-sm mt-2">{description}</p>
      )}
    </div>
  );
}