import UserLayoutClient from "@/components/userLayoutClient/userLayoutClient";

export const metadata = {
  title: "Oficina | Painel do Usuário",
  description: "Painel do usuário para controle de oficina mecânica.",
    icons: {
    icon: "/favicon.ico", // Garanta que a imagem esteja na pasta public/
  },
};

export default function RootLayout({ children }) {
  return (
    <UserLayoutClient>
      {children}
    </UserLayoutClient>
  );
}