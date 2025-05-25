import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const navigate = useNavigate();

    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex list-none m-0 p-0">
                <li className="mr-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-white hover:text-gray-300 bg-transparent border-none cursor-pointer"
                    >
                        Home
                    </button>
                </li>
                <li className="mr-6">
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-white hover:text-gray-300 bg-transparent border-none cursor-pointer"
                    >
                        Admin
                    </button>
                </li>
                <li className="mr-6">
                    <button
                        onClick={() => navigate('/profile')}
                        className="text-white hover:text-gray-300 bg-transparent border-none cursor-pointer"
                    >
                        Profile
                    </button>
                </li>
                <li className="mr-6">
                    <button
                        onClick={() => navigate('/auth')}
                        className="text-white hover:text-gray-300 bg-transparent border-none cursor-pointer"
                    >
                        Auth
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;
