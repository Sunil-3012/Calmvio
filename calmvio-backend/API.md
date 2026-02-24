# Calmivo API Documentation

Base URL: `http://localhost:5000/api`

---

## Health Check

### GET /health
Returns server status.

**Response:**
```json
{ "status": "ok", "service": "Calmivo API", "timestamp": "..." }
```

---

## Chat Endpoints

### POST /chat
Send a message to the AI wellness companion (Sage).

**Body:**
```json
{
  "message": "I've been feeling really anxious lately",
  "sessionId": "optional-existing-session-id"
}
```

**Response:**
```json
{
  "sessionId": "uuid-string",
  "message": "I hear you — anxiety can feel really overwhelming...",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "crisis": { ... }  // Only present if crisis keywords detected
}
```

**Crisis response includes:**
```json
{
  "crisis": {
    "message": "🆘 It sounds like you may be going through something very serious...",
    "resources": [
      { "name": "988 Suicide & Crisis Lifeline", "contact": "Call or text 988", "available": "24/7" },
      { "name": "Crisis Text Line", "contact": "Text HOME to 741741", "available": "24/7" }
    ],
    "followUp": "A real human is available right now to help you..."
  }
}
```

---

### GET /chat/:sessionId/history
Retrieve full conversation history for a session.

**Response:**
```json
{
  "sessionId": "...",
  "messages": [
    { "role": "user", "content": "...", "timestamp": "..." },
    { "role": "assistant", "content": "...", "timestamp": "..." }
  ],
  "crisisTriggered": false
}
```

---

### DELETE /chat/:sessionId
Clear/reset a conversation session.

**Response:**
```json
{ "success": true, "message": "Session cleared." }
```

---

## Mood Endpoints

### POST /mood
Log a mood entry.

**Body:**
```json
{
  "sessionId": "uuid-string",
  "score": 3,
  "note": "Feeling a bit tired but okay",
  "tags": ["tired", "calm"]
}
```

Score: `1` (Very Low) → `5` (Great)
Tags: `anxious | sad | angry | stressed | tired | calm | happy | grateful | hopeful | overwhelmed`

**Response:**
```json
{
  "success": true,
  "mood": {
    "sessionId": "...",
    "score": 3,
    "label": "Okay",
    "emoji": "😐",
    "note": "...",
    "tags": ["tired"],
    "createdAt": "..."
  }
}
```

---

### GET /mood/:sessionId
Get mood history. Optional `?limit=30` query param.

---

### GET /mood/:sessionId/summary
Get mood analytics summary.

**Response:**
```json
{
  "summary": {
    "averageScore": 3.4,
    "totalEntries": 12,
    "recentMood": { ... },
    "trend": "improving"
  }
}
```

---

## Resources Endpoints

### GET /resources
List all wellness resources. Filters: `?category=anxiety&tag=breathing&type=exercise`

**Categories:** `anxiety | grounding | sleep | depression | stress | mindfulness | crisis`

### GET /resources/categories
List all available categories.

### GET /resources/:id
Get a single resource by ID (e.g. `r001`).

---

## Error Responses

All errors follow this format:
```json
{ "error": "Human-readable error message" }
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request / validation error |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
