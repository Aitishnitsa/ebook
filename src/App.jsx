import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [localUsers, setLocalUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, [localUsers]);

  const handleCreateUser = () => {
    const newUser = { id: Date.now(), username, email };
    axios
      .post(`${import.meta.env.VITE_API_URL}/users`, newUser)
      .then((response) => {
        setLocalUsers((prevLocalUsers) => [...prevLocalUsers, response.data]);
        setUsers((prevUsers) => [...prevUsers, response.data]);
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
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === userId ? response.data : u))
        );
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
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
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
    <div>
      <h1>Users</h1>
      <button onClick={handleGetUserCount}>Get User Count</button>
      {userCount !== null && (
        <div>
          <strong>User Count:</strong> {userCount}
        </div>
      )}
      <ul>
        {users.map((user) =>
          editingUser === user.id ? (
            <li key={user.id}>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
              />
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <button onClick={() => handleUpdateUser(user.id)}>Save</button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </li>
          ) : (
            <li key={user.id}>
              {user.username} ({user.email})
              <button onClick={() => handleEditClick(user)}>Edit</button>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          )
        )}
      </ul>
      <h2>Create User</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleCreateUser}>Create User</button>
    </div>
  );
}

export default App;