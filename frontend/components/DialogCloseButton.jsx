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

export default function DialogCloseButton({ setFormData, formdata, clickFunction }) {

    const handleChangeFormData = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusIcon/></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Crear Proyecto</DialogTitle>
                    <DialogDescription>
                        Inserta todos los datos requeridos para crear un nuevo proyecto.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        {/*<Label htmlFor="link" className="sr-only">*/}
                        {/*    Link*/}
                        {/*</Label>*/}
                        {/*<Input*/}
                        {/*    id="link"*/}
                        {/*    defaultValue="https://ui.shadcn.com/docs/installation"*/}
                        {/*    readOnly*/}
                        {/*/>*/}

                        <Label htmlFor="name" >Nombre</Label>
                        <Input id="name" name="name" onChange={(e) => handleChangeFormData(e)}/>

                        <Label htmlFor="description" >Descripción</Label>
                        <Textarea id="description" name="description" onChange={(e) => handleChangeFormData(e)} />

                        <Label htmlFor="">Skills</Label>
                        {/*<SkillsSelector />*/}
                    </div>

                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="primary" className="bg-red-500 text-white hover:bg-red-800">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="button" variant="primary" className="bg-blue-500 text-white hover:bg-blue-800" onClick={() => clickFunction()}>
                        Send
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
