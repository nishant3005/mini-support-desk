import { api } from "./client";
import type {
  Ticket,
  ListTicketsParams,
  ListTicketsResponse,
  CreateTicketInput,
  UpdateTicketInput,
} from "@/types";

export async function fetchTickets(params?: ListTicketsParams): Promise<ListTicketsResponse> {
  const { data } = await api.get<ListTicketsResponse>("/tickets", { params });
  return data;
}

export async function fetchTicket(id: string): Promise<Ticket> {
  const { data } = await api.get<Ticket>(`/tickets/${id}`);
  return data;
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const { data } = await api.post<Ticket>("/tickets", input);
  return data;
}

export async function updateTicket(id: string, input: UpdateTicketInput): Promise<Ticket> {
  const { data } = await api.patch<Ticket>(`/tickets/${id}`, input);
  return data;
}

export async function deleteTicket(id: string): Promise<void> {
  await api.delete(`/tickets/${id}`);
}
