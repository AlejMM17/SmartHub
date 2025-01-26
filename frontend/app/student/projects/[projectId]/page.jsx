"use client";

import { useUser } from '@/context/UserContext';
import useActivities from '@/hooks/useActivities';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SkeletonLoader from '@/components/SkeletonsProject';
import { toast } from '@/hooks/use-toast';
import { FollowingPointerDemoActivity} from '@/components/ui/followPointerDemoActivity';
import useProjects from "@/hooks/useProjects";

export default function Activities() {
    const params = useParams();
    const projectId = params.projectId;
    const [activities, setActivities] = useState([]);
    const { getProjectById } = useProjects()
    const [project, setProject] = useState({})
    const { user } = useUser();
    const [loadingRequest, setLoadingRequest] = useState(true);
    const router = useRouter();

    const { fetchActivities,loading, error } = useActivities();


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
    console.log(error)
    if (error) return <p className="text-red-600 text-2xl">Ups... Something bad happened!</p>;
    return (
        <div className="w-full ">

            <h1 className="w-4/5 mx-auto text-4xl mb-16 sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
                Actividades de {project?.name}
            </h1>
            <ActivityList activities={activities} isLoading={loadingRequest} projectId={projectId}/>
        </div>
    );
}

const ActivityList = ({ activities, isLoading, projectId }) => {
    if ((!Array.isArray(activities) || activities.length <= 0) && !isLoading) return <div className="flex flex-col flex-1 gap-3 lg:flex-row lg:w-4/5 lg:mx-auto lg:flex-wrap  md:max-h-[70vh] lg:max-h-[65vh] max-h-[65vh] overflow-scroll"><p>No hi han activitats per aquest projecte</p></div>;
    return (
        <div className="flex flex-col flex-1 gap-3 lg:flex-row lg:w-4/5 lg:mx-auto lg:flex-wrap  md:max-h-[70vh] lg:max-h-[65vh] max-h-[65vh] overflow-scroll">
            {activities.map(activity => (
                <FollowingPointerDemoActivity
                    key={activity._id}
                    activity={activity}
                    activityID={activity._id}
                    projectID={ projectId }
                />
            ))}
        </div>
    );
};