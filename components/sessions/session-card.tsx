import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { SessionWithProvider } from "./types";

interface SessionCardProps {
  session: SessionWithProvider;
}

export function SessionCard({ session }: SessionCardProps) {
  const statusColors = {
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
  } as const;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 flex-1">
          <div className="bg-blue-50 p-3 rounded-lg h-fit">
            <Calendar className="text-blue-600" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {session.session_type.charAt(0).toUpperCase() +
                  session.session_type.slice(1)}{" "}
                Session
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColors[session.status]
                }`}>
                {session.status.charAt(0).toUpperCase() +
                  session.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 mb-3">
              with {session.provider_name || "Provider"} (
              {session.provider_type})
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{format(parseISO(session.scheduled_at), "PPP")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>
                  {format(parseISO(session.scheduled_at), "p")} (
                  {session.duration_minutes} min)
                </span>
              </div>
              <div className="flex items-center gap-1">
                {session.mode === "online" ? (
                  <>
                    <Video size={16} />
                    <span>Online</span>
                  </>
                ) : (
                  <>
                    <MapPin size={16} />
                    <span>In-Person</span>
                  </>
                )}
              </div>
            </div>
            {session.status === "completed" && session.client_rating && (
              <div className="mt-3 flex items-center gap-1">
                <span className="text-sm text-gray-600">Your rating:</span>
                <span className="text-yellow-500">
                  {"★".repeat(session.client_rating)}
                  {"☆".repeat(5 - session.client_rating)}
                </span>
              </div>
            )}
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View Details
        </button>
      </div>
    </div>
  );
}