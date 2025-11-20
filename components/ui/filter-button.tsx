interface FilterButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

export function FilterButton({ active, label, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}>
      {label}
    </button>
  );
}