import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  content:   { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema(
  {
    sessionId:      { type: String, required: true, unique: true, index: true },
    messages:       [messageSchema],
    crisisTriggered: { type: Boolean, default: false },
    messageCount:   { type: Number, default: 0 },
    lastActive:     { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Update lastActive and messageCount on save
sessionSchema.pre('save', function (next) {
  this.lastActive   = new Date();
  this.messageCount = this.messages.length;
  next();
});

export default mongoose.model('Session', sessionSchema);
