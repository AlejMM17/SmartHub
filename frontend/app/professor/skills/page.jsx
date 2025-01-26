"use client"

import {useUser} from "@/context/UserContext";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import DialogCloseButtonUsers from "@/components/DialogCloseButtonUsers";
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
import useSkills from "@/hooks/useSkills";
import PaginationComponent from "@/components/Pagination";
import DialogCloseButtonSkills from "@/components/DialogCloseButtonSkills";

export default function Page() {
    const { user } = useUser();
    const [skills, setSkills] = useState([])
    const [loadingRequest, setLoadingRequest] = useState(true)
    const { fetchAllSkills, postSkill, deleteSkill, updateSkill, error, loading } = useSkills()
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "",
    })
    const [page, setPage] = useState(1)
    const pagesNumber = !loading && !error ? Math.ceil(skills?.length / 6) : 1

    const handleFormSubmit = async () => {
        await postSkill(formData)
        setSkills(await fetchAllSkills())
    }

    const handleUpdateSkill = async (skillId) => {
        const updatedSkill = await updateSkill(skillId, formData)

        if (!updatedSkill) {
            return toast({
                title: 'No se ha podido modificar la skill',
                variant: 'destructive'
            })
        } else {
            const foundSkill = skills.find((skill) => skill._id === skillId)
            setSkills(await fetchAllSkills())
            return toast({
                title: `Skill modificada ${foundSkill.name}`,
            })
        }
    }

    const handleDeleteSkill = async (skillId) => {
        const deletedSkill = await deleteSkill(skillId)

        if (!deletedSkill) {
            return toast({
                title: 'No se ha podido archivar la skill',
                variant: 'destructive'
            })
        } else {
            const foundSkill = skills.find((skill) => skill._id === skillId)
            setSkills(await fetchAllSkills())
            return toast({
                title: `Skill archivada ${foundSkill.name}`,
            })
        }
    }

    if (error) return <p className="text-red-600 text-2xl">Ups... Something bad happened!</p>

    useEffect(() => {
        setLoadingRequest(true)
        if (user?.role !== "professor") return

        const getSkills = async () => {
            const fetchedSkills = await fetchAllSkills()
            setSkills(fetchedSkills)
        }
        getSkills()

        setLoadingRequest(false)

    }, [user])

    return (
        <div className="container mx-auto">
            <h1 className="text-4xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
                Skills
            </h1>
                <SkillsList
                    skills={skills}
                    page={page}
                    isLoading={loadingRequest}
                    handleDeleteSkill={handleDeleteSkill}
                    handleFormSubmit={handleFormSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    handleUpdateSkill={handleUpdateSkill}
                />
                <PaginationComponent page={page} setPage={setPage} pagesNumber={pagesNumber} />
        </div>
    )
}

const SkillsList = ({
                          skills,
                          isLoading,
                          handleDeleteSkill,
                          page,
                          formData,
                          setFormData,
                          handleFormSubmit,
                          handleUpdateSkill,
                      }) => {

    if ((!Array.isArray(skills) || skills.length <= 0) && !isLoading) return <p>No skills found</p>

    const [modifiedSkills, setModifiedSkills] = useState(skills)
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

            setModifiedSkills(
                skills
                    .filter((skill) => {
                        if (filter.state === "active") return !skill.archive_date && skill.name.toLowerCase().includes(filter.name.toLowerCase());
                        if (filter.state === "archived") return skill.archive_date && skill.name.toLowerCase().includes(filter.name.toLowerCase());
                        return skill.name.toLowerCase().includes(filter.name.toLowerCase());
                    })
                    .slice(startIndex, endIndex)
            );
        }, 300); // 300ms debounce

        return () => clearTimeout(debouncedUpdate);
    }, [page, skills, filter]);


    useEffect(() => {
        const sortedStudents = [...modifiedSkills].sort((a, b) => {
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

        setModifiedSkills(sortedStudents);
    }, [order, skills]);

    useEffect(() => {
        const itemsPerPage = 6;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        setModifiedSkills(
            skills
                .filter((skill) => {
                    if (filter.state === "active") return !skill.archive_date && skill.name.toLowerCase().includes(filter.name.toLowerCase());
                    if (filter.state === "archived") return skill.archive_date && skill.name.toLowerCase().includes(filter.name.toLowerCase());
                    return skill.name.toLowerCase().includes(filter.name.toLowerCase());
                })
                .slice(startIndex, endIndex)
        );
    }, [page, skills, filter]);

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
                                    <DialogCloseButtonSkills
                                        setFormData={setFormData}
                                        formData={formData}
                                        clickFunction={handleFormSubmit}
                                        title="Crear Skill"
                                        description="Inserta todos los datos requeridos para crear una nueva skill para evaluar las notas de tus alumnos."
                                        action={"Create"}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Crear Skill</p>
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
                        <TableHead>Descripción</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {modifiedSkills.map((skill) => (
                        <TableRow key={skill._id}>
                            <TableCell className="rounded">
                                {skill.icon
                                    ? <Image width={24} height={24} src={`${skill.icon}`} alt={`${skill.name} icon`}/>
                                    : <Image width={24} height={24} src="/defaultPFP.webp" alt={`${skill.name} icon`}/>
                                }

                            </TableCell>
                            <TableCell>{skill.name}</TableCell>
                            <TableCell>{skill.description}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-x-2">
                                    <span
                                        className={`w-3 h-3 rounded-full ${
                                            skill.archive_date ? "bg-red-600" : "bg-green-600"
                                        }`}
                                    />
                                    <p>{skill.archive_date ? "Archivado" : "Activo"}</p>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <DialogCloseButtonSkills
                                    setFormData={setFormData}
                                    formData={formData}
                                    clickFunction={handleUpdateSkill}
                                    title="Modificar Skill"
                                    description="Inserta todos los datos requeridos para modificar la skill para evaluar las notas de tus alumnos."
                                    action={"Modify"}
                                    skillId={skill._id}
                                    disabled={skill.archive_date}
                                />
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    disabled={skill.archive_date}
                                    variant="destructive"
                                    onClick={() => handleDeleteSkill(skill._id)}
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
