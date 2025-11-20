import { format, parseISO } from "date-fns";
import { Mail, Phone, Users } from "lucide-react";
import type { Client } from "./types";

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Users className="text-blue-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {client.full_name || "Unnamed Client"}
          </h3>
          <p className="text-sm text-gray-500">
            Client since {format(parseISO(client.created_at), "MMM yyyy")}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={16} />
            <span className="truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={16} />
            <span>{client.phone}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Active Programs</p>
          <p className="text-2xl font-bold text-gray-900">
            {client.active_programs}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Upcoming Sessions</p>
          <p className="text-2xl font-bold text-gray-900">
            {client.upcoming_sessions}
          </p>
        </div>
      </div>

      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
        View Profile
      </button>
    </div>
  );
}