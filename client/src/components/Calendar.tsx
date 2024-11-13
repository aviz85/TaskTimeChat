import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { tasks } = useTasks();

  return (
    <Card className="h-full rounded-none border-0">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <CalendarUI
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <div className="mt-4 space-y-2">
          {tasks
            .filter((task) => {
              const taskDate = new Date(task.dueDate!);
              return (
                date &&
                taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear()
              );
            })
            .map((task) => (
              <div
                key={task.id}
                className={`rounded-md border p-2 ${
                  task.completed ? "bg-muted line-through" : ""
                }`}
              >
                {task.title}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
