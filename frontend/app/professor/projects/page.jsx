"use client"

import {useUser} from "@/context/UserContext";
import {useEffect, useState} from "react";
import useProjects from "@/hooks/useProjects";
import DialogCloseButton from "@/components/DialogCloseButton";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import useSkills from "@/hooks/useSkills";
import {Badge} from "@/components/ui/badge";
import {ArrowRight, Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Link from "next/link";


export default function Page() {
    const { user } = useUser();
    const [projects, setProjects] = useState([])
    const projectInitialStructure = {
        name: "",
        description: "",
        skills: []
    }
    const [formData, setFormData] = useState(projectInitialStructure)
    const { fetchProfessorProjects, postProject, deleteProject, updateProject, loading, error } = useProjects()

    const handleFormSubmit = async () => {
        const projectStructure = {
            professor_id: user._id,
            ...formData
        }

        await postProject(projectStructure)
        setProjects(await fetchProfessorProjects(user._id))
        setFormData(projectInitialStructure)
    }

    const handleModifyProject = async (id) => {
        const updatedProject = await updateProject(id, formData)
        setFormData(projectInitialStructure)
        if (!updatedProject) {
            return toast({
                title: 'No se ha podido modificar el proyecto',
                variant: 'error'
            })
        } else {
            setProjects(await fetchProfessorProjects(user._id))
            return toast({
                title: `Proyecto modificado ${updatedProject.name}`,
                variant: 'success'
            })
        }
    }

    const handleDeleteProject = async (id) => {
        const deletedProject = await deleteProject(id)
        if (!deletedProject) {
            return toast({
                title: 'No se ha podido eliminar el proyecto',
                variant: 'error'
            })
        } else {
            setProjects(prev => prev.filter((project) => project._id !== id))
            return toast({
                title: `Proyecto eliminado ${deletedProject.name}`,
                variant: 'success'
            })
        }

    }

    if (error) return <p className="text-red-600 text-2xl text-center">Ups... Parece que ha habido un problema!</p>

    useEffect(() => {

        if (!user?._id) return

        const fetchUserProfessorProjects = async () => {
            const projects = await fetchProfessorProjects(user._id)
            setProjects(projects)
        }
        fetchUserProfessorProjects()

    }, [user])

    return (
        <div className="w-full">
            <h1 className="w-4/5 mx-auto text-4xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
                Tus Proyectos
            </h1>
            <div className="flex flex-row justify-end items-center mx-auto w-4/5 mb-8">
                <DialogCloseButton
                    setFormData={setFormData}
                    formData={formData}
                    clickFunction={handleFormSubmit}
                    title="Crear Proyecto"
                    description="Inserta todos los datos requeridos para crear un nuevo proyecto."
                    action="Create"
                />
            </div>
            <ProjectList
                projects={projects}
                isLoading={loading}
                handleDeleteProject={handleDeleteProject}
                handleModifyProject={handleModifyProject}
                setFormData={setFormData}
                formData={formData}
            />
        </div>
    )
}

const ProjectList = ({ projects, isLoading, handleDeleteProject, handleModifyProject, formData, setFormData }) => {
    if ((!Array.isArray(projects) || projects.length <= 0) && !isLoading) return <p className="w-4/5 mx-auto text-right text-red-600 italic">No tienes ningún proyecto creado</p>
    return (
        <div className="flex justify-center flex-col flex-1 gap-3 lg:flex-row lg:w-4/5 lg:mx-auto lg:flex-wrap lg:max-h-[65vh]">
            { projects.map(project => (
                <Project
                    key={ project._id }
                    projectID={ project._id }
                    handleDeleteProject={handleDeleteProject}
                    handleModifyProject={handleModifyProject}
                    project={project}
                    setFormData={setFormData}
                    formData={formData}
                />
            )) }
        </div>
    )
}

const Project = ({projectID, handleDeleteProject, project, handleModifyProject, formData, setFormData}) => {
    const { name, description, activities, skills } = project
    const [skillsFetched, setSkillsFetched] = useState([])
    const { getSkillById, loading, error } = useSkills()

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const skillPromises = skills.map((skill) =>
                    getSkillById(skill.skill_id)
                );

                const fetchedSkills = await Promise.all(skillPromises);

                setSkillsFetched(fetchedSkills);
            } catch (err) {
                console.error("Error fetching skills:", err);
            }
        };

        fetchSkills();
    }, [skills]);

    return (
        <div 
            className="rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100 mx-auto w-4/5 p-3 lg:w-2/5 lg:mx-0 flex flex-col"
        >
            <div className="flex flex-row flex-wrap gap-2 my-2">
                { !loading
                    && Array.isArray(skillsFetched)
                    && skillsFetched.length > 0
                    && skillsFetched.map((skill, i) => (
                        <Badge key={skill._id}>
                            {skill.name} - {skills[i].percentage + "%"}
                        </Badge>
                    ))}
            </div>
            <p className="font-bold mb-2 text-lg text-zinc-700">{ name }</p>
            <p className="font-normal text-sm text-zinc-500 flex-grow w-full">{ description }</p>
            <p className="font-normal text-sm text-zinc-500 my-2">Numero de Actividades: { activities.length }</p>
            <div className="flex flex-row justify-between mt-auto">
                <div className="flex flex-row gap-1 self-end">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <DialogCloseButton
                                    setFormData={setFormData}
                                    formData={formData}
                                    clickFunction={handleModifyProject}
                                    title="Modificar Proyecto"
                                    description="Modifica todos los datos requeridos para modificar un proyecto."
                                    action="Modify"
                                    projectID={projectID}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Modificar Proyecto</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link href={`/professor/projects/${projectID}`}><Button variant="outline"><ArrowRight /></Button></Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ir a Proyecto</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button variant="destructive" onClick={() => handleDeleteProject(projectID)}><Trash2 /></Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Eliminar Proyecto</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
        </div>
    )
}
