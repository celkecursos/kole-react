import { useState, type ReactNode } from 'react';
import { Avatar, Badge, Botao, CabecalhoPagina, Chip, ComBadge, Icone, Placa, Status, type BadgeProps, type CorBadge } from '../../../src';
import { Bloco, retrato } from '../Bloco';

const CORES: { cor: CorBadge; nome: string }[] = [
  { cor: 'pri', nome: 'Principal' },
  { cor: 'destaque', nome: 'Destaque' },
  { cor: 'ok', nome: 'Sucesso' },
  { cor: 'err', nome: 'Erro' },
  { cor: 'warn', nome: 'Atenção' },
  { cor: 'info', nome: 'Info' },
  { cor: 'neutral', nome: 'Neutro' },
];

/** Uma linha com o badge em todas as cores. */
function Todas(props: Omit<BadgeProps, 'cor' | 'rotulo'>) {
  return (
    <div className="demo-linha demo-linha--centro">
      {CORES.map((c) => (
        <Badge key={c.cor} cor={c.cor} rotulo={c.nome} {...props} />
      ))}
    </div>
  );
}

const TITULOS: [string, ReactNode][] = [
  ['h1', <h1 key="1">Título de exemplo <Badge tamanho="herdar" rotulo="Novo" /></h1>],
  ['h2', <h2 key="2">Título de exemplo <Badge tamanho="herdar" rotulo="Novo" /></h2>],
  ['h3', <h3 key="3">Título de exemplo <Badge tamanho="herdar" rotulo="Novo" /></h3>],
  ['h4', <h4 key="4">Título de exemplo <Badge tamanho="herdar" rotulo="Novo" /></h4>],
  ['h5', <h5 key="5">Título de exemplo <Badge tamanho="herdar" rotulo="Novo" /></h5>],
  ['h6', <h6 key="6">Título de exemplo <Badge tamanho="herdar" rotulo="Novo" /></h6>],
];

const CHIPS = ['Pix', 'PR', 'Pago'];

