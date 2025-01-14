import { useState } from 'react';

export default function useSkills() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllSkills = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:3001/api/v1/skills`);

            if (!res.ok) {
                throw new Error(`Failed to fetch skills`);
            }

            return res.json();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { fetchAllSkills, error, loading };
}