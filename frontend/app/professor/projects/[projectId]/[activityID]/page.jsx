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

export default function Page() {
    const { user } = useUser();
    const  params  = useParams();
    const activityId  = params.activityID;
    const [students, setStudents] = useState([]);
    const [activity, setActivity] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loadingRequest, setLoadingRequest] = useState(true);
    const { fetchStudents, loading, error } = useStudents();
    const { fetchActivity } = useActivities();
    const { fetchAllSkills, getSkillById } = useSkills();
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    const [formData, setFormData] = useState({
        skills: []
    });

    useEffect(() => {
        const getStudentsAndActivity = async () => {
            try {//Arreglar la manera en la ques se muestran las skills en la columna
                const fetchedStudents = await fetchStudents();
                const fetchedActivity = await fetchActivity(activityId);

                const fetchedSkills = await fetchAllSkills();
                const activitySkills = fetchedSkills.filter(skill => fetchedActivity.skills.includes(skill._id));
                setStudents(fetchedStudents);
                setActivity(fetchedActivity);
                setSkills(activitySkills);
                console.log(activitySkills);
            } catch (err) {
                console.error(err);
                toast({
                    message: err.message,
                    status: 'error'
                });
            } finally {
                setLoadingRequest(false);
            }
        };

        getStudentsAndActivity();
    }, [activityId,]);

    const handleChange = (e, studentId, skillId) => {
        let { value } = e.target;
        value = Number(value);
        setFormData((prev) => {
            const studentIndex = prev.students.findIndex(s => s.student_id === studentId);
            if (studentIndex !== -1) {
                const skills = prev.students[studentIndex].skills.some((s) => s.skill_id === skillId)
                    ? prev.students[studentIndex].skills.map((s) =>
                        s.skill_id === skillId ? { ...s, percentage: value } : s
                    )
                    : [...prev.students[studentIndex].skills, { skill_id: skillId, percentage: value }];
                const students = [...prev.students];
                students[studentIndex] = { ...students[studentIndex], skills };
                return { ...prev, students };
            } else {
                return {
                    ...prev,
                    students: [...prev.students, { student_id: studentId, skills: [{ skill_id: skillId, percentage: value }] }]
                };
            }
        });
    };

    const calculateTotalGrade = (student) => {
        // Implementar lógica para calcular la nota total
        return 0;
    };

    const handleSaveChanges = async () => {
        // Implementar lógica para guardar cambios
        toast({
            message: 'Cambios guardados exitosamente',
            status: 'success'
        });
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
                            <TableHead key={skill._id}>{skill.name}</TableHead>
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
                                    <Input
                                        type="number"
                                        className="w-2/3"
                                        max={100}
                                        min={0}
                                        onChange={(e) => handleChange(e, student._id, skill._id)}
                                        value={formData.students?.find(s => s.student_id === student._id)?.skills.find(s => s.skill_id === skill._id)?.percentage || ""}
                                    />
                                    <p>%</p>
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
