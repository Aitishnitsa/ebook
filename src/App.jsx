import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Nav from './components/Nav';
import Reader from './pages/Reader';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  const handleAuth = () => {
    setIsAuthenticated(true); // Update authentication state
  };

  return (
    <>
      <HashRouter>
        <Nav isAuth={isAuthenticated} onLogout={setIsAuthenticated}/>
        <Routes>
          <Route path="/auth" element={<Auth onAuth={handleAuth} />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reader"
            element={
              <ProtectedRoute>
                <Reader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;