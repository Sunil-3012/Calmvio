import mongoose from 'mongoose';

// ── User Schema ───────────────────────────────────────────────────────────────
// This model is a PLACEHOLDER for future authentication.
// Right now Calmivo has no login — users are identified by a localStorage UUID.
// When you add auth, this is where email, password hash, and profile data live.
// Adding it now means Session and MoodEntry already reference it via userId —
// zero rewrites needed when auth is implemented.
const userSchema = new mongoose.Schema(
  {
    // The localStorage UUID the user had before they created an account.
    // When a user signs up, we link their existing session data to their new account.
    anonymousId: {
      type:  String,
      index: true,
      default: null,
    },

    // Email for login. Sparse index means only documents WITH an email are indexed
    // (important since most users won't have one yet).
    email: {
      type:   String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim:   true,
      default: null,
    },

    // Hashed password. NEVER store plain text passwords.
    // Use bcrypt to hash before saving. Null until the user signs up.
    passwordHash: {
      type:    String,
      default: null,
    },

    // Display name chosen by the user.
    displayName: {
      type:      String,
      maxlength: 50,
      default:   'Anonymous',
    },

    // User preferences and settings.
    // Stored as a flexible object so you can add new settings
    // without changing the schema.
    settings: {
      theme:         { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      language:      { type: String, default: 'en' },
      notifications: { type: Boolean, default: false },
    },

    // Has the user verified their email?
    isVerified: { type: Boolean, default: false },

    // Soft delete — deactivated accounts are hidden but data is preserved.
    isActive: { type: Boolean, default: true },

    // When did the user last log in?
    lastLoginAt: { type: Date, default: null },
  },
  {
    timestamps: true, // createdAt = account creation date
  }
);

export default mongoose.model('User', userSchema);
