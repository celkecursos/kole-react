import { GrupoAvatares } from '../../../../src';

const EQUIPE = [{ nome: 'Ana Souza' }, { nome: 'Bruno Lima' }, { nome: 'Carla Mendes' }, { nome: 'Diego Rocha' }, { nome: 'Elisa Prado' }];

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <GrupoAvatares pessoas={EQUIPE} />
      <GrupoAvatares pessoas={EQUIPE} max={4} tamanho="2.25rem" rotulo="Membros" />
      <GrupoAvatares pessoas={EQUIPE.slice(0, 2)} tamanho="1.5rem" />
    </div>
  );
}
