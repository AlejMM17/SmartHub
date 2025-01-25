"use client";

import ActivitiesDialogCloseButton from '@/components/ActivitiesDialogCloseButton';
import SkeletonLoader from '@/components/SkeletonsProject';
import { useUser } from '@/context/UserContext';
import useActivities from '@/hooks/useActivities';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { FollowingPointerDemo } from '@/components/ui/followPointerDemo';
import useProjects from "@/hooks/useProjects";

export default function Page() {
    const params = useParams();
    const projectId = params.projectId;

    const { user } = useUser();
    const [activities, setActivities] = useState([]);
    const { getProjectById } = useProjects()
    const [project, setProject] = useState({})
    const [loadingRequest, setLoadingRequest] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: null,
        endDate: null,
        skills: []
    });

    const { fetchActivities, postActivity, deleteActivity, updateActivity,loading, error } = useActivities();

    const handleFormSubmit = async () => {
        try {
            const activityStructure = {
                user_id: user._id,
                project_id: projectId,
                name: formData.name,
                description: formData.description,
                start_date: formData.startDate,
                end_date: formData.endDate,
                skills: formData.skills,
                activity_picture: formData.activity_picture
            };
            const newActivity = await postActivity(activityStructure);
            setActivities(prev => [...prev, newActivity]);
            toast({
                title: `Actividad creada ${newActivity.name}`,
                variant: 'success'
            });
        } catch (err) {
            toast({
                title: 'No se ha podido crear la actividad',
                variant: 'error'
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
                title: `Actividad eliminada ${deletedActivity.name}`,
                variant: 'success'
            });
        } catch (err) {
            toast({
                title: 'No se ha podido eliminar la actividad',
                variant: 'error'
            });
        }
    };

    const handleModifyActivity = async (activityID) => {
        try {
            const updatedActivity = await updateActivity(activityID, formData);
            console.log(updatedActivity)
            setActivities(await fetchActivities(projectId));
            toast({
                title: `Actividad modificada`,
                variant: 'success'
            });
        } catch (err) {
            console.log(err)
            toast({
                title: 'No se ha podido modificar la actividad',
                variant: 'error'
            });
        }
    };

    useEffect(() => {
        const fetchProjectActivities = async () => {
            try {
                if (user && projectId ) {
                    const activities = await fetchActivities(projectId);
                    setActivities(activities);
                }
            } catch (err) {
                toast({
                    title: 'No se han podido cargar las actividades',
                    variant: 'error'
                });
            } finally {
                setLoadingRequest(false);
            }
        };
        fetchProjectActivities();
    }, [user, projectId]);

    useEffect(() => {
        const getProjectByIdFunc = async () => {
            setProject(await getProjectById(projectId))
        }

        getProjectByIdFunc()
    }, [projectId])

    if (error) return <p className="text-red-600 text-2xl">Ups... Something bad happened!</p>;

    return (
        <div className="w-full">

            <h1 className="w-4/5 mx-auto text-4xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
                Actividades de {project?.name}
            </h1>
            {loading || loadingRequest && <SkeletonLoader count={3} />}
            {!loading && !loadingRequest &&
                <div className="flex flex-row justify-between items-center mx-auto w-4/5 mb-8">
                    <h3 className="font-bold">Crear Actividad</h3>
                    <ActivitiesDialogCloseButton
                        setFormData={setFormData}
                        formData={formData}
                        clickFunction={handleFormSubmit}
                        title="Crear Actividad"
                        description="Inserta todos los datos requeridos para crear una nueva actividad."
                        action={"Create"}
                    />
                </div>
            }
            <ActivityList activities={activities} isLoading={loadingRequest} handleDeleteActivity={handleDeleteActivity} handleModifyActivity={handleModifyActivity} formData={formData} setFormData={setFormData} projectId={projectId}/>
        </div>
    );
}

const ActivityList = ({ activities, isLoading, handleDeleteActivity, handleModifyActivity, formData, setFormData, projectId }) => {
    if ((!Array.isArray(activities) || activities.length <= 0) && !isLoading) return <p>No activities found</p>;
    return (
        <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:w-4/5 lg:mx-auto lg:flex-wrap max-h-[50vh] lg:max-h-[65vh] sm:max-h-[65vh] overflow-scroll">
            {activities.map(activity => (
                <FollowingPointerDemo
                    key={activity._id}
                    activity={activity}
                    activityID={activity._id}
                    handleDeleteActivity={handleDeleteActivity}
                    handleModifyActivity={handleModifyActivity}
                    formData={formData}
                    setFormData={setFormData}
                    projectID={ projectId }
                />
            ))}
        </div>
    );
};