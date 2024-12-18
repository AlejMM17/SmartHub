"use client"

import { useUser } from '@/context/UserContext';
import useProjects from '@/hooks/useProjects';
import { useEffect, useState } from 'react';

export default function Page() {
    const { fetchProjects, error, loading } = useProjects();
    const [projects, setProjects] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        const fetchUserProjects = async () => {
            if (user && user.assigned_projects) {
                const projectData = await fetchProjects(user.assigned_projects);
                setProjects(projectData);
            }
        };

        fetchUserProjects();
    }, [user]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <>
        <h1>Benvolgut als teus projectes</h1>
        <div>
            {projects.length > 0 ? (
                projects.map((project) => (
                    <div key={project._id}>
                        <h2>{project.name}</h2>
                        <p>{project.description}</p>
                    </div>
                ))
            ) : (
                <p>No projects found</p>
            )}
        </div>
    </>
    );
}