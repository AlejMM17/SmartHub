"use client"

import {PlusIcon} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useEffect, useState} from "react";
import useSkills from "@/hooks/useSkills";
import {toast} from "@/hooks/use-toast";

export default function DialogCloseButton({ setFormData, formData, clickFunction, title, description }) {

    const { fetchAllSkills, error, loading } = useSkills()
    const [skills, setSkills] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSendable, setIsSendable] = useState(false)

    const handleChangeFormData = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    useEffect(() => {
        const sumOfPercentages = Array.isArray(formData.skills) && formData.skills.length > 0
            ? formData.skills?.reduce((sum, skill) => sum + skill.percentage, 0)
            : null
        console.log(sumOfPercentages)
        if (formData.name !== "" && formData.description !== "" && (sumOfPercentages <= 100 || sumOfPercentages === null )) {
            setIsSendable(true)
        } else {
            setIsSendable(false)
        }
    }, [formData]);

    useEffect(() => {
        const getSkills = async () => {
            const fetchedSkills = await fetchAllSkills()
            setSkills(fetchedSkills)
        }

        getSkills()
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusIcon/></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" name="name" onChange={(e) => handleChangeFormData(e)}/>

                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" name="description" onChange={(e) => handleChangeFormData(e)} />

                        <Label htmlFor="skills">Skills</Label>
                        <SkillsSelector
                            id="skills"
                            setSelectedItems={setSelectedItems}
                            selectedItems={selectedItems}
                            skills={skills}
                        />
                        { Array.isArray(selectedItems)
                            && selectedItems.length > 0
                            && <SelectedSkills
                                selectedItems={selectedItems}
                                skills={skills}
                                setFormData={setFormData}
                                formData={formData}
                            />
                        }
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="primary" className="bg-red-500 text-white hover:bg-red-800">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="button" variant="primary" disabled={!isSendable} className="bg-blue-500 text-white hover:bg-blue-800" onClick={() => clickFunction()}>
                        Send
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function SkillsSelector({ setSelectedItems, selectedItems, skills }) {

    const toggleSelection = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    if (skills?.length === 0) {
        return <p className="text-red-600">No hay skills creadas!</p>
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    { selectedItems?.length > 0
                        ? `Seleccionados (${selectedItems?.length})`
                        : "Seleccionar opciones"
                    }
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                { skills?.map((skill) => (
                    <DropdownMenuCheckboxItem
                        key={skill._id}
                        checked={selectedItems?.includes(skill._id)}
                        onCheckedChange={() => toggleSelection(skill._id)}
                    >
                        {skill?.name}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function SelectedSkills({ selectedItems, formData, skills, setFormData }) {

    const selectedSkills = skills.filter(skill => selectedItems.find((s) => s === skill._id))

    const percentagesSum = Array.isArray(formData.skills) && formData.skills.length > 0
        ? formData.skills?.reduce((sum, skill) => sum + skill.percentage, 0)
        : 0

    if (percentagesSum > 100) {
        toast({
            title: "Límite excedido",
            description: "El límite del porcentaje total de las skills excede el 100%",
            variant: "destructive",
        })
    }

    const handleChange = (e, skillId) => {
        let { value } = e.target;
        value = Number(value);

        setFormData((prev) => {
            const skills = prev.skills.some((s) => s.skill_id === skillId)
                ? prev.skills.map((s) =>
                    s.skill_id === skillId ? { ...s, percentage: value } : s
                )
                : [...prev.skills, { skill_id: skillId, percentage: value }];

            return { ...prev, skills };
        });
    }

    return (
        <div className="d-flex flex-col space-y-2">
            { Array.isArray(selectedSkills) && selectedSkills.length > 0 &&
                selectedSkills.map((skill) => (
                    <div key={skill._id} className="flex items-center space-x-2 justify-between">
                        <p>{ skill.name }</p>
                        <div className="flex items-center space-x-2 justify-end">
                            <Input type="number"
                                   className="w-2/3"
                                   max={100}
                                   min={0}
                                   onChange={(e) => handleChange(e, skill._id)}
                            />
                            <p>%</p>
                        </div>
                    </div>
                ))}
        </div>
    )
}
