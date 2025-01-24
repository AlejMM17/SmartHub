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

    const postSkill = async (skill) => {
        setLoading(true);
        setError(null);

        try {
            if (!skill) throw new Error('No skill provided');

            const formData = new FormData();
            formData.append("name", skill.name);
            formData.append("description", skill.description);
            formData.append("icon", skill.icon);

            const res = await fetch("http://localhost:3001/api/v1/skills", {
                method: "POST",
                body: formData,
            })

            if (!res.ok)  {
                throw new Error("¡No se ha podido subir la skill!")
            }

            return await res.json()

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const updateSkill = async (id, skill) => {
        setLoading(true);
        setError(null);

        try {
            if (!id) throw new Error('No ID provided')
            else if (!skill) throw new Error('No skill provided')

            const formData = new FormData();
            formData.append("name", skill.name);
            formData.append("description", skill.description);

            if (skill.icon) {
                formData.append("icon", skill.icon);
            }

            const res = await fetch(`http://localhost:3001/api/v1/skills/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Failed to update skill with id: ${id}`);
            }

            return res.json();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const deleteSkill = async (id) => {
        setLoading(true);
        setError(null);

        try {
            if (!id) throw new Error('No skill ID provided')

            const res = await fetch(`http://localhost:3001/api/v1/skills/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error(`Failed to delete skill with id: ${id}`);
            }

            return res.json();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const getSkillById = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:3001/api/v1/skills/${id}`);

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

    return { fetchAllSkills, getSkillById, postSkill, updateSkill, deleteSkill, error, loading };
}