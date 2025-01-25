"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/Sidebar";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {Zap, List, Rocket, Users} from "lucide-react";
import {ModeToggle} from "@/components/ToggleThemeMode";
import {useUser} from "@/context/UserContext";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useStudents from "@/hooks/useStudents";
import { toast } from "@/hooks/use-toast";
import { setAuthCookie } from "@/utils/setAuthCookie";

export function SidebarDemo({ children }) {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({ name: user?.name || "", lastName: user?.lastName || "", email: user?.email || "", image: "" });
  const { updateUser } = useStudents();
  useEffect(() => {
    if (user) {
      console.log(user)
      setFormData({ name: user.name, lastName: user.lastName, email: user.email, image: "" });
    }
  }, [user]);

  const handleChangeFormData = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };
  const handleSave = async () => {
    try {
      console.log(formData)
      const updatedUser = await updateUser(user._id, formData);
      if (updatedUser) {
        setUser(updatedUser);
        setAuthCookie(updatedUser);
        toast({
          title: 'Perfil actualizado',
          description: 'Tu perfil ha sido actualizado correctamente.',
          variant: 'success',
        });
      }
    } catch (error) {
      toast({
        title: 'Error al actualizar',
        description: 'Hubo un problema al actualizar tu perfil.',
        variant: 'destructive',
      });
    }
  };

  const links = [
    {
      label: "Proyectos",
      href: "/professor/projects",
      icon: (
        <Rocket className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Alumnos",
      href: "/professor/students",
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Skills",
      href: "/professor/skills",
      icon: (
        <Zap className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700",
        // for your use case, use `h-screen` instead of `h-[60vh]`
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <SidebarLink
                  link={{
                    label: user?.name ?? "user",
                    href: "#",
                    icon: user?.user_picture
                          ? <Image width={24} height={24} src={user?.user_picture} alt={`${user?.name} icon`}/>
                          : <Image width={24} height={24} src="defaultPFP.webp" alt={`${user?.name} icon`}/>,
                  }}
                />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit profile</SheetTitle>
                  <SheetDescription>
                    Make changes to your profile here. Click save when you're done.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChangeFormData}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastname" className="text-right">
                      Apellido
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChangeFormData}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChangeFormData}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">
                      Imagen
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <SheetFooter>
                  <Button type="submit" onClick={handleSave}>
                    Guardar Cambios
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard>{ children }</Dashboard>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Smart Hub
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

const Dashboard = ({ children }) => {
  return <div className="w-full">{children}</div>;
};
