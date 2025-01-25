import { setAuthCookie } from '@/utils/setAuthCookie'
import { useState } from 'react'

export default function useLogin() {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const login = async ({ email, password }) => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch("http://localhost:3001/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password})
            })

            if (!res.ok)  {
                // Esto lo que va a hacer es que va a entrar en el catch y va settear alli el error y todo, no hace falta que lo hagamos aqui
                throw new Error("¡Las credenciales no son validas!")
            }

            const data = await res.json()
            const { user_picture, ...userData } = data.user;
            // Guardar el user en las cookies
            setAuthCookie(userData)
            return data

        } catch (err) {
            setError(err.message)
            return null
        } finally {
            setLoading(false)
        }
    }

  return { login, error, loading }
}
