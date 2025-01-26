import { useState } from 'react';

export default function useStudents() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchStudents = async () => {
        setLoading(true);
        setError(null);

        try {

            const res = await fetch(`http://localhost:3001/api/v1/users/students`)

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

    const getUserById = async (id) => {
        setLoading(true);
        setError(null);

        try {
            if (!id) throw new Error('No id provided');
            const res = await fetch(`http://localhost:3001/api/v1/users/${id}`)

            if (!res.ok) {
                throw new Error(`Failed to fetch the user with ID: ${id}`);
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

            const formData = new FormData();
            formData.append("name", user.name);
            formData.append("lastName", user.lastName);
            formData.append("email", user.email);
            formData.append("password", user.password);
            formData.append("role", user.role);

            if (user.user_picture) {
                formData.append("user_picture", user.user_picture);
            }

            const res = await fetch("http://localhost:3001/api/v1/users", {
                method: "POST",
                body: formData,
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

    const assignStudentsToProject = async (students, projectId) => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`http://localhost:3001/api/v1/users/students/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(students),
            });

            if (!res.ok) {
                throw new Error(`Failed to assign users to the project with id: ${projectId}`);
            }

            return await res.json();

        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }

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
            formData.append("password", user.password);
            formData.append("role", user.role);

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
    const fetchUserImage = async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:3001/api/v1/users/${userId}`);
            if (!res.ok) {
                throw new Error(`Failed to fetch user image`);
            }
            const user = await res.json();
            return user.user_picture;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { fetchStudents, postStudent, deleteStudent, importStudents, updateUser, assignStudentsToProject, fetchUserImage, getUserById, error, loading };
}