"use client";

import ActivitiesDialogCloseButton from '@/components/ActivitiesDialogCloseButton';
import { useUser } from '@/context/UserContext';
import useActivities from '@/hooks/useActivities';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { FollowingPointerDemo } from '@/components/ui/followPointerDemo';
import useProjects from "@/hooks/useProjects";
import SelectStudents from "@/components/SelectStudents";
import SelectedStudents from "@/components/SelectedStudents";


export default function Page() {
    const params = useParams();
    const projectId = params.projectId;

    const { user } = useUser();
    const [activities, setActivities] = useState([]);
    const { getProjectById } = useProjects()
    const [project, setProject] = useState({})
    const [loadingRequest, setLoadingRequest] = useState(true);
    const [selectedItems, setSelectedItems] = useState()
    const initialFormData = {
        name: "",
        description: "",
        startDate: null,
        endDate: null,
        skills: []
    }
    const [formData, setFormData] = useState(initialFormData);

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
            console.log(newActivity);
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
        } finally {
            setFormData(initialFormData);
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
            setActivities(await fetchActivities(projectId));
            toast({
                title: `Actividad modificada ${updatedActivity.name}`,
                variant: 'success'
            });
        } catch (err) {
            toast({
                title: 'No se ha podido modificar la actividad',
                variant: 'error'
            });
        } finally {
            setFormData(initialFormData);
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

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://localhost:3001/api/v1/users/students/${projectId}`)
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await res.json();
            setSelectedItems(result.map(user => user._id));
        }
        fetchData();
    }, [projectId]);

    if (error) return <p className="text-red-600 text-2xl">Ups... Something bad happened!</p>;

    return (
        <div className="w-full">

            <h1 className="w-4/5 mx-auto text-4xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
                Actividades de {project?.name}
            </h1>

            <div className="flex flex-row justify-end items-end mx-auto w-4/5 mb-8 space-x-2">
                <SelectStudents setSelectedItems={setSelectedItems} selectedItems={selectedItems} />
                <ActivitiesDialogCloseButton
                    setFormData={setFormData}
                    formData={formData}
                    clickFunction={handleFormSubmit}
                    title="Crear Actividad"
                    description="Inserta todos los datos requeridos para crear una nueva actividad."
                    action={"Create"}
                />
            </div>

            { selectedItems?.length > 0
                ? <div className="w-4/5 mx-auto">
                    <SelectedStudents selectedItems={selectedItems} setSelectedItems={setSelectedItems} projectId={projectId} />
                  </div>
                : <p className="mb-8 w-4/5 mx-auto text-right text-red-600 italic">*No hay ningun estudiando asignado a este proyecto</p>
            }
            <ActivityList activities={activities} isLoading={loadingRequest} handleDeleteActivity={handleDeleteActivity} handleModifyActivity={handleModifyActivity} formData={formData} setFormData={setFormData} projectId={projectId}/>
        </div>
    );
}

const ActivityList = ({ activities, isLoading, handleDeleteActivity, handleModifyActivity, formData, setFormData, projectId }) => {
    if ((!Array.isArray(activities) || activities.length <= 0) && !isLoading) return <p>No activities found</p>;

    return (
        <div className="flex justify-center flex-col flex-1 gap-3 lg:flex-row lg:w-4/5 lg:mx-auto lg:flex-wrap  md:max-h-[70vh] lg:max-h-[65vh] max-h-[65vh] overflow-scroll">
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