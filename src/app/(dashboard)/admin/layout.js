import AdminLayoutClient from "@/components/adminLayoutClient/adminLayoutClient";

export const metadata = {
  title: "Oficina | Gestão Administrativa",
  description: "Sistema administrativo para controle de oficina mecânica.",
  icons: {
    icon: "/favicon.ico", // Garanta que a imagem esteja na pasta public/
  },
};

export default function RootLayout({ children }) {
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}