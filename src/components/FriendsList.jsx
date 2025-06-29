import { useEffect, useState } from "react";
import useApi from '../hooks/useApi';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [error, setError] = useState("");

    const { data: friendsData, error: friendsError, request: requestFriends } = useApi();
    const { data: pendingData, error: pendingError, request: requestPending } = useApi();
    const { error: respondError, request: requestRespond } = useApi();

    useEffect(() => {
        requestFriends("get", "/friends/");
        requestPending("get", "/friends/requests");
    }, []);

    useEffect(() => {
        if (friendsData) setFriends(friendsData);
        if (pendingData) setPending(pendingData);
    }, [friendsData, pendingData]);

    useEffect(() => {
        if (friendsError) setError("Не вдалося завантажити друзів");
        else if (pendingError) setError("Не вдалося завантажити запити");
        else if (respondError) setError("Помилка відповіді на запит");
        else setError("");
    }, [friendsError, pendingError, respondError]);

    const respondRequest = async (request_id, accept) => {
        try {
            await requestRespond("post", `/friends/request/${request_id}/respond?accept=${accept}`);
            setPending(prev => prev.filter(r => r.id !== request_id));
            if (accept) {
                await requestFriends("get", "/friends/");
            }
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
                {friends.map(f => (
                    <li key={f.id} className="mb-1">ID: {f.to_user_id === f.from_user_id ? f.to_user_id : (f.to_user_id || f.from_user_id)}</li>
                ))}
                </ul>
            </div>
            <div>
            <h4 className="font-semibold text-coffee-800">Вхідні запити</h4>
            {pending.length === 0 && <div>Немає запитів</div>}
            <ul>
                {pending.map(r => (
                    <li key={r.id} className="mb-2 flex items-center gap-2">
                        Запит від користувача ID: {r.from_user_id}
                        <button className="px-2 py-1 bg-green-200 rounded" onClick={() => respondRequest(r.id, true)}>Прийняти</button>
                        <button className="px-2 py-1 bg-red-200 rounded" onClick={() => respondRequest(r.id, false)}>Відхилити</button>
                    </li>
                ))}
                </ul>
            </div>
            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
};

export default FriendsList;