export function PaginaBadges() {
  const [chips, setChips] = useState(CHIPS);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Badges" icone="tag" trilha />

      <div className="demo-colunas">
        <Bloco titulo="Padrão">
          <Todas />
        </Bloco>
        <Bloco titulo="Pílula">
          <Todas formato="pilula" />
        </Bloco>
        <Bloco titulo="Suaves">
          <Todas aparencia="suave" />
        </Bloco>
        <Bloco titulo="Suaves em pílula">
          <Todas aparencia="suave" formato="pilula" />
        </Bloco>
        <Bloco titulo="Contorno">
          <Todas aparencia="contorno" />
        </Bloco>
        <Bloco titulo="Contorno em pílula">
          <Todas aparencia="contorno" formato="pilula" />
        </Bloco>
        <Bloco titulo="Gradiente">
          <Todas aparencia="gradiente" />
        </Bloco>
        <Bloco titulo="Gradiente em pílula">
          <Todas aparencia="gradiente" formato="pilula" />
        </Bloco>
      </div>

      <Bloco titulo="Botões com badges" descricao="Badge inverso (fundo claro, texto na cor do botão) dentro de um botão sólido.">
        <div className="demo-linha">
          <Botao severidade="err">
            Notificações <Badge cor="err" aparencia="inverso" rotulo="777" />
          </Botao>
          <Botao>
            Notificações <Badge cor="pri" aparencia="inverso" rotulo="4" />
          </Botao>
          <Botao severidade="ok">
            Notificações <Badge cor="ok" aparencia="inverso" rotulo="12" />
          </Botao>
          <Botao severidade="warn">
            Notificações <Badge cor="warn" aparencia="inverso" rotulo="7" />
          </Botao>
          <Botao severidade="secundario">
            Notificações <Badge cor="neutral" rotulo="32" />
          </Botao>
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Botões com badges coloridos">
          <div className="demo-linha">
            <Botao>
              Pedidos <Badge cor="destaque" rotulo="4" />
            </Botao>
            <Botao severidade="ok">
              Pagos <Badge cor="pri" rotulo="7" />
            </Botao>
            <Botao severidade="err">
              Cancelados <Badge cor="warn" rotulo="12" />
            </Botao>
            <Botao severidade="secundario">
              Rascunhos <Badge cor="info" rotulo="32" />
            </Botao>
          </div>
        </Bloco>

        <Bloco titulo="Botões de contorno com badges">
          <div className="demo-linha">
            <Botao aparencia="contorno">
              Pedidos <Badge cor="pri" rotulo="4" />
            </Botao>
            <Botao aparencia="contorno" severidade="err">
              Cancelados <Badge cor="err" rotulo="7" />
            </Botao>
            <Botao aparencia="contorno" severidade="ok">
              Pagos <Badge cor="ok" rotulo="12" />
            </Botao>
            <Botao aparencia="contorno" severidade="secundario">
              Rascunhos <Badge cor="neutral" aparencia="suave" rotulo="32" />
            </Botao>
          </div>
        </Bloco>

        <Bloco titulo="Em títulos" descricao={'tamanho="herdar" acompanha o tamanho do texto.'}>
          <div className="demo-badges-titulos">{TITULOS.map(([, t]) => t)}</div>
        </Bloco>

        <div className="demo-pilha">
          <Bloco titulo="Posicionados" descricao="ComBadge põe o ponto ou a contagem no canto de outro elemento.">
            <div className="demo-linha demo-linha--centro demo-badges-pos">
              <ComBadge ponto cor="ok" descricao="Online">
                <Avatar nome="Ana Pereira" foto={retrato('#1f5fe0', 'A')} formato="quadrado" tamanho="2.5rem" />
              </ComBadge>
              <ComBadge ponto cor="ok" posicao="inferior-direita" descricao="Online">
                <Avatar nome="Bruno Lima" foto={retrato('#f7931e', 'B')} tamanho="2.5rem" />
              </ComBadge>
              <ComBadge conteudo={1240} max={999} cor="destaque" descricao="novos alertas">
                <Avatar nome="Carla Dias" foto={retrato('#15803d', 'C')} tamanho="2.5rem" />
              </ComBadge>
              <ComBadge ponto cor="ok" descricao="Online">
                <Botao rotulo="Perfil" severidade="secundario" />
              </ComBadge>
              <ComBadge conteudo={128} descricao="mensagens não lidas">
                <Botao rotulo="Caixa de entrada" aparencia="contorno" />
              </ComBadge>
            </div>
          </Bloco>

          <Bloco titulo="Personalizados">
            <div className="demo-linha demo-linha--centro demo-badges-pos">
              <Badge cor="info" aparencia="contorno" tamanho="medio" icone="house" rotulo="Início" />
              <Badge cor="ok" tamanho="medio" icone="house" rotulo="Início" />
              <ComBadge conteudo={14} cor="ok" descricao="notificações">
                <span className="demo-badge-sino">
                  <Icone icone="bell" />
                </span>
              </ComBadge>
              <Badge cor="neutral" aparencia="suave" tamanho="medio" icone="eye" rotulo="13,2 mil" />
              <ComBadge conteudo={32} cor="ok" descricao="mensagens">
                <span className="demo-badge-texto">Caixa de entrada</span>
              </ComBadge>
            </div>
          </Bloco>
        </div>
      </div>

      <div className="demo-colunas">
        <Bloco titulo="Status" descricao="Situação de um registro: cor e texto, com ícone opcional.">
          <div className="demo-linha demo-linha--centro">
            <Status rotulo="Entregue" severidade="ok" />
            <Status rotulo="Pago" severidade="info" icone="clock" />
            <Status rotulo="Aguardando pagamento" severidade="warn" />
            <Status rotulo="Cancelado" severidade="err" />
            <Status rotulo="Enviado" />
          </div>
        </Bloco>
        <Bloco titulo="Chips de filtro" descricao="Filtros aplicados; o × remove.">
          <div className="demo-linha demo-linha--centro">
            {chips.map((c) => (
              <Chip key={c} campo="Filtro" rotulo={c} aoRemover={() => setChips((l) => l.filter((x) => x !== c))} />
            ))}
            {chips.length === 0 && <Botao rotulo="Restaurar filtros" severidade="secundario" aparencia="texto" onClick={() => setChips(CHIPS)} />}
          </div>
        </Bloco>
        <Bloco titulo="Placa de veículo" descricao="Padrão antigo ou Mercosul, com a UF.">
          <div className="demo-linha demo-linha--centro">
            <Placa numero="QBX-7H42" uf="PR" />
            <Placa numero="rta2b19" uf="go" />
            <Placa numero="NJU-4021" uf="SP" />
          </div>
        </Bloco>
      </div>
    </div>
  );
}
