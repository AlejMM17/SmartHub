"use client"

import {useUser} from "@/context/UserContext";
import {useEffect, useState} from "react";
import useProjects from "@/hooks/useProjects";
import SkeletonLoader from "@/components/SkeletonsProject";
import DialogCloseButton from "@/components/DialogCloseButton";

export default function Page() {
    const { user } = useUser();
    const [projects, setProjects] = useState([])
    const [loadingRequest, setLoadingRequest] = useState(true)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        skills: []
    })
    const { fetchProjects, loading, error } = useProjects()

    useEffect(() => {
        setLoadingRequest(true)
        if (!user?.assigned_projects) return

        const fetchUserProjects = async () => {
            const projects = await fetchProjects(user.assigned_projects)
            setProjects(projects)
        }
        fetchUserProjects()
        setLoadingRequest(false)

    }, [user])

    const handleFormSubmit = () => {
        console.log(formData)
    }

    if (error) return <p className="text-red-600 text-2xl">Ups... Something bad happened!</p>

    return (
        <div className="w-full">
            <h1 className="text-4xl font-normal mb-8 text-center lg:text-start lg:mt-8 lg:ms-16">Projects</h1>
            { loading || loadingRequest && <SkeletonLoader count={3} /> }
            {!loading && !loadingRequest &&
                <div className="flex flex-row justify-between items-center mx-auto w-4/5 mb-8">
                    <h3 className="font-bold">Crear Proyecto</h3>
                    <DialogCloseButton setFormData={setFormData} formdata={formData} clickFunction={handleFormSubmit} />
                </div>
            }
            <ProjectList projects={projects} isLoading={loadingRequest}/>
        </div>
    )
}

const ProjectList = ({ projects, isLoading }) => {

    if ((!Array.isArray(projects) || projects.length <= 0) && !isLoading) return <p>No projects found</p>

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:w-4/5 lg:mx-auto lg:flex-wrap">
            { projects.map(project => (
                <Project key={ project._id } { ...project } />
            )) }
        </div>
    )
}

const Project = ({name, description, activities}) => {
    return (
        <div className="w-4/5 border rounded border-slate-900 mx-auto p-3 lg:w-fit lg:mx-0">
            <p>Name: { name }</p>
            <p>Description: { description }</p>
            <p>Activities: { activities.length }</p>
        </div>
    )
}
