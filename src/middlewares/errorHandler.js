/**
 * Global Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled Server Error:', err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

/**
 * 404 Route Not Found Middleware
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
