import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [localUsers, setLocalUsers] = useState([]);

  useEffect(() => {
    axios
      .get('/api/users')
      .then((response) => {
        console.log('Fetched users:', response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, [localUsers]);

  const handleCreateUser = () => {
    const newUser = { id: Date.now(), username, email };
    axios
      .post('/api/users', newUser)
      .then((response) => {
        console.log('User created:', response.data);
        setLocalUsers((prevLocalUsers) => [...prevLocalUsers, response.data]);
        setUsers((prevUsers) => [...prevUsers, response.data]);
        setUsername('');
        setEmail('');
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  };

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user, index) => (
          <li key={user.id || index}>
            {user.username} ({user.email})
          </li>
        ))}
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