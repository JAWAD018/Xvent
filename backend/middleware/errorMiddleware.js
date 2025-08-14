// errorMiddleware.js

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.statusCode || res.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
};
