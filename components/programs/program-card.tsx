import { FileText, Calendar, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { Program } from "./types";

interface ProgramCardProps {
  program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    paused: "bg-yellow-100 text-yellow-800",
    canceled: "bg-red-100 text-red-800",
  } as const;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="bg-purple-50 p-2 rounded-lg h-fit">
            <FileText className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {program.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={14} />
              <span>
                {program.provider_name || "Provider"} ({program.provider_type})
              </span>
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[program.status]
          }`}>
          {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
        </span>
      </div>

      {program.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {program.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>
            {program.start_date
              ? format(parseISO(program.start_date), "MMM d, yyyy")
              : "Start date not set"}
          </span>
        </div>
        {program.end_date && (
          <div className="flex items-center gap-1">
            <span>→</span>
            <span>{format(parseISO(program.end_date), "MMM d, yyyy")}</span>
          </div>
        )}
      </div>

      <button className="w-full mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
        View Details
      </button>
    </div>
  );
}