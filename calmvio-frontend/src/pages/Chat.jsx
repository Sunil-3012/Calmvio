import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';

const API_BASE = '/api';

function getOrCreateSessionId() {
  let id = localStorage.getItem('calmivo_session');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('calmivo_session', id);
  }
  return id;
}

export default function Chat() {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [crisis, setCrisis]       = useState(null);
  const sessionId                 = useRef(getOrCreateSessionId());
  const bottomRef                 = useRef(null);
  const inputRef                  = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Welcome message on first load
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: "Hi, I'm Sage 💜 I'm here to listen, support, and help you feel a little calmer. What's on your mind today?",
      timestamp: new Date().toISOString(),
    }]);
    inputRef.current?.focus();
  }, []);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setCrisis(null);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionId.current }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message, timestamp: data.timestamp },
      ]);

      if (data.crisis) setCrisis(data.crisis);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I had trouble responding right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function clearChat() {
    sessionId.current = crypto.randomUUID();
    localStorage.setItem('calmivo_session', sessionId.current);
    setCrisis(null);
    setMessages([{
      role: 'assistant',
      content: "Hi again 💜 I'm here whenever you're ready. What's on your mind?",
      timestamp: new Date().toISOString(),
    }]);
  }

  return (
    <>
      <Navbar />
      <div className="chat-page">
        <div className="chat-page__layout">

          {/* ── Sidebar ── */}
          <aside className="chat-sidebar">
            <div className="chat-sidebar__header">
              <div className="chat-sidebar__avatar">🌿</div>
              <div>
                <div className="chat-sidebar__name">Sage</div>
                <div className="chat-sidebar__status">
                  <span className="status-dot" /> Online
                </div>
              </div>
            </div>
            <p className="chat-sidebar__bio">
              I'm your compassionate AI wellness companion. I'm here to listen, offer coping strategies,
              and support you — not to replace a therapist.
            </p>
            <div className="chat-sidebar__tips">
              <div className="sidebar-tip">💬 Share how you're feeling</div>
              <div className="sidebar-tip">🧘 Ask for breathing exercises</div>
              <div className="sidebar-tip">😴 Get sleep tips</div>
              <div className="sidebar-tip">🌱 Talk through anxious thoughts</div>
            </div>
            <button className="btn-outline chat-sidebar__clear" onClick={clearChat}>
              Start new conversation
            </button>
            <div className="chat-sidebar__disclaimer">
              Sage is an AI companion, not a licensed therapist. For emergencies, call <strong>988</strong>.
            </div>
          </aside>

          {/* ── Chat window ── */}
          <div className="chat-window">
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`msg msg--${msg.role}${msg.isError ? ' msg--error' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="msg__avatar">🌿</div>
                  )}
                  <div className="msg__bubble">
                    {msg.role === 'assistant' && (
                      <div className="msg__name">Sage</div>
                    )}
                    <p>{msg.content}</p>
                    <div className="msg__time">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="msg msg--assistant">
                  <div className="msg__avatar">🌿</div>
                  <div className="msg__bubble">
                    <div className="msg__name">Sage</div>
                    <div className="typing-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Crisis banner */}
            {crisis && (
              <div className="crisis-banner">
                <div className="crisis-banner__icon">🆘</div>
                <div>
                  <div className="crisis-banner__title">{crisis.message}</div>
                  <div className="crisis-banner__resources">
                    {crisis.resources.map((r, i) => (
                      <span key={i} className="crisis-resource">
                        {r.name} — <strong>{r.contact}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Input bar */}
            <form className="chat-input-bar" onSubmit={sendMessage}>
              <input
                ref={inputRef}
                type="text"
                className="chat-input"
                placeholder="Share what's on your mind..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                maxLength={1000}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                {loading ? '...' : '➤'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}
