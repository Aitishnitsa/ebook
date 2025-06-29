import { useEffect, useState } from 'react';
import { EyeIcon } from '../components/Icons/EyeIcon';
import Button from '../components/Buttons/Button';
import { BrushIcon } from '../components/Icons/BrushIcon';
import FriendsList from '../components/FriendsList';
import useApi from '../hooks/useApi';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { request: apiRequest } = useApi();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setForm({ username: parsed.username, password: '' });
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = () => {
        setEditMode(true);
        setError('');
    };

    const handleCancel = () => {
        setEditMode(false);
        setForm({ username: user.username, password: '' });
        setError('');
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
            setUser(updated);
            localStorage.setItem('user', JSON.stringify(updated));
            setEditMode(false);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.message ||
                'Unknown error'
            );
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="text-center mt-8">Not logged in</div>;

    return (
        <div className="max-w-sm mx-auto mt-8 p-6 border border-coffee-200 rounded-lg">
            {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='relative'>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full pr-10"
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div className='relative'>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="border rounded px-3 py-2 w-full pr-10"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
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
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="flex justify-center gap-2">
                        <Button
                            type="submit"
                            disabled={loading}
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
            ) : (
                <div className="flex flex-row items-start justify-between">
                    <section>
                        <h2 className="text-coffee-900 text-xl font-semibold">{user.username}</h2>
                        <p className="text-coffee-500">{user.email}</p>
                        <FriendsList />
                    </section>
                    <Button
                        onClick={handleEdit}
                    >
                        <BrushIcon className="w-5 h-5 fill-coffee-50" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Profile;