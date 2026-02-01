import { Prisma, TicketPriority, TicketStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export type ListTicketsFilters = {
  q?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  sort?: "createdAt:asc" | "createdAt:desc";
  page: number;
  limit: number;
};

export type CreateTicketInput = {
  title: string;
  description: string;
  priority?: TicketPriority;
};

export type UpdateTicketInput = {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
};

export async function listTickets(filters: ListTicketsFilters) {
  const { q, status, priority, sort = "createdAt:desc", page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.TicketWhereInput = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (q && q.trim()) {
    where.OR = [
      { title: { contains: q.trim(), mode: "insensitive" } },
      { description: { contains: q.trim(), mode: "insensitive" } },
    ];
  }

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy: { createdAt: sort === "createdAt:asc" ? "asc" : "desc" },
      skip,
      take: limit,
    }),
    prisma.ticket.count({ where }),
  ]);

  return { tickets, total, page, limit };
}

export async function getTicketById(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: { comments: false },
  });
}

export async function createTicket(data: CreateTicketInput) {
  return prisma.ticket.create({
    data: {
      title: data.title.trim(),
      description: data.description.trim(),
      priority: (data.priority as TicketPriority) ?? TicketPriority.MEDIUM,
    },
  });
}

export async function updateTicket(id: string, data: UpdateTicketInput) {
  const payload: Prisma.TicketUpdateInput = {};
  if (data.title !== undefined) payload.title = data.title.trim();
  if (data.description !== undefined) payload.description = data.description.trim();
  if (data.status !== undefined) payload.status = data.status;
  if (data.priority !== undefined) payload.priority = data.priority;

  return prisma.ticket.update({
    where: { id },
    data: payload,
  });
}

export async function deleteTicket(id: string) {
  return prisma.ticket.delete({
    where: { id },
  });
}
