import { useState } from 'react';
import axios from 'axios';

function AuthForm({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    axios
      .post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password })
      .then((response) => {
        onAuth && onAuth(response.data);
      })
      .catch((err) => {
        setError('Invalid email or password');
      });
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-sm mx-auto p-6 bg-white rounded shadow mt-10"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && (
        <div className="mb-3 text-red-600 text-center">{error}</div>
      )}
      <div className="mb-4">
        <input
          type="email"
          className="border rounded px-3 py-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          className="border rounded px-3 py-2 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
}

export default AuthForm;