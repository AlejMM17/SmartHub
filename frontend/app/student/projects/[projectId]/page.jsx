"use client";

import { useUser } from '@/context/UserContext';
import useActivities from '@/hooks/useActivities';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Activities() {
    const { fetchActivities, error, loading } = useActivities();
    const [activities, setActivities] = useState([]);
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        const fetchUserActivities = async () => {
            if (user && user.assigned_projects) {
                const allActivities = [];
                for (const projectId of user.assigned_projects) {
                    const activityData = await fetchActivities(projectId);
                    allActivities.push(...activityData);
                }
                setActivities(allActivities);
            }
        };

        fetchUserActivities();
    }, [user]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleActivityClick = (activityId) => {
        router.push(`/student/activity/${activityId}/details`);
    };

    return (
      <>
        <h1>Benvolgut a les teves activitats</h1>
        <div>
            {activities.length > 0 ? (
                activities.map((activity) => (
                    <div key={activity._id} onClick={() => handleActivityClick(activity._id)} style={{ cursor: 'pointer' }}>
                        <h2>{activity.name}</h2>
                        <p>{activity.description}</p>
                    </div>
                ))
            ) : (
                <p>No activities found</p>
            )}
        </div>
    </>
    );
}
