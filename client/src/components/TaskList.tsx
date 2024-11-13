import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import TaskItem from "./TaskItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema } from "db/schema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

export default function TaskList() {
  const { tasks, createTask } = useTasks();
  const form = useForm({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      priority: 1,
      completed: false,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    createTask(data);
    form.reset();
  });

  return (
    <Card className="h-full rounded-none border-0">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex gap-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Add new task..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Add</Button>
          </form>
        </Form>

        <div className="mt-4 space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
