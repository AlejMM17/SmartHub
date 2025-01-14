"use client"

import {useUser} from "@/context/UserContext";
import {useEffect, useState} from "react";
import SkeletonLoader from "@/components/SkeletonsProject";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import DialogCloseButtonUsers from "@/components/DialogCloseButtonUsers";
import useStudents from "@/hooks/useStudents";

export default function Page() {
    const { user } = useUser();
    const [students, setStudents] = useState([])
    const [loadingRequest, setLoadingRequest] = useState(true)
    const { fetchStudents, deleteStudent, postStudent, loading, error } = useStudents();
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
    })

    const handleFormSubmit = async () => {

    }

    const handleDeleteStudent = (userId) => {
        const deletedUser = deleteStudent(userId)
        if (!deletedUser) {
            return toast({
                message: 'No se ha podido eliminar el estudiante',
                status: 'error'
            })
        } else {
            setStudents(prev => prev.filter((student) => student._id !== userId))
            return toast({
                message: `Estudiante eliminado ${deletedUser.name}`,
                status: 'success'
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
        <div className="w-full">
            <h1 className="text-4xl font-normal mb-8 text-center lg:text-start lg:mt-8 lg:ms-16">Alumnos</h1>
            { loading || loadingRequest && <SkeletonLoader count={3} /> }
            { !loading && !loadingRequest &&
                <div className="flex flex-row justify-between items-center mx-auto w-4/5 mb-8">
                    <h3 className="font-bold">Crear Alumno</h3>
                    <DialogCloseButtonUsers
                        setFormData={setFormData}
                        formData={formData}
                        clickFunction={handleFormSubmit}
                        title="Crear Alumno"
                        description="Inserta todos los datos requeridos para crear un nuevo alumno."
                    />
                </div>
            }
            <StudentsList students={students} isLoading={loadingRequest} handleDeleteStudent={handleDeleteStudent} />
        </div>
    )
}

const StudentsList = ({ students, isLoading, handleDeleteStudent }) => {

    if ((!Array.isArray(students) || students.length <= 0) && !isLoading) return <p>No students found</p>

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:w-4/5 lg:mx-auto lg:flex-wrap">
            { students.map(student => (
                <Student key={ student._id } studentID={ student._id } handleDeleteStudent={handleDeleteStudent} { ...student } />
            )) }
        </div>
    )
}

const Student = ({name, lastName, email, studentID, handleDeleteStudent}) => {

    return (
        <div className="w-4/5 border rounded border-slate-900 mx-auto p-3 lg:w-fit lg:mx-0">
            <p>Name: { name }</p>
            <p>Apellido: { lastName }</p>
            <p>Correo: { email }</p>
            <Button variant="destructive" onClick={() => handleDeleteStudent(studentID)}>Eliminar</Button>
        </div>
    )
}
