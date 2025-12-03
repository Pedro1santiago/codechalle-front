import { useEffect, useState } from "react";
import { getAllEvents } from "../api/codechellaApi";
import { useAuth } from "@/context/AuthContext";
import { EventCard } from "./EventCard";
import { formatarPreco } from "@/lib/utils";

export default function EventList() {
  const [eventos, setEventos] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getAllEvents(user?.token);
        if (!cancelled) setEventos(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setEventos([]);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user?.token]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {eventos.map((ev: any) => (
        <EventCard
          key={ev.id}
          title={ev.nome}
          date={ev.data}
          location={ev.local}
          price={`R$ ${formatarPreco(ev.preco ?? ev.valor)}`}
          image={ev.imagemUrl || ev.imagem}
          category={ev.categoria || ev.tipo}
          id={ev.id}
          ingressosDisponiveis={ev.ingressosDisponiveis}
        />
      ))}
    </div>
  );
}
