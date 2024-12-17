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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin()
  const { setUser } = useUser()
  const router = useRouter()

  const redirectByRole = (role) => {
    if (role === "professor") {
        router.push("/professor")
        return
    }

    router.push("/student")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        setEmail("")
        setPassword("")
        toast({
            variant: "destructive",
            title: "Login incorrecto!",
            description: `Error: ${error}`,
        })
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading} onClick={(e) => handleSubmit(e)}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
