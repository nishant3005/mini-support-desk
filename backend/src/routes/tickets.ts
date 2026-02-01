import { Router } from "express";
import * as ticketService from "../services/ticketService.js";
import { validate } from "../middleware/validate.js";
import {
  createTicketSchema,
  updateTicketSchema,
  listTicketsQuerySchema,
  ticketIdParamSchema,
} from "../validators/tickets.js";
import type { TicketStatus, TicketPriority } from "@prisma/client";

const router = Router();

router.get(
  "/",
  validate(listTicketsQuerySchema, "query"),
  async (req, res, next) => {
    try {
      const { q, status, priority, sort, page, limit } = req.query as unknown as {
        q?: string;
        status?: TicketStatus;
        priority?: TicketPriority;
        sort?: "createdAt:asc" | "createdAt:desc";
        page: number;
        limit: number;
      };
      const result = await ticketService.listTickets({
        q,
        status,
        priority,
        sort: sort ?? "createdAt:desc",
        page: Number(page) || 1,
        limit: Number(limit) || 20,
      });
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.post("/", validate(createTicketSchema, "body"), async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (e) {
    next(e);
  }
});

router.get(
  "/:id",
  validate(ticketIdParamSchema, "params"),
  async (req, res, next) => {
    try {
      const ticket = await ticketService.getTicketById(req.params.id);
      if (!ticket) {
        res.status(404).json({ error: "Ticket not found" });
        return;
      }
      res.json(ticket);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/:id",
  validate(ticketIdParamSchema, "params"),
  validate(updateTicketSchema, "body"),
  async (req, res, next) => {
    try {
      const ticket = await ticketService.updateTicket(req.params.id, req.body);
      res.json(ticket);
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  "/:id",
  validate(ticketIdParamSchema, "params"),
  async (req, res, next) => {
    try {
      await ticketService.deleteTicket(req.params.id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
);

export default router;
