import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (res.headersSent) {
    return;
  }

  // Validation error (Joi)
  if (err && typeof err === "object" && "details" in err && Array.isArray((err as { details: unknown }).details)) {
    const joiErr = err as { details: Array<{ message: string }> };
    res.status(400).json({
      error: "Validation failed",
      details: joiErr.details.map((d) => d.message),
    });
    return;
  }

  // Prisma not found (P2025)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  // Prisma unique / foreign key etc.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2003") {
      res.status(404).json({ error: "Related resource not found" });
      return;
    }
    res.status(400).json({ error: "Database error", details: err.meta });
    return;
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  const status = (err as { status?: number })?.status ?? 500;
  res.status(status).json({ error: message });
}
