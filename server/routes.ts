import { Express } from "express";
import { setupAuth } from "./auth";
import { db } from "db";
import { tasks, chatMessages } from "db/schema";
import { eq } from "drizzle-orm";
import { Server } from "socket.io";

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Tasks API
  app.get("/api/tasks", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, req.user.id));
    res.json(userTasks);
  });

  app.post("/api/tasks", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const [task] = await db
      .insert(tasks)
      .values({ ...req.body, userId: req.user.id })
      .returning();
    res.json(task);
  });

  app.put("/api/tasks/:id", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const [task] = await db
      .update(tasks)
      .set(req.body)
      .where(eq(tasks.id, parseInt(req.params.id)))
      .returning();
    res.json(task);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    await db.delete(tasks).where(eq(tasks.id, parseInt(req.params.id)));
    res.status(204).end();
  });

  // Chat API
  app.get("/api/chat", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, req.user.id));
    res.json(messages);
  });

  app.post("/api/chat", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    
    // Save user message
    const [userMessage] = await db
      .insert(chatMessages)
      .values({
        userId: req.user.id,
        message: req.body.message,
        isBot: false,
      })
      .returning();

    // Generate bot response
    const botResponse = generateBotResponse(req.body.message);
    
    // Save bot message
    const [botMessage] = await db
      .insert(chatMessages)
      .values({
        userId: req.user.id,
        message: botResponse,
        isBot: true,
      })
      .returning();

    res.json([userMessage, botMessage]);
  });
}

function generateBotResponse(message: string): string {
  const responses = {
    hello: "Hi there! How can I help you with your tasks today?",
    help: "I can help you manage your tasks. Try asking about creating, updating, or organizing tasks.",
    task: "Would you like me to help you create a new task?",
    default: "I'm here to help! Let me know if you need assistance with your tasks.",
  };

  const lowercaseMessage = message.toLowerCase();
  for (const [key, response] of Object.entries(responses)) {
    if (lowercaseMessage.includes(key)) {
      return response;
    }
  }

  return responses.default;
}
