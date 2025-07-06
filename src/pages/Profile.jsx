import { useState } from 'react';
import Button from '../components/Buttons/Button';
import { BrushIcon } from '../components/Icons/BrushIcon';
import FriendsList from '../components/FriendsList';
import { useAuth } from '../hooks/useAuth';
import EditForm from '../components/profile/EditForm';

const Profile = () => {
    const { user } = useAuth();
    const [editMode, setEditMode] = useState(false);

    const handleEdit = () => {
        setEditMode(true);
    };

    if (!user) return <div className="text-center mt-8">Not logged in</div>;

    return (
        <div className="max-w-sm mx-auto mt-8 p-6 border border-coffee-200 rounded-lg">
            {editMode ? (
                <EditForm setEditMode={setEditMode} />
            ) : (
                <>
                    <div className="flex flex-row items-start justify-between">
                        <section>
                            <h2 className="text-coffee-900 text-xl font-semibold">{user.username}</h2>
                            <p className="text-coffee-500">{user.email}</p>
                        </section>
                        <Button
                            onClick={handleEdit}
                        >
                            <BrushIcon className="w-5 h-5 fill-coffee-50" />
                        </Button>
                    </div>
                    <FriendsList />
                </>)}
        </div>
    );
};

export default Profile;