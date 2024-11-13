import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60;

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTimePosition, setCurrentTimePosition] = useState(0);
  const { tasks } = useTasks();
  const scrollRef = useRef<HTMLDivElement>(null);

  // עדכון מיקום קו הזמן הנוכחי וגלילה למיקום הנוכחי
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const position = (minutes / 60) * HOUR_HEIGHT;
      setCurrentTimePosition(position);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);

    // גלילה למיקום הנוכחי
    if (scrollRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const scrollPosition = Math.max(0, (currentHour - 2) * HOUR_HEIGHT);
      scrollRef.current.scrollTop = scrollPosition;
    }

    return () => clearInterval(interval);
  }, []);

  const navigateDay = (direction: 'prev' | 'next') => {
    setSelectedDate(direction === 'prev' ? subDays(selectedDate, 1) : addDays(selectedDate, 1));
  };

  const filteredTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <Card className="h-full rounded-none border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Schedule</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateDay('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(selectedDate, 'EEEE, MMMM d')}
          </span>
          <Button variant="outline" size="icon" onClick={() => navigateDay('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={scrollRef} className="relative h-[calc(100vh-12rem)] overflow-y-auto">
          {/* רשת השעות - עודכן פורמט השעות */}
          <div className="absolute left-0 top-0 w-14 border-r bg-muted/50">
            <div className="sticky top-0 z-20 h-8 bg-background/90 backdrop-blur-sm" />
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex h-[60px] items-center justify-end pr-2 border-b text-xs font-medium text-muted-foreground"
              >
                {String(hour).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* אזור התוכן */}
          <div className="ml-14 relative min-h-[1440px]"> {/* 24 שעות * 60 פיקסלים */}
            <div className="sticky top-0 z-20 h-8 bg-background/90 backdrop-blur-sm" />
            
            {/* קו הזמן הנוכחי */}
            {format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
              <div
                className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                style={{ top: `${currentTimePosition}px` }}
              >
                <div className="absolute -left-2.5 -top-1.5 h-3 w-3 rounded-full bg-red-500" />
              </div>
            )}

            {/* רשת השעות */}
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-[60px] border-b border-border/50 relative group"
              >
                <div className="absolute inset-0 group-hover:bg-muted/50 transition-colors" />
                {/* חצי שעה */}
                <div className="absolute left-0 right-0 top-1/2 border-b border-border/30" />
              </div>
            ))}

            {/* משימות */}
            {filteredTasks.map((task) => {
              const taskDate = new Date(task.dueDate!);
              const minutes = taskDate.getHours() * 60 + taskDate.getMinutes();
              const taskTop = (minutes / 60) * HOUR_HEIGHT;
              
              return (
                <div
                  key={task.id}
                  className={cn(
                    "absolute left-1 right-1 rounded-md p-2 text-sm",
                    task.completed ? "bg-muted line-through" : "bg-primary/10 hover:bg-primary/20"
                  )}
                  style={{
                    top: `${taskTop}px`,
                    height: `${HOUR_HEIGHT}px`,
                  }}
                >
                  {task.title}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
