"use client"

import {useUser} from "@/context/UserContext";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import DialogCloseButtonUsers from "@/components/DialogCloseButtonUsers";
import useStudents from "@/hooks/useStudents";
import {
    Table,
    TableBody,
    TableCell,
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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import Image from "next/image";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ArrowDown, ArrowUp} from "lucide-react";
import DialogCloseButtonImport from "@/components/DialogCloseButtonImport";
import PaginationComponent from "@/components/Pagination";

export default function Page() {

    const initialState = {
        name: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        user_picture: undefined,
    }

    const { user } = useUser();
    const [students, setStudents] = useState([])
    const [loadingRequest, setLoadingRequest] = useState(true)
    const { fetchStudents, deleteStudent, postStudent, importStudents, updateUser, loading, error } = useStudents();
    const [formData, setFormData] = useState(initialState);
    const [importFile, setImportFile] = useState(null)
    const [page, setPage] = useState(1)
    const pagesNumber = Math.ceil(students.length / 6)

    const handleFormSubmit = async () => {
        const { confirmPassword, ...userPost } = formData
        await postStudent(userPost)
        setStudents(await fetchStudents())
        setFormData(initialState);
    }

    const handleUpdateUser = async (userId) => {
        const updatedUser = await updateUser(userId, formData);
        setFormData(initialState);
        if (!updatedUser) {
            return toast({
                title: 'No se ha podido modificar el usuario',
                variant: 'destructive',
            });
        }

        setStudents(await fetchStudents());
        return toast({
            title: `Usuario modificado ${updatedUser.name}`,
        });
    };


    const handleImportFileSubmit = async () => {

        if (!importFile) {
            return toast({
                title: "Error",
                description: "No file selected.",
                variant: "destructive",
            });
        }

        try {
            const res = await importStudents(importFile);
            if (res) {
                setStudents(await fetchStudents());
            } else {
                toast({
                    title: "Import Error",
                    description: "Failed to import students.",
                    variant: "destructive",
                });
            }
        } catch (err) {
            toast({
                title: "Import Error",
                message: "An unexpected error occurred.",
                variant: "destructive",
            });
        }
        setImportFile(null)
    };


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
            <h1 className="text-4xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
                Alumnos
            </h1>
            <StudentsList
                students={students}
                page={page}
                isLoading={loadingRequest}
                handleDeleteStudent={handleDeleteStudent}
                handleFormSubmit={handleFormSubmit}
                formData={formData}
                setFormData={setFormData}
                setImportFile={setImportFile}
                importFile={importFile}
                handleImportFileSubmit={handleImportFileSubmit}
                handleUpdateUser={handleUpdateUser}
            />
            <PaginationComponent page={page} setPage={setPage} pagesNumber={pagesNumber} />
        </div>
    )
}

const StudentsList = ({
                          students,
                          isLoading,
                          handleDeleteStudent,
                          page,
                          formData,
                          setFormData,
                          handleFormSubmit,
                          handleImportFileSubmit,
                          importFile,
                          setImportFile,
                          handleUpdateUser
                      }) => {

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
        const debouncedUpdate = setTimeout(() => {
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
        }, 300); // 300ms debounce

        return () => clearTimeout(debouncedUpdate);
    }, [page, students, filter]);


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
                            <SelectTrigger className="w-[150px] dark:border-white">
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
                            <SelectTrigger className="w-[150px] dark:border-white">
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
                    <div className="flex flex-row gap-x-2 items-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <DialogCloseButtonUsers
                                        setFormData={setFormData}
                                        formData={formData}
                                        clickFunction={handleFormSubmit}
                                        title="Crear Alumno"
                                        description="Inserta todos los datos requeridos para crear un nuevo alumno."
                                        action={"Create"}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Crear Alumno</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <DialogCloseButtonImport
                                        setFormData={setImportFile}
                                        formData={importFile}
                                        clickFunction={handleImportFileSubmit}
                                        title="Importar Alumnos"
                                        description="Elige un archivo .csv para importar alumnos. Asegurate de poner los siguientes campos: name, lastName, email, password, role (opcional)"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Importar Alumnos</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
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
                            <TableCell className="rounded">
                                {student.user_picture
                                    ? <Image width={24} height={24} src={student.user_picture} alt={`${student.name} icon`}/>
                                    : <Image width={24} height={24} src="/defaultPFP.webp" alt={`${student.name} icon`}/>
                                }
                            </TableCell>
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
                                <DialogCloseButtonUsers
                                    setFormData={setFormData}
                                    formData={formData}
                                    clickFunction={handleUpdateUser}
                                    title="Modificar Alumno"
                                    description="Modifica todos los datos requeridos para crear un nuevo alumno."
                                    action={"Modify"}
                                    userId={student._id}
                                    disabled={student.archive_date}
                                />
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
            </Table>
        </>
    )
}
