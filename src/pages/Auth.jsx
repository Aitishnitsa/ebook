import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Auth({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      if (isRegistering) {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
          username,
          email,
          password,
        });
        setSuccess(true);
        localStorage.setItem('user', JSON.stringify(response.data));
        onAuth && onAuth(response.data);
        setIsRegistering(false);
        setPassword('');
        setError('');
      } else {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', username);
        params.append('password', password);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/token`,
          params,
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }
        );
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        localStorage.setItem('user', JSON.stringify(userResponse.data));
        setSuccess(true);
        onAuth && onAuth(userResponse.data);
        navigate('/profile');
      }
    } catch (err) {
      if (err.response) {
        const detail = err.response.data?.detail;
        if (typeof detail === 'string') {
          setError(detail);
        } else if (Array.isArray(detail) && detail[0]?.msg) {
          setError(detail[0].msg);
        } else if (err.response.status === 401 || err.response.status === 404) {
          setError('No user found with this email or password.');
        } else {
          setError('An error occurred');
        }
      } else {
        setError('An error occurred');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 bg-white rounded shadow mt-10"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isRegistering ? 'Register' : 'Login'}
      </h2>
      {error && <div className="mb-3 text-red-600 text-center">{error}</div>}
      {success && (
        <div className="mb-3 text-green-600 text-center">
          {isRegistering
            ? 'Registration successful! Please login.'
            : 'Login successful! Redirecting...'}
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      {isRegistering && (
        <div className="mb-4">
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      )}
      <div className="mb-4 relative">
        <input
          type={showPassword ? "text" : "password"}
          className="border rounded px-3 py-2 w-full pr-10"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            // Eye open SVG
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            // Eye closed SVG
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.634 6.634A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.95M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
            </svg>
          )}
        </button>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition cursor-pointer"
      >
        {isRegistering ? 'Register' : 'Login'}
      </button>
      <button
        type="button"
        className="text-blue-600 mt-4 w-full cursor-pointer hover:underline"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
      </button>
    </form>
  );
}

export default Auth;