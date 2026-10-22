import { useState } from 'react';
import {
  Balao,
  Botao,
  BotaoFechar,
  CabecalhoPagina,
  CampoTextarea,
  CampoTexto,
  Dialogo,
  Dica,
  useToast,
  type AnimacaoDialogo,
  type DialogoProps,
} from '../../../src';
import { Bloco } from '../Bloco';

const PARAGRAFO =
  'Este é um texto de exemplo para o diálogo. Ele existe só para ocupar espaço e mostrar como o conteúdo se comporta: quebra de linha, espaçamento e rolagem quando passa da altura da tela.';

const ANIMACOES: Array<[AnimacaoDialogo, string]> = [
  ['escala', 'Escala'],
  ['deslizar-direita', 'Deslizar da direita'],
  ['deslizar-baixo', 'Deslizar de baixo'],
  ['jornal', 'Jornal'],
  ['queda', 'Queda'],
  ['girar-horizontal', 'Girar na horizontal'],
  ['girar-vertical', 'Girar na vertical'],
  ['super-escala', 'Super escala'],
  ['placa', 'Placa'],
  ['girar-baixo', 'Girar de baixo'],
  ['girar-esquerda', 'Girar da esquerda'],
];

const TELA_CHEIA: Array<[DialogoProps['telaCheiaAbaixo'] | 'sempre', string]> = [
  ['sempre', 'Tela cheia'],
  ['sm', 'Tela cheia abaixo de sm'],
  ['md', 'Tela cheia abaixo de md'],
  ['lg', 'Tela cheia abaixo de lg'],
  ['xl', 'Tela cheia abaixo de xl'],
  ['xxl', 'Tela cheia abaixo de xxl'],
];

