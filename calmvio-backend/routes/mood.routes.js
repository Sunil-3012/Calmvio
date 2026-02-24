import { Router } from 'express';

const router = Router();

// ── Mood label + emoji map ───────────────────────────────────────────────────
const MOOD_LABELS = {
  1: { label: 'Very Low',  emoji: '😞' },
  2: { label: 'Low',       emoji: '😔' },
  3: { label: 'Okay',      emoji: '😐' },
  4: { label: 'Good',      emoji: '🙂' },
  5: { label: 'Great',     emoji: '😁' },
};

const VALID_TAGS = [
  'anxious', 'sad', 'angry', 'stressed', 'tired',
  'calm', 'happy', 'grateful', 'hopeful', 'overwhelmed',
];

// In-memory mood store: Map<sessionId, Array<moodEntry>>
const moodStore = new Map();

// ── POST /api/mood — log a mood entry ───────────────────────────────────────
router.post('/', (req, res) => {
  const { sessionId, score, note, tags } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required.' });
  }
  if (!score || typeof score !== 'number' || score < 1 || score > 5) {
    return res.status(400).json({ error: 'score must be a number between 1 and 5.' });
  }

  const sanitizedTags = Array.isArray(tags)
    ? tags.filter((t) => VALID_TAGS.includes(t))
    : [];

  const entry = {
    sessionId,
    score,
    label: MOOD_LABELS[score].label,
    emoji: MOOD_LABELS[score].emoji,
    note: note ? String(note).slice(0, 500) : '',
    tags: sanitizedTags,
    createdAt: new Date().toISOString(),
  };

  if (!moodStore.has(sessionId)) {
    moodStore.set(sessionId, []);
  }
  moodStore.get(sessionId).push(entry);

  return res.status(201).json({ success: true, mood: entry });
});

// ── GET /api/mood/:sessionId — mood history ──────────────────────────────────
router.get('/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const limit = parseInt(req.query.limit) || 30;

  const history = moodStore.get(sessionId) || [];
  const recent = history.slice(-limit);

  return res.json({ sessionId, moods: recent, total: history.length });
});

// ── GET /api/mood/:sessionId/summary ────────────────────────────────────────
router.get('/:sessionId/summary', (req, res) => {
  const { sessionId } = req.params;
  const history = moodStore.get(sessionId) || [];

  if (history.length === 0) {
    return res.json({ summary: null, message: 'No mood entries found for this session.' });
  }

  const scores = history.map((e) => e.score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Simple trend: compare last 3 vs previous 3
  let trend = 'stable';
  if (scores.length >= 6) {
    const recent = scores.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const previous = scores.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
    if (recent > previous + 0.4) trend = 'improving';
    else if (recent < previous - 0.4) trend = 'declining';
  }

  return res.json({
    summary: {
      averageScore: Math.round(avg * 10) / 10,
      totalEntries: history.length,
      recentMood: history[history.length - 1],
      trend,
    },
  });
});

export default router;
