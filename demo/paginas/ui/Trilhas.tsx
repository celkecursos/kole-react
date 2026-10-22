import { Botao, CabecalhoPagina, Escolha, Trilha, type ItemTrilha, type ModeloTrilha } from '../../../src';
import { Bloco } from '../Bloco';

/** Modelos prontos — os mesmos que o seletor "Usar no sistema" aplica. */
export const MODELOS_TRILHA: { id: string; nome: string; modelo: ModeloTrilha; codigo: string }[] = [
  { id: 'padrao', nome: 'Padrão (›)', modelo: {}, codigo: '{}' },
  { id: 'barra', nome: 'Barra (/)', modelo: { separador: 'barra', icones: 'nenhum' }, codigo: "{ separador: 'barra', icones: 'nenhum' }" },
  { id: 'duplo', nome: 'Duplo (»)', modelo: { separador: 'duplo', icones: 'nenhum' }, codigo: "{ separador: 'duplo', icones: 'nenhum' }" },
  { id: 'til', nome: 'Til (~)', modelo: { separador: 'til', icones: 'nenhum' }, codigo: "{ separador: 'til', icones: 'nenhum' }" },
  { id: 'seta', nome: 'Seta (→)', modelo: { separador: 'seta', icones: 'nenhum' }, codigo: "{ separador: 'seta', icones: 'nenhum' }" },
  { id: 'icones', nome: 'Com ícones', modelo: { icones: 'todos' }, codigo: "{ icones: 'todos' }" },
  { id: 'fundo', nome: 'Com fundo', modelo: { aparencia: 'fundo' }, codigo: "{ aparencia: 'fundo' }" },
];

const INICIO: ItemTrilha = { rotulo: 'Início', rota: '/', icone: 'house' };
const PEDIDOS: ItemTrilha = { rotulo: 'Pedidos', rota: '/pedidos', icone: 'shopping-cart' };
const PEDIDO: ItemTrilha = { rotulo: 'PED-2026-0042', icone: 'file-text' };
const NIVEIS: ItemTrilha[][] = [[INICIO], [INICIO, PEDIDOS], [INICIO, PEDIDOS, PEDIDO]];

/** Os três níveis (1, 2 e 3 passos), num modelo — sem herdar o modelo do sistema. */
function Niveis({ separador = 'chevron', icones = 'inicio', aparencia = 'simples' }: ModeloTrilha) {
  return (
    <div className="demo-trilhas">
      {NIVEIS.map((itens) => (
        <Trilha key={itens.length} itens={itens} mostrarUnico separador={separador} icones={icones} aparencia={aparencia} />
      ))}
    </div>
  );
}

export function PaginaTrilhas({
  modeloAtual,
  aoMudarModelo,
  navegar,
}: {
  modeloAtual: string;
  aoMudarModelo: (id: string) => void;
  navegar: (r: string) => void;
}) {
  const escolhido = MODELOS_TRILHA.find((m) => m.id === modeloAtual) ?? MODELOS_TRILHA[0];

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Trilha de navegação" icone="list" trilha />

      <Bloco
        titulo="Usar no sistema"
        descricao="O modelo escolhido vale para as trilhas de todas as páginas (prop modeloTrilha da Estrutura). Abra Pedidos para ver aplicado."
      >
        <div className="demo-linha demo-linha--centro">
          <Escolha rotulo="Modelo" opcoes={MODELOS_TRILHA.map((m) => ({ valor: m.id, rotulo: m.nome }))} valor={escolhido.id} aoMudar={aoMudarModelo} />
          <Botao rotulo="Ver em Pedidos" icone="arrow-right" posicaoIcone="direita" severidade="secundario" onClick={() => navegar('/pedidos')} />
        </div>
        <code className="demo-util-res">{`<Estrutura modeloTrilha={${escolhido.codigo}} … />`}</code>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Padrão" descricao="Separador ›, ícone só no Início.">
          <Niveis />
        </Bloco>
        <Bloco titulo="Barra">
          <Niveis separador="barra" icones="nenhum" />
        </Bloco>
        <Bloco titulo="Duplo">
          <Niveis separador="duplo" icones="nenhum" />
        </Bloco>
        <Bloco titulo="Til">
          <Niveis separador="til" icones="nenhum" />
        </Bloco>
        <Bloco titulo="Seta">
          <Niveis separador="seta" icones="nenhum" />
        </Bloco>
        <Bloco titulo="Com ícones" descricao={'icones="todos": cada passo mostra o ícone do item do menu.'}>
          <Niveis icones="todos" />
        </Bloco>
        <Bloco titulo="Com fundo">
          <Niveis aparencia="fundo" />
        </Bloco>
        <Bloco titulo="Personalizado" descricao="O separador aceita qualquer conteúdo (aqui, “|”).">
          <Niveis separador="|" icones="nenhum" aparencia="fundo" />
        </Bloco>
      </div>
    </div>
  );
}