export function PaginaModais() {
  const toast = useToast();
  // um diálogo aberto por vez, identificado por uma chave
  const [aberto, setAberto] = useState<string | null>(null);
  const [destinatario, setDestinatario] = useState('');
  const abrir = (chave: string) => () => setAberto(chave);
  const fechar = () => setAberto(null);
  const rodapePadrao = (
    <>
      <Botao rotulo="Fechar" severidade="secundario" formato="retangulo" onClick={fechar} />
      <Botao
        rotulo="Salvar alterações"
        formato="retangulo"
        onClick={() => {
          fechar();
          toast.ok('Alterações salvas');
        }}
      />
    </>
  );
  const texto = (n: number) => Array.from({ length: n }, (_, i) => <p key={i}>{PARAGRAFO}</p>);
  const props = (chave: string): Pick<DialogoProps, 'aberto' | 'aoFechar'> => ({ aberto: aberto === chave, aoFechar: fechar });

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Modais e fechar" icone="app-window" trilha />

      <div className="demo-colunas-3">
        <Bloco titulo="Básico">
          <div>
            <Botao rotulo="Abrir diálogo" formato="retangulo" onClick={abrir('basico')} />
          </div>
        </Bloco>
        <Bloco titulo="Fundo estático" descricao="Não fecha com clique fora nem com Esc.">
          <div>
            <Botao rotulo="Abrir com fundo estático" formato="retangulo" onClick={abrir('estatico')} />
          </div>
        </Bloco>
        <Bloco titulo="Conteúdo longo" descricao="O diálogo cresce e a página rola.">
          <div>
            <Botao rotulo="Abrir conteúdo longo" formato="retangulo" onClick={abrir('longo')} />
          </div>
        </Bloco>

        <Bloco titulo="No topo" descricao="Por padrão o diálogo fica centralizado.">
          <div className="demo-linha">
            <Botao rotulo="Centralizado" formato="retangulo" onClick={abrir('centro')} />
            <Botao rotulo="No topo" aparencia="contorno" formato="retangulo" onClick={abrir('topo')} />
          </div>
        </Bloco>
        <Bloco titulo="Rolagem no corpo" descricao="Cabeçalho e rodapé fixos; só o miolo rola.">
          <div>
            <Botao rotulo="Abrir com rolagem no corpo" formato="retangulo" onClick={abrir('corpo')} />
          </div>
        </Bloco>
        <Bloco titulo="Dicas e balões" descricao="Funcionam dentro do diálogo.">
          <div>
            <Botao rotulo="Abrir diálogo" formato="retangulo" onClick={abrir('dicas')} />
          </div>
        </Bloco>

        <Bloco titulo="Usando a grade">
          <div>
            <Botao rotulo="Abrir diálogo" formato="retangulo" onClick={abrir('grade')} />
          </div>
        </Bloco>
        <Bloco titulo="Alternar entre diálogos" descricao="Um diálogo abre o outro.">
          <div>
            <Botao rotulo="Abrir o primeiro" formato="retangulo" onClick={abrir('primeiro')} />
          </div>
        </Bloco>
        <Bloco titulo="Tamanhos">
          <div className="demo-linha">
            <Botao rotulo="Extragrande" formato="retangulo" onClick={abrir('xg')} />
            <Botao rotulo="Grande" formato="retangulo" onClick={abrir('g')} />
            <Botao rotulo="Pequeno" formato="retangulo" onClick={abrir('p')} />
          </div>
        </Bloco>
      </div>

      <Bloco titulo="Tela cheia" descricao="Sempre, ou só abaixo de uma largura de tela.">
        <div className="demo-linha">
          {TELA_CHEIA.map(([chave, rotulo]) => (
            <Botao key={chave} rotulo={rotulo} formato="retangulo" onClick={abrir(`cheia-${chave}`)} />
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Conteúdo variável" descricao="O mesmo diálogo, preenchido conforme o botão.">
        <div className="demo-linha">
          {['@ana', '@bruno', '@celke'].map((d, i) => (
            <Botao
              key={d}
              rotulo={`Mensagem para ${d}`}
              severidade={(['pri', 'destaque', 'secundario'] as const)[i]}
              aparencia="contorno"
              formato="retangulo"
              onClick={() => {
                setDestinatario(d);
                setAberto('mensagem');
              }}
            />
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Efeitos de entrada" descricao={<>animacao no Dialogo; desligados para quem prefere menos movimento.</>}>
        <div className="demo-modais-efeitos">
          {ANIMACOES.map(([chave, rotulo]) => (
            <Botao key={chave} rotulo={rotulo} aparencia="contorno" formato="retangulo" bloco onClick={abrir(`anim-${chave}`)} />
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas-3">
        <Bloco titulo="Botão de fechar">
          <div>
            <BotaoFechar />
          </div>
        </Bloco>
        <Bloco titulo="Desabilitado">
          <div>
            <BotaoFechar disabled />
          </div>
        </Bloco>
        <Bloco titulo="Variante clara" descricao="Para fundos escuros.">
          <div className="demo-modais-escuro">
            <BotaoFechar variante="claro" />
            <BotaoFechar variante="claro" disabled />
          </div>
        </Bloco>
      </div>

      {/* ---- os diálogos ---- */}
      <Dialogo {...props('basico')} titulo="Título do diálogo" rodape={rodapePadrao}>
        <p className="demo-modais-texto">{PARAGRAFO}</p>
      </Dialogo>
      <Dialogo {...props('estatico')} titulo="Fundo estático" dispensavel={false} rodape={rodapePadrao}>
        <p className="demo-modais-texto">Clique fora ou aperte Esc: este diálogo não fecha. Use os botões.</p>
      </Dialogo>
      <Dialogo {...props('longo')} titulo="Conteúdo longo" rolagem="pagina" rodape={rodapePadrao}>
        <div className="demo-modais-texto">{texto(14)}</div>
      </Dialogo>
      <Dialogo {...props('centro')} titulo="Centralizado" rodape={rodapePadrao}>
        <p className="demo-modais-texto">Este diálogo fica no meio da tela.</p>
      </Dialogo>
      <Dialogo {...props('topo')} titulo="No topo" posicao="topo" rodape={rodapePadrao}>
        <p className="demo-modais-texto">Este diálogo fica perto do topo da tela.</p>
      </Dialogo>
      <Dialogo {...props('corpo')} titulo="Rolagem no corpo" rodape={rodapePadrao}>
        <div className="demo-modais-texto">{texto(14)}</div>
      </Dialogo>
      <Dialogo {...props('dicas')} titulo="Dicas e balões" rodape={rodapePadrao}>
        <div className="demo-modais-texto">
          <p>
            Este{' '}
            <Balao titulo="Título do balão" conteudo="O conteúdo do balão fica aqui." posicao="direita">
              <Botao rotulo="botão" tamanho="pequeno" aparencia="suave" formato="retangulo" />
            </Balao>{' '}
            abre um balão ao clicar.
          </p>
          <p>
            <Dica texto="Dica">
              <a href="#/avancado/modais" onClick={(e) => e.preventDefault()}>
                Este link
              </a>
            </Dica>{' '}
            e{' '}
            <Dica texto="Outra dica">
              <a href="#/avancado/modais" onClick={(e) => e.preventDefault()}>
                este outro
              </a>
            </Dica>{' '}
            mostram dicas ao passar o mouse.
          </p>
        </div>
      </Dialogo>
      <Dialogo {...props('grade')} titulo="Usando a grade" tamanho="grande" rodape={rodapePadrao}>
        <div className="demo-modais-grade">
          <div className="demo-modais-cel demo-modais-cel--6">.col-6</div>
          <div className="demo-modais-cel demo-modais-cel--6">.col-6</div>
          <div className="demo-modais-cel demo-modais-cel--4">.col-4</div>
          <div className="demo-modais-cel demo-modais-cel--4">.col-4</div>
          <div className="demo-modais-cel demo-modais-cel--4">.col-4</div>
          <div className="demo-modais-cel demo-modais-cel--3">.col-3</div>
          <div className="demo-modais-cel demo-modais-cel--9">.col-9</div>
        </div>
      </Dialogo>
      <Dialogo
        {...props('primeiro')}
        titulo="Primeiro diálogo"
        rodape={<Botao rotulo="Abrir o segundo" formato="retangulo" onClick={abrir('segundo')} />}
      >
        <p className="demo-modais-texto">Mostre um segundo diálogo e esconda este com o botão abaixo.</p>
      </Dialogo>
      <Dialogo
        {...props('segundo')}
        titulo="Segundo diálogo"
        rodape={<Botao rotulo="Voltar ao primeiro" formato="retangulo" onClick={abrir('primeiro')} />}
      >
        <p className="demo-modais-texto">Esconda este diálogo e mostre o primeiro com o botão abaixo.</p>
      </Dialogo>
      <Dialogo {...props('xg')} titulo="Diálogo extragrande" tamanho="extragrande">
        <p className="demo-modais-texto">{PARAGRAFO}</p>
      </Dialogo>
      <Dialogo {...props('g')} titulo="Diálogo grande" tamanho="grande">
        <p className="demo-modais-texto">{PARAGRAFO}</p>
      </Dialogo>
      <Dialogo {...props('p')} titulo="Diálogo pequeno" tamanho="pequeno">
        <p className="demo-modais-texto">{PARAGRAFO}</p>
      </Dialogo>
      {TELA_CHEIA.map(([chave, rotulo]) => (
        <Dialogo
          key={chave}
          {...props(`cheia-${chave}`)}
          titulo={rotulo}
          tamanho={chave === 'sempre' ? 'full' : 'grande'}
          telaCheiaAbaixo={chave === 'sempre' ? undefined : chave}
          rodape={rodapePadrao}
        >
          {/* no tamanho full o corpo vem sem espaçamento (é feito para conteúdo de ponta a ponta) */}
          <div className={chave === 'sempre' ? 'demo-modais-texto demo-modais-texto--pad' : 'demo-modais-texto'}>{texto(3)}</div>
        </Dialogo>
      ))}
      <Dialogo
        {...props('mensagem')}
        titulo={`Nova mensagem para ${destinatario}`}
        rodape={
          <>
            <Botao rotulo="Fechar" severidade="secundario" formato="retangulo" onClick={fechar} />
            <Botao
              rotulo="Enviar mensagem"
              icone="send"
              formato="retangulo"
              onClick={() => {
                fechar();
                toast.ok('Mensagem enviada', `Para ${destinatario}`);
              }}
            />
          </>
        }
      >
        <div className="demo-pilha-p">
          <CampoTexto rotulo="Destinatário" valor={destinatario} aoMudar={setDestinatario} />
          <CampoTextarea rotulo="Mensagem" />
        </div>
      </Dialogo>
      {ANIMACOES.map(([chave, rotulo]) => (
        <Dialogo key={chave} {...props(`anim-${chave}`)} titulo={rotulo} animacao={chave} rodape={rodapePadrao}>
          <p className="demo-modais-texto">{PARAGRAFO}</p>
        </Dialogo>
      ))}
    </div>
  );
}
