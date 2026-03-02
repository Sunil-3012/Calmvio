import rateLimit from 'express-rate-limit';

// ── General rate limit — applies to all routes ────────────────────────────────
// 100 requests per 15 minutes per IP covers mood, resources, admin, etc.
const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    error: 'Too many requests — please slow down and try again in 15 minutes.',
  },
  skip: (req) => req.path === '/api/health',
});

// ── Strict chat rate limit — applied only to POST /api/chat ──────────────────
// Each message calls the Anthropic API which costs real money.
// 20 messages per 10 minutes is generous for real users
// but stops abuse and accidental cost explosions.
export const chatRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max:      20,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    error: 'You\'re sending messages too quickly. Please wait a few minutes before trying again.',
  },
});

export default rateLimitMiddleware;
