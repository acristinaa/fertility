import { Calendar, Target } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { Goal } from "./types";

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    achieved: "bg-blue-100 text-blue-800",
    dropped: "bg-gray-100 text-gray-800",
  } as const;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 flex-1">
          <div className="bg-green-50 p-3 rounded-lg h-fit">
            <Target className="text-green-600" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {goal.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColors[goal.status]
                }`}>
                {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
              </span>
            </div>
            {goal.description && (
              <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
            )}
            {goal.program_title && (
              <p className="text-sm text-gray-500 mb-2">
                Part of program:{" "}
                <span className="font-medium">{goal.program_title}</span>
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {goal.target_date && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>
                    Target: {format(parseISO(goal.target_date), "MMM d, yyyy")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span>
                  Created: {format(parseISO(goal.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View Details
        </button>
      </div>
    </div>
  );
}