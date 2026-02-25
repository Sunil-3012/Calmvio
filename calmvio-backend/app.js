import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import corsMiddleware from './middleware/cors.js';
import rateLimitMiddleware from './middleware/rateLimit.js';
import chatRoutes from './routes/chat.routes.js';
import moodRoutes from './routes/mood.routes.js';
import resourcesRoutes from './routes/resources.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app  = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(rateLimitMiddleware);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/chat',      chatRoutes);
app.use('/api/mood',      moodRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/admin',     adminRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status:    'ok',
    service:   'Calmivo API',
    database:  mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error:   'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ── Database + Server start ───────────────────────────────────────────────────
async function startServer() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.warn('⚠️  MongoDB not connected — running without persistence:', err.message);
    }
  } else {
    console.warn('⚠️  MONGODB_URI not set — running without persistence');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Calmivo API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();