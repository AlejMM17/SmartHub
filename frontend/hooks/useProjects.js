import { useState } from 'react';

export default function useProjects() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchProjects = async (assigned_projects) => {
        setLoading(true);
        setError(null);

        try {
            if (!Array.isArray(assigned_projects)) {
                throw new Error('Assigned projects is not an array');
            }

            const projectsPromise = assigned_projects.map(async (projectId) => {
                const res = await fetch(`http://localhost:3001/api/v1/projects/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch project with ID: ${projectId}`);
                }                
                
                return res.json();
            });
            const projects = await Promise.all(projectsPromise);
            return projects;
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const postProject = async (project) => {
        setLoading(true);
        setError(null);

        try {
            if (!project) throw new Error('No project provided');

            const res = await fetch("http://localhost:3001/api/v1/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(project)
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

    const fetchProfessorProjects = async (professorID) => {
        setLoading(true);
        setError(null);

        try {
            if (!professorID) throw new Error('No professor ID provided')

            const res = await fetch(`http://localhost:3001/api/v1/projects/professors/${professorID}`);

            if (!res.ok) {
                throw new Error(`Failed to fetch professor projects with professor_id: ${professorID}`);
            }

            return res.json();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const deleteProject = async (id) => {
        setLoading(true);
        setError(null);

        try {
            if (!id) throw new Error('No ID provided')

            const res = await fetch(`http://localhost:3001/api/v1/projects/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error(`Failed to delete project with id: ${id}`);
            }

            return res.json();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const updateProject = async (id, project) => {
        setLoading(true);
        setError(null);

        try {
            if (!id) throw new Error('No ID provided')

            const res = await fetch(`http://localhost:3001/api/v1/projects/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(project)
            });

            if (!res.ok) {
                throw new Error(`Failed to delete project with id: ${id}`);
            }

            return res.json();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { fetchProjects, postProject, fetchProfessorProjects, deleteProject, updateProject, error, loading };
}