import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { sendMessage } from '../claude.service.js';
import { detectCrisis } from '../crisisDetect.js';
import Session from '../models/Session.js';

const router = Router();

// ── Fallback in-memory store (used when MongoDB is not connected) ─────────────
const memSessions = new Map();

const isMongoConnected = () => mongoose.connection.readyState === 1;

// ── Helpers ───────────────────────────────────────────────────────────────────
async function getOrCreateSession(sessionId) {
  const id = sessionId || uuidv4();

  if (isMongoConnected()) {
    let session = await Session.findOne({ sessionId: id });
    if (!session) {
      session = await Session.create({ sessionId: id, messages: [] });
    }
    return { id, session };
  }

  // Fallback: in-memory
  if (!memSessions.has(id)) {
    memSessions.set(id, { messages: [], crisisTriggered: false });
  }
  return { id, session: memSessions.get(id) };
}

// ── POST /api/chat ────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
  }

  const { id, session } = await getOrCreateSession(sessionId);

  // Crisis detection runs BEFORE the AI responds
  const crisis = detectCrisis(message);
  if (crisis.detected) session.crisisTriggered = true;

  try {
    // Build clean history for Claude (only role + content)
    const history = session.messages.map(({ role, content }) => ({ role, content }));

    // Get AI response from Claude
    const aiResponse = await sendMessage(history, message.trim());

    // Save messages
    session.messages.push(
      { role: 'user',      content: message.trim() },
      { role: 'assistant', content: aiResponse      }
    );

    if (isMongoConnected()) await session.save();

    const response = {
      sessionId: id,
      message:   aiResponse,
      timestamp: new Date().toISOString(),
    };

    if (crisis.detected) response.crisis = crisis.response;

    return res.json(response);
  } catch (err) {
    console.error('Claude API error:', err.message);
    return res.status(500).json({ error: 'Failed to get a response from the AI. Please try again.' });
  }
});

// ── GET /api/chat/:sessionId/history ─────────────────────────────────────────
router.get('/:sessionId/history', async (req, res) => {
  const { sessionId } = req.params;

  if (isMongoConnected()) {
    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    return res.json({
      sessionId,
      messages:        session.messages,
      crisisTriggered: session.crisisTriggered,
    });
  }

  if (!memSessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found.' });
  }
  const session = memSessions.get(sessionId);
  return res.json({ sessionId, messages: session.messages, crisisTriggered: session.crisisTriggered });
});

// ── DELETE /api/chat/:sessionId ───────────────────────────────────────────────
router.delete('/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (isMongoConnected()) {
    const result = await Session.findOneAndDelete({ sessionId });
    if (!result) return res.status(404).json({ error: 'Session not found.' });
    return res.json({ success: true, message: 'Session cleared.' });
  }

  if (!memSessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found.' });
  }
  memSessions.delete(sessionId);
  return res.json({ success: true, message: 'Session cleared.' });
});

export default router;