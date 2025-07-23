// Book schema
// server/models/Book.js
import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String },
    coverUrl: String,
    averageRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// text index for search
bookSchema.index({ title: "text", author: "text" });

export default mongoose.model("Book", bookSchema);
