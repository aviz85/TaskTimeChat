import { Task } from "db/schema";
import { useTasks } from "@/hooks/use-tasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { updateTask, deleteTask } = useTasks();

  const priorityColors = {
    1: "bg-green-500",
    2: "bg-yellow-500",
    3: "bg-red-500",
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border p-2">
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) =>
          updateTask(task.id, { ...task, completed: !!checked })
        }
      />
      <span className={task.completed ? "line-through" : ""}>{task.title}</span>
      <Badge
        variant="secondary"
        className={`ml-auto ${priorityColors[task.priority as keyof typeof priorityColors]}`}
      >
        P{task.priority}
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteTask(task.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
