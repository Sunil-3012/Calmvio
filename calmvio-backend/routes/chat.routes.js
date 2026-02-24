import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage } from '../claude.service.js';
import { detectCrisis } from '../crisisDetect.js';

const router = Router();

// ── In-memory session store (replaced by MongoDB when MONGODB_URI is set) ────
// Map<sessionId, { messages: Array, crisisTriggered: boolean }>
const sessions = new Map();

function getOrCreateSession(sessionId) {
  if (!sessionId || !sessions.has(sessionId)) {
    const id = sessionId || uuidv4();
    sessions.set(id, { messages: [], crisisTriggered: false });
    return { id, session: sessions.get(id) };
  }
  return { id: sessionId, session: sessions.get(sessionId) };
}

// ── POST /api/chat — send a message ─────────────────────────────────────────
router.post('/', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
  }

  const { id, session } = getOrCreateSession(sessionId);

  // Crisis detection runs BEFORE the AI responds
  const crisis = detectCrisis(message);
  if (crisis.detected) {
    session.crisisTriggered = true;
  }

  try {
    // Get AI response from Claude
    const aiResponse = await sendMessage(session.messages, message.trim());

    // Save conversation to session history
    session.messages.push(
      { role: 'user',      content: message.trim() },
      { role: 'assistant', content: aiResponse }
    );

    const response = {
      sessionId: id,
      message: aiResponse,
      timestamp: new Date().toISOString(),
    };

    if (crisis.detected) {
      response.crisis = crisis.response;
    }

    return res.json(response);
  } catch (err) {
    console.error('Claude API error:', err.message);
    return res.status(500).json({ error: 'Failed to get a response from the AI. Please try again.' });
  }
});

// ── GET /api/chat/:sessionId/history ────────────────────────────────────────
router.get('/:sessionId/history', (req, res) => {
  const { sessionId } = req.params;

  if (!sessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found.' });
  }

  const session = sessions.get(sessionId);

  return res.json({
    sessionId,
    messages: session.messages,
    crisisTriggered: session.crisisTriggered,
  });
});

// ── DELETE /api/chat/:sessionId ──────────────────────────────────────────────
router.delete('/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  if (!sessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found.' });
  }

  sessions.delete(sessionId);
  return res.json({ success: true, message: 'Session cleared.' });
});

export default router;
