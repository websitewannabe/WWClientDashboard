import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  date,
  numeric,
  uuid
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  companyName: varchar("company_name"),
  intercomId: varchar("intercom_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNumber: varchar("invoice_number").notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  dueDate: date("due_date"),
  amount: numeric("amount").notNull(),
  status: varchar("status").notNull(), // 'paid', 'pending', 'overdue'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support tickets table
export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: varchar("ticket_id").notNull(), // e.g. #5821
  userId: varchar("user_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  description: text("description"),
  date: date("date").notNull(),
  lastUpdated: date("last_updated"),
  status: varchar("status").notNull(), // 'open', 'in-progress', 'completed', 'waiting'
  priority: varchar("priority").notNull(), // 'low', 'medium', 'high'
  category: varchar("category"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schemas and types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Invoice = typeof invoices.$inferSelect;
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type Ticket = typeof tickets.$inferSelect;
export const createTicketSchema = createInsertSchema(tickets).omit({ 
  id: true, 
  ticketId: true, 
  userId: true, 
  date: true, 
  lastUpdated: true,
  createdAt: true, 
  updatedAt: true 
});
export type CreateTicket = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = createInsertSchema(tickets).pick({
  status: true,
  priority: true,
  category: true,
}).partial();
export type UpdateTicket = z.infer<typeof updateTicketSchema>;

// Dashboard statistics type
export interface Stats {
  pendingInvoices: number;
  openTickets: number;
  nextPayment: string;
  visitors: string;
}
