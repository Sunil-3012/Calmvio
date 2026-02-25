import { Router } from 'express';
import Session   from '../models/Session.js';
import MoodEntry from '../models/MoodEntry.js';

const router = Router();

// ── Simple admin key guard ────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorised.' });
  }
  next();
}

// ── GET /api/admin/sessions — list all sessions ───────────────────────────────
router.get('/sessions', requireAdmin, async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip  = (page - 1) * limit;

  const [sessions, total] = await Promise.all([
    Session.find({})
      .sort({ lastActive: -1 })
      .skip(skip)
      .limit(limit)
      .select('sessionId messageCount crisisTriggered lastActive createdAt'),
    Session.countDocuments(),
  ]);

  return res.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    sessions,
  });
});

// ── GET /api/admin/sessions/:sessionId — full conversation ────────────────────
router.get('/sessions/:sessionId', requireAdmin, async (req, res) => {
  const session = await Session.findOne({ sessionId: req.params.sessionId });
  if (!session) return res.status(404).json({ error: 'Session not found.' });
  return res.json(session);
});

// ── GET /api/admin/stats — overview stats ─────────────────────────────────────
router.get('/stats', requireAdmin, async (req, res) => {
  const [
    totalSessions,
    totalMessages,
    crisisSessions,
    totalMoods,
    moodAvg,
  ] = await Promise.all([
    Session.countDocuments(),
    Session.aggregate([{ $group: { _id: null, total: { $sum: '$messageCount' } } }]),
    Session.countDocuments({ crisisTriggered: true }),
    MoodEntry.countDocuments(),
    MoodEntry.aggregate([{ $group: { _id: null, avg: { $avg: '$score' } } }]),
  ]);

  return res.json({
    totalSessions,
    totalMessages:  totalMessages[0]?.total || 0,
    crisisSessions,
    totalMoodLogs:  totalMoods,
    averageMood:    moodAvg[0]?.avg ? Math.round(moodAvg[0].avg * 10) / 10 : null,
  });
});

// ── GET /api/admin/moods — all mood entries ───────────────────────────────────
router.get('/moods', requireAdmin, async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const moods = await MoodEntry.find({}).sort({ createdAt: -1 }).limit(limit);
  return res.json({ total: moods.length, moods });
});

export default router;
