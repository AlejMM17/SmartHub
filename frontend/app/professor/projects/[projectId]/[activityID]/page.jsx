"use client"

import {useUser} from "@/context/UserContext";
import {useEffect, useState} from "react";
import SkeletonLoader from "@/components/SkeletonsProject";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import DialogCloseButtonUsers from "@/components/DialogCloseButtonUsers";
import useStudents from "@/hooks/useStudents";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import Image from "next/image";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ArrowDown, ArrowUp} from "lucide-react";
import useProjects from "@/hooks/useProjects";
import { useParams } from "next/navigation";
import useActivities from "@/hooks/useActivities";
import useSkills from "@/hooks/useSkills";
import useScores from '@/hooks/useScores';

export default function Page() {
    const { user } = useUser();
    const params = useParams();
    const activityId = params.activityID;
    const projectId = params.projectId;
    const [students, setStudents] = useState([]);
    const [activity, setActivity] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loadingRequest, setLoadingRequest] = useState(true);
    const { fetchStudents, loading, error } = useStudents();
    const { fetchActivity } = useActivities();
    const { fetchAllSkills, getSkillById } = useSkills();
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const { postScore, updateScore, fetchScores } = useScores();
    const [formData, setFormData] = useState({
        students: [],
        skills: []
    });

    useEffect(() => {
        const getStudentsAndActivity = async () => {
            try {
                const fetchedStudents = await fetchStudents();
                const fetchedActivity = await fetchActivity(activityId);
                const fetchedSkills = await fetchAllSkills();

                const activitySkillIds = fetchedActivity.skills.map(skill => skill.skill_id);

                const activitySkills = fetchedSkills
                    .filter(skill => activitySkillIds.includes(skill._id))
                    .map(skill => ({
                        ...skill,
                        percentage: fetchedActivity.skills.find(s => s.skill_id === skill._id).percentage
                    }));

                setStudents(fetchedStudents);
                setActivity(fetchedActivity);
                setSkills(activitySkills);

                // Cargar las notas registradas
                const scoresData = await fetchScores(`activity_id=${activityId}&project_id=${projectId}`);
                
                const updatedFormData = {
                    students: fetchedStudents.map(student => ({
                        student_id: student._id,
                        skills: scoresData.filter(score => score.student_id === student._id).map(score => ({
                            skill_id: score.skill_id,
                            percentage: score.score
                        }))
                    })),
                    skills: activitySkills
                };

                setFormData(updatedFormData);

            } catch (err) {
                console.error(err);
                toast({
                    title: err.message,
                    variant: 'error'
                });
            } finally {
                setLoadingRequest(false);
            }
        };

        getStudentsAndActivity();
    }, [activityId, projectId]);

    const handleChange = (e, studentId, skillId) => {
        let { value } = e.target;
        value = Number(value);
        setFormData((prev) => {
            const students = prev.students || [];
            const studentIndex = students.findIndex(s => s.student_id === studentId);
            if (studentIndex !== -1) {
                const skills = students[studentIndex].skills.some((s) => s.skill_id === skillId)
                    ? students[studentIndex].skills.map((s) =>
                        s.skill_id === skillId ? { ...s, percentage: value } : s
                    )
                    : [...students[studentIndex].skills, { skill_id: skillId, percentage: value }];
                const updatedStudents = [...students];
                updatedStudents[studentIndex] = { ...updatedStudents[studentIndex], skills };
                return { ...prev, students: updatedStudents };
            } else {
                return {
                    ...prev,
                    students: [...students, { student_id: studentId, skills: [{ skill_id: skillId, percentage: value }] }]
                };
            }
        });
    };

    const calculateTotalGrade = (student) => {
        const studentData = formData.students.find(s => s.student_id === student._id);
        if (!studentData) return 0;
    
        const totalGrade = studentData.skills.reduce((total, skill) => {
            const skillData = skills.find(s => s._id === skill.skill_id);
            if (!skillData) return total;
    
            const skillPercentage = skillData.percentage / 100;
            const skillGrade = skill.percentage || 0;
    
            return total + (skillGrade * skillPercentage);
        }, 0);
    
        return totalGrade.toFixed(2); // Redondear a dos decimales
    };

    const handleSaveChanges = async () => {
        try {
            for (const student of formData.students) {
                for (const skill of student.skills) {
                    if (skill.percentage < 0 || skill.percentage > 10) {
                        toast({
                            title: 'Error en la nota',
                            description: `Las notas deben estar entre 0 y 10.`,
                            variant: 'error'
                        });
                        return;
                    }
    
                    const score = {
                        student_id: student.student_id,
                        score: skill.percentage,
                        activity_id: activityId,
                        skill_id: skill.skill_id,
                        project_id: projectId
                    };
    
                    // Verificar si ya existe un registro con los mismos datos excepto el score
                    const existingScoreData = await fetchScores(`student_id=${score.student_id}&activity_id=${score.activity_id}&skill_id=${score.skill_id}&project_id=${score.project_id}`);
    
                    if (existingScoreData.length > 0) {
                        // Si el score es diferente, actualizarlo
                        if (existingScoreData[0].score !== score.score) {
                            await updateScore(existingScoreData[0]._id, { score: score.score });
                        }
                    } else {
                        await postScore(score);
                    }
                }
            }
            toast({
                title: 'Cambios guardados exitosamente',
                variant: 'success'
            });
        } catch (err) {
            toast({
                title: 'Error guardando los cambios',
                variant: 'error'
            });
        }
    };

    if (error) return <p className="text-red-600 text-2xl">Ups... Something bad happened!</p>;

    const paginatedStudents = students.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="container mx-auto">
            <h1 className="text-4xl font-normal mb-8 text-center lg:text-start lg:mt-8">Notas de la Actividad</h1>
            <div className="flex flex-row gap-x-6 items-end justify-end">
                <Button onClick={handleSaveChanges} className="mt-4">Guardar Cambios</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellido</TableHead>
                        <TableHead>Correo</TableHead>
                        {skills.map(skill => (
                            <TableHead key={skill._id}>{skill.name} - {skill.percentage}%</TableHead>
                        ))}
                        <TableHead>Nota Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedStudents.map((student) => (
                        <TableRow key={student._id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.lastName}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            {skills.map(skill => (
                                <TableCell key={skill._id}>
                                    <div className="flex items-center">
                                        <Input
                                            type="number"
                                            className="w-1/3 min-w-20"
                                            max={10}
                                            min={0}
                                            onChange={(e) => handleChange(e, student._id, skill._id)}
                                            value={formData.students?.find(s => s.student_id === student._id)?.skills.find(s => s.skill_id === skill._id)?.percentage || ""}
                                        />
                                    </div>
                                </TableCell>
                            ))}
                            <TableCell>
                                {calculateTotalGrade(student)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
                <PaginationComponent page={page} setPage={setPage} pagesNumber={Math.ceil(students.length / itemsPerPage)} />
            </div>
        </div>
    );
}

const PaginationComponent = ({ page, setPage, pagesNumber }) => (

    <Pagination className="my-8">
        <PaginationContent>
            <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className={`hover:cursor-pointer ${page === 1 ? "opacity-20 hover:pointer-events-none" : ""}`}
            />
            {Array.from({ length: pagesNumber }, (_, i) => (
                <PaginationItem key={i + 1}>
                    <PaginationLink
                        onClick={() => setPage(i + 1)}
                        isActive={page === i + 1}
                        className="hover:cursor-pointer"
                    >
                        {i + 1}
                    </PaginationLink>
                </PaginationItem>
            ))}
            <PaginationNext
                onClick={() => setPage((prev) => Math.min(pagesNumber, prev + 1))}
                disabled={page === pagesNumber}
                className={`hover:cursor-pointer ${page === pagesNumber ? "opacity-20 hover:pointer-events-none" : ""}`}
            />
        </PaginationContent>
    </Pagination>
);
