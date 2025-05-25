import { useState } from 'react';

const testUser = {
  "id": 8,
  "username": "user",
  "email": "user@example.com"
}

function Auth({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    // axios
    //   .post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password })
    //   .then((response) => {
        localStorage.setItem('user', JSON.stringify(testUser));
        setSuccess(true);
      //   onAuth && onAuth(response.data);
      // })
      // .catch((err) => {
      //   setError('Invalid email or password');
      // });
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
      {success && (
        <div className="mb-3 text-green-600 text-center">Ви успішно увійшли в акаунт!</div>
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

export default Auth;