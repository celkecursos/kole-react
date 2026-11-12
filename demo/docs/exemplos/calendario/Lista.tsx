import { Calendario } from '../../../../src';
import { eventosExemplo } from './eventos';

export default function Exemplo() {
  return (
    <Calendario
      rotulo="Agenda"
      eventos={eventosExemplo()}
      visaoInicial="lista"
      aoClicarEvento={(evento) => console.log('abrir', evento.titulo)}
      aoClicarDia={(dia) => console.log('novo evento em', dia)}
    />
  );
}
