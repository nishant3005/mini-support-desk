import type { Request, Response, NextFunction } from "express";
import type { Schema } from "joi";

type Target = "body" | "query" | "params";

export function validate(schema: Schema, target: Target = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const value = req[target];
    const { error, value: validated } = schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });
    if (error) {
      next(error);
      return;
    }
    (req as unknown as Record<string, unknown>)[target] = validated;
    next();
  };
}
