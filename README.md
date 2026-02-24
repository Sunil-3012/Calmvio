# 💜 Calmivo — AI Mental Wellness Companion

> A full-stack mental health web app powered by Claude AI. Chat with Sage, track your mood, and access evidence-based wellness resources — anytime, for free.

🌐 **Live Demo:** [calmvio-sunil.vercel.app](https://calmvio-sunil.vercel.app)

---

## ✨ Features

- **AI Chat Companion** — Talk to Sage, a compassionate AI built on Claude, available 24/7
- **Crisis Detection** — Automatically detects distress signals and surfaces emergency helplines (988, Crisis Text Line)
- **Mood Tracker** — Log daily emotions with scores, tags, and notes. View trends over time
- **Wellness Resources** — Curated library of breathing exercises, grounding techniques, sleep guides, and mindfulness practices
- **Session Memory** — Conversations are preserved within a session for context-aware responses
- **Fully Responsive** — Works on desktop and mobile

---

## 🛠 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=flat&logo=react-router)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat&logo=express)
![Claude AI](https://img.shields.io/badge/Claude_AI-Anthropic-D97706?style=flat)

### Deployment
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat&logo=vercel)
![Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=flat&logo=railway)

---

## 📁 Project Structure

```
calmvio/
├── backend/
│   ├── middleware/
│   │   ├── cors.js          # CORS configuration
│   │   └── rateLimit.js     # Rate limiting
│   ├── routes/
│   │   ├── chat.routes.js   # Chat API + session management
│   │   ├── mood.routes.js   # Mood tracking API
│   │   └── resources.routes.js # Wellness resources API
│   ├── app.js               # Express server entry point
│   ├── claude.service.js    # Anthropic Claude API integration
│   ├── crisisDetect.js      # Crisis keyword detection
│   ├── .env.example         # Environment variable template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx  # Home page
    │   │   ├── Chat.jsx     # AI chatbot interface
    │   │   ├── Mood.jsx     # Mood tracker
    │   │   └── Resources.jsx# Wellness resources
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone the repo

```bash
git clone https://github.com/Sunil-3012/Calmvio.git
cd Calmvio
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your API key:

```env
ANTHROPIC_API_KEY=your_key_here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
# 🚀 Calmivo API running on http://localhost:3001
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
# Local: http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) — that's it!

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/chat` | Send a message to Sage (Claude AI) |
| `GET` | `/api/chat/:sessionId/history` | Get conversation history |
| `DELETE` | `/api/chat/:sessionId` | Clear a session |
| `POST` | `/api/mood` | Log a mood entry |
| `GET` | `/api/mood/:sessionId` | Get mood history |
| `GET` | `/api/mood/:sessionId/summary` | Get mood analytics |
| `GET` | `/api/resources` | List wellness resources (filterable) |
| `GET` | `/api/resources/categories` | Get all categories |
| `GET` | `/api/resources/:id` | Get a single resource |

---

## ☁️ Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | [Vercel](https://vercel.com) | Root dir: `frontend` |
| Backend | [Railway](https://railway.app) | Root dir: `backend` |
| Database | MongoDB Atlas (optional) | Falls back to in-memory |

---

## 🧠 How the AI Works

Calmivo uses **Claude (Anthropic)** with a custom system prompt that defines Sage's personality — warm, non-judgmental, and grounded in evidence-based techniques like CBT and mindfulness.

Key safeguards:
- Sage **never diagnoses** or prescribes medication
- **Crisis detection** scans every message for distress signals and surfaces real helplines instantly
- Sage reminds users it is an AI companion, not a licensed therapist

---

## ⚠️ Disclaimer

Calmivo is an AI wellness tool and is **not a substitute for professional mental health care**. If you are in crisis, please call or text **988** (Suicide & Crisis Lifeline) or text **HOME to 741741** (Crisis Text Line).

---

## 👨‍💻 Author

**Sunil Gangupamu**
- GitHub: [@Sunil-3012](https://github.com/Sunil-3012)
- Email: gangupamu.sunil30@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with 💜 as a portfolio project to demonstrate full-stack development with AI integration.*

