"use client";

import { useUser } from '@/context/UserContext';
import useProjects from '@/hooks/useProjects';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SkeletonLoader from '@/components/SkeletonsProject';
import { toast } from '@/hooks/use-toast';
import useSkills from "@/hooks/useSkills";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowRight, Trash2} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import useActivities from '@/hooks/useActivities';
import { Slider } from "@/components/ui/slider"
import useScores from '@/hooks/useScores';



export default function Page() {
    const { fetchProjects, error, loading } = useProjects();
    const [projects, setProjects] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        const fetchUserProjects = async () => {
            if (user && user.assigned_projects) {
                const projectData = await fetchProjects(user.assigned_projects);
                setProjects(projectData);
            }
        };

        fetchUserProjects();
    }, [user]);

    if (loading) return <SkeletonLoader count={3} />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="w-full">
            <h1 className="w-4/5 mx-auto mb-16 text-4xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
                Bienvenido a tus proyectos {user?.name}
            </h1>
            <ProjectList projects={projects}/>
        </div>
    );
}

const ProjectList = ({ projects }) => {
    if (!Array.isArray(projects) || projects.length <= 0) return <p>No projects found</p>;

    return (
        <div className="flex justify-center flex-col flex-1 gap-3 lg:flex-row lg:w-4/5 lg:mx-auto lg:flex-wrap md:max-h-[70vh] lg:max-h-[65vh] max-h-[65vh] overflow-scroll">
            {projects.map(project => (
                <Project
                    key={project._id}
                    project={project}
                    projectID={project._id}
                />
            ))}
        </div>
    );
};

const Project = ({ projectID, project }) => {
    const { name, description, activities, skills } = project;
    const [skillsFetched, setSkillsFetched] = useState([]);
    const { getSkillById, loading } = useSkills();
    const { fetchActivities } = useActivities();
    const [isHovered, setIsHovered] = useState(false);
    const [averageScores, setAverageScores] = useState([]);
    const { fetchScores } = useScores();

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const skillPromises = skills.map((skill) => getSkillById(skill.skill_id));
                const fetchedSkills = await Promise.all(skillPromises);
                setSkillsFetched(fetchedSkills);
            } catch (err) {
                console.error("Error fetching skills:", err);
            }
        };
        fetchSkills();
    }, [skills]);

    useEffect(() => {
        const calculateAverageScores = async () => {
            try {
                const scores = await fetchScores(`project_id=${projectID}`);
                const skillScores = {};
        
                // Filtrar y agrupar scores por skill_id
                scores.forEach(score => {
                    if (skills.some(skill => skill.skill_id === score.skill_id)) {
                        if (!skillScores[score.skill_id]) {
                            skillScores[score.skill_id] = [];
                        }
                        skillScores[score.skill_id].push(score.score);
                    }
                });
        
                // Calcular el promedio de cada skill
                const averages = Object.keys(skillScores).map(skill_id => {
                    const total = skillScores[skill_id].reduce((acc, score) => acc + score, 0);
                    const average = total / skillScores[skill_id].length;
                    
                    // Buscar el nombre de la habilidad en skillsFetched
                    const fetchedSkill = skillsFetched.find(skill => skill._id === skill_id);
                    const skillName = fetchedSkill ? fetchedSkill.name : "Unknown Skill";
                    
                    return {
                        skill_id,
                        skillName,
                        averageScore: average.toFixed(2) // Redondear a dos decimales
                    };
                });
        
                setAverageScores(averages);
            } catch (err) {
                console.error("Error calculating average scores:", err);
            }
        };
        

        if (isHovered) {
            calculateAverageScores();
        }
    }, [isHovered, skillsFetched,fetchActivities, skills]);

    console.log(averageScores)
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const handleTouchStart = () => setIsHovered(true);
    const handleTouchEnd = () => setIsHovered(false);
    
    return (
        <div className="rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100 mx-auto w-4/5 p-3 lg:w-2/5 lg:mx-0 flex flex-col">
            {/* Contenedor para hover */}
            <div
                className="hover-target min-h-[130px]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className={`transition-all duration-300 ${
                        isHovered ? "opacity-0 absolute h-0 overflow-hidden " : "opacity-100 relative h-auto"
                    }`}
                >
                    <div className="flex flex-row flex-wrap gap-2 my-2">
                        {!loading &&
                            Array.isArray(skillsFetched) &&
                            skillsFetched.length > 0 &&
                            skillsFetched.map((skill, i) => (
                                <Badge key={skill._id}>
                                    {skill.name} - {skills[i].percentage + "%"}
                                </Badge>
                            ))}
                    </div>
                    <p className="font-bold mb-2 text-lg text-zinc-700">{name}</p>
                    <p className="font-normal text-sm text-zinc-500 flex-grow w-full">{description}</p>
                    <p className="font-normal text-sm text-zinc-500 my-2">
                        Numero de Actividades: {activities.length}
                    </p>
                </div>

                {/* Sliders section */}
                <div
                    className={`transition-all duration-300 ${
                        isHovered ? "opacity-100 relative h-auto" : "opacity-0 absolute h-0 overflow-hidden"
                    }`}
                >
                    <h2 className="font-bold mb-2 text-lg text-zinc-700 ms-5">
                        Scores de {name}
                    </h2>
                    <div className="flex flex-col flex-wrap gap-2 w-full min-h-full ">
                        {averageScores.map((score, i) => (
                            <div key={i} className="flex flex-col items-center w-full">
                                <Badge>
                                    {score.skillName} - {score.averageScore}
                                </Badge>
                                <div className="flex flex-row flex-wrap gap-2 my-2 w-80">
                                    <Slider
                                        defaultValue={[parseFloat(score.averageScore)]}
                                        max={10}
                                        step={0}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Button section */}
            <div className="flex flex-row mt-auto">
                <div className="flex flex-row gap-1 self-end">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link href={`/student/projects/${projectID}`}>
                                    <Button variant="outline"><ArrowRight /></Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ir a Proyecto</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    );
};