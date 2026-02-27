import mongoose from 'mongoose';

// ── MoodEntry Schema ──────────────────────────────────────────────────────────
const moodEntrySchema = new mongoose.Schema(
  {
    // The localStorage UUID — current way of identifying a user.
    sessionId: {
      type:     String,
      required: true,
      index:    true,
    },

    // Placeholder for future auth. Same pattern as Session.js —
    // add it now so adding login later requires zero schema changes.
    userId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'User',
      default: null,
    },

    // Core mood score. 1 = Very Low, 5 = Great.
    score: {
      type:     Number,
      required: true,
      min:      1,
      max:      5,
    },

    // Human-readable label derived from score ("Very Low", "Great", etc.)
    // Stored so we don't need to re-derive it every time we read the data.
    label: { type: String, required: true },

    // Emoji for the score. Stored alongside label for the same reason.
    emoji: { type: String },

    // Optional free-text note from the user. Capped at 500 chars.
    note: {
      type:      String,
      maxlength: 500,
      default:   '',
    },

    // Emotion tags selected by the user e.g. ['anxious', 'tired'].
    // Only values from the approved list in mood.routes.js are allowed.
    tags: [{ type: String }],

    // How energetic does the user feel? (1 = exhausted, 5 = full of energy)
    // Separate from mood score — someone can feel calm (mood: 4) but tired (energy: 2).
    // Unlocks powerful correlations in the future (low energy → lower mood patterns).
    energyLevel: {
      type:    Number,
      min:     1,
      max:     5,
      default: null,
    },

    // How many hours did the user sleep last night?
    // One of the strongest predictors of mood. Optional field.
    sleepHours: {
      type:    Number,
      min:     0,
      max:     24,
      default: null,
    },
  },
  {
    // Automatically adds createdAt and updatedAt.
    // createdAt is what we use for mood trend analysis over time.
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Most common query: "give me all moods for this session, sorted by date"
// This compound index makes that query instant.
moodEntrySchema.index({ sessionId: 1, createdAt: -1 });

// For when userId is added — "give me all moods for this user"
moodEntrySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('MoodEntry', moodEntrySchema);
