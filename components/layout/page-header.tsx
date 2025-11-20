// components/layout/PageHeader.tsx
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  primaryActionLabel?: string;
  primaryActionIcon?: ReactNode;
  onPrimaryActionClick?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  primaryActionLabel,
  primaryActionIcon,
  onPrimaryActionClick,
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
      </div>

      {primaryActionLabel && (
        <button
          onClick={onPrimaryActionClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {primaryActionIcon}
          {primaryActionLabel}
        </button>
      )}
    </div>
  );
}