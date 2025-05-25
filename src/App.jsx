import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Nav from './components/Nav';

function App() {
  return (
    <>
      <BrowserRouter basename="/ebook">
        <Nav />
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;