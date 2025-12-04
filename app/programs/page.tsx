"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { FileText, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyStateCard } from "@/components/common/empty-state-card";
import type { Program } from "@/components/programs/types";
import { ProgramCard } from "@/components/programs/program-card";

type RawProgramRow = {
  id: number;
  title: string;
  description: string | null;
  status: Program["status"];
  start_date: string | null;
  end_date: string | null;
  provider_type: string;
  created_at: string;
  provider: { full_name: string | null } | null;
};

export default function ProgramsPage() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from("programs")
          .select(
            `
            id,
            title,
            description,
            status,
            start_date,
            end_date,
            provider_type,
            created_at,
            provider:profiles!programs_provider_id_fkey(full_name)
          `
          )
          .eq("client_id", user.id)
          .order("created_at", { ascending: false });

        const rows = (data ?? []) as RawProgramRow[];

        setPrograms(
          rows.map(
            (p): Program => ({
              id: p.id,
              title: p.title,
              description: p.description,
              status: p.status,
              start_date: p.start_date,
              end_date: p.end_date,
              provider_type: p.provider_type,
              provider_name: p.provider?.full_name ?? null,
              created_at: p.created_at,
            })
          )
        );
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading programs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Programs"
        subtitle="Your personalized fertility programs"
        primaryActionLabel="New Program"
        primaryActionIcon={<Plus size={20} />}
      />

      {programs.length === 0 ? (
        <EmptyStateCard
          icon={<FileText className="text-gray-400" size={48} />}
          title="No programs yet"
          description="Start your fertility journey by creating your first program with a coach or doctor."
          primaryActionLabel="Create Program"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
}
