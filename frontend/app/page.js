"use client"

import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";

export default function Home() {

    const router = useRouter()
    const { user } = useUser()

    useEffect(() => {
        if (!user) {
            router.push("/login")
        } else if (user.role === "professor") {
            router.push("/professor/projects")
        } else {
            router.push("/student")
        }
    }, [user, router])
}
