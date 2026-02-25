import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav className="navbar">
        <div className="container navbar__inner">
          <div className="navbar__logo">
            <span className="navbar__logo-dot" />
            Calmivo
          </div>
          <ul className="navbar__links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#testimonials">Stories</a></li>
            <li><a href="/chat" className="navbar__cta">Start Chatting</a></li>
          </ul>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero__badge">
            ✨ AI-Powered Mental Wellness
          </div>
          <h1 className="hero__title">
            A calmer mind starts with <span>one conversation</span>
          </h1>
          <p className="hero__subtitle">
            Calmivo is your safe, judgment-free space to talk, reflect, and grow.
            Powered by AI, guided by compassion — available anytime you need it.
          </p>
          <div className="hero__actions">
            <button className="btn-primary" onClick={() => navigate('/chat')}>
              💬 Talk to Sage — it's free
            </button>
            <button className="btn-outline" onClick={() => navigate('/resources')}>
              Explore Resources
            </button>
          </div>

          {/* Chat preview mockup */}
          <div className="hero__preview">
            <div className="hero__preview-bar">
              <div className="hero__preview-dot" style={{ background: '#FC5753' }} />
              <div className="hero__preview-dot" style={{ background: '#FDBC40' }} />
              <div className="hero__preview-dot" style={{ background: '#33C748' }} />
              <span className="hero__preview-title">💜 Sage — Calmivo Companion</span>
            </div>
            <div className="hero__chat">
              <div className="chat-bubble chat-bubble--user">
                I've been feeling really anxious and overwhelmed lately...
              </div>
              <div className="chat-bubble chat-bubble--sage">
                <div className="chat-bubble__name">Sage</div>
                That sounds really hard, and I'm glad you reached out. Anxiety can feel
                all-consuming sometimes. Can you tell me a little more about what's been
                weighing on you most? I'm here to listen — there's no rush. 💜
              </div>
              <div className="chat-bubble chat-bubble--user">
                It's mostly work stress and not sleeping well
              </div>
              <div className="chat-bubble chat-bubble--sage">
                <div className="chat-bubble__name">Sage</div>
                That combination is really tough — poor sleep makes everything feel
                harder to handle. Let's try something together right now: a simple
                breathing exercise that can calm your nervous system in under 5 minutes.
                Would that help?
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="section" id="features">
        <div className="container">
          <p className="section__label">What Calmivo Offers</p>
          <h2 className="section__title">Everything you need to feel better</h2>
          <p className="section__subtitle">
            Three powerful tools designed to support your mental wellbeing — all in one place.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card__icon">💬</div>
              <h3 className="feature-card__title">AI Wellness Companion</h3>
              <p className="feature-card__desc">
                Chat with Sage, your compassionate AI companion trained in CBT techniques,
                grounding exercises, and empathetic listening. Available 24/7 — no appointments needed.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">📊</div>
              <h3 className="feature-card__title">Mood Tracker</h3>
              <p className="feature-card__desc">
                Log how you're feeling daily and watch your patterns emerge. Track your mood
                score, add notes, and get insights on your emotional trends over time.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">🌿</div>
              <h3 className="feature-card__title">Wellness Resources</h3>
              <p className="feature-card__desc">
                Access a curated library of evidence-based exercises — breathing techniques,
                grounding methods, sleep guides, and mindfulness practices — whenever you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────── */}
      <section className="section section--alt" id="how-it-works">
        <div className="container">
          <p className="section__label">Simple by Design</p>
          <h2 className="section__title">How Calmivo works</h2>
          <p className="section__subtitle">
            No sign-up required. Just open, talk, and feel better.
          </p>
          <div className="steps">
            <div className="step">
              <div className="step__number">1</div>
              <h3 className="step__title">Open Calmivo</h3>
              <p className="step__desc">
                No account needed. Your session is private and yours alone.
              </p>
            </div>
            <div className="step">
              <div className="step__number">2</div>
              <h3 className="step__title">Talk to Sage</h3>
              <p className="step__desc">
                Share what's on your mind. Sage listens with empathy and responds thoughtfully.
              </p>
            </div>
            <div className="step">
              <div className="step__number">3</div>
              <h3 className="step__title">Track your mood</h3>
              <p className="step__desc">
                Log your feelings and discover your emotional patterns over time.
              </p>
            </div>
            <div className="step">
              <div className="step__number">4</div>
              <h3 className="step__title">Practice & Grow</h3>
              <p className="step__desc">
                Use curated exercises to build healthy habits and build emotional resilience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────── */}
      <section className="section" id="testimonials">
        <div className="container">
          <p className="section__label">Real Stories</p>
          <h2 className="section__title">People who found their calm</h2>
          <p className="section__subtitle">
            Here's what people say about using Calmivo during difficult moments.
          </p>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-card__stars">★★★★★</div>
              <p className="testimonial-card__text">
                "I was having a panic attack at 2am with no one to call. Sage walked me through
                a breathing exercise and just... listened. I felt genuinely better within 15 minutes."
              </p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">👩</div>
                <div>
                  <div className="testimonial-card__name">Priya M.</div>
                  <div className="testimonial-card__role">Graduate Student</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-card__stars">★★★★★</div>
              <p className="testimonial-card__text">
                "The mood tracker helped me realize my anxiety spikes every Sunday evening.
                That awareness alone has been life-changing for how I plan my week."
              </p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">👨</div>
                <div>
                  <div className="testimonial-card__name">James K.</div>
                  <div className="testimonial-card__role">Software Engineer</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-card__stars">★★★★★</div>
              <p className="testimonial-card__text">
                "I use the resources section every night before bed. The progressive muscle
                relaxation exercise has genuinely transformed my sleep. Highly recommend."
              </p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">👩</div>
                <div>
                  <div className="testimonial-card__name">Amara O.</div>
                  <div className="testimonial-card__role">Nurse</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="cta-banner">
          <h2 className="cta-banner__title">Ready to find your calm?</h2>
          <p className="cta-banner__subtitle">
            Start a conversation with Sage right now — no sign-up, no judgment, just support.
          </p>
          <button className="btn-primary" onClick={() => navigate('/chat')}>
            💬 Start talking — it's free
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <div>
              <div className="footer__logo">Calmivo</div>
              <p className="footer__tagline">
                Your AI mental wellness companion. Available anytime, completely private.
              </p>
            </div>
            <div className="footer__links">
              <h4>Product</h4>
              <ul>
                <li><a href="/chat">Chat with Sage</a></li>
                <li><a href="/mood">Mood Tracker</a></li>
                <li><a href="/resources">Resources</a></li>
              </ul>
            </div>
            <div className="footer__links">
              <h4>Crisis Support</h4>
              <ul>
                <li><a href="tel:988">988 Lifeline — Call/Text 988</a></li>
                <li><a href="sms:741741">Crisis Text Line — Text HOME to 741741</a></li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <p>© 2025 Calmivo. Built with 💜 for everyone who needs a moment of calm.</p>
            <p className="footer__disclaimer">
              Calmivo is an AI wellness tool and is not a substitute for professional mental health care.
              If you are in crisis, please contact a qualified mental health professional or call 988.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
