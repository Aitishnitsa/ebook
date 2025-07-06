import { useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import Button from "../components/Buttons/Button";
import { useAuth } from "../hooks/useAuth";
import { PlusIcon } from "../components/Icons/PlusIcon";

const FindFriends = () => {
    const [username, setUsername] = useState("");
    const [msg, setMsg] = useState("");
    const { request } = useApi();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { user } = useAuth();

    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allUsers = await request("get", "/users");
                const otherUsers = allUsers.filter(u => u.id !== user.id);
                setUsers(otherUsers);
                setFilteredUsers(otherUsers);

                const friendsList = await request("get", "/friends/");
                setFriends(
                    friendsList.filter(f => f.status === "accepted")
                );

                const requests = await request("get", "/friends/requests");
                setPendingRequests(
                    requests.filter(r => r.status === "pending")
                );
            } catch {
                setMsg("Не вдалося завантажити користувачів");
            }
        };
        fetchData();
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

    const isFriend = (userId) =>
        friends.some(
            f =>
                (f.from_user_id === user.id && f.to_user_id === userId) ||
                (f.to_user_id === user.id && f.from_user_id === userId)
        );

    const isRequestPending = (userId) =>
        pendingRequests.some(
            r =>
                ((r.from_user_id === user.id && r.to_user_id === userId) ||
                    (r.to_user_id === user.id && r.from_user_id === userId)) &&
                r.status === "pending"
        );

    const handleSendRequest = async (toUserId) => {
        try {
            await request("post", "/friends/request", { data: { to_user_id: toUserId } });
            setMsg("Запит надіслано!");
            const requests = await request("get", "/friends/requests");
            setPendingRequests(requests.filter(r => r.status === "pending"));
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
            <div className={"flex flex-col gap-2"}>
                {filteredUsers.length === 0 && <div>Користувачів не знайдено</div>}
                {filteredUsers.map(u => {
                    const friend = isFriend(u.id);
                    const requestPending = isRequestPending(u.id);
                    return (
                        <div key={u.id} className="p-2 border border-coffee-300 rounded flex justify-between items-center">
                            <div className="flex flex-col gap-1">
                                <span><b>{u.username}</b></span>
                                <span>{u.email}</span>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                {friend && (
                                    <span className="text-coffee-800 text-sm">Друг</span>
                                )}
                                {requestPending && !friend && (
                                    <span className="text-coffee-600 text-sm">Запит на розгляді</span>
                                )}
                                <Button
                                    onClick={() => handleSendRequest(u.id)}
                                    className="bg-coffee-600 text-white px-3 py-1 rounded disabled:opacity-50"
                                    disabled={friend || requestPending}
                                >
                                    <PlusIcon className="w-5 h-5 fill-coffee-50" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FindFriends;