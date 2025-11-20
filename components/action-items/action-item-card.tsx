import { AlertCircle, Calendar, CheckSquare } from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import type { ActionItem } from "./types";

interface ActionItemCardProps {
  item: ActionItem;
}

export function ActionItemCard({ item }: ActionItemCardProps) {
  const statusColors = {
    open: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
    canceled: "bg-gray-100 text-gray-800",
  } as const;

  const isOverdue =
    (item.status === "open" || item.status === "in_progress") &&
    item.due_date &&
    isPast(parseISO(item.due_date));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 flex-1">
          <div
            className={`${
              item.status === "done" ? "bg-green-50" : "bg-purple-50"
            } p-3 rounded-lg h-fit`}>
            <CheckSquare
              className={
                item.status === "done" ? "text-green-600" : "text-purple-600"
              }
              size={24}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColors[item.status]
                }`}>
                {item.status.replace("_", " ").charAt(0).toUpperCase() +
                  item.status.slice(1).replace("_", " ")}
              </span>
              {isOverdue && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Overdue
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {item.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                    Due: {format(parseISO(item.due_date), "MMM d, yyyy")}
                  </span>
                </div>
              )}
              {item.goal_title && (
                <div className="text-sm text-gray-500">
                  Goal: <span className="font-medium">{item.goal_title}</span>
                </div>
              )}
              {item.session_id && (
                <div className="text-sm text-gray-500">
                  From session #{item.session_id}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {item.status !== "done" && item.status !== "canceled" && (
            <button className="text-green-600 hover:text-green-700 font-medium text-sm">
              Mark Done
            </button>
          )}
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}