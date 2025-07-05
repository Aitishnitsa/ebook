import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import useApi from "../hooks/useApi";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [userCount, setUserCount] = useState(null);  

    const { request } = useApi();

    useEffect(() => {
        const cachedUsers = localStorage.getItem('users');
        if (cachedUsers) {
            setUsers(JSON.parse(cachedUsers));
        }
        request('get', '/users')
            .then((usersData) => {
                setUsers(usersData);
                localStorage.setItem('users', JSON.stringify(usersData));
            })
            .catch((err) => {
                console.error('Error fetching users:', err);
            });
    }, []);

    const handleEditClick = (user) => {
        setEditingUser(user.id);
        setEditUsername(user.username);
        setEditEmail(user.email);
    };

    const handleUpdateUser = async (userId) => {
        const updatedUser = { id: userId, username: editUsername, email: editEmail };
        try {
            const updated = await request('put', `/users/${userId}`, { data: updatedUser });
            setUsers((prevUsers) => {
                const updatedUsers = prevUsers.map((u) => (u.id === userId ? updated : u));
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                return updatedUsers;
            });
            setEditingUser(null);
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await request('delete', `/users/${userId}`);
            setUsers((prevUsers) => {
                const updatedUsers = prevUsers.filter((u) => u.id !== userId);
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                return updatedUsers;
            });
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const handleGetUserCount = async () => {
        try {
            const result = await request('get', '/users/count');
            setUserCount(result.count);
        } catch (err) {
            console.error('Error fetching user count:', err);
            setUserCount('Error');
        }
    };

    return (
        <div className="max-w-xl w-full mx-auto p-4 sm:p-6 bg-coffee-50 rounded shadow mt-6 sm:mt-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-coffee-900">Users</h1>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 sm:gap-0">
                <button
                    className="w-full sm:w-auto cursor-pointer bg-coffee-600 text-coffee-50 px-4 py-2 rounded hover:bg-coffee-700 transition"
                    onClick={handleGetUserCount}
                >
                    Get User Count
                </button>
                {userCount !== null && (
                    <div className="text-coffee-700 mt-2 sm:mt-0">
                        <strong>User Count:</strong> {userCount}
                    </div>
                )}
            </div>
            <ul className="space-y-3 mb-8">
                {users.map((user) =>
                    editingUser === user.id ? (
                        <li key={user.id} className="w-full flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 justify-between bg-coffee-100 p-2 rounded">
                            <input
                                type="text"
                                className="border rounded px-2 py-1 w-full sm:w-1/3 flex-1"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                            />
                            <input
                                type="email"
                                className="border rounded px-2 py-1 w-full sm:w-1/3 flex-1"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button
                                    className="cursor-pointer bg-coffee-500 text-coffee-50 px-3 py-1 rounded hover:bg-coffee-600 transition flex items-center justify-center"
                                    onClick={() => handleUpdateUser(user.id)}
                                    title="Save"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                                <button
                                    className="cursor-pointer bg-coffee-300 text-coffee-800 px-3 py-1 rounded hover:bg-coffee-400 transition flex items-center justify-center"
                                    onClick={() => setEditingUser(null)}
                                    title="Cancel"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ) : (
                        <li key={user.id} className="flex flex-row items-stretch sm:items-center justify-between bg-coffee-50 p-2 rounded space-y-2 sm:space-y-0">
                            <span>
                                    <span className="font-medium text-coffee-950">{user.id}</span> <span className="font-medium text-coffee-700">{user.username}</span> <span className="text-coffee-500">({user.email})</span>
                            </span>
                            <div className="flex items-center justify-end flex-row gap-2">
                                <button
                                    className="cursor-pointer bg-coffee-400 text-coffee-50 px-3 py-1 rounded hover:bg-coffee-500 transition flex items-center justify-center"
                                    onClick={() => handleEditClick(user)}
                                    title="Edit"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4" />
                                    </svg>
                                </button>
                                <button
                                    className="cursor-pointer bg-coffee-500 text-coffee-50 px-3 py-1 rounded hover:bg-coffee-600 transition flex items-center justify-center"
                                    onClick={() => handleDeleteUser(user.id)}
                                    title="Delete"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    )
                )}
            </ul>
        </div>
    );
}

export default AdminPanel;