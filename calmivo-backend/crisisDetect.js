// ─────────────────────────────────────────────────────────────────────────────
//  Crisis Detection Middleware
//  Scans incoming chat messages for crisis signals BEFORE they reach Claude.
//  If triggered, it prepends a mandatory safety response and still lets the
//  AI continue — so users get both immediate resources AND empathetic support.
// ─────────────────────────────────────────────────────────────────────────────

const CRISIS_KEYWORDS = [
  // Suicidal ideation
  'kill myself', 'end my life', 'want to die', 'suicidal', 'suicide',
  'take my own life', 'not worth living', 'better off dead', 'no reason to live',
  // Self-harm
  'hurt myself', 'cutting myself', 'self harm', 'self-harm', 'harming myself',
  // Immediate danger
  'going to kill', 'planning to end', 'goodbye forever', 'final goodbye',
];

const CRISIS_RESOURCES = {
  message: '🆘 It sounds like you may be going through something very serious. Please know you are not alone.',
  resources: [
    { name: '988 Suicide & Crisis Lifeline', contact: 'Call or text 988', available: '24/7' },
    { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7' },
    { name: 'International Association for Suicide Prevention', contact: 'https://www.iasp.info/resources/Crisis_Centres/', available: '24/7' },
  ],
  followUp: 'A real human is available right now to help you. Please reach out to one of the resources above. I\'m also here to listen.',
};

export function detectCrisis(text = '') {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => lower.includes(keyword));
}

export function crisisDetectMiddleware(req, res, next) {
  const { message } = req.body || {};
  if (message && detectCrisis(message)) {
    req.crisisDetected = true;
    req.crisisPayload = CRISIS_RESOURCES;
  }
  next();
}

export default crisisDetectMiddleware;
