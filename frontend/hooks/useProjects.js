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
    return { fetchProjects, error, loading };
}