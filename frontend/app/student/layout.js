import { SidebarDemo } from "../../components/SidebarStudent";

export const metadata = {
  title: "Students Home",
  description: "Students index page",
};

export default function RootLayout({ children }) {
  return (
    <SidebarDemo>
        { children }
    </SidebarDemo>
  );
}
