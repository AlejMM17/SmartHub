export const metadata = {
  title: "Students Home",
  description: "Students index page",
};

export default function RootLayout({ children }) {
  return (
    <div>
        { children }
    </div>
  );
}
