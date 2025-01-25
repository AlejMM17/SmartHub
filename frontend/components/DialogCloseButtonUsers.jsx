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
import {useEffect, useState} from "react";
import {toast} from "@/hooks/use-toast";

export default function DialogCloseButtonUsers({ setFormData, formData, clickFunction, title, description, action, userId, disabled }) {

    const [isSendable, setIsSendable] = useState(false)

    const handleChangeFormData = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, user_picture: file }));
        }
    };


    useEffect(() => {
        if (formData.name !== "" && formData.lastName !== "" && formData.email !== "" && formData.password !== "" && formData.confirmPassword !== "") {
            if (formData.password === formData.confirmPassword) {
                setIsSendable(true)
            } else {
                setIsSendable(false)
                toast({
                    title: "Contraseñas diferentes",
                    description: "La contraseña y su confirmación son diferentes!",
                    variant: "error",
                })
            }
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
                        <div className="md:flex md:items-end md:space-x-2">
                            <div>
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" name="name" value={formData.name} onChange={(e) => handleChangeFormData(e)} />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Apellido</Label>
                                <Input id="lastName" name="lastName" value={formData.lastName} onChange={(e) => handleChangeFormData(e)} />
                            </div>
                        </div>

                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" type="email" name="email" value={formData.email} onChange={(e) => handleChangeFormData(e)} />

                        <div className="md:flex md:items-end md:space-x-2">
                            <div>
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" type="password" name="password" value={formData.password}
                                       onChange={(e) => handleChangeFormData(e)}/>
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword">Confirma Contraseña</Label>
                                <Input id="confirmPassword" type="password" name="confirmPassword" value={formData.confirmPassword}
                                       onChange={(e) => handleChangeFormData(e)}/>
                            </div>
                        </div>

                        <Label htmlFor="user_picture">Foto</Label>
                        <Input type={"file"} accept="image/*" id="user_picture" name="user_picture" onChange={handleFileChange}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="primary" disabled={!isSendable} className="bg-blue-500 text-white hover:bg-blue-800" onClick={() => action === "Modify" ? clickFunction(userId) : clickFunction()}>
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
