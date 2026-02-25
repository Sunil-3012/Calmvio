import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    score:     { type: Number, required: true, min: 1, max: 5 },
    label:     { type: String, required: true },
    emoji:     { type: String },
    note:      { type: String, maxlength: 500, default: '' },
    tags:      [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('MoodEntry', moodEntrySchema);
