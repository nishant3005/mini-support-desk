export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface ListTicketsParams {
  q?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  sort?: "createdAt:asc" | "createdAt:desc";
  page?: number;
  limit?: number;
}

export interface ListTicketsResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  limit: number;
}

export interface ListCommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority?: TicketPriority;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
}

export interface CreateCommentInput {
  authorName: string;
  message: string;
}
