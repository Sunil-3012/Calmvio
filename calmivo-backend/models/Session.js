import mongoose from 'mongoose';

// ── Message Sub-Schema ────────────────────────────────────────────────────────
// Each message is a sub-document inside a Session.
// We don't give messages their own collection because they are
// always accessed together with their parent session — never alone.
const messageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  content:   { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// ── Session Schema ────────────────────────────────────────────────────────────
const sessionSchema = new mongoose.Schema(
  {
    // The random UUID stored in the user's localStorage.
    // This is the current way we identify a user (no auth yet).
    sessionId: {
      type:     String,
      required: true,
      unique:   true,
      index:    true,
    },

    // Placeholder for future user authentication.
    // When you add login, populate this with the User's _id.
    // Keeping it here now means zero schema changes later.
    userId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'User',
      default: null,
    },

    // Auto-generated from the first user message.
    // Makes it easier to list past conversations in a sidebar.
    title: {
      type:    String,
      default: 'New Conversation',
      maxlength: 100,
    },

    // All messages in this session, newest at the end.
    messages: [messageSchema],

    // Was a crisis keyword ever detected in this session?
    crisisTriggered: { type: Boolean, default: false },

    // How many times was a crisis keyword detected?
    // More useful than a simple true/false for safety monitoring.
    crisisCount: { type: Number, default: 0 },

    // Mirrors messages.length — stored separately so we can
    // query "sessions with more than X messages" without loading
    // the full messages array.
    messageCount: { type: Number, default: 0 },

    // When was the last message sent? Used for sorting and cleanup.
    lastActive: { type: Date, default: Date.now },

    // Soft delete flag. Never hard-delete mental health data.
    // If a user "clears" a conversation, set this to true instead.
    isArchived: { type: Boolean, default: false },
  },
  {
    // Automatically adds createdAt and updatedAt fields.
    timestamps: true,
  }
);

// ── Pre-save Hook ─────────────────────────────────────────────────────────────
// Runs automatically before every session.save() call.
// Keeps messageCount and lastActive always in sync.
sessionSchema.pre('save', function (next) {
  this.lastActive   = new Date();
  this.messageCount = this.messages.length;

  // Auto-generate title from the first user message if still default.
  if (this.title === 'New Conversation' && this.messages.length > 0) {
    const firstUserMsg = this.messages.find((m) => m.role === 'user');
    if (firstUserMsg) {
      // Take first 60 characters of the first message as the title.
      this.title = firstUserMsg.content.slice(0, 60).trim();
      if (firstUserMsg.content.length > 60) this.title += '...';
    }
  }

  next();
});

// ── Indexes ───────────────────────────────────────────────────────────────────
// Compound index: when we query sessions by userId + sort by lastActive.
// This makes loading a user's conversation history very fast.
sessionSchema.index({ userId: 1, lastActive: -1 });

// Index for filtering out archived sessions quickly.
sessionSchema.index({ isArchived: 1 });

export default mongoose.model('Session', sessionSchema);
