import cors from 'cors';

const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    // Allow localhost in development
    if (origin.includes('localhost')) return callback(null, true);

    // Allow all Vercel deployments (preview + production)
    if (origin.endsWith('.vercel.app')) return callback(null, true);

    // Allow custom domain if set
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-token', 'x-admin-key'],
  credentials: true,
});

export default corsMiddleware;