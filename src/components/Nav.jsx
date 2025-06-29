import { useNavigate } from 'react-router-dom';
import Logo from './Icons/Logo';
import { Logout } from './Icons/Logout';

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
        <nav className="bg-coffee-800 px-4 py-2 flex items-center justify-between">
            <div className="flex-1 cursor-pointer" onClick={() => navigate('/')}>
                <Logo className={"w-10 h-10"} />
            </div>
            {isAuth && (
                <ul className="flex flex-1 justify-center list-none m-0 p-0">
                    <li className="mx-3">
                        <button
                            onClick={() => navigate('/')}
                            className="text-coffee-50 transition duration-300 hover:text-coffee-200 bg-transparent border-none cursor-pointer"
                        >
                            Home
                        </button>
                    </li>
                    {/* <li className="mx-3">
                        <button
                            onClick={() => navigate('/admin')}
                            className="text-coffee-50 hover:text-coffee-200 bg-transparent border-none cursor-pointer"
                        >
                            Admin
                        </button>
                    </li> */}
                    <li className="mx-3">
                        <button
                            onClick={() => navigate('/reader')}
                            className="text-coffee-50 transition duration-300 hover:text-coffee-200 bg-transparent border-none cursor-pointer"
                        >
                            Reader
                        </button>
                    </li>
                    <li className="mx-3">
                        <button
                            onClick={() => navigate('/profile')}
                            className="text-coffee-50 transition duration-300 hover:text-coffee-200 bg-transparent border-none cursor-pointer"
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
                        className="text-coffee-50 transition duration-300 hover:text-coffee-200 bg-transparent border-none cursor-pointer"
                    >
                        <Logout className="w-7 h-7" />
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Nav;