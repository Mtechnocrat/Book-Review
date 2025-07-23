// Book validation
// server/validators/bookValidator.js
import { body } from "express-validator";

export const bookRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("description").optional().isLength({ max: 2000 })
];
