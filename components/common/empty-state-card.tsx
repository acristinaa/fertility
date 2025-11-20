import type { ReactNode } from "react";

interface EmptyStateCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  primaryActionLabel?: string;
  onPrimaryActionClick?: () => void;
}

export function EmptyStateCard({
  icon,
  title,
  description,
  primaryActionLabel,
  onPrimaryActionClick,
}: EmptyStateCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      {icon && <div className="mx-auto mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {primaryActionLabel && (
        <button
          onClick={onPrimaryActionClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {primaryActionLabel}
        </button>
      )}
    </div>
  );
}