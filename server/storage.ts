import {
  users,
  type User,
  type UpsertUser,
  invoices,
  type Invoice,
  tickets,
  type Ticket,
  type CreateTicket,
  type UpdateTicket,
  type Stats
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Intercom integration operations
  createUserFromIntercom(userData: UpsertUser): Promise<User>;
  updateUserFromIntercom(userId: string, userData: Partial<UpsertUser>): Promise<User>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  updateUserAnalytics(userId: string, analyticsData: {
    gaMeasurementId?: string;
    gaPropertyId?: string;
    gaViewId?: string;
    gscSiteUrl?: string;
    gscVerificationMethod?: string;
    gscVerified?: boolean;
  }): Promise<User>;
  
  // Client portal operations
  getStats(userId: string): Promise<Stats>;
  getInvoices(userId: string): Promise<Invoice[]>;
  getTickets(userId: string): Promise<Ticket[]>;
  getAnalytics(userId: string, timeframe: string): Promise<any>;
  createTicket(userId: string, ticket: CreateTicket): Promise<Ticket>;
  updateTicket(userId: string, ticketId: string, updateData: UpdateTicket): Promise<Ticket>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUserFromIntercom(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }
  
  async updateUserFromIntercom(userId: string, userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  // Add method to update user analytics settings
  async updateUserAnalytics(userId: string, analyticsData: {
    gaMeasurementId?: string;
    gaPropertyId?: string;
    gaViewId?: string;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...analyticsData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  // Get all users (for admin)
  async getAllUsers(): Promise<User[]> {
    return db
      .select()
      .from(users)
      .orderBy(users.createdAt);
  }

  // Client portal operations
  async getStats(userId: string): Promise<Stats> {
    // Get the count of pending invoices
    const pendingInvoices = await db
      .select()
      .from(invoices)
      .where(
        eq(invoices.userId, userId) && eq(invoices.status, 'pending')
      );
    
    // Get the count of open tickets
    const openTickets = await db
      .select()
      .from(tickets)
      .where(
        eq(tickets.userId, userId) && eq(tickets.status, 'open')
      );

    // Next payment date from pending invoices
    let nextPayment = "";
    if (pendingInvoices.length > 0) {
      // Find the earliest due date from pending invoices
      const sortedInvoices = [...pendingInvoices].filter(invoice => invoice.dueDate !== null).sort((a, b) => {
        // TypeScript knows both are non-null now
        return new Date(a.dueDate as string).getTime() - new Date(b.dueDate as string).getTime();
      });
      if (sortedInvoices[0]?.dueDate) {
        const date = new Date(sortedInvoices[0].dueDate);
        nextPayment = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
      }
    }

    // For now we're using dummy data for visitors
    // In a real scenario, this would be fetched from an analytics service
    const visitors = "4,238";

    return {
      pendingInvoices: pendingInvoices.length,
      openTickets: openTickets.length,
      nextPayment,
      visitors
    };
  }

  async getInvoices(userId: string): Promise<Invoice[]> {
    return db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, userId))
      .orderBy(invoices.date);
  }

  async getTickets(userId: string): Promise<Ticket[]> {
    return db
      .select()
      .from(tickets)
      .where(eq(tickets.userId, userId))
      .orderBy(tickets.date);
  }

  async getAnalytics(userId: string, timeframe: string): Promise<any> {
    // In a real implementation, this would fetch analytics data from a service 
    // like Google Analytics, etc.
    // For now, we're returning dummy data that matches the frontend expectations
    return {
      traffic: [],
      sources: [],
      devices: [],
      pages: []
    };
  }

  async createTicket(userId: string, ticketData: CreateTicket): Promise<Ticket> {
    // Generate a ticket ID like #5822
    const allTickets = await db.select().from(tickets);
    const ticketNumber = 5821 + allTickets.length + 1;
    const ticketId = `#${ticketNumber}`;

    const [ticket] = await db
      .insert(tickets)
      .values({
        ...ticketData,
        ticketId,
        userId,
        date: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      })
      .returning();

    return ticket;
  }

  async updateTicket(userId: string, ticketId: string, updateData: UpdateTicket): Promise<Ticket> {
    const [ticket] = await db
      .select()
      .from(tickets)
      .where(
        eq(tickets.id, ticketId) && eq(tickets.userId, userId)
      );

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const [updatedTicket] = await db
      .update(tickets)
      .set({
        ...updateData,
        lastUpdated: new Date().toISOString()
      })
      .where(eq(tickets.id, ticketId))
      .returning();

    return updatedTicket;
  }
}

export const storage = new DatabaseStorage();
