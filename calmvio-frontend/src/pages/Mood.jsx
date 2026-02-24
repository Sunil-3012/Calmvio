import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';

const API_BASE = '/api';

const MOODS = [
  { score: 1, emoji: '😞', label: 'Very Low' },
  { score: 2, emoji: '😔', label: 'Low'      },
  { score: 3, emoji: '😐', label: 'Okay'     },
  { score: 4, emoji: '🙂', label: 'Good'     },
  { score: 5, emoji: '😁', label: 'Great'    },
];

const TAGS = ['anxious','sad','angry','stressed','tired','calm','happy','grateful','hopeful','overwhelmed'];

function getSessionId() {
  let id = localStorage.getItem('calmivo_session');
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('calmivo_session', id); }
  return id;
}

export default function Mood() {
  const [selected, setSelected]     = useState(null);
  const [note, setNote]             = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [history, setHistory]       = useState([]);
  const [summary, setSummary]       = useState(null);

  const sessionId = getSessionId();

  useEffect(() => { fetchHistory(); }, []);

  async function fetchHistory() {
    try {
      const [histRes, sumRes] = await Promise.all([
        fetch(`${API_BASE}/mood/${sessionId}`),
        fetch(`${API_BASE}/mood/${sessionId}/summary`),
      ]);
      const histData = await histRes.json();
      const sumData  = await sumRes.json();
      setHistory(histData.moods || []);
      setSummary(sumData.summary || null);
    } catch (_) {}
  }

  function toggleTag(tag) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, score: selected, note, tags: activeTags }),
      });
      setSuccess(true);
      setSelected(null);
      setNote('');
      setActiveTags([]);
      await fetchHistory();
      setTimeout(() => setSuccess(false), 3000);
    } catch (_) {}
    finally { setSubmitting(false); }
  }

  const trendIcon = summary?.trend === 'improving' ? '📈' : summary?.trend === 'declining' ? '📉' : '➡️';

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">

          <div className="page-header">
            <h1 className="page-title">Mood Tracker</h1>
            <p className="page-subtitle">Check in with yourself. Small moments of awareness add up to big changes.</p>
          </div>

          <div className="mood-layout">

            {/* ── Log form ── */}
            <div className="mood-form-card">
              <h2 className="card-title">How are you feeling right now?</h2>
              <form onSubmit={handleSubmit}>

                {/* Score selector */}
                <div className="mood-selector">
                  {MOODS.map(({ score, emoji, label }) => (
                    <button
                      key={score}
                      type="button"
                      className={`mood-btn${selected === score ? ' mood-btn--active' : ''}`}
                      onClick={() => setSelected(score)}
                    >
                      <span className="mood-btn__emoji">{emoji}</span>
                      <span className="mood-btn__label">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Tags */}
                <div className="mood-tags-label">What's contributing to this feeling?</div>
                <div className="mood-tags">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-btn${activeTags.includes(tag) ? ' tag-btn--active' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Note */}
                <textarea
                  className="mood-note"
                  placeholder="Add a note (optional) — what's on your mind?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  maxLength={500}
                />

                <button
                  type="submit"
                  className="btn-primary mood-submit"
                  disabled={!selected || submitting}
                >
                  {submitting ? 'Saving...' : 'Log my mood'}
                </button>

                {success && (
                  <div className="mood-success">✅ Mood logged — keep checking in!</div>
                )}
              </form>
            </div>

            {/* ── Stats & History ── */}
            <div className="mood-right">

              {/* Summary stats */}
              {summary && (
                <div className="mood-stats">
                  <div className="mood-stat">
                    <div className="mood-stat__value">{summary.averageScore}</div>
                    <div className="mood-stat__label">Avg Score</div>
                  </div>
                  <div className="mood-stat">
                    <div className="mood-stat__value">{summary.totalEntries}</div>
                    <div className="mood-stat__label">Check-ins</div>
                  </div>
                  <div className="mood-stat">
                    <div className="mood-stat__value">{trendIcon}</div>
                    <div className="mood-stat__label">{summary.trend}</div>
                  </div>
                </div>
              )}

              {/* History list */}
              <div className="mood-history-card">
                <h3 className="card-title">Recent check-ins</h3>
                {history.length === 0 ? (
                  <p className="mood-empty">No entries yet — log your first mood above!</p>
                ) : (
                  <div className="mood-history">
                    {[...history].reverse().slice(0, 10).map((entry, i) => (
                      <div key={i} className="mood-history-item">
                        <span className="mood-history-emoji">
                          {MOODS.find((m) => m.score === entry.score)?.emoji}
                        </span>
                        <div className="mood-history-info">
                          <div className="mood-history-label">{entry.label}</div>
                          {entry.note && (
                            <div className="mood-history-note">"{entry.note}"</div>
                          )}
                          {entry.tags?.length > 0 && (
                            <div className="mood-history-tags">
                              {entry.tags.map((t) => (
                                <span key={t} className="mood-history-tag">{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="mood-history-time">
                          {new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
