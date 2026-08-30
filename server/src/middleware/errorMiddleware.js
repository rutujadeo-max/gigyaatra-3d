const notFound = (_req, res, _next) => {
  res.status(404).json({ message: 'Route not found' });
};

const errorHandler = (err, _req, res, _next) => {
  if (err?.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      message: 'A record with this value already exists',
      field: err.sqlMessage?.includes('users_email_unique') ? 'email' : null,
    });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
