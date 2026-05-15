import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { UsuarioMenu } from "@/components/UsuarioMenu";
import { getSessao } from "@/lib/auth/session";

export default async function LayoutAutenticado({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessao = await getSessao();
  if (!sessao) redirect("/login");

  return (
    <>
      <Sidebar />
      <UsuarioMenu
        nome={sessao.nome}
        email={sessao.email}
        picture={sessao.picture}
        role={sessao.role}
      />
      <main className="ml-60 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </>
  );
}
