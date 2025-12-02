import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { listarSolicitacoesPendentesComToken, aprovarSolicitacao, negarSolicitacao, listarAdmins, listarUsuarios, removerAdmin, removerUsuario, excluirEventoQualquer } from "@/api/codechellaApi";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface SolicitacaoPermissao {
  id: number;
  idUsuario: number;
  nomeUsuario?: string;
  emailUsuario?: string;
  motivo?: string;
  status: string;
}

interface Admin {
  id: number;
  nome: string;
  email: string;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoPermissao[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSolicitacoes, setLoadingSolicitacoes] = useState(false);
  const [tab, setTab] = useState<"solicitacoes" | "admins" | "usuarios">("solicitacoes");

  async function carregarSolicitacoes() {
    if (!user?.token) return;
    setLoadingSolicitacoes(true);
    setSolicitacoes([]);
    try {
      const listener = listarSolicitacoesPendentesComToken(user.token, (data) => {
        setSolicitacoes((prev) => {
          const exists = prev.find((s) => s.id === data.id);
          if (exists) return prev;
          return [...prev, data];
        });
      });
      setTimeout(() => {
        listener.close();
        setLoadingSolicitacoes(false);
      }, 2000);
    } catch (err) {
      console.error("Erro ao carregar solicitações:", err);
      setLoadingSolicitacoes(false);
    }
  }

  async function atualizar() {
    if (!user?.token) return;
    setLoadingSolicitacoes(true);
    try {
      if (tab === "solicitacoes") {
        await carregarSolicitacoes();
      } else if (tab === "admins") {
        const data = await listarAdmins(user.token);
        setAdmins(data);
      } else if (tab === "usuarios") {
        const data = await listarUsuarios(user.token);
        setUsuarios(data);
      }
    } catch (err) {
      console.error("Erro ao atualizar:", err);
    } finally {
      setLoadingSolicitacoes(false);
    }
  }

  useEffect(() => {
    if (!user?.id || !user?.token) {
      console.warn("⚠️ [SUPER] Usuário ou token não disponível");
      return;
    }

    carregarSolicitacoes();

    // Carregar admins e usuários uma vez
    listarAdmins(user.token)
      .then(data => setAdmins(data))
      .catch(err => console.error("Erro ao carregar admins:", err));

    listarUsuarios(user.token)
      .then(data => setUsuarios(data))
      .catch(err => console.error("Erro ao carregar usuários:", err));
  }, [user?.id, user?.token]);

  async function handleAprovar(id: number) {
    try {
      await aprovarSolicitacao(id, user?.token ?? "", user?.id);
      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      console.error(err.message);
    }
  }

  async function handleNegar(id: number) {
    try {
      await negarSolicitacao(id, "", user?.token ?? "", user?.id);
      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      console.error(err.message);
    }
  }

  async function handleRemoverAdmin(id: number) {
    if (!confirm("Remover esse admin?")) return;
    try {
      await removerAdmin(id, user?.id ?? 0);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      console.error(err.message);
    }
  }

  async function handleRemoverUsuario(id: number) {
    if (!confirm("Remover esse usuário?")) return;
    try {
      await removerUsuario(id, user?.id ?? 0);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      console.error(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Painel <span className="text-gradient">Super Admin</span>
            </h1>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Abas */}
            <div className="flex justify-between items-center mb-8 border-b border-border">
              <div className="flex gap-2">
                <button
                  onClick={() => setTab("solicitacoes")}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    tab === "solicitacoes"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Solicitações ({solicitacoes.length})
                </button>
                <button
                  onClick={() => setTab("admins")}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    tab === "admins"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Admins ({admins.length})
                </button>
                <button
                  onClick={() => setTab("usuarios")}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    tab === "usuarios"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Usuários ({usuarios.length})
                </button>
              </div>
              <Button 
                onClick={atualizar} 
                disabled={loadingSolicitacoes}
                variant="outline"
                size="sm"
              >
                {loadingSolicitacoes ? "Carregando..." : "Atualizar"}
              </Button>
            </div>

            {/* Solicita\u00e7\u00f5es Pendentes */}
            {tab === "solicitacoes" && (
              <section className="space-y-4">
                {solicitacoes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhuma solicitação pendente</p>
                ) : (
                  solicitacoes.map((req) => {
                    const nome = req.nomeUsuario || "—";
                    const email = req.emailUsuario || "—";
                    const motivo = (req.motivo || "").trim();
                    return (
                    <div
                      key={req.id}
                      className="bg-card p-6 rounded-lg border border-border/50 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-lg truncate">{nome}</div>
                        <div className="text-sm text-muted-foreground truncate">{email}</div>
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="secondary">Ver motivo</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Motivo da solicitação</DialogTitle>
                              <DialogDescription>
                                {nome ? `${nome} deseja ser admin` : "Solicitação de admin"}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-2 whitespace-pre-wrap text-sm">
                              {motivo || "Sem motivo informado."}
                            </div>
                            <DialogFooter>
                              <div className="flex gap-2 w-full justify-end">
                                <Button onClick={() => handleAprovar(req.id)} className="bg-green-600 hover:bg-green-700">
                                  Aprovar
                                </Button>
                                <Button onClick={() => handleNegar(req.id)} variant="destructive">
                                  Rejeitar
                                </Button>
                              </div>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button onClick={() => handleAprovar(req.id)} className="bg-green-600 hover:bg-green-700">
                          Aprovar
                        </Button>
                        <Button onClick={() => handleNegar(req.id)} variant="destructive">
                          Rejeitar
                        </Button>
                      </div>
                    </div>
                    );
                  })
                )}
              </section>
            )}

            {/* Admins */}
            {tab === "admins" && (
              <section className="space-y-4">
                {admins.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum admin cadastrado</p>
                ) : (
                  admins.map((admin) => (
                    <div key={admin.id} className="bg-card p-6 rounded-lg border border-border/50 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg">{admin.nome}</div>
                        <div className="text-sm text-muted-foreground">{admin.email}</div>
                      </div>
                      <Button
                        onClick={() => handleRemoverAdmin(admin.id)}
                        variant="destructive"
                      >
                        Remover
                      </Button>
                    </div>
                  ))
                )}
              </section>
            )}

            {/* Usuários */}
            {tab === "usuarios" && (
              <section className="space-y-4">
                {usuarios.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum usuário cadastrado</p>
                ) : (
                  usuarios.map((usuario) => (
                    <div key={usuario.id} className="bg-card p-6 rounded-lg border border-border/50 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg">{usuario.nome}</div>
                        <div className="text-sm text-muted-foreground">{usuario.email}</div>
                      </div>
                      <Button
                        onClick={() => handleRemoverUsuario(usuario.id)}
                        variant="destructive"
                      >
                        Remover
                      </Button>
                    </div>
                  ))
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
