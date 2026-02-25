import rateLimit from 'express-rate-limit';

const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests — please slow down and try again in 15 minutes.',
  },
  skip: (req) => req.path === '/api/health', // don't rate-limit health checks
});

export default rateLimitMiddleware;
