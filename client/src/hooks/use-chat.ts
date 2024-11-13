import useSWR from "swr";
import type { ChatMessage } from "db/schema";

export function useChat() {
  const { data: messages, mutate } = useSWR<ChatMessage[]>("/api/chat");

  const sendMessage = async (message: string) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    mutate();
  };

  return {
    messages: messages || [],
    sendMessage,
  };
}
