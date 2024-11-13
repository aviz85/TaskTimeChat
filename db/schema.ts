import { sqliteTable, text, integer, numeric } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm"

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  phoneCountryCode: text("phone_country_code").notNull(),
  phoneNumber: text("phone_number").notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  priority: integer("priority").notNull().default(1),
  completed: integer("completed", { mode: "boolean" }).default(false),
  dueDate: numeric("due_date"),
  createdAt: numeric("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const chatMessages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isBot: integer("is_bot", { mode: "boolean" }).default(false),
  createdAt: numeric("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users, {
  phoneCountryCode: z.string().regex(/^\+\d{1,4}$/),
  phoneNumber: z
    .string()
    .min(9)
    .max(15)
    .regex(/^[\d-]+$/, { message: "Phone number can only contain digits and hyphens" })
    .transform((val) => {
      const cleaned = val.replace(/[-\s]/g, '');
      return cleaned.replace(/^0+/, '');
    }),
});
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = z.infer<typeof selectTaskSchema>;

export const insertChatMessageSchema = createInsertSchema(chatMessages);
export const selectChatMessageSchema = createSelectSchema(chatMessages);
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = z.infer<typeof selectChatMessageSchema>;
