import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [userCount, setUserCount] = useState(null);  

    useEffect(() => {
        const cachedUsers = localStorage.getItem('users');
        if (cachedUsers) {
            setUsers(JSON.parse(cachedUsers));
        }
        axios
            .get(`${import.meta.env.VITE_API_URL}/users`)
            .then((response) => {
                setUsers(response.data);
                localStorage.setItem('users', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const handleCreateUser = () => {
        if (!username || !email) return;
        const newUser = { id: Date.now(), username, email };
        axios
            .post(`${import.meta.env.VITE_API_URL}/users`, newUser)
            .then((response) => {
                setUsers((prevUsers) => {
                    const updatedUsers = [...prevUsers, response.data];
                    localStorage.setItem('users', JSON.stringify(updatedUsers));
                    return updatedUsers;
                });
                setUsername('');
                setEmail('');
            })
            .catch((error) => {
                console.error('Error creating user:', error);
            });
    };

    const handleEditClick = (user) => {
        setEditingUser(user.id);
        setEditUsername(user.username);
        setEditEmail(user.email);
    };

    const handleUpdateUser = (userId) => {
        const updatedUser = { id: userId, username: editUsername, email: editEmail };
        axios
            .put(`${import.meta.env.VITE_API_URL}/users/${userId}`, updatedUser)
            .then((response) => {
                setUsers((prevUsers) => {
                    const updatedUsers = prevUsers.map((u) => (u.id === userId ? response.data : u));
                    localStorage.setItem('users', JSON.stringify(updatedUsers));
                    return updatedUsers;
                });
                setEditingUser(null);
            })
            .catch((error) => {
                console.error('Error updating user:', error);
            });
    };

    const handleDeleteUser = (userId) => {
        axios
            .delete(`${import.meta.env.VITE_API_URL}/users/${userId}`)
            .then(() => {
                setUsers((prevUsers) => {
                    const updatedUsers = prevUsers.filter((u) => u.id !== userId);
                    localStorage.setItem('users', JSON.stringify(updatedUsers));
                    return updatedUsers;
                });
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
            });
    };

    const handleGetUserCount = () => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/users/count`)
            .then((response) => {
                setUserCount(response.data.count);
            })
            .catch((error) => {
                console.error('Error fetching user count:', error);
                setUserCount('Error');
            });
    };

    return (
        <div className="max-w-xl w-full mx-auto p-4 sm:p-6 bg-white rounded shadow mt-6 sm:mt-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Users</h1>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 sm:gap-0">
                <button
                    className="w-full sm:w-auto cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={handleGetUserCount}
                >
                    Get User Count
                </button>
                {userCount !== null && (
                    <div className="text-gray-700 mt-2 sm:mt-0">
                        <strong>User Count:</strong> {userCount}
                    </div>
                )}
            </div>
            <ul className="space-y-3 mb-8">
                {users.map((user) =>
                    editingUser === user.id ? (
                        <li key={user.id} className="w-full flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 justify-between bg-gray-100 p-2 rounded">
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
                                    className="cursor-pointer bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition flex items-center justify-center"
                                    onClick={() => handleUpdateUser(user.id)}
                                    title="Save"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                                <button
                                    className="cursor-pointer bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition flex items-center justify-center"
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
                        <li key={user.id} className="flex flex-row items-stretch sm:items-center justify-between bg-gray-50 p-2 rounded space-y-2 sm:space-y-0">
                            <span>
                                <span className="font-medium">{user.username}</span> <span className="text-gray-500">({user.email})</span>
                            </span>
                            <div className="flex items-center justify-end flex-row gap-2">
                                <button
                                    className="cursor-pointer bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition flex items-center justify-center"
                                    onClick={() => handleEditClick(user)}
                                    title="Edit"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4" />
                                    </svg>
                                </button>
                                <button
                                    className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center justify-center"
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