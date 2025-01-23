import { useState } from 'react';

export default function useScores() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const postScore = async (score) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:3001/api/v1/scores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(score)
            });

            if (!res.ok) {
                throw new Error("Failed to post score");
            }

            return await res.json();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateScore = async (id, score) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:3001/api/v1/scores/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(score)
            });

            if (!res.ok) {
                throw new Error("Failed to update score");
            }

            return await res.json();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchScores = async (query) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:3001/api/v1/scores?${query}`);

            if (!res.ok) {
                throw new Error("Failed to fetch scores");
            }

            return await res.json();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { postScore, updateScore, fetchScores, error, loading };
}