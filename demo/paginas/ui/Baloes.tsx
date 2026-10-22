import { Avatar, Balao, Botao, CabecalhoPagina, Icone, useToast, type CorBalao, type PosicaoBalao, type SeveridadeBotao } from '../../../src';
import { Bloco, retrato } from '../Bloco';

const DIRECOES: Array<{ posicao: PosicaoBalao; rotulo: string }> = [
  { posicao: 'cima', rotulo: 'Em cima' },
  { posicao: 'direita', rotulo: 'À direita' },
  { posicao: 'baixo', rotulo: 'Embaixo' },
  { posicao: 'esquerda', rotulo: 'À esquerda' },
];

/** Cor do balão + a severidade do botão que o abre (mesmos nomes, menos `pri`/`escuro`). */
const CORES: Array<{ cor: CorBalao; rotulo: string; posicao: PosicaoBalao }> = [
  { cor: 'pri', rotulo: 'Primário', posicao: 'cima' },
  { cor: 'secundario', rotulo: 'Secundário', posicao: 'direita' },
  { cor: 'info', rotulo: 'Info', posicao: 'baixo' },
  { cor: 'warn', rotulo: 'Aviso', posicao: 'esquerda' },
  { cor: 'ok', rotulo: 'Sucesso', posicao: 'cima' },
  { cor: 'err', rotulo: 'Perigo', posicao: 'direita' },
  { cor: 'destaque', rotulo: 'Destaque', posicao: 'baixo' },
  { cor: 'escuro', rotulo: 'Escuro', posicao: 'cima' },
];

const NOME_COR: Record<CorBalao, string> = {
  pri: 'primária',
  secundario: 'secundária',
  info: 'informativa',
  warn: 'de aviso',
  ok: 'de sucesso',
  err: 'de perigo',
  destaque: 'de destaque',
  escuro: 'escura',
};

