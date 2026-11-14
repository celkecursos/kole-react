import { Avatar, Botao, CabecalhoPagina, Dica, Icone, type CorDica, type PosicaoDica, type SeveridadeBotao } from '../../../src';
import { Bloco, retrato } from '../Bloco';
import { useT } from '../../i18n/useT';

const DIRECOES: Array<{ posicao: PosicaoDica; rotulo: string }> = [
  { posicao: 'cima', rotulo: 'Dica em cima' },
  { posicao: 'direita', rotulo: 'Dica à direita' },
  { posicao: 'baixo', rotulo: 'Dica embaixo' },
  { posicao: 'esquerda', rotulo: 'Dica à esquerda' },
];

const CORES: Array<{ cor: CorDica; rotulo: string; posicao: PosicaoDica; botao: SeveridadeBotao; aparencia?: 'contorno' }> = [
  { cor: 'pri', rotulo: 'Primária', posicao: 'cima', botao: 'pri' },
  { cor: 'secundario', rotulo: 'Secundária', posicao: 'direita', botao: 'secundario' },
  { cor: 'warn', rotulo: 'Aviso', posicao: 'baixo', botao: 'warn' },
  { cor: 'info', rotulo: 'Info', posicao: 'esquerda', botao: 'info' },
  { cor: 'ok', rotulo: 'Sucesso', posicao: 'cima', botao: 'ok' },
  { cor: 'err', rotulo: 'Perigo', posicao: 'baixo', botao: 'err' },
  { cor: 'destaque', rotulo: 'Destaque', posicao: 'cima', botao: 'destaque' },
  { cor: 'claro', rotulo: 'Clara', posicao: 'cima', botao: 'secundario', aparencia: 'contorno' },
  { cor: 'padrao', rotulo: 'Padrão', posicao: 'cima', botao: 'escuro' },
];

export function PaginaDicas() {
  const { t } = useT();
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.dicas.titulo')} icone="message-square" trilha />

      <Bloco titulo={t('paginas.dicas.secoes.direcoes')} descricao={t('paginas.dicas.textos.passeOMouseOu')}>
        <div className="demo-linha">
          {DIRECOES.map((d) => (
            <Dica key={d.posicao} texto={d.rotulo} posicao={d.posicao}>
              <Botao rotulo={d.rotulo} formato="retangulo" />
            </Dica>
          ))}
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.dicas.secoes.cores')}>
        <div className="demo-linha">
          {CORES.map((c) => (
            <Dica key={c.cor} texto={t('paginas.dicas.textos.dicaValor', { valor: c.rotulo.toLowerCase() })} cor={c.cor} posicao={c.posicao}>
              <Botao rotulo={c.rotulo} severidade={c.botao} aparencia={c.aparencia} formato="retangulo" />
            </Dica>
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas-3">
        <Bloco titulo={t('paginas.dicas.secoes.emLinks')}>
          <p className="demo-dicas-texto">{t('paginas.dicas.textos.passeOMouseSobre')}<Dica texto={t('paginas.dicas.textos.abreAPoliticaDe')} cor="pri">
              <a href="#/ui/dicas" onClick={(e) => e.preventDefault()}>{t('paginas.dicas.textos.link')}</a>
            </Dica>{t('paginas.dicas.textos.paraVerADica')}</p>
        </Bloco>
        <Bloco titulo={t('paginas.dicas.secoes.emIcones')} descricao={t('paginas.dicas.textos.botoesSoComIcone')}>
          <div className="demo-linha demo-linha--centro">
            {(
              [
                ['house', 'Início', 'pri'],
                ['mail', 'Mensagens', 'secundario'],
                ['user-plus', 'Convidar pessoa', 'warn'],
                ['send', 'Enviar', 'info'],
                ['ellipsis', 'Mais opções', 'ok'],
              ] as const
            ).map(([icone, rotulo, cor]) => (
              <Dica key={icone} texto={rotulo} cor={cor}>
                <button type="button" className={`demo-dicas-icone demo-dicas-icone--${cor}`} aria-label={rotulo}>
                  <Icone icone={icone} />
                </button>
              </Dica>
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.dicas.secoes.elementoDesabilitado')} descricao={t('paginas.dicas.textos.aDicaAbreMesmo')}>
          <div>
            <Dica texto={t('paginas.dicas.textos.dicaDoBotaoDesabilitado')}>
              <Botao rotulo={t('paginas.dicas.textos.botaoDesabilitado')} formato="retangulo" disabled />
            </Dica>
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.dicas.secoes.emImagens')}>
          <div className="demo-linha demo-linha--centro">
            {(
              [
                ['Ana Pereira', '#1f5fe0', '2rem'],
                ['Bruno Lima', '#e8590c', '2.75rem'],
                ['Carla Dias', '#15803d', '3.5rem'],
              ] as const
            ).map(([nome, fundo, tamanho]) => (
              <Dica key={nome} texto={nome} cor="pri">
                <button type="button" className="demo-dicas-avatar" aria-label={nome}>
                  <Avatar nome={nome} foto={retrato(fundo, nome[0])} tamanho={tamanho} />
                </button>
              </Dica>
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.dicas.secoes.conteudoFormatado')} descricao={t('paginas.dicas.textos.oTextoPodeTer')}>
          <div>
            <Dica
              texto={
                <>
                  <strong>Atalho:</strong> Ctrl + S
                  <br />
                  <em>Salva sem sair da tela.</em>
                </>
              }
              posicao="direita"
            >
              <Botao rotulo={t('paginas.dicas.textos.salvar')} icone="save" aparencia="contorno" formato="retangulo" />
            </Dica>
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.dicas.secoes.peloProprioBotao')} descricao={<>O Botao aceita a prop dica (útil nos que têm só ícone).</>}>
          <div className="demo-linha">
            <Botao icone="pencil" dica={t('paginas.dicas.textos.editar')} aria-label={t('paginas.dicas.textos.editar')} aparencia="suave" formato="retangulo" />
            <Botao icone="copy" dica={t('paginas.dicas.textos.duplicar')} aria-label={t('paginas.dicas.textos.duplicar')} aparencia="suave" formato="retangulo" />
            <Botao icone="trash-2" dica={t('paginas.dicas.textos.excluir')} aria-label={t('paginas.dicas.textos.excluir')} severidade="err" aparencia="suave" formato="retangulo" />
          </div>
        </Bloco>
      </div>
    </div>
  );
}
