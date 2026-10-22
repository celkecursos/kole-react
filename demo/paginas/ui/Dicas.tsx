import { Avatar, Botao, CabecalhoPagina, Dica, Icone, type CorDica, type PosicaoDica, type SeveridadeBotao } from '../../../src';
import { Bloco, retrato } from '../Bloco';

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
  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Dicas" icone="message-square" trilha />

      <Bloco titulo="Direções" descricao="Passe o mouse ou foque com o teclado. Se não couber, a dica vira para o outro lado.">
        <div className="demo-linha">
          {DIRECOES.map((d) => (
            <Dica key={d.posicao} texto={d.rotulo} posicao={d.posicao}>
              <Botao rotulo={d.rotulo} formato="retangulo" />
            </Dica>
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Cores">
        <div className="demo-linha">
          {CORES.map((c) => (
            <Dica key={c.cor} texto={`Dica ${c.rotulo.toLowerCase()}`} cor={c.cor} posicao={c.posicao}>
              <Botao rotulo={c.rotulo} severidade={c.botao} aparencia={c.aparencia} formato="retangulo" />
            </Dica>
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas-3">
        <Bloco titulo="Em links">
          <p className="demo-dicas-texto">
            Passe o mouse sobre o{' '}
            <Dica texto="Abre a política de entregas" cor="pri">
              <a href="#/ui/dicas" onClick={(e) => e.preventDefault()}>
                link
              </a>
            </Dica>{' '}
            para ver a dica.
          </p>
        </Bloco>
        <Bloco titulo="Em ícones" descricao="Botões só com ícone: a dica explica a ação.">
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
        <Bloco titulo="Elemento desabilitado" descricao="A dica abre mesmo com o botão desabilitado, no mouse e no teclado.">
          <div>
            <Dica texto="Dica do botão desabilitado">
              <Botao rotulo="Botão desabilitado" formato="retangulo" disabled />
            </Dica>
          </div>
        </Bloco>

        <Bloco titulo="Em imagens">
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
        <Bloco titulo="Conteúdo formatado" descricao="O texto pode ter negrito, itálico, quebras.">
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
              <Botao rotulo="Salvar" icone="save" aparencia="contorno" formato="retangulo" />
            </Dica>
          </div>
        </Bloco>
        <Bloco titulo="Pelo próprio botão" descricao={<>O Botao aceita a prop dica (útil nos que têm só ícone).</>}>
          <div className="demo-linha">
            <Botao icone="pencil" dica="Editar" aria-label="Editar" aparencia="suave" formato="retangulo" />
            <Botao icone="copy" dica="Duplicar" aria-label="Duplicar" aparencia="suave" formato="retangulo" />
            <Botao icone="trash-2" dica="Excluir" aria-label="Excluir" severidade="err" aparencia="suave" formato="retangulo" />
          </div>
        </Bloco>
      </div>
    </div>
  );
}
