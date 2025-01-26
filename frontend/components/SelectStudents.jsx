import {useEffect, useState} from "react";
import useStudents from "@/hooks/useStudents";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {id} from "date-fns/locale";

export default function SelectStudents({ selectedItems, setSelectedItems }) {
    const { fetchStudents } = useStudents();
    const [students, setStudents] = useState([])
    const toggleSelection = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const getStudentsFunc = async () => {
            const fetchedStudents = await fetchStudents();
            setStudents(fetchedStudents.filter((student) => !student.archive_date ));
        }

        getStudentsFunc();
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    { selectedItems?.length > 0
                        ? `Seleccionados (${selectedItems?.length})`
                        : "Seleccionar Estudiantes"
                    }
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                { students?.map((student) => (
                    <DropdownMenuCheckboxItem
                        key={student._id}
                        checked={selectedItems?.includes(student._id)}
                        onCheckedChange={() => toggleSelection(student._id)}
                    >
                        {student?.name}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function StudentsSelector({ setSelectedItems, selectedItems, students }) {


}