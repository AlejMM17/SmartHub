import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // IMPORTANTE aqui es donde se define todo lo necessario para que tailwind funcione, sin esto no funciona

import { UserProvider } from "@/context/UserContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider"
import Head from "next/head";


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
  icons: {
    icon: "/favicon.webp",
  }
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
        >
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
