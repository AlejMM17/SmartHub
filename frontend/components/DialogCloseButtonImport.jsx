"use client"

import {ImportIcon} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function DialogCloseButtonImport({ setFormData, formData, clickFunction, title, description }) {
    const [isSendable, setIsSendable] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("");

    const handleChange = (event) => {
        const selectedFile = event.target.files[0];

        // Check file type and size (example: CSV only, max 5MB)
        if (selectedFile) {
            if (selectedFile.type !== "text/csv") {
                setErrorMessage("Solo se aceptan archivos csv.");
                setFormData(null);
                setSelectedFileName("");
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                setErrorMessage("El archivo no puede exceder los 5MB.");
                setFormData(null);
                setSelectedFileName("");
                return;
            }

            setErrorMessage("");
            setFormData(selectedFile);
            setSelectedFileName(selectedFile.name);

        }
    };

    useEffect(() => {
        setIsSendable(!!formData && !errorMessage);
    }, [formData, errorMessage]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <ImportIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <Label htmlFor="file">Inserta Fichero:</Label>
                <Input type="file" id="file" onChange={handleChange} accept=".csv" />
                {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                {selectedFileName && <p className="text-green-500 text-sm mt-1">Selected File: {selectedFileName}</p>}
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
    );
}