export function PaginaBaloes() {
  const toast = useToast();

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Balões" icone="message-square" trilha />

      <div className="demo-colunas">
        <Bloco titulo="Padrão" descricao="Clique para abrir; clique fora ou Esc para fechar.">
          <div className="demo-linha">
            {DIRECOES.map((d) => (
              <Balao key={d.posicao} posicao={d.posicao} titulo={`Balão ${d.rotulo.toLowerCase()}`} conteudo="E aqui um conteúdo interessante. Bem envolvente, não é?">
                <Botao rotulo={d.rotulo} formato="retangulo" />
              </Balao>
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Cabeçalho colorido" descricao="Só o título ganha a cor.">
          <div className="demo-linha">
            {CORES.map((c) => (
              <Balao key={c.cor} cor={c.cor} aparencia="cabecalho" posicao={c.posicao} titulo="Cabeçalho colorido" conteudo={`Balão com cabeçalho na cor ${NOME_COR[c.cor]}.`}>
                <Botao rotulo={c.rotulo} severidade={c.cor as SeveridadeBotao} aparencia="contorno" formato="retangulo" />
              </Balao>
            ))}
          </div>
        </Bloco>
      </div>

      <Bloco titulo="Balões coloridos" descricao="O balão todo na cor.">
        <div className="demo-linha">
          {CORES.map((c) => (
            <Balao key={c.cor} cor={c.cor} aparencia="solido" posicao={c.posicao} titulo="Fundo colorido" conteudo={`Balão com fundo na cor ${NOME_COR[c.cor]}.`}>
              <Botao rotulo={c.rotulo} severidade={c.cor as SeveridadeBotao} formato="retangulo" />
            </Balao>
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Balões suaves" descricao="Fundo claro da cor.">
        <div className="demo-linha">
          {CORES.map((c) => (
            <Balao key={c.cor} cor={c.cor} aparencia="suave" posicao={c.posicao} titulo="Fundo claro" conteudo={`Balão com fundo claro na cor ${NOME_COR[c.cor]}.`}>
              <Botao rotulo={c.rotulo} severidade={c.cor as SeveridadeBotao} aparencia="suave" formato="retangulo" />
            </Balao>
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo="Fecha no próximo clique" descricao="Qualquer clique, até no próprio balão, fecha.">
          <div className="demo-linha">
            {DIRECOES.map((d, i) => (
              <Balao key={d.posicao} gatilho="foco" posicao={d.posicao} titulo="Balão descartável" conteudo="E aqui um conteúdo interessante. Bem envolvente, não é?">
                <Botao rotulo={d.rotulo} severidade={(['pri', 'secundario', 'info', 'warn'] as const)[i]} formato="retangulo" />
              </Balao>
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Botão desabilitado" descricao="Abre ao passar o mouse ou com o foco do teclado, mesmo com o botão desabilitado.">
          <div className="demo-linha">
            {(['cima', 'direita', 'baixo'] as const).map((p) => (
              <Balao key={p} gatilho="passar" posicao={p} conteudo="Esta ação está desabilitada no momento.">
                <Botao rotulo="Botão desabilitado" formato="retangulo" disabled />
              </Balao>
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Ícones" descricao="Ao passar o mouse.">
          <div className="demo-linha demo-linha--centro">
            {(
              [
                ['secundario', 'esquerda', 'info', 'Informações'],
                ['info', 'cima', 'circle-question-mark', 'Ajuda'],
                ['warn', 'baixo', 'triangle-alert', 'Atenção'],
                ['ok', 'direita', 'circle-check', 'Tudo certo'],
              ] as const
            ).map(([cor, posicao, icone, rotulo]) => (
              <Balao key={icone} gatilho="passar" cor={cor} aparencia="solido" posicao={posicao} conteudo="Este balão explica o que este ícone quer dizer.">
                <button type="button" className={`demo-balao-icone demo-balao-icone--${cor}`} aria-label={rotulo}>
                  <Icone icone={icone} />
                </button>
              </Balao>
            ))}
          </div>
        </Bloco>
        <Bloco titulo="Avatares" descricao="Clique na pessoa para ver os dados.">
          <div className="demo-linha demo-linha--centro">
            {(
              [
                ['Ana Pereira', '#1f5fe0', 'pri', 'cima', 'Gerente comercial'],
                ['Bruno Lima', '#e8590c', 'destaque', 'direita', 'Vendedor'],
                ['Carla Dias', '#15803d', 'ok', 'baixo', 'Financeiro'],
              ] as const
            ).map(([nome, fundo, cor, posicao, cargo]) => (
              <Balao key={nome} cor={cor} aparencia="cabecalho" posicao={posicao} titulo={nome} conteudo={cargo}>
                <button type="button" className="demo-balao-avatar" aria-label={nome}>
                  <Avatar nome={nome} foto={retrato(fundo, nome[0])} tamanho="2.5rem" />
                </button>
              </Balao>
            ))}
          </div>
        </Bloco>
      </div>

      <Bloco titulo="Conteúdo livre" descricao="O conteúdo pode ter texto formatado e ações.">
        <div className="demo-linha">
          <Balao
            titulo="Pedido PED-2026-0042"
            posicao="direita"
            largura="19rem"
            conteudo={
              <div className="demo-balao-rico">
                <p>
                  Mercado Bom Preço · <strong>R$ 1.239,90</strong>
                </p>
                <p>Entrega prevista para amanhã, das 8h às 12h.</p>
                <div className="demo-linha">
                  <Botao rotulo="Ver pedido" tamanho="pequeno" formato="retangulo" onClick={() => toast.info('Ver pedido', 'PED-2026-0042')} />
                  <Botao rotulo="Copiar código" tamanho="pequeno" aparencia="contorno" formato="retangulo" onClick={() => toast.ok('Copiado', 'PED-2026-0042')} />
                </div>
              </div>
            }
          >
            <Botao rotulo="Resumo do pedido" icone="package" aparencia="contorno" formato="retangulo" />
          </Balao>
        </div>
      </Bloco>
    </div>
  );
}
