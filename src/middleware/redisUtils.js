const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.error('Redis Client Error', err));
client.connect();

// Rate Limiter: 100 requests per minute
const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rate_limit:${ip}`;
    
    const requests = await client.incr(key);
    if (requests === 1) await client.expire(key, 60);

    if (requests > 100) {
      const ttl = await client.ttl(key);
      res.set('Retry-After', ttl);
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Cache Middleware
const cacheProvider = (duration) => async (req, res, next) => {
  const key = `__express__${req.originalUrl || req.url}`;
  try {
    const cachedBody = await client.get(key);
    if (cachedBody) {
      return res.status(200).json(JSON.parse(cachedBody));
    } else {
      res.sendResponse = res.json;
      res.json = (body) => {
        client.setEx(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };
      next();
    }
  } catch (err) {
    next(); // Fail gracefully: if Redis is down, just go to DB
  }
};

// Invalidator Helper
const invalidateCache = async (pattern) => {
  const keys = await client.keys(pattern);
  if (keys.length > 0) await client.del(keys);
};

module.exports = { rateLimiter, cacheProvider, invalidateCache };