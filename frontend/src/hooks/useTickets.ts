import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTickets,
  fetchTicket,
  createTicket,
  updateTicket,
  deleteTicket,
} from "@/api/tickets";
import type { ListTicketsParams, CreateTicketInput, UpdateTicketInput } from "@/types";

export const ticketKeys = {
  all: ["tickets"] as const,
  lists: () => [...ticketKeys.all, "list"] as const,
  list: (params?: ListTicketsParams) => [...ticketKeys.lists(), params] as const,
  detail: (id: string) => [...ticketKeys.all, "detail", id] as const,
};

export function useTickets(params?: ListTicketsParams) {
  return useQuery({
    queryKey: ticketKeys.list(params),
    queryFn: () => fetchTickets(params),
  });
}

export function useTicket(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ticketKeys.detail(id ?? ""),
    queryFn: () => fetchTicket(id!),
    enabled: !!id && enabled,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTicketInput) => createTicket(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}

export function useUpdateTicket(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTicketInput) => updateTicket(id, input),
    onSuccess: (data) => {
      queryClient.setQueryData(ticketKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}
