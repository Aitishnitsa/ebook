import { useEffect, useState } from 'react';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    if (!user) return <div className="text-center mt-8">Not logged in</div>;

    return (
        <div className="max-w-sm mx-auto mt-8 p-6 border border-gray-200 rounded-lg bg-white text-center">
            <h2 className="text-xl font-semibold my-2">{user.username}</h2>
            <p className="text-gray-500 my-1">{user.email}</p>
        </div>
    );
};

export default Profile;