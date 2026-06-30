import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import ConfectioneriesPage from './pages/ConfectioneriesPage';
import DesignsPage from './pages/DesignsPage';
import BookPage from './pages/BookPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/confectioneries" element={<ConfectioneriesPage />} />
        <Route path="/designs" element={<DesignsPage />} />
        <Route path="/book" element={<BookPage />} />
      </Routes>
    </BrowserRouter>
  );
}
