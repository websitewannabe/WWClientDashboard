import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

import { fetchIntercomTickets, getIntercomTicketById } from "./intercom";
import { syncIntercomContactsToUsers, importIntercomContactByEmail } from "./intercom-sync";
import { fetchGoogleAnalyticsData } from "./google-analytics";

export async function registerRoutes(app: Express): Server {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get("/api/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  // Invoices
  app.get("/api/invoices", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoices = await storage.getInvoices(userId);
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  // Support tickets
  app.get("/api/tickets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tickets = await storage.getTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  // Analytics data - from database
  app.get("/api/analytics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const timeframe = req.query.timeframe || 'monthly';
      const analytics = await storage.getAnalytics(userId, timeframe);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  // Google Analytics data - from GA
  app.get("/api/analytics/ga", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const timeframe = req.query.timeframe || 'last30days';
      
      // Get the user to fetch their GA measurement ID
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Use the client's specific GA Measurement ID if available
      const clientGAId = user.gaMeasurementId || import.meta.env.VITE_GA_MEASUREMENT_ID;
      
      // Fetch analytics data from Google Analytics using the client's credentials
      const analytics = await fetchGoogleAnalyticsData(timeframe as string, userId, clientGAId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching Google Analytics data:", error);
      res.status(500).json({ message: "Failed to fetch analytics data from Google Analytics" });
    }
  });

  // Create new support ticket
  app.post("/api/tickets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ticketData = req.body;
      const ticket = await storage.createTicket(userId, ticketData);
      res.status(201).json(ticket);
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ message: "Failed to create support ticket" });
    }
  });

  // Update ticket status
  app.patch("/api/tickets/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ticketId = req.params.id;
      const updateData = req.body;
      const updatedTicket = await storage.updateTicket(userId, ticketId, updateData);
      res.json(updatedTicket);
    } catch (error) {
      console.error("Error updating ticket:", error);
      res.status(500).json({ message: "Failed to update support ticket" });
    }
  });

  // Intercom ticket integration routes
  app.get('/api/tickets/intercom', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.email) {
        return res.status(400).json({ message: 'User email not found' });
      }
      
      const tickets = await fetchIntercomTickets(user.email);
      res.json(tickets);
    } catch (error) {
      console.error('Error fetching Intercom tickets:', error);
      res.status(500).json({ message: 'Failed to fetch tickets from Intercom' });
    }
  });

  app.get('/api/tickets/intercom/:ticketId', isAuthenticated, async (req, res) => {
    try {
      const ticketId = req.params.ticketId;
      const ticket = await getIntercomTicketById(ticketId);
      
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      
      res.json(ticket);
    } catch (error) {
      console.error('Error fetching Intercom ticket details:', error);
      res.status(500).json({ message: 'Failed to fetch ticket details from Intercom' });
    }
  });

  // Intercom contacts sync endpoints (admin only)
  app.post('/api/admin/intercom/sync-all-contacts', isAuthenticated, async (req: any, res) => {
    try {
      // In a production environment, you'd want to ensure this is only called by admins
      const result = await syncIntercomContactsToUsers();
      res.json(result);
    } catch (error) {
      console.error('Error syncing Intercom contacts:', error);
      res.status(500).json({ message: 'Error syncing Intercom contacts' });
    }
  });
  
  // Import a single Intercom contact by email
  app.post('/api/admin/intercom/import-contact', isAuthenticated, async (req: any, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      const success = await importIntercomContactByEmail(email);
      if (success) {
        res.json({ message: 'Contact imported successfully' });
      } else {
        res.status(404).json({ message: 'Contact not found in Intercom' });
      }
    } catch (error) {
      console.error('Error importing Intercom contact:', error);
      res.status(500).json({ message: 'Error importing Intercom contact' });
    }
  });
  
  // Get all clients for admin
  app.get('/api/admin/clients', isAuthenticated, async (req: any, res) => {
    try {
      // In a production app, you'd want to check if the user is an admin
      const clients = await storage.getAllUsers();
      res.json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ message: 'Failed to fetch clients' });
    }
  });
  
  // Update client Google Analytics settings
  app.patch('/api/admin/clients/:id/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const clientId = req.params.id;
      const { gaMeasurementId, gaPropertyId, gaViewId } = req.body;
      
      // In a production app, you'd want to check if the user is an admin
      
      const updatedClient = await storage.updateUserAnalytics(clientId, {
        gaMeasurementId,
        gaPropertyId,
        gaViewId
      });
      
      res.json(updatedClient);
    } catch (error) {
      console.error('Error updating client analytics settings:', error);
      res.status(500).json({ message: 'Failed to update client analytics settings' });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
