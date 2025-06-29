import { useEffect, useState } from "react";
import useApi from '../hooks/useApi';
import Button from "./Buttons/Button";
import { AcceptIcon } from "./Icons/AcceptIcon";
import { CancelIcon } from "./Icons/CancelIcon";
import { useAuth } from "../hooks/useAuth";
import { TrashIcon } from "./Icons/TrashIcon";

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    const { data: friendsData, error: friendsError, request: requestFriends } = useApi();
    const { data: pendingData, error: pendingError, request: requestPending } = useApi();
    const { error: respondError, request: requestRespond } = useApi();
    const { request: requestUsers } = useApi();
    const { error: deleteError, request: requestDelete } = useApi();
    const { user } = useAuth();

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
        else if (respondError) setError("Помилка відповіді на запит");
        else if (deleteError) setError("Не вдалося видалити друга");
        else setError("");
    }, [friendsError, pendingError, respondError, deleteError]);

    const getUsername = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.username : `ID: ${userId}`;
    };

    const respondRequest = async (request_id, accept) => {
        try {
            await requestRespond("post", `/friends/request/${request_id}/respond?accept=${accept}`);
            if (accept) {
                await requestFriends("get", "/friends/");
            }
            await requestPending("get", "/friends/requests");
        } catch {
            // error handled by useApi
        }
    };

    const deleteFriend = async (friend_id) => {
        try {
            await requestDelete("delete", `/friends/${friend_id}`);
            await requestFriends("get", "/friends/");
        } catch {
            // error handled by useApi
        }
    };

    return (
        <div className="flex flex-col max-w-sm mx-auto mt-8 space-y-4 text-coffee-500">
            <div>
                <h3 className="font-semibold text-coffee-800">Друзі</h3>
                {friends.length === 0 && <div>Немає друзів :(</div>}
                <ul>
                    {friends.map(f => {
                        const friendId = f.from_user_id === user.id ? f.to_user_id : f.from_user_id;
                        return (
                            <li key={f.id} className="mb-1 flex items-center justify-between gap-2">
                                <span>{getUsername(friendId)}</span>
                                <Button
                                    onClick={() => deleteFriend(friendId)}
                                    className="bg-coffee-300"
                                    title="Видалити друга"
                                >
                                    <TrashIcon className="w-5 h-5 fill-coffee-50" />
                                </Button>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-coffee-800">Вхідні запити</h4>
                {pending.length === 0 && <div>Немає запитів</div>}
                <ul className="flex flex-col space-y-2 w-full">
                    {pending.map(r => (
                    <li key={r.id} className="mb-2 w-full flex items-center justify-between gap-2 p-2 border border-coffee-300 rounded">
                            <b>{getUsername(r.from_user_id)}</b>
                        <div className="flex gap-2">
                            <Button onClick={() => respondRequest(r.id, true)}>
                                <AcceptIcon className="w-5 h-5 stroke-coffee-50" />
                            </Button>
                            <Button onClick={() => respondRequest(r.id, false)} className="bg-coffee-300">
                                <CancelIcon className="w-5 h-5 stroke-coffee-50" />
                            </Button>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
};

export default FriendsList;