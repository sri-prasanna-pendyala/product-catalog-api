const express = require('express');
const mongoose = require('mongoose');
const runSeeder = require('./config/seed');
const { rateLimiter } = require('./middleware/redisUtils');
const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(express.json());

app.use(rateLimiter);
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));
app.use('/api/products', productRoutes);
app.use(errorHandler);

const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/product_catalog';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await runSeeder();
    // Use 0.0.0.0 to allow Docker port mapping
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });