import { useUser } from "@/hooks/use-user";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Calendar from "@/components/Calendar";
import TaskList from "@/components/TaskList";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, login, register, logout } = useUser();
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-4 p-4">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <Button
            onClick={() =>
              login({ username: "demo", password: "demo" }).then((res) => {
                if (!res.ok) {
                  toast({
                    title: "Error",
                    description: res.message,
                    variant: "destructive",
                  });
                }
              })
            }
          >
            Demo Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-xl font-bold">Task Manager</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user.username}</span>
          <Button variant="outline" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-4rem)]">
        <ResizablePanel defaultSize={25}>
          <Calendar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <TaskList />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <ChatBot />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
