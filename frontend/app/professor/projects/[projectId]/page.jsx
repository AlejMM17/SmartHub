"use client";

import ActivitiesDialogCloseButton from '@/components/ActivitiesDialogCloseButton';
import SkeletonLoader from '@/components/SkeletonsProject';
import { useUser } from '@/context/UserContext';
import useActivities from '@/hooks/useActivities';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { FollowingPointerDemo } from '@/components/ui/followPointerDemo';

export default function Page() {
    const params = useParams();
    const projectId = params.projectId;

    const { user } = useUser();
    const [activities, setActivities] = useState([]);
    const [loadingRequest, setLoadingRequest] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: null,
        endDate: null,
        skills: []
    });
    console.log(formData.startDate);
    console.log(formData.endDate);

    const { fetchActivities, postActivity, deleteActivity, loading, error } = useActivities();

    const handleFormSubmit = async () => {
        try {
            const activityStructure = {
                user_id: user._id,
                project_id: projectId,
                name: formData.name,
                description: formData.description,
                start_date: formData.startDate,
                end_date: formData.endDate,
                skills: formData.skills
            };
            const newActivity = await postActivity(activityStructure);
            setActivities(prev => [...prev, newActivity]);
            toast({
                message: `Actividad creada ${newActivity.name}`,
                status: 'success'
            });
        } catch (err) {
            toast({
                message: 'No se ha podido crear la actividad',
                status: 'error'
            });
        }
    };

    const handleDeleteActivity = async (activityID) => {
        try {
            const deletedActivity = await deleteActivity(activityID);
            if (!deletedActivity) {
                throw new Error('No se ha podido eliminar la actividad');
            }
            setActivities(prev => prev.filter((activity) => activity._id !== activityID));
            toast({
                message: `Actividad eliminada ${deletedActivity.name}`,
                status: 'success'
            });
        } catch (err) {
            toast({
                message: 'No se ha podido eliminar la actividad',
                status: 'error'
            });
        }
    };

    useEffect(() => {
        const fetchProjectActivities = async () => {
            try {
                if (user && projectId) {
                    const activities = await fetchActivities(projectId);
                    setActivities(activities);
                }
            } catch (err) {
                toast({
                    message: 'No se han podido cargar las actividades',
                    status: 'error'
                });
            } finally {
                setLoadingRequest(false);
            }
        };
        fetchProjectActivities();
    }, [user, projectId]);

    if (error) return <p className="text-red-600 text-2xl">Ups... Something bad happened!</p>;

    return (
        <div className="w-full">
            <h1 className="text-4xl font-normal mb-8 text-center lg:text-start lg:mt-8 lg:ms-16">Activities</h1>
            { loading || loadingRequest && <SkeletonLoader count={3} /> }
            { !loading && !loadingRequest &&
                <div className="flex flex-row justify-between items-center mx-auto w-4/5 mb-8">
                    <h3 className="font-bold">Crear Actividad</h3>
                    <ActivitiesDialogCloseButton
                        setFormData={setFormData}
                        formData={formData}
                        clickFunction={handleFormSubmit}
                        title="Crear Actividad"
                        description="Inserta todos los datos requeridos para crear una nueva actividad."
                    />
                </div>
            }
            <ActivityList activities={activities} isLoading={loadingRequest} handleDeleteActivity={handleDeleteActivity} />
        </div>
    );
}

const ActivityList = ({ activities, isLoading, handleDeleteActivity }) => {
    if ((!Array.isArray(activities) || activities.length <= 0) && !isLoading) return <p>No activities found</p>;

    return (
        <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:w-4/5 lg:mx-auto lg:flex-wrap">
            { activities.map(activity => (
                <FollowingPointerDemo key={ activity._id } activity={ activity } activityID={ activity._id } handleDeleteActivity={handleDeleteActivity} />
            )) }
        </div>
    );
};