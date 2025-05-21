import axios from 'axios';
import { storage } from './storage';

// Define the shape of an Intercom contact/lead
export interface IntercomContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: number;
  updated_at: number;
  role?: string;
  company?: {
    id: string;
    name: string;
  };
  custom_attributes?: Record<string, any>;
}

/**
 * Fetches all contacts from Intercom and syncs them with the portal users
 * This can be run as a scheduled job to keep users in sync
 */
export async function syncIntercomContactsToUsers(): Promise<{
  created: number;
  updated: number;
  errors: number;
}> {
  try {
    let hasMore = true;
    let startingAfter: string | undefined = undefined;
    let created = 0;
    let updated = 0;
    let errors = 0;

    // Process contacts in batches
    while (hasMore) {
      let response: any;
      response = await axios.get(
        'https://api.intercom.io/contacts',
        {
          headers: {
            'Authorization': `Bearer ${process.env.INTERCOM_ACCESS_TOKEN}`,
            'Accept': 'application/json'
          },
          params: {
            per_page: 50,
            ...(startingAfter ? { starting_after: startingAfter } : {})
          }
        }
      );

      const contacts: IntercomContact[] = response.data.data;
      
      // Process each contact to create/update user
      for (const contact of contacts) {
        if (contact.email) {
          try {
            // Check if user already exists
            const existingUser = await storage.getUserByEmail(contact.email);
            
            if (existingUser) {
              // Update existing user with latest data from Intercom
              await storage.updateUserFromIntercom(existingUser.id, {
                email: contact.email,
                firstName: contact.name?.split(' ')[0] || null,
                lastName: contact.name?.split(' ').slice(1).join(' ') || null,
                intercomId: contact.id,
                phone: contact.phone || null,
                companyName: contact.company?.name || null,
                updatedAt: new Date()
              });
              updated++;
            } else {
              // Create new user from Intercom contact
              await storage.createUserFromIntercom({
                id: `intercom_${contact.id}`, // Generate a unique ID based on Intercom ID
                email: contact.email,
                firstName: contact.name?.split(' ')[0] || null,
                lastName: contact.name?.split(' ').slice(1).join(' ') || null,
                intercomId: contact.id,
                phone: contact.phone || null,
                companyName: contact.company?.name || null,
                createdAt: new Date(),
                updatedAt: new Date()
              });
              created++;
            }
          } catch (error) {
            console.error(`Error processing contact ${contact.id}:`, error);
            errors++;
          }
        }
      }

      // Check if there are more contacts to fetch
      hasMore = !!response.data.pages.next;
      startingAfter = response.data.pages.next?.starting_after;
    }

    console.log(`Intercom sync complete: ${created} created, ${updated} updated, ${errors} errors`);
    return { created, updated, errors };
  } catch (error) {
    console.error('Error syncing Intercom contacts:', error);
    throw error;
  }
}

/**
 * Fetches a specific contact by email from Intercom
 */
export async function getIntercomContactByEmail(email: string): Promise<IntercomContact | null> {
  try {
    const response = await axios.post(
      'https://api.intercom.io/contacts/search',
      {
        query: {
          field: 'email',
          operator: '=',
          value: email
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.INTERCOM_ACCESS_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.data.length === 0) {
      return null;
    }

    return response.data.data[0];
  } catch (error) {
    console.error(`Error fetching Intercom contact by email ${email}:`, error);
    return null;
  }
}

/**
 * Import a specific email from Intercom and create/update user
 */
export async function importIntercomContactByEmail(email: string): Promise<boolean> {
  try {
    const contact = await getIntercomContactByEmail(email);
    
    if (!contact) {
      return false;
    }
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    
    if (existingUser) {
      // Update existing user with latest data from Intercom
      await storage.updateUserFromIntercom(existingUser.id, {
        email: contact.email,
        firstName: contact.name?.split(' ')[0] || null,
        lastName: contact.name?.split(' ').slice(1).join(' ') || null,
        intercomId: contact.id,
        phone: contact.phone || null,
        companyName: contact.company?.name || null,
        updatedAt: new Date()
      });
    } else {
      // Create new user from Intercom contact
      await storage.createUserFromIntercom({
        id: `intercom_${contact.id}`, // Generate a unique ID based on Intercom ID
        email: contact.email,
        firstName: contact.name?.split(' ')[0] || null,
        lastName: contact.name?.split(' ').slice(1).join(' ') || null,
        intercomId: contact.id,
        phone: contact.phone || null,
        companyName: contact.company?.name || null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error(`Error importing Intercom contact by email ${email}:`, error);
    return false;
  }
}