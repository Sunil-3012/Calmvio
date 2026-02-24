# Calmivo Backend — Setup Guide

## Prerequisites
- Node.js v18+
- MongoDB (local or Atlas) — optional, falls back to in-memory
- Anthropic API key → https://console.anthropic.com

---

## Quick Start

```bash
# 1. Navigate to backend
cd calmivo/backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 4. Start development server
npm run dev

# Server runs at: http://localhost:5000
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `ANTHROPIC_API_KEY` | **Yes** | Your Claude API key |
| `MONGODB_URI` | No | MongoDB connection string |
| `FRONTEND_URL` | No | Frontend origin for CORS |

---

## MongoDB Setup (Optional)

The backend runs without MongoDB using in-memory storage. For persistence:

**Local MongoDB:**
```bash
# Install MongoDB Community: https://www.mongodb.com/try/download/community
# Then set in .env:
MONGODB_URI=mongodb://localhost:27017/calmivo
```

**MongoDB Atlas (free cloud):**
1. Create account at https://cloud.mongodb.com
2. Create a free cluster
3. Get connection string → paste into `MONGODB_URI` in `.env`

---

## API Quick Test

```bash
# Health check
curl http://localhost:5000/api/health

# Send a chat message
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I feel anxious today"}'

# Get resources
curl http://localhost:5000/api/resources?category=anxiety
```

---

## Deployment

### Railway (recommended)
1. Push code to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variables in Railway dashboard
4. Deploy!

### Render
1. New Web Service → Connect GitHub repo
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variables
