import "./globals.css";
import ReactQueryProvider from "../lib/ReactQueryProvider";

export const metadata = {
  title: "Kanban Todo App",
  description: "Task management board",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
