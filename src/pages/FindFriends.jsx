import { useState } from "react";
import useApi from "../hooks/useApi";
import Button from "../components/Buttons/Button";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { PlusIcon } from "../components/Icons/PlusIcon";

const FindFriends = () => {
    const [username, setUsername] = useState("");
    const [msg, setMsg] = useState("");
    const { request, loading } = useApi();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await request("get", "/users");
                // Відфільтрувати самого себе
                const otherUsers = allUsers.filter(u => u.id !== user.id);
                setUsers(otherUsers);
                setFilteredUsers(otherUsers);
            } catch {
                setMsg("Не вдалося завантажити користувачів");
            }
        };
        fetchUsers();
    }, [user, request]);

    useEffect(() => {
        if (!username) {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(
                users.filter(u =>
                    u.username.toLowerCase().includes(username.toLowerCase())
                )
            );
        }
    }, [username, users]);

    const handleSendRequest = async (toUserId) => {
        try {
            await request("post", "/friends/request", { data: { to_user_id: toUserId } });
            setMsg("Запит надіслано!");
        } catch {
            setMsg("Не вдалося надіслати запит");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-8 p-6 border border-coffee-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-coffee-900">Знайти друга за іменем</h2>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                    placeholder="Username"
                />
            </div>
            {msg && <div className="my-2">{msg}</div>}
            <div>
                {filteredUsers.length === 0 && <div>Користувачів не знайдено</div>}
                {filteredUsers.map(u => (
                    <div key={u.id} className="mb-2 p-2 border border-coffee-300 rounded flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <span><b>{u.username}</b></span>
                            <span>{u.email}</span>
                        </div>
                        <Button
                            onClick={() => handleSendRequest(u.id)}
                            className="bg-coffee-600 text-white px-3 py-1 rounded mt-2"
                        >
                            <PlusIcon className="w-5 h-5 fill-coffee-50" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindFriends;