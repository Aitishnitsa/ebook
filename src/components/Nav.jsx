import { useNavigate } from 'react-router-dom';
import Logo from './Icons/Logo';
import { Logout } from './Icons/Logout';
import { useAuth } from '../hooks/useAuth';

const Nav = ({ isAuth, onLogout }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = isAuth && user && (user.username === "aitishnitsa" || user.username === "DimaLoading");

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        onLogout(false);
        navigate('/auth');
    };

    return (
        <nav className="bg-coffee-800 px-4 py-2 flex items-center justify-between h-14">
            <div className="flex-1 cursor-pointer" onClick={() => navigate('/')}>
                <Logo className={"w-10 h-10"} />
            </div>
            {isAuth && (
                <ul className="flex flex-1 justify-center list-none space-x-2 sm:space-x-5 p-0">
                    {/* <li>
                        <button
                            onClick={() => navigate('/')}
                            className="text-coffee-50 transition duration-300 hover:text-coffee-200 bg-transparent border-none cursor-pointer"
                        >
                            Home
                        </button>
                    </li> */}
                    {isAdmin && <li>
                        <button
                            onClick={() => navigate('/admin')}
                            className="text-coffee-50 transition duration-300 hover:text-coffee-200 bg-transparent border-none cursor-pointer"
                        >
                            Admin
                        </button>
                    </li>}
                    <li>
                        <button
                            onClick={() => navigate('/friends')}
                            className="text-coffee-50 hover:text-coffee-200 bg-transparent border-none cursor-pointer"
                        >
                            Friends
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate('/reader')}
                            className="text-coffee-50 transition duration-300 hover:text-coffee-200 bg-transparent border-none cursor-pointer"
                        >
                            Reader
                        </button>
                    </li>
                    <li>
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