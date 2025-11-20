"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckSquare, Plus, AlertCircle } from "lucide-react";
import { parseISO, isPast } from "date-fns";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { EmptyStateCard } from "@/components/common/empty-state-card";
import { FilterButton } from "@/components/ui/filter-button";
import type { ActionItem } from "@/components/action-items/types";
import { ActionItemCard } from "@/components/action-items/action-item-card";

type RawActionItemRow = {
  id: number;
  title: string;
  description: string | null;
  status: ActionItem["status"];
  due_date: string | null;
  created_at: string;
  session_id: number | null;
  goal: { title: string | null } | null;
};

export default function ActionItemsPage() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "open" | "in_progress" | "done" | "canceled"
  >("open");

  useEffect(() => {
    async function fetchActionItems() {
      try {
        const userId = "11111111-1111-1111-1111-111111111008";

        let query = supabase
          .from("action_items")
          .select(
            `
            id,
            title,
            description,
            status,
            due_date,
            created_at,
            session_id,
            goal:goals(title)
          `
          )
          .eq("client_id", userId)
          .order("due_date", { ascending: true, nullsFirst: false });

        if (filter !== "all") {
          query = query.eq("status", filter);
        }

        const { data } = await query;
        const rows = (data ?? []) as RawActionItemRow[];

        setActionItems(
          rows.map(
            (a): ActionItem => ({
              id: a.id,
              title: a.title,
              description: a.description,
              status: a.status,
              due_date: a.due_date,
              created_at: a.created_at,
              session_id: a.session_id,
              goal_title: a.goal?.title ?? null,
            })
          )
        );
      } catch (error) {
        console.error("Error fetching action items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchActionItems();
  }, [filter]);

  const pendingCount = actionItems.filter(
    (a) => a.status === "open" || a.status === "in_progress"
  ).length;

  const overdueCount = actionItems.filter(
    (a) =>
      (a.status === "open" || a.status === "in_progress") &&
      a.due_date &&
      isPast(parseISO(a.due_date))
  ).length;

  return (
    <div className="p-8">
      <PageHeader
        title="Action Items"
        subtitle="Track your tasks and commitments"
        primaryActionLabel="New Action Item"
        primaryActionIcon={<Plus size={20} />}
      />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <StatCard
          label="Pending Items"
          value={pendingCount}
          icon={
            <div className="bg-purple-50 p-2 rounded-lg">
              <CheckSquare className="text-purple-600" size={24} />
            </div>
          }
        />
        <StatCard
          label="Overdue Items"
          value={overdueCount}
          icon={
            <div className="bg-red-50 p-2 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
          }
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <FilterButton
          active={filter === "open"}
          onClick={() => setFilter("open")}
          label="Open"
        />
        <FilterButton
          active={filter === "in_progress"}
          onClick={() => setFilter("in_progress")}
          label="In Progress"
        />
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All"
        />
        <FilterButton
          active={filter === "done"}
          onClick={() => setFilter("done")}
          label="Done"
        />
        <FilterButton
          active={filter === "canceled"}
          onClick={() => setFilter("canceled")}
          label="Canceled"
        />
      </div>

      {actionItems.length === 0 ? (
        <EmptyStateCard
          icon={<CheckSquare className="text-gray-400" size={48} />}
          title="No action items yet"
          description="Create your first action item to start tracking tasks from your sessions."
          primaryActionLabel="Create Action Item"
        />
      ) : (
        <div className="space-y-4">
          {actionItems.map((item) => (
            <ActionItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}