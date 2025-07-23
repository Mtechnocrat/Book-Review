// Review controller logic
// server/controllers/reviewController.js
import Review from "../models/Review.js";
import { handleValidation } from "../validators/handleValidation.js";

export const listReviews = async (req, res) => {
  const reviews = await Review.find({ book: req.params.bookId })
    .populate("user", "name")
    .sort({ createdAt: -1 });
  res.json(reviews);
};

export const addReview = async (req, res) => {
  if (handleValidation(req, res)) return;
  const review = await Review.create({
    ...req.body,
    book: req.params.bookId,
    user: req.user.id
  });
  res.status(201).json(review);
};
