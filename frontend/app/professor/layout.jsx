import { SidebarDemo } from "@/components/SidebarProfessor";

export const metadata = {
    title: "Home Profesores",
    description: "Professors index page",
};

export default function ProfessorLayout({ children }) {
    return (
        <SidebarDemo>
            { children }
        </SidebarDemo>
    );
}
