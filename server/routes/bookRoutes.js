// Book routes
// server/routes/bookRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listBooks,
  getBook,
  createBook
} from "../controllers/bookController.js";
import { bookRules } from "../validators/bookValidator.js";

const router = express.Router();

router.get("/", listBooks);
router.get("/:id", getBook);
router.post("/", protect, bookRules, createBook);

export default router;
