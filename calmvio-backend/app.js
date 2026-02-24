import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import corsMiddleware from './middleware/cors.js';
import rateLimitMiddleware from './middleware/rateLimit.js';
import chatRoutes from './routes/chat.routes.js';
import moodRoutes from './routes/mood.routes.js';
import resourcesRoutes from './routes/resources.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(rateLimitMiddleware);

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/chat', chatRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/resources', resourcesRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Calmivo API',
    timestamp: new Date().toISOString(),
  });
});

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ── Database + Server start ──────────────────────────────────────────────────
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.warn('⚠️  MongoDB not connected — running without persistence:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Calmivo API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
