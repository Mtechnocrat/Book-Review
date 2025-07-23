// Review schema
// server/models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true }
  },
  { timestamps: true }
);

// Enforce one review per user per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// After save/update ---> recalc book stats
async function updateStats(doc) {
  const agg = await doc.constructor.aggregate([
    { $match: { book: doc.book } },
    {
      $group: {
        _id: "$book",
        avg: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);
  const { avg = 0, count = 0 } = agg[0] || {};
  await mongoose.model("Book").findByIdAndUpdate(doc.book, {
    averageRating: avg,
    ratingsCount: count
  });
}
reviewSchema.post("save", updateStats);
reviewSchema.post("findOneAndUpdate", updateStats);
reviewSchema.post("findOneAndDelete", updateStats);

export default mongoose.model("Review", reviewSchema);
