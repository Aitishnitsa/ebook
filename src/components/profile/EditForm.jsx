import { useState, useEffect } from 'react';
import { EyeIcon } from '../Icons/EyeIcon';
import Button from '../Buttons/Button';
import useApi from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import useValidation from '../../hooks/useValidation';

const EditForm = ({ setEditMode }) => {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { request: apiRequest } = useApi();
    const { validateField, clearErrors, clearFieldError, addFieldError, getFieldErrors, hasFieldErrors, checkUserExists, checking } = useValidation();

    useEffect(() => {
        if (user) {
            setForm({ username: user.username, password: '' });
        }
    }, [user]);

    const isFormValid = () => {
        const usernameErrors = getFieldErrors('username');
        const passwordErrors = getFieldErrors('password');

        return usernameErrors.length === 0 &&
            passwordErrors.length === 0 &&
            !checking.username;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        clearFieldError(e.target.name);
    };

    const handleUsernameBlur = async () => {
        const usernameErrors = validateField('username', form.username);

        if (usernameErrors.length === 0 && form.username !== user.username) {
            const exists = await checkUserExists('username', form.username, user.username);
            if (exists) {
                addFieldError('username', 'Користувач з таким іменем вже існує');
            }
        }
    };

    const handlePasswordBlur = () => {
        validateField('password', form.password, 'passwordProfile');
    };

    const handleCancel = () => {
        setEditMode(false);
        setForm({ username: user.username, password: '' });
        setError('');
        clearErrors();
    };

    const performAutoLogin = async (username, password) => {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', username);
        params.append('password', password);

        const loginResponse = await apiRequest('post', '/token', {
            data: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const { access_token, refresh_token } = loginResponse;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        const userResponse = await apiRequest('get', '/users/me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        updateUser(userResponse);
        return userResponse;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const updated = await apiRequest('put', '/me', {
                data: {
                    username: form.username,
                    password: form.password || undefined,
                },
            });

            if (updated.username !== user.username && form.password) {
                try {
                    await performAutoLogin(updated.username, form.password);
                    setEditMode(false);
                } catch (loginError) {
                    console.error('Auto-login error:', loginError);
                    updateUser(null);

                    let loginErrorMessage = 'Не вдалося автоматично увійти';
                    if (loginError.response?.data?.detail) {
                        const detail = loginError.response.data.detail;
                        if (typeof detail === 'string') {
                            loginErrorMessage = detail;
                        }
                    }

                    window.location.href = '/ebook/auth';
                }
            } else if (updated.username !== user.username && !form.password) {
                setError('Для зміни імені користувача необхідно вказати пароль.');
            } else {
                updateUser(updated);
                setEditMode(false);
            }
        } catch (err) {
            console.error('Profile update error:', err);

            let errorMessage = 'Unknown error';

            if (err.response?.data?.detail) {
                const detail = err.response.data.detail;
                if (typeof detail === 'string') {
                    errorMessage = detail;
                } else if (Array.isArray(detail) && detail.length > 0) {
                    errorMessage = detail.map(error => error.msg || error.message || 'Validation error').join(', ');
                } else if (typeof detail === 'object') {
                    errorMessage = detail.msg || detail.message || 'Validation error';
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className='relative'>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        onBlur={handleUsernameBlur}
                        className={`border rounded px-3 py-2 w-full pr-10 ${hasFieldErrors('username') ? 'border-red-500' : 'border-coffee-300'
                            }`}
                        placeholder="Username"
                        required
                    />
                    {checking.username && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div className="animate-spin w-4 h-4 border-2 border-coffee-600 border-t-transparent rounded-full"></div>
                        </div>
                    )}
                    {hasFieldErrors('username') && (
                        <div className="mt-1 text-sm text-red-500">
                            <ul className="list-disc list-inside">
                                {getFieldErrors('username').map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {!hasFieldErrors('username') && form.username !== user.username && (
                        <div className="mt-1 text-sm text-coffee-600">
                            <p>Вимоги до імені користувача:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li className={form.username.length >= 3 ? 'text-green-600' : 'text-coffee-500'}>
                                    Мінімум 3 символи
                                </li>
                                <li className={form.username.length <= 50 ? 'text-green-600' : 'text-coffee-500'}>
                                    Максимум 50 символів
                                </li>
                                <li className={/^[a-zA-Z0-9_]*$/.test(form.username) && form.username.length > 0 ? 'text-green-600' : 'text-coffee-500'}>
                                    Тільки літери, цифри та підкреслення
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    <div className='relative'>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className={`border rounded px-3 py-2 w-full pr-10 ${hasFieldErrors('password') ? 'border-red-500' : 'border-coffee-300'
                                }`}
                            placeholder="Password" // (пусто - без змін)"
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handlePasswordBlur}
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
                    {hasFieldErrors('password') && (
                        <div className="mt-1 text-sm text-red-500">
                            <ul className="list-disc list-inside">
                                {getFieldErrors('password').map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {form.password && !hasFieldErrors('password') && (
                        <div className="mt-1 text-sm text-coffee-600">
                            <p>Вимоги до пароля:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li className={form.password.length >= 8 ? 'text-green-600' : 'text-coffee-500'}>
                                    Мінімум 8 символів
                                </li>
                                <li className={/(?=.*[a-zA-Z])/.test(form.password) ? 'text-green-600' : 'text-coffee-500'}>
                                    Щонайменше одна літера
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                {error && <div className="text-red-500">{error}</div>}
                <div className="flex justify-center gap-2">
                    <Button
                        type="submit"
                        disabled={loading || !isFormValid()}
                        className={`${isFormValid() && !loading
                            ? 'bg-coffee-600 hover:bg-coffee-700'
                            : 'bg-coffee-400 cursor-not-allowed'
                            }`}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                        type="button"
                        className="bg-coffee-300 px-4 py-2 rounded"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </>
    );
};

export default EditForm;
