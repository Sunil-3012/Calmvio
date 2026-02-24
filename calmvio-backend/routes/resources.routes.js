import { Router } from 'express';

const router = Router();

// ── Static wellness resources ────────────────────────────────────────────────
const RESOURCES = [
  // Anxiety
  {
    id: 'r001', category: 'anxiety', type: 'exercise',
    title: 'Box Breathing',
    description: 'A powerful breathing technique to calm your nervous system instantly.',
    steps: [
      'Breathe in slowly for 4 seconds',
      'Hold your breath for 4 seconds',
      'Exhale slowly for 4 seconds',
      'Hold again for 4 seconds',
      'Repeat 4–6 times',
    ],
    tags: ['breathing', 'quick', 'anxiety'],
    duration: '5 minutes',
  },
  {
    id: 'r002', category: 'anxiety', type: 'exercise',
    title: '5-4-3-2-1 Grounding Technique',
    description: 'A sensory grounding exercise to bring you back to the present moment.',
    steps: [
      'Name 5 things you can SEE',
      'Name 4 things you can TOUCH',
      'Name 3 things you can HEAR',
      'Name 2 things you can SMELL',
      'Name 1 thing you can TASTE',
    ],
    tags: ['grounding', 'mindfulness', 'anxiety'],
    duration: '5–10 minutes',
  },
  // Grounding
  {
    id: 'r003', category: 'grounding', type: 'exercise',
    title: 'Cold Water Grounding',
    description: 'Splash cold water on your wrists and face to reset your nervous system.',
    steps: [
      'Go to a sink or have a glass of cold water ready',
      'Run cold water over your wrists for 30 seconds',
      'Splash cold water gently on your face',
      'Take three deep breaths as you feel the sensation',
    ],
    tags: ['grounding', 'quick', 'physical'],
    duration: '2 minutes',
  },
  // Sleep
  {
    id: 'r004', category: 'sleep', type: 'guide',
    title: 'Sleep Hygiene Basics',
    description: 'Simple habits that dramatically improve your sleep quality.',
    tips: [
      'Keep a consistent sleep and wake time, even on weekends',
      'Avoid screens 30–60 minutes before bed',
      'Keep your room cool (around 65–68°F / 18–20°C)',
      'Avoid caffeine after 2pm',
      'Use your bed only for sleep — not work or scrolling',
    ],
    tags: ['sleep', 'habits', 'routine'],
    duration: 'Ongoing habit',
  },
  {
    id: 'r005', category: 'sleep', type: 'exercise',
    title: 'Progressive Muscle Relaxation',
    description: 'Systematically tense and release muscle groups to relax your body before sleep.',
    steps: [
      'Lie comfortably and close your eyes',
      'Tense your feet muscles tightly for 5 seconds, then release',
      'Work upward — calves, thighs, stomach, hands, arms, shoulders',
      'Tense each group for 5 seconds then fully release',
      'Finish with your face muscles',
    ],
    tags: ['sleep', 'relaxation', 'body'],
    duration: '10–15 minutes',
  },
  // Depression
  {
    id: 'r006', category: 'depression', type: 'guide',
    title: 'Behavioral Activation',
    description: 'A CBT technique to fight low mood by gently increasing activity.',
    tips: [
      'Make a small list of activities that used to bring you joy',
      'Choose one tiny version of an activity (e.g., a 5-min walk instead of a gym session)',
      'Schedule it — treat it like an appointment',
      'Do it even if you don\'t feel like it — mood often follows action',
      'Track how you feel before and after, even slightly better counts',
    ],
    tags: ['depression', 'CBT', 'activity'],
    duration: '15 minutes to start',
  },
  // Stress
  {
    id: 'r007', category: 'stress', type: 'exercise',
    title: '4-7-8 Breathing',
    description: 'A natural tranquilizer for the nervous system developed by Dr. Andrew Weil.',
    steps: [
      'Exhale completely through your mouth',
      'Close mouth and inhale quietly through nose for 4 seconds',
      'Hold breath for 7 seconds',
      'Exhale completely through mouth for 8 seconds',
      'Repeat the cycle 3–4 times',
    ],
    tags: ['breathing', 'stress', 'quick'],
    duration: '5 minutes',
  },
  // Mindfulness
  {
    id: 'r008', category: 'mindfulness', type: 'exercise',
    title: 'Body Scan Meditation',
    description: 'A guided awareness exercise to connect with your body and reduce tension.',
    steps: [
      'Sit or lie in a comfortable position and close your eyes',
      'Take 3 deep breaths to settle in',
      'Bring attention to the top of your head — notice any sensations',
      'Slowly move attention down: forehead, jaw, neck, shoulders',
      'Continue through chest, arms, stomach, hips, legs, feet',
      'If you find tension, breathe into that area and let it soften',
    ],
    tags: ['mindfulness', 'meditation', 'body'],
    duration: '10–20 minutes',
  },
  {
    id: 'r009', category: 'mindfulness', type: 'guide',
    title: 'Journaling for Mental Clarity',
    description: 'Use writing to process emotions and gain perspective.',
    tips: [
      'Write for 5–10 minutes without editing or judging yourself',
      'Try prompts: "Right now I feel..." or "What is on my mind is..."',
      'Write about what you\'re grateful for — even small things',
      'End with one kind thing you can do for yourself today',
    ],
    tags: ['journaling', 'self-reflection', 'mindfulness'],
    duration: '10 minutes daily',
  },
  // Crisis
  {
    id: 'r010', category: 'crisis', type: 'resource',
    title: 'Crisis Support Lines',
    description: 'Immediate human support available 24/7.',
    contacts: [
      { name: '988 Suicide & Crisis Lifeline', contact: 'Call or text 988', available: '24/7', country: 'USA' },
      { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7', country: 'USA/UK/Canada' },
      { name: 'Samaritans', contact: 'Call 116 123', available: '24/7', country: 'UK' },
      { name: 'Lifeline Australia', contact: 'Call 13 11 14', available: '24/7', country: 'Australia' },
    ],
    tags: ['crisis', 'emergency', 'hotline'],
  },
];

const CATEGORIES = [...new Set(RESOURCES.map((r) => r.category))];

// ── GET /api/resources ───────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const { category, tag, type } = req.query;
  let results = [...RESOURCES];

  if (category) results = results.filter((r) => r.category === category);
  if (type)     results = results.filter((r) => r.type === type);
  if (tag)      results = results.filter((r) => r.tags && r.tags.includes(tag));

  return res.json({ count: results.length, resources: results });
});

// ── GET /api/resources/categories ───────────────────────────────────────────
router.get('/categories', (req, res) => {
  return res.json({ categories: CATEGORIES });
});

// ── GET /api/resources/:id ───────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const resource = RESOURCES.find((r) => r.id === req.params.id);
  if (!resource) {
    return res.status(404).json({ error: `Resource '${req.params.id}' not found.` });
  }
  return res.json(resource);
});

export default router;
