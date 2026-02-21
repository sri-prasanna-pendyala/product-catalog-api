module.exports = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Handle Duplicate Key (SKU)
  if (err.code === 11000) {
    return res.status(400).json({ error: 'SKU must be unique' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};