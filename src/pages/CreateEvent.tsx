import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { cadastrarEvento } from "@/api/codechellaApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    categoria: "SHOW",
    nome: "",
    data: "",
    local: "",
    preco: "",
    descricao: "",
    imagem: "",
    ingressosDisponiveis: ""
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error" | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const eventoPayload = {
        nome: form.nome,
        data: form.data,
        local: form.local,
        preco: parseFloat(form.preco),
        categoria: form.categoria,
        descricao: form.descricao,
        imagem: form.imagem,
        ingressosDisponiveis: parseInt(form.ingressosDisponiveis)
      };

      // Enviar token JWT no header Authorization
      await cadastrarEvento(eventoPayload, user?.token);
      setMsgType("success");
      setMsg("✓ Evento criado com sucesso!");
      setForm({ categoria: "SHOW", nome: "", data: "", local: "", preco: "", descricao: "", imagem: "", ingressosDisponiveis: "" });
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      setMsgType("error");
      setMsg(err.message || "Erro ao criar evento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 space-y-2">
              <h1 className="font-display text-4xl md:text-5xl font-bold">
                Criar <span className="text-gradient">Evento</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Preencha os dados abaixo para cadastrar um novo evento
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-card border border-border/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-semibold mb-2 block">Categoria</Label>
                    <select 
                      name="categoria" 
                      value={form.categoria} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="SHOW">Show</option>
                      <option value="CONCERTO">Concerto</option>
                      <option value="TEATRO">Teatro</option>
                      <option value="PALESTRA">Palestra</option>
                      <option value="WORKSHOP">Workshop</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">Preço (R$)</Label>
                    <Input 
                      type="number" 
                      name="preco" 
                      value={form.preco} 
                      onChange={handleChange} 
                      placeholder="0.00"
                      step="0.01"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">Nome do Evento</Label>
                  <Input 
                    name="nome" 
                    value={form.nome} 
                    onChange={handleChange} 
                    placeholder="Ex: Festival de Música 2024"
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-semibold mb-2 block">Data e Hora</Label>
                    <Input 
                      type="datetime-local" 
                      name="data" 
                      value={form.data} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">Local</Label>
                    <Input 
                      name="local" 
                      value={form.local} 
                      onChange={handleChange} 
                      placeholder="Ex: Estádio Municipal"
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-semibold mb-2 block">Ingressos Disponíveis</Label>
                    <Input 
                      type="number" 
                      name="ingressosDisponiveis" 
                      value={form.ingressosDisponiveis} 
                      onChange={handleChange}
                      placeholder="Ex: 500"
                      min="1"
                      required 
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">URL da Imagem</Label>
                    <Input 
                      type="url"
                      name="imagem" 
                      value={form.imagem} 
                      onChange={handleChange} 
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">Descrição</Label>
                  <textarea 
                    name="descricao" 
                    value={form.descricao} 
                    onChange={handleChange} 
                    rows={4} 
                    placeholder="Descreva o evento..."
                    className="w-full rounded-lg border border-border bg-background text-foreground p-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="pt-2 pb-4 px-4 rounded-lg bg-secondary/20 border border-border/50">
                  <p className="text-sm text-muted-foreground">
                    <strong>Criado por:</strong> {user?.nome || user?.email}
                  </p>
                </div>

                {msg && (
                  <div className={`p-4 rounded-lg text-sm font-medium ${
                    msgType === "success" 
                      ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30" 
                      : "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30"
                  }`}>
                    {msg}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Criando..." : "Criar Evento"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/")}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
