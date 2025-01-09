import { useState } from 'react';

export default function useUpdateUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateUser = async (userId, updatedData) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:3001/api/v1/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) {

                throw new Error('Failed to update user');
            }

            const data = await res.json();
            console.log(data)
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateUser, loading, error };
}