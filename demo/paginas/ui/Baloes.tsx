import { Avatar, Balao, Botao, CabecalhoPagina, Icone, useToast, type CorBalao, type PosicaoBalao, type SeveridadeBotao } from '../../../src';
import { Bloco, retrato } from '../Bloco';
import { useT } from '../../i18n/useT';

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
  const { t } = useT();
  const toast = useToast();

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.baloes.titulo')} icone="message-square" trilha />

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.baloes.secoes.padrao')} descricao={t('paginas.baloes.textos.cliqueParaAbrirClique')}>
          <div className="demo-linha">
            {DIRECOES.map((d) => (
              <Balao key={d.posicao} posicao={d.posicao} titulo={t('paginas.baloes.textos.balaoValor', { valor: d.rotulo.toLowerCase() })} conteudo={t('paginas.baloes.textos.eAquiUmConteudo')}>
                <Botao rotulo={d.rotulo} formato="retangulo" />
              </Balao>
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.baloes.secoes.cabecalhoColorido')} descricao={t('paginas.baloes.textos.soOTituloGanha')}>
          <div className="demo-linha">
            {CORES.map((c) => (
              <Balao key={c.cor} cor={c.cor} aparencia="cabecalho" posicao={c.posicao} titulo={t('paginas.baloes.textos.cabecalhoColorido')} conteudo={t('paginas.baloes.textos.balaoComCabecalhoNa', { v: NOME_COR[c.cor] })}>
                <Botao rotulo={c.rotulo} severidade={c.cor as SeveridadeBotao} aparencia="contorno" formato="retangulo" />
              </Balao>
            ))}
          </div>
        </Bloco>
      </div>

      <Bloco titulo={t('paginas.baloes.secoes.baloesColoridos')} descricao={t('paginas.baloes.textos.oBalaoTodoNa')}>
        <div className="demo-linha">
          {CORES.map((c) => (
            <Balao key={c.cor} cor={c.cor} aparencia="solido" posicao={c.posicao} titulo={t('paginas.baloes.textos.fundoColorido')} conteudo={t('paginas.baloes.textos.balaoComFundoNa', { v: NOME_COR[c.cor] })}>
              <Botao rotulo={c.rotulo} severidade={c.cor as SeveridadeBotao} formato="retangulo" />
            </Balao>
          ))}
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.baloes.secoes.baloesSuaves')} descricao={t('paginas.baloes.textos.fundoClaroDaCor')}>
        <div className="demo-linha">
          {CORES.map((c) => (
            <Balao key={c.cor} cor={c.cor} aparencia="suave" posicao={c.posicao} titulo={t('paginas.baloes.textos.fundoClaro')} conteudo={t('paginas.baloes.textos.balaoComFundoClaro', { v: NOME_COR[c.cor] })}>
              <Botao rotulo={c.rotulo} severidade={c.cor as SeveridadeBotao} aparencia="suave" formato="retangulo" />
            </Balao>
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.baloes.secoes.fechaNoProximoClique')} descricao={t('paginas.baloes.textos.qualquerCliqueAteNo')}>
          <div className="demo-linha">
            {DIRECOES.map((d, i) => (
              <Balao key={d.posicao} gatilho="foco" posicao={d.posicao} titulo={t('paginas.baloes.textos.balaoDescartavel')} conteudo={t('paginas.baloes.textos.eAquiUmConteudo')}>
                <Botao rotulo={d.rotulo} severidade={(['pri', 'secundario', 'info', 'warn'] as const)[i]} formato="retangulo" />
              </Balao>
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.baloes.secoes.botaoDesabilitado')} descricao={t('paginas.baloes.textos.abreAoPassarO')}>
          <div className="demo-linha">
            {(['cima', 'direita', 'baixo'] as const).map((p) => (
              <Balao key={p} gatilho="passar" posicao={p} conteudo={t('paginas.baloes.textos.estaAcaoEstaDesabilitada')}>
                <Botao rotulo={t('paginas.baloes.textos.botaoDesabilitado')} formato="retangulo" disabled />
              </Balao>
            ))}
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.baloes.secoes.icones')} descricao={t('paginas.baloes.textos.aoPassarOMouse')}>
          <div className="demo-linha demo-linha--centro">
            {(
              [
                ['secundario', 'esquerda', 'info', 'Informações'],
                ['info', 'cima', 'circle-question-mark', 'Ajuda'],
                ['warn', 'baixo', 'triangle-alert', 'Atenção'],
                ['ok', 'direita', 'circle-check', 'Tudo certo'],
              ] as const
            ).map(([cor, posicao, icone, rotulo]) => (
              <Balao key={icone} gatilho="passar" cor={cor} aparencia="solido" posicao={posicao} conteudo={t('paginas.baloes.textos.esteBalaoExplicaO')}>
                <button type="button" className={`demo-balao-icone demo-balao-icone--${cor}`} aria-label={rotulo}>
                  <Icone icone={icone} />
                </button>
              </Balao>
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.baloes.secoes.avatares')} descricao={t('paginas.baloes.textos.cliqueNaPessoaPara')}>
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

      <Bloco titulo={t('paginas.baloes.secoes.conteudoLivre')} descricao={t('paginas.baloes.textos.oConteudoPodeTer')}>
        <div className="demo-linha">
          <Balao
            titulo={t('paginas.baloes.textos.pedidoPed20260042')}
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
            <Botao rotulo={t('paginas.baloes.textos.resumoDoPedido')} icone="package" aparencia="contorno" formato="retangulo" />
          </Balao>
        </div>
      </Bloco>
    </div>
  );
}
