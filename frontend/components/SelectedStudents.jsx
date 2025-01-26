import { useEffect, useState } from "react";
import useStudents from "@/hooks/useStudents";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";

export default function SelectedStudents({ selectedItems, setSelectedItems, projectId }) {
    const { fetchStudents, assignStudentsToProject } = useStudents();
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

    const handleAssignStudentsToProject = async () => {
        console.log("assignStudentsToProject");
        const res = await assignStudentsToProject(selectedItems, projectId);
        if (!res) {
            toast({
                title: "Error al assignar al proyecto los estudiantes!",
                variant: "destructive",
            })
            return;
        }

        toast({
            title: "Se han guardado los usuarios correctamente",
            variant: "success",
        })
    }

    useEffect(() => {
        const filteredStudents = students.filter(student =>
            selectedItems.includes(String(student._id))
        );
        setSelectedStudents(filteredStudents);
    }, [students, selectedItems]);

    useEffect(() => {
        const getStudentsFunc = async () => {
            const fetchedStudents = await fetchStudents();
            setStudents(fetchedStudents);
        };

        getStudentsFunc();
    }, []);

    return (
        <div className="flex flex-row justify-between">
            <div className="flex flex-row flex-wrap gap-2 mb-8">
                {Array.isArray(selectedStudents) && selectedStudents.length > 0 &&
                    selectedStudents.map(student => (
                        <Badge key={student._id} className="flex items-center space-x-2 w-fit">
                            <span>{student.name}</span>
                            <X
                                className="cursor-pointer"
                                onClick={() =>
                                    setSelectedItems(prev => prev.filter(item => item !== student._id))
                                }
                            />
                        </Badge>
                    ))}
            </div>
            <Button onClick={() => handleAssignStudentsToProject()}>Guardar</Button>
        </div>
    );
}
