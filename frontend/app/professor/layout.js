import { SidebarDemo } from "../../components/SidebarProfessor";

export const metadata = {
  title: "Professor's Home",
  description: "Professors index page",
};

export default function RootLayout({ children }) {
  return (
    <SidebarDemo>
        { children }
    </SidebarDemo>
  );
}
