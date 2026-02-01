import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import ticketsRouter from "./routes/tickets.js";
import commentsRouter from "./routes/comments.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(requestLogger);

app.use("/api/tickets/:id/comments", commentsRouter);
app.use("/api/tickets", ticketsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;
