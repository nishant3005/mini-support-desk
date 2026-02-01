import Joi from "joi";
import { TicketPriority, TicketStatus } from "@prisma/client";

const statusValues = Object.values(TicketStatus) as string[];
const priorityValues = Object.values(TicketPriority) as string[];

export const createTicketSchema = Joi.object({
  title: Joi.string().min(5).max(80).required().messages({
    "string.min": "Title must be at least 5 characters",
    "string.max": "Title must be at most 80 characters",
  }),
  description: Joi.string().min(20).max(2000).required().messages({
    "string.min": "Description must be at least 20 characters",
    "string.max": "Description must be at most 2000 characters",
  }),
  priority: Joi.string()
    .valid(...priorityValues)
    .default("MEDIUM"),
});

export const updateTicketSchema = Joi.object({
  title: Joi.string().min(5).max(80),
  description: Joi.string().min(20).max(2000),
  status: Joi.string().valid(...statusValues),
  priority: Joi.string().valid(...priorityValues),
})
  .min(1)
  .messages({
    "object.min": "At least one field (title, description, status, priority) is required",
  });

export const listTicketsQuerySchema = Joi.object({
  q: Joi.string().allow("").optional(),
  status: Joi.string().valid(...statusValues).optional(),
  priority: Joi.string().valid(...priorityValues).optional(),
  sort: Joi.string().valid("createdAt:asc", "createdAt:desc").default("createdAt:desc"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const ticketIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
