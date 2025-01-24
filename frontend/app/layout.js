import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // IMPORTANTE aqui es donde se define todo lo necessario para que tailwind funcione, sin esto no funciona

import { UserProvider } from "@/context/UserContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SmartHub",
  description: "El mejor portal de aprendizaje",
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
        >
            {/*
                El UserProvider es un context que contiene la informacion del user, se puede utilizar en sus hijos para acceder y modificar su informacion mediante al useUser() que te devuelve user y setUser.

                Ejemplo de como obtener los datos en hijos:

                import { useUser } from "./context/UserContext";
                const { user, setUser } = useUser()

                Con estas dos variables ya puedes ver la información del usuario ( user ) y modificarla ( setUser )
            */}
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                { children }
                <Toaster />
            </ThemeProvider>
        </body>
        </html>
    </UserProvider>
  );
}
