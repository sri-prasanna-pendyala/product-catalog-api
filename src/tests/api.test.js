const request = require('supertest');
const app = require('../server'); // Export app from server.js for testing

describe('Product API Advanced Features', () => {
  it('should return 429 when rate limit is exceeded', async () => {
    // Send 101 requests rapidly
    for(let i = 0; i < 100; i++) {
      await request(app).get('/api/products');
    }
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(429);
  });

  it('should invalidate cache when a product is updated', async () => {
    const productId = 'some-mongo-id';
    // 1. Get product (sets cache)
    await request(app).get(`/api/products/${productId}`);
    
    // 2. Update product
    await request(app).put(`/api/products/${productId}`).send({ price: 99 });
    
    // 3. Verify Redis key is deleted (Manual check or check response headers)
  });
});