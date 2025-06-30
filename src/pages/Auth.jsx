import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { EyeIcon } from '../components/Icons/EyeIcon';

const Auth = ({ onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { request } = useApi();
  const { updateUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      if (isRegistering) {
        // 1. Реєстрація
        await request('post', '/register', {
          data: { username, email, password },
        });
        // 2. Логін після реєстрації
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', username);
        params.append('password', password);
        const loginResponse = await request('post', '/token', {
          data: params,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const { access_token, refresh_token } = loginResponse;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // 3. Отримати профіль користувача
        const userResponse = await request('get', '/users/me', {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        localStorage.setItem('user', JSON.stringify(userResponse));
        updateUser(userResponse);
        setSuccess(true);
        onAuth && onAuth(userResponse);
        navigate('/profile');
      } else {
        // Логін
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', username);
        params.append('password', password);
        const loginResponse = await request('post', '/token', {
          data: params,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const { access_token, refresh_token } = loginResponse;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        const userResponse = await request('get', '/users/me', {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        localStorage.setItem('user', JSON.stringify(userResponse));
        updateUser(userResponse);
        setSuccess(true);
        onAuth && onAuth(userResponse);
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
      className="max-w-sm mx-auto p-6 bg-coffee-50 rounded shadow mt-10"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-coffee-900">
        {isRegistering ? 'Register' : 'Login'}
      </h2>
      {error && <div className="mb-3 text-red-600 text-center">{error}</div>}
      {success && (
        <div className="mb-3 text-green-600 text-center">
          {isRegistering
            ? 'Registration successful! Redirecting...'
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
          className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 flex items-center"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <EyeIcon showPassword={showPassword} size={`w-5 h-5`} colors={`${showPassword ? 'stroke-coffee-600' : 'stroke-coffee-400'}`} />
        </button>
      </div>
      <button
        type="submit"
        className="bg-coffee-600 text-coffee-50 px-4 py-2 rounded w-full hover:bg-coffee-700 transition cursor-pointer"
      >
        {isRegistering ? 'Register' : 'Login'}
      </button>
      <button
        type="button"
        className="text-coffee-600 mt-4 w-full cursor-pointer transition-all duration-200 ease-in-out hover:text-coffee-700 hover:underline"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
      </button>
    </form>
  );
}
export default Auth;