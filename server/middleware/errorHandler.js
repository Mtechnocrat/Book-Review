// Global error handler
// server/middleware/errorHandler.js
export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res
    .status(res.statusCode === 200 ? 500 : res.statusCode)
    .json({ message: err.message });
};
