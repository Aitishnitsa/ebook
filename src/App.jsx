import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Nav from './components/Nav';
import Reader from "./pages/Reader.jsx";

function App() {
  return (
    <>
      <BrowserRouter basename="/ebook">
        <Nav />
        <Routes>
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reader" element={<Reader />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;