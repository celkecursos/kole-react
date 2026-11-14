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
import { useT } from '../../i18n/useT';

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
  const { t } = useT();
  const toast = useToast();
  // um diálogo aberto por vez, identificado por uma chave
  const [aberto, setAberto] = useState<string | null>(null);
  const [destinatario, setDestinatario] = useState('');
  const abrir = (chave: string) => () => setAberto(chave);
  const fechar = () => setAberto(null);
  const rodapePadrao = (
    <>
      <Botao rotulo={t('paginas.modais.textos.fechar')} severidade="secundario" formato="retangulo" onClick={fechar} />
      <Botao
        rotulo={t('paginas.modais.textos.salvarAlteracoes')}
        formato="retangulo"
        onClick={() => {
          fechar();
          toast.ok(t('paginas.modais.textos.alteracoesSalvas'));
        }}
      />
    </>
  );
  const texto = (n: number) => Array.from({ length: n }, (_, i) => <p key={i}>{PARAGRAFO}</p>);
  const props = (chave: string): Pick<DialogoProps, 'aberto' | 'aoFechar'> => ({ aberto: aberto === chave, aoFechar: fechar });

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.modais.titulo')} icone="app-window" trilha />

      <div className="demo-colunas-3">
        <Bloco titulo={t('paginas.modais.secoes.basico')}>
          <div>
            <Botao rotulo={t('paginas.modais.textos.abrirDialogo')} formato="retangulo" onClick={abrir('basico')} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.modais.secoes.fundoEstatico')} descricao={t('paginas.modais.textos.naoFechaComClique')}>
          <div>
            <Botao rotulo={t('paginas.modais.textos.abrirComFundoEstatico')} formato="retangulo" onClick={abrir('estatico')} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.modais.secoes.conteudoLongo')} descricao={t('paginas.modais.textos.oDialogoCresceE')}>
          <div>
            <Botao rotulo={t('paginas.modais.textos.abrirConteudoLongo')} formato="retangulo" onClick={abrir('longo')} />
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.modais.secoes.noTopo')} descricao={t('paginas.modais.textos.porPadraoODialogo')}>
          <div className="demo-linha">
            <Botao rotulo={t('paginas.modais.textos.centralizado')} formato="retangulo" onClick={abrir('centro')} />
            <Botao rotulo={t('paginas.modais.textos.noTopo')} aparencia="contorno" formato="retangulo" onClick={abrir('topo')} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.modais.secoes.rolagemNoCorpo')} descricao={t('paginas.modais.textos.cabecalhoERodapeFixos')}>
          <div>
            <Botao rotulo={t('paginas.modais.textos.abrirComRolagemNo')} formato="retangulo" onClick={abrir('corpo')} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.modais.secoes.dicasEBaloes')} descricao={t('paginas.modais.textos.funcionamDentroDoDialogo')}>
          <div>
            <Botao rotulo={t('paginas.modais.textos.abrirDialogo')} formato="retangulo" onClick={abrir('dicas')} />
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.modais.secoes.usandoAGrade')}>
          <div>
            <Botao rotulo={t('paginas.modais.textos.abrirDialogo')} formato="retangulo" onClick={abrir('grade')} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.modais.secoes.alternarEntreDialogos')} descricao={t('paginas.modais.textos.umDialogoAbreO')}>
          <div>
            <Botao rotulo={t('paginas.modais.textos.abrirOPrimeiro')} formato="retangulo" onClick={abrir('primeiro')} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.modais.secoes.tamanhos')}>
          <div className="demo-linha">
            <Botao rotulo={t('paginas.modais.textos.extragrande')} formato="retangulo" onClick={abrir('xg')} />
            <Botao rotulo={t('paginas.modais.textos.grande')} formato="retangulo" onClick={abrir('g')} />
            <Botao rotulo={t('paginas.modais.textos.pequeno')} formato="retangulo" onClick={abrir('p')} />
          </div>
        </Bloco>
      </div>

      <Bloco titulo={t('paginas.modais.secoes.telaCheia')} descricao={t('paginas.modais.textos.sempreOuSoAbaixo')}>
        <div className="demo-linha">
          {TELA_CHEIA.map(([chave, rotulo]) => (
            <Botao key={chave} rotulo={rotulo} formato="retangulo" onClick={abrir(`cheia-${chave}`)} />
          ))}
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.modais.secoes.conteudoVariavel')} descricao={t('paginas.modais.textos.oMesmoDialogoPreenchido')}>
        <div className="demo-linha">
          {['@ana', '@bruno', '@celke'].map((d, i) => (
            <Botao
              key={d}
              rotulo={t('paginas.modais.textos.mensagemParaD', { d })}
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

      <Bloco titulo={t('paginas.modais.secoes.efeitosDeEntrada')} descricao={<>animacao no Dialogo; desligados para quem prefere menos movimento.</>}>
        <div className="demo-modais-efeitos">
          {ANIMACOES.map(([chave, rotulo]) => (
            <Botao key={chave} rotulo={rotulo} aparencia="contorno" formato="retangulo" bloco onClick={abrir(`anim-${chave}`)} />
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas-3">
        <Bloco titulo={t('paginas.modais.secoes.botaoDeFechar')}>
          <div>
            <BotaoFechar />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.modais.secoes.desabilitado')}>
          <div>
            <BotaoFechar disabled />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.modais.secoes.varianteClara')} descricao={t('paginas.modais.textos.paraFundosEscuros')}>
          <div className="demo-modais-escuro">
            <BotaoFechar variante="claro" />
            <BotaoFechar variante="claro" disabled />
          </div>
        </Bloco>
      </div>

      {/* ---- os diálogos ---- */}
      <Dialogo {...props('basico')} titulo={t('paginas.modais.textos.tituloDoDialogo')} rodape={rodapePadrao}>
        <p className="demo-modais-texto">{PARAGRAFO}</p>
      </Dialogo>
      <Dialogo {...props('estatico')} titulo={t('paginas.modais.textos.fundoEstatico')} dispensavel={false} rodape={rodapePadrao}>
        <p className="demo-modais-texto">{t('paginas.modais.textos.cliqueForaOuAperte')}</p>
      </Dialogo>
      <Dialogo {...props('longo')} titulo={t('paginas.modais.textos.conteudoLongo')} rolagem="pagina" rodape={rodapePadrao}>
        <div className="demo-modais-texto">{texto(14)}</div>
      </Dialogo>
      <Dialogo {...props('centro')} titulo={t('paginas.modais.textos.centralizado')} rodape={rodapePadrao}>
        <p className="demo-modais-texto">{t('paginas.modais.textos.esteDialogoFicaNo')}</p>
      </Dialogo>
      <Dialogo {...props('topo')} titulo={t('paginas.modais.textos.noTopo')} posicao="topo" rodape={rodapePadrao}>
        <p className="demo-modais-texto">{t('paginas.modais.textos.esteDialogoFicaPerto')}</p>
      </Dialogo>
      <Dialogo {...props('corpo')} titulo={t('paginas.modais.textos.rolagemNoCorpo')} rodape={rodapePadrao}>
        <div className="demo-modais-texto">{texto(14)}</div>
      </Dialogo>
      <Dialogo {...props('dicas')} titulo={t('paginas.modais.textos.dicasEBaloes')} rodape={rodapePadrao}>
        <div className="demo-modais-texto">
          <p>{t('paginas.modais.textos.este')}<Balao titulo={t('paginas.modais.textos.tituloDoBalao')} conteudo={t('paginas.modais.textos.oConteudoDoBalao')} posicao="direita">
              <Botao rotulo={t('paginas.modais.textos.botao')} tamanho="pequeno" aparencia="suave" formato="retangulo" />
            </Balao>{t('paginas.modais.textos.abreUmBalaoAo')}</p>
          <p>
            <Dica texto={t('paginas.modais.textos.dica')}>
              <a href="#/avancado/modais" onClick={(e) => e.preventDefault()}>{t('paginas.modais.textos.esteLink')}</a>
            </Dica>{' '}
            e{' '}
            <Dica texto={t('paginas.modais.textos.outraDica')}>
              <a href="#/avancado/modais" onClick={(e) => e.preventDefault()}>{t('paginas.modais.textos.esteOutro')}</a>
            </Dica>{t('paginas.modais.textos.mostramDicasAoPassar')}</p>
        </div>
      </Dialogo>
      <Dialogo {...props('grade')} titulo={t('paginas.modais.textos.usandoAGrade')} tamanho="grande" rodape={rodapePadrao}>
        <div className="demo-modais-grade">
          <div className="demo-modais-cel demo-modais-cel--6">{t('paginas.modais.textos.col6')}</div>
          <div className="demo-modais-cel demo-modais-cel--6">{t('paginas.modais.textos.col6')}</div>
          <div className="demo-modais-cel demo-modais-cel--4">{t('paginas.modais.textos.col4')}</div>
          <div className="demo-modais-cel demo-modais-cel--4">{t('paginas.modais.textos.col4')}</div>
          <div className="demo-modais-cel demo-modais-cel--4">{t('paginas.modais.textos.col4')}</div>
          <div className="demo-modais-cel demo-modais-cel--3">{t('paginas.modais.textos.col3')}</div>
          <div className="demo-modais-cel demo-modais-cel--9">{t('paginas.modais.textos.col9')}</div>
        </div>
      </Dialogo>
      <Dialogo
        {...props('primeiro')}
        titulo={t('paginas.modais.textos.primeiroDialogo')}
        rodape={<Botao rotulo={t('paginas.modais.textos.abrirOSegundo')} formato="retangulo" onClick={abrir('segundo')} />}
      >
        <p className="demo-modais-texto">{t('paginas.modais.textos.mostreUmSegundoDialogo')}</p>
      </Dialogo>
      <Dialogo
        {...props('segundo')}
        titulo={t('paginas.modais.textos.segundoDialogo')}
        rodape={<Botao rotulo={t('paginas.modais.textos.voltarAoPrimeiro')} formato="retangulo" onClick={abrir('primeiro')} />}
      >
        <p className="demo-modais-texto">{t('paginas.modais.textos.escondaEsteDialogoE')}</p>
      </Dialogo>
      <Dialogo {...props('xg')} titulo={t('paginas.modais.textos.dialogoExtragrande')} tamanho="extragrande">
        <p className="demo-modais-texto">{PARAGRAFO}</p>
      </Dialogo>
      <Dialogo {...props('g')} titulo={t('paginas.modais.textos.dialogoGrande')} tamanho="grande">
        <p className="demo-modais-texto">{PARAGRAFO}</p>
      </Dialogo>
      <Dialogo {...props('p')} titulo={t('paginas.modais.textos.dialogoPequeno')} tamanho="pequeno">
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
        titulo={t('paginas.modais.textos.novaMensagemParaDestinatario', { destinatario })}
        rodape={
          <>
            <Botao rotulo={t('paginas.modais.textos.fechar')} severidade="secundario" formato="retangulo" onClick={fechar} />
            <Botao
              rotulo={t('paginas.modais.textos.enviarMensagem')}
              icone="send"
              formato="retangulo"
              onClick={() => {
                fechar();
                toast.ok(t('paginas.modais.textos.mensagemEnviada'), t('paginas.modais.textos.paraDestinatario', { destinatario }));
              }}
            />
          </>
        }
      >
        <div className="demo-pilha-p">
          <CampoTexto rotulo={t('paginas.modais.textos.destinatario')} valor={destinatario} aoMudar={setDestinatario} />
          <CampoTextarea rotulo={t('paginas.modais.textos.mensagem')} />
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
