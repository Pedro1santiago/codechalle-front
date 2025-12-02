import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listarEventosSSE, deleteEventAsAdmin } from "@/api/codechellaApi";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit } from "lucide-react";

// Mapeamento de imagens por categoria
const categoriasImagens: Record<string, string> = {
  SHOW: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  CONCERTO: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
  TEATRO: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80",
  PALESTRA: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  WORKSHOP: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
};

function getImagemEvento(evento: Evento): string {
  if (evento.imagem) return evento.imagem;
  const categoria = (evento.categoria || "").toUpperCase();
  return categoriasImagens[categoria] || "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80";
}

interface Evento {
  id: number;
  nome: string;
  data: string;
  local: string;
  preco: number;
  categoria: string;
  imagem?: string;
  ingressosDisponiveis?: number;
  criadoPorId?: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [meusEventos, setMeusEventos] = useState<Evento[]>([]);

  useEffect(() => {
    // SSE para listar todos os eventos
    const unsubscribe = listarEventosSSE((data: Evento) => {
      setEventos((prev) => {
        const exists = prev.find((e) => e.id === data.id);
        if (exists) {
          return prev.map((e) => (e.id === data.id ? data : e));
        }
        return [...prev, data];
      });
    });

    return () => unsubscribe.close();
  }, []);

  useEffect(() => {
    // Filtrar apenas eventos criados por este admin
    const filtered = eventos.filter((e) => e.criadoPorId === user?.id);
    setMeusEventos(filtered);
  }, [eventos, user?.id]);

  async function handleDeleteEvent(id: number) {
    if (!confirm("Tem certeza que deseja deletar este evento?")) return;
    try {
      await deleteEventAsAdmin(id, user?.id ?? 0);
      setMeusEventos((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      console.error(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-2">
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Meus <span className="text-gradient">Eventos</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Gerencie os eventos que você criou
            </p>
          </div>

          <div className="max-w-6xl mx-auto mb-8">
            <Button 
              onClick={() => navigate("/criar-evento")}
              className="w-full md:w-auto"
            >
              + Criar Novo Evento
            </Button>
          </div>

          {meusEventos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-6">
                Você ainda não criou nenhum evento
              </p>
              <Button onClick={() => navigate("/criar-evento")}>
                Criar Primeiro Evento
              </Button>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              {meusEventos.map((evento) => (
                <div 
                  key={evento.id} 
                  className="bg-card p-6 rounded-lg border border-border/50 hover:border-primary/50 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={getImagemEvento(evento)} 
                        alt={evento.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-foreground mb-2">{evento.nome}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>Categoria:</strong> {evento.categoria}</p>
                        <p><strong>Data:</strong> {new Date(evento.data).toLocaleString('pt-BR')}</p>
                        <p><strong>Local:</strong> {evento.local}</p>
                        <p><strong>Preço:</strong> R$ {evento.preco.toFixed(2)}</p>
                        <p><strong>Ingressos:</strong> {evento.ingressosDisponiveis} disponíveis</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/editar-evento/${evento.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button 
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleDeleteEvent(evento.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
