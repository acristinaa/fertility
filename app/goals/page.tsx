"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Target, Plus, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { FilterButton } from "@/components/ui/filter-button";
import { EmptyStateCard } from "@/components/common/empty-state-card";
import type { Goal } from "@/components/goals/types";
import { GoalCard } from "@/components/goals/goal-card";

type RawGoalRow = {
  id: number;
  title: string;
  description: string | null;
  status: Goal["status"];
  target_date: string | null;
  created_at: string;
  program: { title: string | null } | null;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "active" | "achieved" | "dropped"
  >("active");

  useEffect(() => {
    async function fetchGoals() {
      try {
        const userId = "11111111-1111-1111-1111-111111111008";

        let query = supabase
          .from("goals")
          .select(
            `
            id,
            title,
            description,
            status,
            target_date,
            created_at,
            program:programs(title)
          `
          )
          .eq("client_id", userId)
          .order("created_at", { ascending: false });

        if (filter !== "all") {
          query = query.eq("status", filter);
        }

        const { data } = await query;
        const rows = (data ?? []) as RawGoalRow[];

        setGoals(
          rows.map(
            (g): Goal => ({
              id: g.id,
              title: g.title,
              description: g.description,
              status: g.status,
              target_date: g.target_date,
              created_at: g.created_at,
              program_title: g.program?.title ?? null,
            })
          )
        );
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGoals();
  }, [filter]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading goals...</div>
        </div>
      </div>
    );
  }

  const activeGoals = goals.filter((g) => g.status === "active").length;
  const achievedGoals = goals.filter((g) => g.status === "achieved").length;

  return (
    <div className="p-8">
      <PageHeader
        title="Goals"
        subtitle="Track your fertility journey milestones"
        primaryActionLabel="New Goal"
        primaryActionIcon={<Plus size={20} />}
      />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <StatCard
          label="Active Goals"
          value={activeGoals}
          icon={
            <div className="bg-green-50 p-2 rounded-lg">
              <Target className="text-green-600" size={24} />
            </div>
          }
        />
        <StatCard
          label="Achieved Goals"
          value={achievedGoals}
          icon={
            <div className="bg-blue-50 p-2 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          }
        />
      </div>

      <div className="flex gap-2 mb-6">
        <FilterButton
          active={filter === "active"}
          onClick={() => setFilter("active")}
          label="Active"
        />
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All"
        />
        <FilterButton
          active={filter === "achieved"}
          onClick={() => setFilter("achieved")}
          label="Achieved"
        />
        <FilterButton
          active={filter === "dropped"}
          onClick={() => setFilter("dropped")}
          label="Dropped"
        />
      </div>

      {goals.length === 0 ? (
        <EmptyStateCard
          icon={<Target className="text-gray-400" size={48} />}
          title="No goals yet"
          description="Set your first goal to start tracking your fertility journey progress."
          primaryActionLabel="Create Goal"
        />
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}