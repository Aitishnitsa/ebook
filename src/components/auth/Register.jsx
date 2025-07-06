import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import useValidation from '../../hooks/useValidation';
import { EyeIcon } from '../Icons/EyeIcon';
import Button from '../Buttons/Button';

const Register = ({ onAuth, onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { request } = useApi();
    const { updateUser } = useAuth();
    const { validateField, clearFieldError, getFieldErrors, hasFieldErrors, checkUserExists, checking, addFieldError } = useValidation();

    const isFormValid = () => {
        const usernameErrors = getFieldErrors('username');
        const emailErrors = getFieldErrors('email');
        const passwordErrors = getFieldErrors('passwordRegister');

        return (
            username.length >= 3 &&
            /^[a-zA-Z0-9_]+$/.test(username) &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
            password.length >= 8 &&
            /(?=.*[a-zA-Z])/.test(password) &&
            usernameErrors.length === 0 &&
            emailErrors.length === 0 &&
            passwordErrors.length === 0 &&
            !checking.username &&
            !checking.email
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            // 1. Реєстрація
            await request('post', '/register', {
                data: { username, email, password },
            });

            // 2. Автоматичний логін після реєстрації
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
        } catch (err) {
            console.error('Registration error:', err);
            updateUser(null);

            if (err.response) {
                const detail = err.response.data?.detail;
                const status = err.response.status;

                if (typeof detail === 'string') {
                    setError(detail);
                } else if (Array.isArray(detail) && detail[0]?.msg) {
                    setError(detail[0].msg);
                } else if (status === 422) {
                    setError('Перевірте правильність введених даних.');
                } else if (status === 409) {
                    setError('Користувач з таким ім\'ям або email вже існує.');
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

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        clearFieldError('email');
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        clearFieldError('passwordRegister');
    };

    const handleUsernameBlur = async () => {
        const usernameErrors = validateField('username', username);

        if (usernameErrors.length === 0 && username.length >= 3) {
            const exists = await checkUserExists('username', username);
            if (exists) {
                addFieldError('username', 'Користувач з таким іменем вже існує');
            }
        }
    };

    const handleEmailBlur = async () => {
        const emailErrors = validateField('email', email);

        if (emailErrors.length === 0 && email.length > 0) {
            const exists = await checkUserExists('email', email);
            if (exists) {
                addFieldError('email', 'Користувач з таким email вже існує');
            }
        }
    };

    const handlePasswordBlur = () => {
        validateField('passwordRegister', password);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-sm mx-auto p-6 bg-coffee-50 rounded shadow mt-10"
        >
            <h2 className="text-2xl font-bold mb-4 text-center text-coffee-900">
                Register
            </h2>

            {error && <div className="mb-3 text-red-600 text-center">{error}</div>}
            {success && (
                <div className="mb-3 text-coffee-600 text-center">
                    Registration successful! Redirecting...
                </div>
            )}

            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        className={`border rounded px-3 py-2 w-full pr-10 ${hasFieldErrors('username') ? 'border-red-500' : 'border-coffee-300'
                            }`}
                        placeholder="Username"
                        value={username}
                        onChange={handleUsernameChange}
                        onBlur={handleUsernameBlur}
                        required
                    />
                    {checking.username && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div className="animate-spin w-4 h-4 border-2 border-coffee-600 border-t-transparent rounded-full"></div>
                        </div>
                    )}
                </div>
                {hasFieldErrors('username') && (
                    <div className="mt-1 text-sm text-red-500">
                        <ul className="list-disc list-inside">
                            {getFieldErrors('username').map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {!hasFieldErrors('username') && (
                    <div className="mt-2 text-sm text-coffee-600">
                        <ul className="list-disc list-inside">
                            <li className={username.length >= 3 ? 'text-coffee-600' : 'text-red-500'}>
                                Мінімум 3 символи
                            </li>
                            <li className={/^[a-zA-Z0-9_]*$/.test(username) && username.length > 0 ? 'text-coffee-600' : 'text-red-500'}>
                                Тільки літери, цифри та підкреслення
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <div className="relative">
                    <input
                        type="email"
                        className={`border rounded px-3 py-2 w-full pr-10 ${hasFieldErrors('email') ? 'border-red-500' : 'border-coffee-300'
                            }`}
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        required
                    />
                    {checking.email && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div className="animate-spin w-4 h-4 border-2 border-coffee-600 border-t-transparent rounded-full"></div>
                        </div>
                    )}
                </div>
                {hasFieldErrors('email') && (
                    <div className="mt-1 text-sm text-red-500">
                        <ul className="list-disc list-inside">
                            {getFieldErrors('email').map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {!hasFieldErrors('email') && (
                    <div className="mt-2 text-sm text-coffee-600">
                        <p className={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email === '' ? 'text-coffee-600' : 'text-red-500'}>
                            {email === '' ? '' :
                                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' :
                                    'Неправильний формат email'}
                        </p>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className={`border rounded px-3 py-2 w-full pr-10 ${hasFieldErrors('passwordRegister') ? 'border-red-500' : 'border-coffee-300'
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
                {hasFieldErrors('passwordRegister') && (
                    <div className="mt-1 text-sm text-red-500">
                        <ul className="list-disc list-inside">
                            {getFieldErrors('passwordRegister').map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {!hasFieldErrors('passwordRegister') && (
                <div className="mb-4 text-sm text-coffee-600">
                    <ul className="list-disc list-inside">
                        <li className={password.length >= 8 ? 'text-coffee-600' : 'text-red-500'}>
                            Мінімум 8 символів
                        </li>
                        <li className={/(?=.*[a-zA-Z])/.test(password) ? 'text-coffee-600' : 'text-red-500'}>
                            Щонайменше одна літера
                        </li>
                    </ul>
                </div>
            )}

            <Button
                type="submit"
                disabled={!isFormValid() || loading}
                className={`w-full ${isFormValid() && !loading ? 'bg-coffee-600' : 'bg-coffee-400'}`}
            >
                {loading ? 'Registering...' : 'Register'}
            </Button>

            <Button
                type="button"
                className="text-coffee-600 mt-4 w-full bg-transparent hover:bg-transparent hover:text-coffee-700 hover:underline"
                onClick={onSwitchToLogin}
                disabled={loading}
            >
                Already have an account? Login
            </Button>
        </form>
    );
};

export default Register;
