import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import useValidation from '../../hooks/useValidation';
import { EyeIcon } from '../Icons/EyeIcon';
import Button from '../Buttons/Button';

const Login = ({ onAuth, onSwitchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { request } = useApi();
    const { updateUser } = useAuth();
    const { validateField, clearFieldError, getFieldErrors, hasFieldErrors } = useValidation();

    const isFormValid = () => {
        const usernameErrors = getFieldErrors('username');
        const passwordErrors = getFieldErrors('password');

        return (
            username.trim() &&
            password.trim() &&
            usernameErrors.length === 0 &&
            passwordErrors.length === 0
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
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
        } catch (err) {
            console.error('Login error:', err);
            updateUser(null);

            if (err.response) {
                const detail = err.response.data?.detail;
                const status = err.response.status;

                if (typeof detail === 'string') {
                    if (detail.toLowerCase().includes('incorrect') ||
                        detail.toLowerCase().includes('invalid') ||
                        detail.toLowerCase().includes('wrong')) {
                        setError('Неправильний пароль або ім\'я користувача.');
                    } else {
                        setError(detail);
                    }
                } else if (Array.isArray(detail) && detail[0]?.msg) {
                    setError(detail[0].msg);
                } else if (status === 401) {
                    setError('Неправильний пароль або ім\'я користувача.');
                } else if (status === 404) {
                    setError('Користувача з таким ім\'ям не знайдено.');
                } else if (status === 422) {
                    setError('Перевірте правильність введених даних.');
                } else {
                    setError('Сталася помилка. Спробуйте ще раз.');
                }
            } else {
                setError('Помилка з\'єднання з сервером.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        clearFieldError('username');
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        clearFieldError('password');
    };

    const handleUsernameBlur = () => {
        validateField('username', username);
    };

    const handlePasswordBlur = () => {
        validateField('password', password);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-sm mx-auto p-6 bg-coffee-50 rounded shadow mt-10"
        >
            <h2 className="text-2xl font-bold mb-4 text-center text-coffee-900">
                Login
            </h2>

            {error && <div className="mb-3 text-red-600 text-center">{error}</div>}
            {success && (
                <div className="mb-3 text-coffee-600 text-center">
                    Login successful! Redirecting...
                </div>
            )}

            <div className="mb-4">
                <input
                    type="text"
                    className={`border rounded px-3 py-2 w-full ${hasFieldErrors('username') ? 'border-red-500' : 'border-coffee-300'
                        }`}
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    onBlur={handleUsernameBlur}
                    required
                />
                {hasFieldErrors('username') && (
                    <div className="mt-1 text-sm text-red-500">
                        <ul className="list-disc list-inside">
                            {getFieldErrors('username').map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className={`border rounded px-3 py-2 w-full pr-10 ${hasFieldErrors('password') ? 'border-red-500' : 'border-coffee-300'
                            }`}
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        required
                    />
                    <button
                        type="button"
                        className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-coffee-500 flex items-center"
                        tabIndex={-1}
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        <EyeIcon
                            showPassword={showPassword}
                            size={`w-5 h-5`}
                            colors={`${showPassword ? 'stroke-coffee-600' : 'stroke-coffee-400'}`}
                        />
                    </button>
                </div>
                {hasFieldErrors('password') && (
                    <div className="mt-1 text-sm text-red-500">
                        <ul className="list-disc list-inside">
                            {getFieldErrors('password').map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <Button
                type="submit"
                disabled={!isFormValid() || loading}
                className={`w-full ${isFormValid() && !loading ? 'bg-coffee-600' : 'bg-coffee-400'}`}
            >
                {loading ? 'Logging in...' : 'Login'}
            </Button>

            <Button
                type="button"
                className="text-coffee-600 mt-4 w-full bg-transparent hover:bg-transparent hover:text-coffee-700 hover:underline"
                onClick={onSwitchToRegister}
                disabled={loading}
            >
                Don't have an account? Register
            </Button>
        </form>
    );
};

export default Login;
