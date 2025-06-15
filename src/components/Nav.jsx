import { useNavigate } from 'react-router-dom';

const Nav = ({ isAuth, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        onLogout(false);
        navigate('/auth');
    };

    return (
        <nav className="bg-gray-800 p-4 flex items-center justify-between">
            <div className="flex-1">
                <h1 className="text-white">eBook logo :)</h1>
            </div>
            {isAuth && (
                <ul className="flex flex-1 justify-center list-none m-0 p-0">
                    <li className="mx-3">
                        <button
                            onClick={() => navigate('/')}
                            className="text-white hover:text-gray-300 bg-transparent border-none cursor-pointer"
                        >
                            Home
                        </button>
                    </li>
                    <li className="mx-3">
                        <button
                            onClick={() => navigate('/admin')}
                            className="text-white hover:text-gray-300 bg-transparent border-none cursor-pointer"
                        >
                            Admin
                        </button>
                    </li>
                    <li className="mx-3">
                        <button
                            onClick={() => navigate('/profile')}
                            className="text-white hover:text-gray-300 bg-transparent border-none cursor-pointer"
                        >
                            Profile
                        </button>
                    </li>
                </ul>
            )}
            <div className="flex-1 flex justify-end">
                {isAuth && (
                    <button
                        onClick={handleLogout}
                        className="text-white hover:text-gray-300 bg-transparent border-none cursor-pointer"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Nav;