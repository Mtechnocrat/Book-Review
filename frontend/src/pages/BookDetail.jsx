// src/pages/BookDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import ReviewList from "../components/ReviewList";
import { bookAPI } from "../services/api";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  const load = async () => {
    const b = await bookAPI.getBook(id);
    const r = await bookAPI.getBookReviews(id);
    setBook(b);
    setReviews(r);
  };

  useEffect(() => { load(); }, [id]);

  if (!book) return <p>Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold">{book.title}</h2>
        <p className="text-gray-600 mb-2">by {book.author}</p>
        <StarRating rating={book.averageRating} readonly />
        <p className="mt-4 text-gray-700 whitespace-pre-wrap">{book.description}</p>
      </div>

      <ReviewList
        bookId={id}
        reviews={reviews}
        onReviewAdded={load}   // refresh after submit
      />
    </div>
  );
};

export default BookDetail;
