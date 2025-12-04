"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyStateCard } from "@/components/common/empty-state-card";
import type { Client } from "@/components/clients/types";
import { ClientCard } from "@/components/clients/client-card";

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};

type LinkRow = {
  client_id: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchClients() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setClients([]);
          setLoading(false);
          return;
        }

        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        type ProfileRole = { role: string };
        const typedProfile = profileData as ProfileRole | null;

        if (!typedProfile || (typedProfile.role !== "coach" && typedProfile.role !== "doctor")) {
          setClients([]);
          setLoading(false);
          return;
        }

        const providerId = user.id;
        const providerType = typedProfile.role as "coach" | "doctor";

        const linkTable =
          providerType === "coach"
            ? "client_coach_links"
            : "client_doctor_links";
        const linkColumn = providerType === "coach" ? "coach_id" : "doctor_id";

        const { data: links } = await supabase
          .from(linkTable)
          .select("client_id")
          .eq(linkColumn, providerId)
          .eq("status", "active");

        if (!links || links.length === 0) {
          setClients([]);
          setLoading(false);
          return;
        }

        const linkRows = (links ?? []) as LinkRow[];
        const clientIds = linkRows.map((link) => link.client_id);

        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, created_at")
          .in("id", clientIds)
          .eq("role", "client");

        const profileRows = (profiles ?? []) as ProfileRow[];

        const clientsWithStats: Client[] = await Promise.all(
          profileRows.map(async (profile) => {
            const { count: programsCount } = await supabase
              .from("programs")
              .select("*", { count: "exact", head: true })
              .eq("client_id", profile.id)
              .eq("status", "active");

            const { count: sessionsCount } = await supabase
              .from("sessions")
              .select("*", { count: "exact", head: true })
              .eq("client_id", profile.id)
              .eq("status", "scheduled")
              .gte("scheduled_at", new Date().toISOString());

            return {
              id: profile.id,
              full_name: profile.full_name,
              email: profile.email,
              phone: profile.phone,
              created_at: profile.created_at,
              active_programs: programsCount ?? 0,
              upcoming_sessions: sessionsCount ?? 0,
            };
          })
        );

        setClients(clientsWithStats);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.full_name?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading clients...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader title="Clients" subtitle="Manage your client relationships" />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <EmptyStateCard
          icon={<Users className="text-gray-400" size={48} />}
          title={searchQuery ? "No clients found" : "No clients yet"}
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Clients will appear here once they connect with you"
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}