import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { listarEventosSSE } from "@/api/codechellaApi";

interface EventoDTO {
  id: number;
  nome: string;
  data: string;
  local: string;
  preco: number;
  categoria: string;
  imagemUrl?: string;
}

const AllEvents = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  const [eventos, setEventos] = useState<EventoDTO[]>([]);

  useEffect(() => {
    const unsubscribe = listarEventosSSE((data) => {
      setEventos((prev) => {
        const exists = prev.some((e) => e.id === data.id);
        if (!exists) return [...prev, data];
        return prev.map((e) => (e.id === data.id ? data : e));
      });
    });

    return () => unsubscribe.close();
  }, []);

  const categories = [
    { id: "TODOS", label: "Todos" },
    { id: "SHOW", label: "Shows" },
    { id: "CONCERTO", label: "Concertos" },
    { id: "TEATRO", label: "Teatro" },
    { id: "PALESTRA", label: "Palestras" },
    { id: "WORKSHOP", label: "Workshops" }
  ];

  const filteredEvents = eventos.filter((event) => {
    const matchesCategory = selectedCategory === "TODOS" || event.categoria === selectedCategory;
    const matchesSearch =
      event.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.local.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">

          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Todos os <span className="text-gradient">Eventos</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore nossa coleção completa de eventos e encontre o perfeito para você
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar eventos por nome ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-base"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all"
              >
                {category.label}
              </Button>
            ))}
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <EventCard
                    title={event.nome}
                    date={event.data}
                    location={event.local}
                    price={`R$ ${event.preco}`}
                    image={event.imagemUrl || "/default-event.jpg"}
                    category={event.categoria}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                Nenhum evento encontrado para os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllEvents;
