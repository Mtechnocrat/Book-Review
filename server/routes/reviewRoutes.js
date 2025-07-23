// Review routes
// server/routes/reviewRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listReviews,
  addReview
} from "../controllers/reviewController.js";
import { reviewRules } from "../validators/reviewValidator.js";

const router = express.Router({ mergeParams: true });

router.get("/", listReviews);
router.post("/", protect, reviewRules, addReview);

export default router;
