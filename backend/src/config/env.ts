const PORT = parseInt(process.env.PORT ?? "3000", 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";

export const env = {
  PORT: Number.isNaN(PORT) ? 3000 : PORT,
  CORS_ORIGIN,
};
