"use client"

import Cookies from "js-cookie"
import { createContext, useContext, useEffect, useState } from "react"

const UserContext = createContext()

export const useUser = () => {
    return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
    /**
     * user = {
            _id: string
            name: string
            role: string ( student | professor )
            email: string
            password: string
            user_picture: string
            assigned_projects: Array
            create_date: date
     * }
     */
    const [user, setUser] = useState()

    // Cada vez que el componente UserProvider se monte se ira a las cookies a buscar "user"
    useEffect(() => {
        const currentUser = JSON.parse(Cookies.get("user"))
        setUser(currentUser)
    }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
        { children }
    </UserContext.Provider>
  )
}
