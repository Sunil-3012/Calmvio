import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';

const API_BASE = '/api';

const CATEGORY_META = {
  anxiety:     { icon: '😮‍💨', label: 'Anxiety'     },
  grounding:   { icon: '🌍', label: 'Grounding'   },
  sleep:       { icon: '😴', label: 'Sleep'        },
  depression:  { icon: '💙', label: 'Depression'   },
  stress:      { icon: '😤', label: 'Stress'       },
  mindfulness: { icon: '🧘', label: 'Mindfulness'  },
  crisis:      { icon: '🆘', label: 'Crisis Help'  },
};

const TYPE_LABELS = {
  exercise: 'Exercise',
  guide:    'Guide',
  resource: 'Resource',
};

export default function Resources() {
  const [resources, setResources]     = useState([]);
  const [categories, setCategories]   = useState([]);
  const [activeCategory, setCategory] = useState('all');
  const [expanded, setExpanded]       = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [resData, catData] = await Promise.all([
          fetch(`${API_BASE}/resources`).then((r) => r.json()),
          fetch(`${API_BASE}/resources/categories`).then((r) => r.json()),
        ]);
        setResources(resData.resources || []);
        setCategories(catData.categories || []);
      } catch (_) {}
      finally { setLoading(false); }
    }
    load();
  }, []);

  const filtered = activeCategory === 'all'
    ? resources
    : resources.filter((r) => r.category === activeCategory);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">

          <div className="page-header">
            <h1 className="page-title">Wellness Resources</h1>
            <p className="page-subtitle">Evidence-based exercises and guides to help you feel better, one step at a time.</p>
          </div>

          {/* Category filter */}
          <div className="resource-filters">
            <button
              className={`filter-btn${activeCategory === 'all' ? ' filter-btn--active' : ''}`}
              onClick={() => setCategory('all')}
            >
              ✨ All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn${activeCategory === cat ? ' filter-btn--active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {CATEGORY_META[cat]?.icon} {CATEGORY_META[cat]?.label || cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="resources-loading">Loading resources...</div>
          ) : (
            <div className="resources-grid">
              {filtered.map((res) => (
                <div
                  key={res.id}
                  className={`resource-card${expanded === res.id ? ' resource-card--open' : ''}`}
                >
                  <div className="resource-card__header" onClick={() => setExpanded(expanded === res.id ? null : res.id)}>
                    <div className="resource-card__icon">
                      {CATEGORY_META[res.category]?.icon || '🌿'}
                    </div>
                    <div className="resource-card__meta">
                      <div className="resource-card__type">
                        <span className={`type-badge type-badge--${res.type}`}>
                          {TYPE_LABELS[res.type] || res.type}
                        </span>
                        {res.duration && (
                          <span className="resource-card__duration">⏱ {res.duration}</span>
                        )}
                      </div>
                      <h3 className="resource-card__title">{res.title}</h3>
                      <p className="resource-card__desc">{res.description}</p>
                    </div>
                    <div className="resource-card__chevron">
                      {expanded === res.id ? '▲' : '▼'}
                    </div>
                  </div>

                  {expanded === res.id && (
                    <div className="resource-card__body">
                      {/* Steps */}
                      {res.steps && (
                        <ol className="resource-steps">
                          {res.steps.map((step, i) => (
                            <li key={i} className="resource-step">
                              <span className="resource-step__num">{i + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      )}
                      {/* Tips */}
                      {res.tips && (
                        <ul className="resource-tips">
                          {res.tips.map((tip, i) => (
                            <li key={i} className="resource-tip">✓ {tip}</li>
                          ))}
                        </ul>
                      )}
                      {/* Crisis contacts */}
                      {res.contacts && (
                        <div className="crisis-contacts">
                          {res.contacts.map((c, i) => (
                            <div key={i} className="crisis-contact">
                              <div className="crisis-contact__name">{c.name}</div>
                              <div className="crisis-contact__info">
                                <strong>{c.contact}</strong> · {c.available} · {c.country}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Tags */}
                      {res.tags && (
                        <div className="resource-tags">
                          {res.tags.map((t) => (
                            <span key={t} className="resource-tag">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
