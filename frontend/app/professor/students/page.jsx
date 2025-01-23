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

export default function Page() {
    const { user } = useUser();
    const [students, setStudents] = useState([])
    const [loadingRequest, setLoadingRequest] = useState(true)
    const { fetchStudents, deleteStudent, postStudent, loading, error } = useStudents();
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student"
    })
    const [page, setPage] = useState(1)
    const pagesNumber = Math.ceil(students.length / 6)

    const handleFormSubmit = async () => {
        const { confirmPassword, ...userPost } = formData
        await postStudent(userPost)
        setStudents(await fetchStudents())
    }

    const handleDeleteStudent = async (userId) => {
        const deletedUser = await deleteStudent(userId)

        if (!deletedUser) {
            return toast({
                title: 'No se ha podido archivar el estudiante',
                variant: 'destructive'
            })
        } else {
            const foundStudent = students.find((student) => student._id === userId)
            setStudents(await fetchStudents())
            return toast({
                title: `Estudiante archivado ${foundStudent.name}`,
            })
        }
    }

    if (error) return <p className="text-red-600 text-2xl">Ups... Something bad happened!</p>

    useEffect(() => {
        setLoadingRequest(true)
        if (user?.role !== "professor") return

        const getStudents = async () => {
            const fetchedStudents = await fetchStudents()
            setStudents(fetchedStudents)
        }
        getStudents()

        setLoadingRequest(false)

    }, [user])


    return (
        <div className="container mx-auto">
            <h1 className="text-4xl font-normal mb-8 text-center lg:text-start lg:mt-8">Alumnos</h1>
            { loading || loadingRequest && <SkeletonLoader count={3} /> }
            { !loading && !loadingRequest &&
                <>
                    <StudentsList
                        students={students}
                        page={page}
                        isLoading={loadingRequest}
                        handleDeleteStudent={handleDeleteStudent}
                        handleFormSubmit={handleFormSubmit}
                        formData={formData}
                        setFormData={setFormData}
                    />
                    <PaginationComponent page={page} setPage={setPage} pagesNumber={pagesNumber} />
                </>
            }
        </div>
    )
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


const StudentsList = ({ students, isLoading, handleDeleteStudent, page, formData, setFormData, handleFormSubmit }) => {

    if ((!Array.isArray(students) || students.length <= 0) && !isLoading) return <p>No students found</p>

    const [modifiedStudents, setModifiedStudents] = useState(students)
    const [filter, setFilter] = useState({
        name: "",
        state: "",
    })
    const [order, setOrder] = useState({
        field: "",
        option: "",
    })

    useEffect(() => {
        setModifiedStudents(students.filter((student) => {
            if (filter.state === "active") {
                return student.name.toLowerCase().includes(filter.name.toLowerCase()) && !student.archive_date
            } else if (filter.state === "archived") {
                return student.name.toLowerCase().includes(filter.name.toLowerCase()) && student.archive_date
            }

            return student.name.toLowerCase().includes(filter.name.toLowerCase())
        }))
    }, [filter])

    useEffect(() => {
        const sortedStudents = [...modifiedStudents].sort((a, b) => {
            if (order.field === "name") {
                return order.option === "ascending"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (order.field === "state") {
                const isAArchived = !!a.archive_date;
                const isBArchived = !!b.archive_date;

                if (order.option === "ascending") {
                    return (isAArchived ? 1 : 0) - (isBArchived ? 1 : 0);
                } else {
                    return (isBArchived ? 1 : 0) - (isAArchived ? 1 : 0);
                }
            }
            return 0;
        });

        setModifiedStudents(sortedStudents);
    }, [order, students]);

    useEffect(() => {
        const itemsPerPage = 6;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        setModifiedStudents(
            students
                .filter((student) => {
                    if (filter.state === "active") return !student.archive_date && student.name.toLowerCase().includes(filter.name.toLowerCase());
                    if (filter.state === "archived") return student.archive_date && student.name.toLowerCase().includes(filter.name.toLowerCase());
                    return student.name.toLowerCase().includes(filter.name.toLowerCase());
                })
                .slice(startIndex, endIndex)
        );
    }, [page, students, filter]);

    return (
        <>
            <div className="mb-8 flex flex-row justify-between">
                <div>
                    <Label htmlFor="filterByName">Buscar por nombre:</Label>
                    <Input
                        name="filterByName"
                        type="text"
                        onChange={(e) => setFilter(prevState => ({ ...prevState, name: e.target.value }))}
                        value={filter.name}
                        placeholder="Buscar"
                    />
                </div>
                <div className="flex flex-row gap-x-6 items-end">
                    <div>
                        <Label htmlFor="filterByState">Filtrar por estado:</Label>
                        <Select onValueChange={(value) => setFilter(prevState => ({ ...prevState, state: value }))}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none" className="font-bold">Ninguno</SelectItem>
                                <SelectItem value="active">Activo</SelectItem>
                                <SelectItem value="archived">Archivado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="order">Ordenar:</Label>
                        <Select onValueChange={(value) => (
                            setOrder({
                                field: value.includes("name") ? "name" : "state",
                                option: value.toLowerCase().includes("desc") ? "descending" : "ascending",
                            }))
                        }>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Orden" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                <SelectItem value="all" className="font-bold">
                                    No Ordenar
                                </SelectItem>
                                <SelectItem value="nameAsc">
                                    <div className="flex flex-row items-center justify-between space-x-2">
                                        <ArrowUp className="w-4 h-4" />
                                        <span>Nombre</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="nameDesc">
                                    <div className="flex flex-row items-center justify-between space-x-2">
                                        <ArrowDown className="w-4 h-4" />
                                        <span>Nombre</span>
                                    </div>
                                </SelectItem>

                                <SelectItem value="stateAsc">
                                    <div className="flex flex-row items-center justify-between space-x-2">
                                        <ArrowUp className="w-4 h-4" />
                                        <span>Estado</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="stateDesc">
                                    <div className="flex flex-row items-center justify-between space-x-2">
                                        <ArrowDown className="w-4 h-4" />
                                        <span>Estado</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <DialogCloseButtonUsers
                                    setFormData={setFormData}
                                    formData={formData}
                                    clickFunction={handleFormSubmit}
                                    title="Crear Alumno"
                                    description="Inserta todos los datos requeridos para crear un nuevo alumno."
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Crear Alumno</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Foto</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellido</TableHead>
                        <TableHead>Correo</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {modifiedStudents.map((student) => (
                        <TableRow key={student._id}>
                            <TableCell className="rounded"><Image width={24} height={24} src={`/${student.user_picture}`} alt=""/></TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.lastName}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-x-2">
                                    <span
                                        className={`w-3 h-3 rounded-full ${
                                            student.archive_date ? "bg-red-600" : "bg-green-600"
                                        }`}
                                    />
                                    <p>{student.archive_date ? "Archivado" : "Activo"}</p>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    disabled={student.archive_date}
                                    variant="destructive"
                                    onClick={() => handleDeleteStudent(student._id)}
                                >
                                    Archivar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                {/*<TableFooter>*/}
                {/*    <TableRow>*/}
                {/*        <TableCell colSpan={3}>Total</TableCell>*/}
                {/*        <TableCell className="text-right">$2,500.00</TableCell>*/}
                {/*    </TableRow>*/}
                {/*</TableFooter>*/}
            </Table>
        </>
    )
}
