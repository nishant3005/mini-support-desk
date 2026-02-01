import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchComments, createComment } from "@/api/comments";
import { ticketKeys } from "./useTickets";
import type { CreateCommentInput } from "@/types";

export const commentKeys = {
  list: (ticketId: string, page?: number, limit?: number) =>
    ["comments", ticketId, page, limit] as const,
};

export function useComments(ticketId: string | undefined, page = 1, limit = 20, enabled = true) {
  return useQuery({
    queryKey: commentKeys.list(ticketId ?? "", page, limit),
    queryFn: () => fetchComments(ticketId!, page, limit),
    enabled: !!ticketId && enabled,
  });
}

export function useCreateComment(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCommentInput) => createComment(ticketId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", ticketId] });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
    },
  });
}
