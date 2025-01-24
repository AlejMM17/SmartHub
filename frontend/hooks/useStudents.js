import { useState } from 'react';

export default function useStudents() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchStudents = async () => {
        setLoading(true);
        setError(null);

        try {

            const res = await fetch(`http://localhost:3001/api/v1/users/students`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!res.ok) {
                throw new Error(`Failed to fetch students`);
            }

            return res.json();
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const postStudent = async (user) => {
        setLoading(true);
        setError(null);

        try {
            if (!user) throw new Error('No user provided');

            const res = await fetch("http://localhost:3001/api/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })

            if (!res.ok)  {
                throw new Error("¡Las credenciales no son validas!")
            }

            return await res.json()

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const deleteStudent = async (id) => {
        setLoading(true);
        setError(null);

        try {
            if (!id) throw new Error('No ID provided')

            const res = await fetch(`http://localhost:3001/api/v1/users/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error(`Failed to delete user with id: ${id}`);
            }

            return res.json();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const importStudents = async (file) => {
        setLoading(true);
        setError(null);

        try {
            if (!file) throw new Error('No file provided')

            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`http://localhost:3001/api/v1/users/import`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error(`Failed to import users`);
            }

            return res.json();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    
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

    return { fetchStudents, postStudent, deleteStudent, importStudents, updateUser, error, loading };
}