"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import useLogin from "../../hooks/useLogin";
import { useUser } from "../../context/UserContext";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login, loading, error } = useLogin()
  const { setUser } = useUser()
  const router = useRouter()

  const validateOnSubmit = () => {
    const { email, password } = formData
    const newErrors = {}

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Email no valido";
    }

    if (!password.trim()) {
        newErrors.password = "La contraseña no puede estar vacia"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // Devuelve true si el objeto esta vacio/no hay errores
  }

  const redirectByRole = (role) => {
    if (role === "professor") {
        router.push("/professor")
        return
    }
    router.push("/student")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateOnSubmit()) {
        let errorMessage
        if (Object.keys(errors).length > 0) {
            if (errors.email) errorMessage += `${errors.email}`
            if (errors.password) errorMessage += `; ${errors.password}`
        }
        toast({
            variant: "destructive",
            title: "Login incorrecto!",
            description: errorMessage,
        })
        return
    }

    const { email, password } = formData
    const res = await login({ email, password })

    if (res) {
        const user = res.user
        toast({
            title: "Login correcto!",
            description: `¡Bienvenido ${user.name} a SmartHub!`,
        })
        setUser(user)
        redirectByRole(user.role)
    } else {
        setFormData({ email: "", password: "" })
        toast({
            variant: "destructive",
            title: "Login incorrecto!",
            description: `Error: ${error}`,
        })
    }
  };

  const validateField = (name, value) => {
    let newErrors = {}
    if (name === "email") {
        if (value.trim() === "") {
            newErrors.email = "El campo no puede estar vacio"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors.email = "Email no és válido";
        }
    } else {
        if (value.trim() === "") {
            newErrors.password = "El campo no puede estar vacio"
        }
    }
    setErrors(newErrors)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
        ...formData,
        [name]: value
    })
    validateField(name, value)
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          { errors.email && <p className="text-red-600 ">{errors.email}</p> }

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          { errors.password && <p className="text-red-600 ">{errors.password}</p> }


          <Button type="submit" className="w-full" disabled={loading || Object.keys(errors).length !== 0 } onClick={(e) => handleSubmit(e)}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
