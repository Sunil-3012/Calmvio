import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing   from './pages/Landing.jsx';
import Chat      from './pages/Chat.jsx';
import Mood      from './pages/Mood.jsx';
import Resources from './pages/Resources.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Landing   />} />
        <Route path="/chat"      element={<Chat      />} />
        <Route path="/mood"      element={<Mood      />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </BrowserRouter>
  );
}
