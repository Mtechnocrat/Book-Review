// Book controller logic

// server/controllers/bookController.js
import Book from "../models/Book.js";
import { handleValidation } from "../validators/handleValidation.js";

export const listBooks = async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
};

export const getBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

export const createBook = async (req, res) => {
  if (handleValidation(req, res)) return;
  const book = await Book.create(req.body);
  res.status(201).json(book);
};
