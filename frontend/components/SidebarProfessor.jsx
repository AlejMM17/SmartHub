"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/Sidebar";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {List, Rocket, Users} from "lucide-react";
import {ModeToggle} from "@/components/ToggleThemeMode";
import {useUser} from "@/context/UserContext";

export function SidebarDemo({ children }) {

  const { user } = useUser();

  const links = [
    {
      label: "Proyectos",
      href: "/professor/projects",
      icon: (
        <Rocket className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Actividades",
      href: "/professor/activities",
      icon: (
        <List className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
      label: "Profile",
      href: "/profile",
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700",
        // for your use case, use `h-screen` instead of `h-[60vh]`
        "min-h-screen"
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
            <SidebarLink
              link={{
                label: user?.name ?? "user",
                href: "#",
                icon: (
                  <Image
                    src={("/" + user?.user_picture) ?? "/defaultPFP.webp"}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
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
