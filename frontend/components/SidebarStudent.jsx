"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/Sidebar";
import {
  IconArrowLeft,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {Brain, Rocket, Router} from "lucide-react";
import { useUser } from "@/context/UserContext";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUpdateUser from "@/hooks/useUpdateUser";
import useStudents from "@/hooks/useStudents";
import { toast } from "@/hooks/use-toast";
import { setAuthCookie } from "@/utils/setAuthCookie";
import {ModeToggle} from "@/components/ToggleThemeMode";
import {League_Spartan} from "next/font/google";

export function SidebarDemo({ children }) {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({ name: user?.name || "", lastName: user?.lastName || "", email: user?.email || "", user_picture: "" });
  const [userImage, setUserImage] = useState("");
  const { updateUser } = useUpdateUser();
  const { fetchUserImage } = useStudents();

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, lastName: user.lastName, email: user.email, user_picture: "" });
      fetchUserImage(user._id).then(setUserImage);
    }
  }, [user]);

  const handleChangeFormData = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, user_picture: e.target.files[0] }));
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateUser(user._id, formData);
      if (updatedUser) {
        const { user_picture, ...updatedUserData } = updatedUser;
        setUser(updatedUserData);
        setAuthCookie(updatedUserData);
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
      href: "/student/projects",
      icon: (
        <Rocket className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Cerrar Sesión",
      href: "/login",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <Sheet>
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700",
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
              <SheetTrigger asChild>
                <SidebarLink
                  link={{
                    label: user?.name ?? "user",
                    href: "#",
                    icon: (
                      <Image
                        src={userImage || "/defaultPFP.webp"}
                        className="h-7 w-7 flex-shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                  onClick={(e) => {
                    setOpen(!open);
                    e.stopPropagation();
                  }}
                />
              </SheetTrigger>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard>{children}</Dashboard>
    </div>
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
          <Label htmlFor="user_picture" className="text-right">
            Imagen
          </Label>
          <Input
            id="user_picture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="col-span-3"
          />
        </div>
      </div>
      <SheetFooter>
        <SheetClose>
          <Button type="submit" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
  );
}

const leagueSpartan = League_Spartan({
  weight: ['400', '700'], // Add desired weights
  subsets: ['latin'], // Add subsets if needed
  variable: '--font-league-spartan', // Optional CSS variable
  display: 'swap', // Ensures a smooth font swap
});

export const Logo = () => {
  return (
      <Link
          href="/student/projects"
          className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      >
        <Brain className="dark:text-white" />
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`font-medium text-black dark:text-white whitespace-pre `}
        >
          <p className={`${leagueSpartan.className} font-bold text-lg mt-1`}>SmartHub</p>
        </motion.span>
      </Link>
  );
};

export const LogoIcon = () => {
  return (
      <Link
          href="/student/projects"
          className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      >
        <Brain className="dark:text-white" />
      </Link>
  );
};

const Dashboard = ({ children }) => {
  return <div className="w-full overflow-y-scroll">{children}</div>;
};