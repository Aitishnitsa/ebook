import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
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
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Users</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleGetUserCount}
        >
          Get User Count
        </button>
        {userCount !== null && (
          <div className="text-gray-700">
            <strong>User Count:</strong> {userCount}
          </div>
        )}
      </div>
      <ul className="space-y-3 mb-8">
        {users.map((user) =>
          editingUser === user.id ? (
            <li key={user.id} className="w-full flex items-center space-x-2 justify-between bg-gray-100 p-2 rounded">
              <input
                type="text"
                className="border rounded px-2 py-1 w-1/3"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
              />
              <input
                type="email"
                className="border rounded px-2 py-1 w-1/3"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <button
                className="cursor-pointer bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                onClick={() => handleUpdateUser(user.id)}
              >
                Save
              </button>
              <button
                className="cursor-pointer bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
            </li>
          ) : (
            <li key={user.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span>
                <span className="font-medium">{user.username}</span> <span className="text-gray-500">({user.email})</span>
              </span>
              <div className="space-x-2">
                <button
                  className="cursor-pointer bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
                <button
                  className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          )
        )}
      </ul>
      <h2 className="text-xl font-semibold mb-3">Create User</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Username"
          className="border rounded px-2 py-1 flex-1"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-2 py-1 flex-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="cursor-pointer bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          onClick={handleCreateUser}
        >
          Create User
        </button>
      </div>
    </div>
  );
}

export default App;