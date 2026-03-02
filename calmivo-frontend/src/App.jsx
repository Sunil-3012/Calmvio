import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Landing   from './pages/Landing.jsx';
import Chat      from './pages/Chat.jsx';
import Mood      from './pages/Mood.jsx';
import Resources from './pages/Resources.jsx';

function ScrollObserver() {
  const { pathname } = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll('.fade-up');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollObserver />
      <Routes>
        <Route path="/"          element={<Landing   />} />
        <Route path="/chat"      element={<Chat      />} />
        <Route path="/mood"      element={<Mood      />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </BrowserRouter>
  );
}
