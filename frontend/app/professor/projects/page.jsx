"use client"

import {useUser} from "@/context/UserContext";
import {useEffect, useState} from "react";
import useProjects from "@/hooks/useProjects";
import SkeletonLoader from "@/components/SkeletonsProject";
import DialogCloseButton from "@/components/DialogCloseButton";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';


export default function Page() {
    const { user } = useUser();
    const [projects, setProjects] = useState([])
    const [loadingRequest, setLoadingRequest] = useState(true)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        skills: []
    })
    const { fetchProfessorProjects, postProject, deleteProject, loading, error } = useProjects()

    const handleFormSubmit = async () => {
        const projectStructure = {
            professor_id: user._id,
            ...formData
        }

        await postProject(projectStructure)
        setProjects(await fetchProfessorProjects(user._id))
    }

    const handleDeleteProject = (projectID) => {
        const deletedProject = deleteProject(projectID)
        if (!deletedProject) {
            return toast({
                message: 'No se ha podido eliminar el proyecto',
                status: 'error'
            })
        } else {
            setProjects(prev => prev.filter((project) => project._id !== projectID))
            return toast({
                message: `Proyecto eliminado ${deletedProject.name}`,
                status: 'success'
            })
        }

    }

    if (error) return <p className="text-red-600 text-2xl">Ups... Something bad happened!</p>

    useEffect(() => {
        setLoadingRequest(true)
        if (!user?._id) return

        const fetchUserProfessorProjects = async () => {
            const projects = await fetchProfessorProjects(user._id)
            setProjects(projects)
        }
        fetchUserProfessorProjects()

        setLoadingRequest(false)

    }, [user])

    console.log(formData)

    return (
        <div className="w-full">
            <h1 className="text-4xl font-normal mb-8 text-center lg:text-start lg:mt-8 lg:ms-16">Projects</h1>
            { loading || loadingRequest && <SkeletonLoader count={3} /> }
            { !loading && !loadingRequest &&
                <div className="flex flex-row justify-between items-center mx-auto w-4/5 mb-8">
                    <h3 className="font-bold">Crear Proyecto</h3>
                    <DialogCloseButton
                        setFormData={setFormData}
                        formData={formData}
                        clickFunction={handleFormSubmit}
                        title="Crear Proyecto"
                        description="Inserta todos los datos requeridos para crear un nuevo proyecto."
                    />
                </div>
            }
            <ProjectList projects={projects} isLoading={loadingRequest} handleDeleteProject={handleDeleteProject} />
        </div>
    )
}

const ProjectList = ({ projects, isLoading, handleDeleteProject }) => {
    if ((!Array.isArray(projects) || projects.length <= 0) && !isLoading) return <p>No projects found</p>

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:w-4/5 lg:mx-auto lg:flex-wrap">
            { projects.map(project => (
                <Project key={ project._id } projectID={ project._id } handleDeleteProject={handleDeleteProject} { ...project } />
            )) }
        </div>
    )
}

const Project = ({name, description, activities, projectID, handleDeleteProject}) => {
    const router = useRouter();

    const handleProjectClick = (projectId) => {
        router.push(`/professor/projects/${projectId}/`);
    };

    return (
        <div 
            className="w-4/5 border rounded border-slate-900 mx-auto p-3 lg:w-fit lg:mx-0 cursor-pointer" 
            onClick={() => handleProjectClick(projectID)}
        >
            <p>Name: { name }</p>
            <p>Description: { description }</p>
            <p>Activities: { activities.length }</p>
            <Button variant="destructive" onClick={(e) => { e.stopPropagation(); handleDeleteProject(projectID); }}>Eliminar</Button>
        </div>
    )
}
