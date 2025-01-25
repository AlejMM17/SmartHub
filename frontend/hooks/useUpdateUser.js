import { useState } from 'react';

export default function useUpdateUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateUser = async (id, user) => {
        setLoading(true);
        setError(null);

        try {
            if (!id) throw new Error('No ID provided')
            else if (!user) throw new Error('No user provided')

            const formData = new FormData();
            formData.append("name", user.name);
            formData.append("lastName", user.lastName);
            formData.append("email", user.email);

            if (user.user_picture) {
                formData.append("user_picture", user.user_picture);
            }

            const res = await fetch(`http://localhost:3001/api/v1/users/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Failed to update user with id: ${id}`);
            }

            return await res.json();
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };
    return { updateUser, loading, error };
}