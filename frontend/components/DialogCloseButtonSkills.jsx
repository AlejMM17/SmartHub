"use client"

import {PencilIcon, PlusIcon} from "lucide-react"

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

export default function DialogCloseButtonSkills({ setFormData, formData, clickFunction, title, description, action, skillId, disabled }) {

    const [isSendable, setIsSendable] = useState(false)

    const handleChangeFormData = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleFileChange = (e) => {
        setFormData(prev => ({...prev, icon: e.target.files[0]}));
    };

    useEffect(() => {
        if (formData.name !== "" && formData.description !== "" && formData.icon !== "") {
            setIsSendable(true)
        } else {
            setIsSendable(false)
        }
    }, [formData]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={disabled} className={action === "Modify" ? "bg-blue-500 hover:bg-blue-600 text-white hover:text-white" : ""}>{action === "Create" ? <PlusIcon/> : <PencilIcon />}</Button>
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

                        <Label htmlFor="icon">Icono</Label>
                        <Input type={"file"} accept="image/*" id="icon" name="icon" onChange={handleFileChange}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="primary" disabled={!isSendable} className="bg-blue-500 text-white hover:bg-blue-800" onClick={() => action === "Modify" ? clickFunction(skillId) : clickFunction()}>
                        Enviar
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="primary" className="bg-red-500 text-white hover:bg-red-800">
                            Cerrar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}