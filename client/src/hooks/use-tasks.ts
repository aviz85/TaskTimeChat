import useSWR from "swr";
import type { Task, InsertTask } from "db/schema";

export function useTasks() {
  const { data: tasks, mutate } = useSWR<Task[]>("/api/tasks");

  const createTask = async (task: Omit<InsertTask, "userId">) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to create task");
    mutate();
  };

  const updateTask = async (id: number, task: Partial<InsertTask>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to update task");
    mutate();
  };

  const deleteTask = async (id: number) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete task");
    mutate();
  };

  return {
    tasks: tasks || [],
    createTask,
    updateTask,
    deleteTask,
  };
}
