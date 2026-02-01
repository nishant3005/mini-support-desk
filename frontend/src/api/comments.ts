import { api } from "./client";
import type { Comment, CreateCommentInput, ListCommentsResponse } from "@/types";

export async function fetchComments(
  ticketId: string,
  page = 1,
  limit = 20
): Promise<ListCommentsResponse> {
  const { data } = await api.get<ListCommentsResponse>(`/tickets/${ticketId}/comments`, {
    params: { page, limit },
  });
  return data;
}

export async function createComment(
  ticketId: string,
  input: CreateCommentInput
): Promise<Comment> {
  const { data } = await api.post<Comment>(`/tickets/${ticketId}/comments`, input);
  return data;
}
