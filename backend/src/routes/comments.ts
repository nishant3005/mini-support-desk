import { Router } from "express";
import * as commentService from "../services/commentService.js";
import { validate } from "../middleware/validate.js";
import {
  createCommentSchema,
  listCommentsQuerySchema,
  ticketIdParamSchema,
} from "../validators/comments.js";
import { prisma } from "../lib/prisma.js";

const router = Router({ mergeParams: true });

router.get(
  "/",
  validate(ticketIdParamSchema, "params"),
  validate(listCommentsQuerySchema, "query"),
  async (req, res, next) => {
    try {
      const ticketId = req.params.id;
      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
      if (!ticket) {
        res.status(404).json({ error: "Ticket not found" });
        return;
      }
      const { page, limit } = req.query as unknown as { page: number; limit: number };
      const result = await commentService.listCommentsByTicketId({
        ticketId,
        page: Number(page) || 1,
        limit: Number(limit) || 20,
      });
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/",
  validate(ticketIdParamSchema, "params"),
  validate(createCommentSchema, "body"),
  async (req, res, next) => {
    try {
      const ticketId = req.params.id;
      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
      if (!ticket) {
        res.status(404).json({ error: "Ticket not found" });
        return;
      }
      const comment = await commentService.createComment({
        ticketId,
        authorName: req.body.authorName,
        message: req.body.message,
      });
      res.status(201).json(comment);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
