import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Nav from './components/Nav';
import Reader from "./pages/Reader.jsx";

function App() {
  return (
    <>
      <HashRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<AdminPanel />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reader" element={<Reader />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;