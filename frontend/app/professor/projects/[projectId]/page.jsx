"use client";

import ActivitiesDialogCloseButton from '@/components/ActivitiesDialogCloseButton';
import SkeletonLoader from '@/components/SkeletonsProject';
import { useUser } from '@/context/UserContext';
import useActivities from '@/hooks/useActivities';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const { user } = useUser();
    const [activities, setActivities] = useState([])
    const [loadingRequest, setLoadingRequest] = useState(true)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    })
    const { fetchActivities, postActivity, deleteActivity, loading, error } = useActivities()

    const handleFormSubmit = async () => {
        const activityStructure = {
            user_id: user._id,
            ...formData
        }
        await postActivity(activityStructure)
        setActivities(await fetchActivities(user._id))
    }

    const handleDeleteActivity = async (activityID) => {
        const deletedActivity = await deleteActivity(activityID)
        if (!deletedActivity) {
            return toast({
                message: 'No se ha podido eliminar la actividad',
                status: 'error'
            })
        } else {
            setActivities(prev => prev.filter((activity) => activity._id !== activityID))
            return toast({
                message: `Actividad eliminada ${deletedActivity.name}`,
                status: 'success'
            })
        }
    }

    useEffect(() => {
        setLoadingRequest(true)
        if (!user?._id) return
        const fetchUserActivities = async () => {
            const activities = await fetchActivities(user._id)
            setActivities(activities)
        }
        fetchUserActivities()
        setLoadingRequest(false)
    }, [user])

    if (error) return <p className="text-red-600 text-2xl">Ups... Something bad happened!</p>

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
    )
}

const ActivityList = ({ activities, isLoading, handleDeleteActivity }) => {
    if ((!Array.isArray(activities) || activities.length <= 0) && !isLoading) return <p>No activities found</p>

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:w-4/5 lg:mx-auto lg:flex-wrap">
            { activities.map(activity => (
                <Activity key={ activity._id } activityID={ activity._id } handleDeleteActivity={handleDeleteActivity} { ...activity } />
            )) }
        </div>
    )
}

const Activity = ({name, description, activityID, handleDeleteActivity}) => {
    return (
        <div className="w-4/5 border rounded border-slate-900 mx-auto p-3 lg:w-fit lg:mx-0">
            <p>Name: { name }</p>
            <p>Description: { description }</p>
            <Button variant="destructive" onClick={() => handleDeleteActivity(activityID)}>Eliminar</Button>
        </div>
    )
}
