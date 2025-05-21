import axios from 'axios';

// Define the shape of an Intercom conversation/ticket
export interface IntercomTicket {
  id: string;
  created_at: number;
  updated_at: number;
  title?: string;
  state: string;
  read: boolean;
  waiting_since?: number;
  snoozed_until?: number;
  priority: string;
  source: {
    type: string;
    delivered_as?: string;
    subject?: string;
    body?: string;
    author?: {
      id: string;
      type: string;
      email?: string;
      name?: string;
    }
  },
  tags?: {
    tags: Array<{ id: string, name: string }>;
  };
  first_contact_reply?: {
    created_at: number;
  };
  sla_applied?: {
    sla_name: string;
    sla_status: string;
  };
  team_assignee_id?: string;
  admin_assignee_id?: string;
  conversation_rating?: {
    rating: number;
    remark: string;
    created_at: number;
  };
}

// Type for transformed ticket data sent to frontend
export interface ClientTicket {
  id: string;
  ticketId: string;
  subject: string;
  date: string;
  status: 'open' | 'in-progress' | 'completed' | 'waiting';
  priority: 'low' | 'medium' | 'high';
  description?: string;
  lastUpdated?: string;
  category?: string;
}

// Function to fetch tickets from Intercom
export async function fetchIntercomTickets(clientEmail: string): Promise<ClientTicket[]> {
  try {
    // First, search for the contact by email to get their ID
    const contactResponse = await axios.post(
      'https://api.intercom.io/contacts/search',
      {
        query: {
          field: 'email',
          operator: '=',
          value: clientEmail
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

    if (!contactResponse.data.data.length) {
      console.log(`No Intercom contact found with email: ${clientEmail}`);
      return [];
    }

    const contactId = contactResponse.data.data[0].id;

    // Now fetch conversations for this contact
    const conversationsResponse = await axios.get(
      `https://api.intercom.io/conversations?contact_ids=${contactId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.INTERCOM_ACCESS_TOKEN}`,
          'Accept': 'application/json'
        }
      }
    );

    // Transform the Intercom conversations into our ClientTicket format
    const tickets: ClientTicket[] = conversationsResponse.data.conversations.map((conversation: IntercomTicket) => {
      let status: 'open' | 'in-progress' | 'completed' | 'waiting';
      
      if (conversation.state === 'closed') {
        status = 'completed';
      } else if (conversation.state === 'snoozed') {
        status = 'waiting';
      } else if (conversation.admin_assignee_id) {
        status = 'in-progress';
      } else {
        status = 'open';
      }

      let priority: 'low' | 'medium' | 'high';
      switch (conversation.priority) {
        case 'priority':
          priority = 'high';
          break;
        case 'not_priority':
          priority = 'low';
          break;
        default:
          priority = 'medium';
      }

      return {
        id: conversation.id,
        ticketId: `TICKET-${conversation.id.substring(0, 8).toUpperCase()}`,
        subject: conversation.title || conversation.source.subject || 'No Subject',
        date: new Date(conversation.created_at * 1000).toISOString(),
        status,
        priority,
        description: conversation.source.body || 'No description available',
        lastUpdated: new Date(conversation.updated_at * 1000).toISOString(),
        category: conversation.tags?.tags[0]?.name || 'Support'
      };
    });

    return tickets;
  } catch (error) {
    console.error('Error fetching Intercom tickets:', error);
    throw error;
  }
}

// Function to get ticket details by ID
export async function getIntercomTicketById(ticketId: string): Promise<ClientTicket | null> {
  try {
    const response = await axios.get(
      `https://api.intercom.io/conversations/${ticketId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.INTERCOM_ACCESS_TOKEN}`,
          'Accept': 'application/json'
        }
      }
    );

    const conversation = response.data;
    
    let status: 'open' | 'in-progress' | 'completed' | 'waiting';
    if (conversation.state === 'closed') {
      status = 'completed';
    } else if (conversation.state === 'snoozed') {
      status = 'waiting';
    } else if (conversation.admin_assignee_id) {
      status = 'in-progress';
    } else {
      status = 'open';
    }

    let priority: 'low' | 'medium' | 'high';
    switch (conversation.priority) {
      case 'priority':
        priority = 'high';
        break;
      case 'not_priority':
        priority = 'low';
        break;
      default:
        priority = 'medium';
    }

    return {
      id: conversation.id,
      ticketId: `TICKET-${conversation.id.substring(0, 8).toUpperCase()}`,
      subject: conversation.title || conversation.source.subject || 'No Subject',
      date: new Date(conversation.created_at * 1000).toISOString(),
      status,
      priority,
      description: conversation.source.body || 'No description available',
      lastUpdated: new Date(conversation.updated_at * 1000).toISOString(),
      category: conversation.tags?.tags[0]?.name || 'Support'
    };
  } catch (error) {
    console.error(`Error fetching Intercom ticket ${ticketId}:`, error);
    return null;
  }
}