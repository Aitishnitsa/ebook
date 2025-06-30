import { useState } from "react";
import useApi from "../hooks/useApi";
import Button from "../components/Buttons/Button";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { PlusIcon } from "../components/Icons/PlusIcon";

const FindFriends = () => {
    const [username, setUsername] = useState("");
    const [msg, setMsg] = useState("");
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [error, setError] = useState("");

    const { user } = useAuth();    
    const { request, loading } = useApi();
    const { request: requestFriends, data: friendsData, error: friendsError } = useApi();
    const { request: requestPending, data: pendingData, error: pendingError } = useApi();
    const { request: requestUsers } = useApi();


    useEffect(() => {
        if (!user) return;
        requestFriends("get", "/friends/");
        requestPending("get", "/friends/requests");
        requestUsers("get", "/users").then(data => setUsers(data || []));
    }, []);

    useEffect(() => {
        if (friendsData) setFriends(friendsData);
        if (pendingData) setPending(pendingData);
    }, [friendsData, pendingData]);

    useEffect(() => {
        if (friendsError) setError("Не вдалося завантажити друзів");
        else if (pendingError) setError("Не вдалося завантажити запити");
        else setError("");
    }, [friendsError, pendingError]);

    useEffect(() => {
        if (!users.length || !user) {
            setFilteredUsers([]);
            return;
        }
        const friendIds = friends.map(f => f.id);
        const pendingIds = pending.map(r => r.to_user?.id || r.to_user);
        const filtered = users
            .filter(u =>
                u.id !== user.id &&
                !friendIds.includes(u.id) &&
                !pendingIds.includes(u.id)
            )
            .map(u => ({
                ...u,
                requestSent: pendingIds.includes(u.id),
                isFriend: friendIds.includes(u.id)
            }));
        setFilteredUsers(filtered);
    }, [users, friends, pending, user]);

    useEffect(() => {
        if (!username) {
            setFilteredUsers(prev =>
                prev.length ? prev : users.map(u => ({
                    ...u,
                    isFriend: friends.map(f => f.id).includes(u.id),
                    requestSent: pending.map(r => r.to_user?.id || r.to_user).includes(u.id)
                }))
            );
        } else {
            setFilteredUsers(
                users
                    .filter(u =>
                        u.id !== user.id &&
                        u.username.toLowerCase().includes(username.toLowerCase())
                    )
                    .map(u => ({
                        ...u,
                        isFriend: friends.map(f => f.id).includes(u.id),
                        requestSent: pending.map(r => r.to_user?.id || r.to_user).includes(u.id)
                    }))
                    .filter(u =>
                        !u.isFriend && !u.requestSent
                    )
            );
        }
    }, [username, users, friends, pending, user]);

    const handleSendRequest = async (friendId) => {
        try {
            await request("post", "/friends/request", { friend_id: friendId });
            setMsg("Запит надіслано!");
            await requestPending("get", "/friends/requests");
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
                        {u.requestSent ? (
                            <span className="text-coffee-500">Запит надіслано</span>
                        ) : (
                            <Button
                                onClick={() => handleSendRequest(u.id)}
                                className="bg-coffee-600 text-white px-3 py-1 rounded mt-2"
                            >
                                <PlusIcon className="w-5 h-5 fill-coffee-50" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindFriends;