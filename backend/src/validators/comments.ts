import Joi from "joi";

export const createCommentSchema = Joi.object({
  authorName: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Author name is required",
  }),
  message: Joi.string().trim().min(1).max(500).required().messages({
    "string.min": "Message must be at least 1 character",
    "string.max": "Message must be at most 500 characters",
  }),
});

export const listCommentsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const ticketIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
