import { SidebarDemo } from "@/components/SidebarProfessor";

export const metadata = {
    title: "Professors Home",
    description: "Professors index page",
};

export default function ProfessorLayout({ children }) {
    return (
        <SidebarDemo>
            { children }
        </SidebarDemo>
    );
}
