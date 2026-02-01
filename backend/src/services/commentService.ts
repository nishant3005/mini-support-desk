import { prisma } from "../lib/prisma.js";

export type CreateCommentInput = {
  ticketId: string;
  authorName: string;
  message: string;
};

export type ListCommentsFilters = {
  ticketId: string;
  page: number;
  limit: number;
};

export async function listCommentsByTicketId(filters: ListCommentsFilters) {
  const { ticketId, page, limit } = filters;
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
    }),
    prisma.comment.count({ where: { ticketId } }),
  ]);

  return { comments, total, page, limit };
}

export async function createComment(data: CreateCommentInput) {
  return prisma.comment.create({
    data: {
      ticketId: data.ticketId,
      authorName: data.authorName.trim(),
      message: data.message.trim(),
    },
  });
}
