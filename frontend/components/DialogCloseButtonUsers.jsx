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
import {useEffect, useState} from "react";
import {toast} from "@/hooks/use-toast";

export default function DialogCloseButtonUsers({ setFormData, formData, clickFunction, title, description }) {

    const [isSendable, setIsSendable] = useState(false)

    const handleChangeFormData = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

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
                <Button variant="outline" className="bg-none"><PlusIcon/></Button>
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
                                <Input id="name" name="name" required onChange={(e) => handleChangeFormData(e)}/>
                            </div>
                            <div>
                                <Label htmlFor="lastName">Apellido</Label>
                                <Input id="lastName" name="lastName" required onChange={(e) => handleChangeFormData(e)} />
                            </div>
                        </div>

                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" type="email" name="email" required onChange={(e) => handleChangeFormData(e)} />

                        <div className="md:flex md:items-end md:space-x-2">
                            <div>
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" type="password" required name="password"
                                       onChange={(e) => handleChangeFormData(e)}/>
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword">Confirma Contraseña</Label>
                                <Input id="confirmPassword" type="password" required name="confirmPassword"
                                       onChange={(e) => handleChangeFormData(e)}/>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="">
                    <Button type="button" variant="primary" disabled={!isSendable} className="bg-blue-500 text-white hover:bg-blue-800" onClick={() => action === "Modify" ? clickFunction(projectID) : clickFunction()}>
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
