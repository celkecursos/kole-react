import { useState } from 'react';
import { Calendario, type EventoCalendario } from '../../../../src';
import { eventosExemplo } from './eventos';

export default function Exemplo() {
  const [eventos, setEventos] = useState(eventosExemplo);
  return (
    <Calendario
      rotulo="Agenda editável"
      eventos={eventos}
      visaoInicial="semana"
      // arrastar para outro dia ou horário, ou esticar pela borda de baixo
      aoAlterarEvento={(evento: EventoCalendario, { inicio, fim }) =>
        setEventos((lista) => lista.map((e) => (e.id === evento.id ? { ...e, inicio, fim } : e)))
      }
    />
  );
}
