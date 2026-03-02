export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  const response = { message };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(status).json(response);
};