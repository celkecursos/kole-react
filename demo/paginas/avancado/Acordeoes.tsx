import { useState, type ReactNode } from 'react';
import { Acordeao, Botao, CabecalhoPagina, ItemAcordeao, Recolhivel, type AcordeaoProps } from '../../../src';
import { Bloco } from '../Bloco';
import { useT, type TradutorDemo } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

const TEXTO = (t: TradutorDemo['t']) => ((
  <>{rico(t('paginas.acordeoes.textos.esteEOCorpo'))}</>
));

/** Os 3 itens de exemplo, com o primeiro aberto. */
function Exemplo(props: Omit<AcordeaoProps, 'children'> & { icones?: boolean }) {
  const { t } = useT();
  const { icones, ...resto } = props;
  return (
    <Acordeao padraoAbertos={['um']} {...resto}>
      <ItemAcordeao valor="um" titulo={t('paginas.acordeoes.textos.item1DoAcordeao')} icone={icones ? 'package' : undefined}>
        {TEXTO(t)}
      </ItemAcordeao>
      <ItemAcordeao valor="dois" titulo={t('paginas.acordeoes.textos.item2DoAcordeao')} icone={icones ? 'truck' : undefined}>{t('paginas.acordeoes.textos.conteudoDoSegundoItem')}</ItemAcordeao>
      <ItemAcordeao valor="tres" titulo={t('paginas.acordeoes.textos.item3DoAcordeao')} icone={icones ? 'wallet' : undefined}>{t('paginas.acordeoes.textos.conteudoDoTerceiroItem')}</ItemAcordeao>
    </Acordeao>
  );
}

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <>
      <h2 className="demo-secao-titulo">{titulo}</h2>
      {children}
    </>
  );
}

export function PaginaAcordeoes() {
  const { t } = useT();
  const [link, setLink] = useState(false);
  const [primeiro, setPrimeiro] = useState(false);
  const [segundo, setSegundo] = useState(false);
  const [lateral, setLateral] = useState(false);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.acordeoes.titulo')} icone="list" trilha />

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.acordeoes.secoes.acordeaoBasico')} descricao={t('paginas.acordeoes.textos.abrirUmItemFecha')}>
          <Exemplo />
        </Bloco>
        <Bloco titulo={t('paginas.acordeoes.secoes.sempreAberto')} descricao={t('paginas.acordeoes.textos.comMultiploAbrirUm')}>
          <Exemplo multiplo />
        </Bloco>
      </div>

      <Bloco titulo={t('paginas.acordeoes.secoes.semBorda')} descricao={t('paginas.acordeoes.textos.encostadoNoContainerPara')}>
        <Exemplo variante="sem-borda" />
      </Bloco>

      <Secao titulo={t('paginas.acordeoes.secoes.coresSolidas')}>
        <div className="demo-colunas">
          <Bloco titulo={t('paginas.acordeoes.secoes.primario')}>
            <Exemplo variante="solido" />
          </Bloco>
          <Bloco titulo={t('paginas.acordeoes.secoes.destaque')}>
            <Exemplo variante="solido" cor="destaque" />
          </Bloco>
        </div>
      </Secao>

      <Secao titulo={t('paginas.acordeoes.secoes.coresSuaves')}>
        <div className="demo-colunas">
          <Bloco titulo={t('paginas.acordeoes.secoes.primario')}>
            <Exemplo variante="suave" />
          </Bloco>
          <Bloco titulo={t('paginas.acordeoes.secoes.destaque')}>
            <Exemplo variante="suave" cor="destaque" />
          </Bloco>
        </div>
      </Secao>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.acordeoes.secoes.iconeDeMaisE')} descricao={t('paginas.acordeoes.textos.itensSeparadosCom')}>
          <Exemplo separado icone="mais" />
        </Bloco>
        <Bloco titulo={t('paginas.acordeoes.secoes.umaCorPorItem')} descricao={t('paginas.acordeoes.textos.aCorDoItem')}>
          <Acordeao separado variante="suave" padraoAbertos={['um']}>
            <ItemAcordeao valor="um" titulo={t('paginas.acordeoes.textos.item1DoAcordeao')} cor="pri">
              {TEXTO(t)}
            </ItemAcordeao>
            <ItemAcordeao valor="dois" titulo={t('paginas.acordeoes.textos.item2DoAcordeao')} cor="err">{t('paginas.acordeoes.textos.conteudoDoSegundoItem2')}</ItemAcordeao>
            <ItemAcordeao valor="tres" titulo={t('paginas.acordeoes.textos.item3DoAcordeao')} cor="destaque">{t('paginas.acordeoes.textos.conteudoDoTerceiroItem')}</ItemAcordeao>
          </Acordeao>
        </Bloco>
      </div>

      <Secao titulo={t('paginas.acordeoes.secoes.bordasColoridas')}>
        <div className="demo-colunas">
          <Bloco titulo={t('paginas.acordeoes.secoes.primario')}>
            <Exemplo variante="contorno" separado />
          </Bloco>
          <Bloco titulo={t('paginas.acordeoes.secoes.sucesso')}>
            <Exemplo variante="contorno" separado cor="ok" />
          </Bloco>
        </div>
      </Secao>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.acordeoes.secoes.iconeAEsquerda')} descricao={t('paginas.acordeoes.textos.comIconeNoTitulo')}>
          <Exemplo separado posicaoIcone="inicio" icones />
        </Bloco>
        <Bloco titulo={t('paginas.acordeoes.secoes.semIcone')}>
          <Exemplo separado icone="nenhum" />
        </Bloco>
      </div>

      <Secao titulo={t('paginas.acordeoes.secoes.recolhivel')}>
        <div className="demo-colunas">
          <Bloco titulo={t('paginas.acordeoes.secoes.exemplo')} descricao={t('paginas.acordeoes.textos.qualquerConteudoPodeAbrir')}>
            <div className="demo-linha">
              <Botao rotulo={t('paginas.acordeoes.textos.linkComRecolhivel')} aparencia="texto" formato="retangulo" onClick={() => setLink((v) => !v)} aria-expanded={link} />
              <Botao rotulo={t('paginas.acordeoes.textos.botaoComRecolhivel')} formato="retangulo" onClick={() => setLink((v) => !v)} aria-expanded={link} />
            </div>
            <Recolhivel aberto={link}>
              <div className="demo-recolhivel-caixa">{t('paginas.acordeoes.textos.umConteudoDeExemplo')}</div>
            </Recolhivel>
          </Bloco>
          <Bloco titulo={t('paginas.acordeoes.secoes.variosAlvos')} descricao={t('paginas.acordeoes.textos.umBotaoPodeControlar')}>
            <div className="demo-linha">
              <Botao rotulo={t('paginas.acordeoes.textos.alternarOPrimeiro')} formato="retangulo" onClick={() => setPrimeiro((v) => !v)} aria-expanded={primeiro} />
              <Botao rotulo={t('paginas.acordeoes.textos.alternarOSegundo')} severidade="secundario" formato="retangulo" onClick={() => setSegundo((v) => !v)} aria-expanded={segundo} />
              <Botao
                rotulo={t('paginas.acordeoes.textos.alternarOsDois')}
                severidade="ok"
                formato="retangulo"
                onClick={() => {
                  setPrimeiro((v) => !v);
                  setSegundo((v) => !v);
                }}
              />
            </div>
            <div className="demo-colunas">
              <Recolhivel aberto={primeiro}>
                <div className="demo-recolhivel-caixa">{t('paginas.acordeoes.textos.primeiroRecolhivelAbreCom')}</div>
              </Recolhivel>
              <Recolhivel aberto={segundo}>
                <div className="demo-recolhivel-caixa">{t('paginas.acordeoes.textos.segundoRecolhivelAbreCom')}</div>
              </Recolhivel>
            </div>
          </Bloco>
        </div>
      </Secao>

      <Bloco titulo={t('paginas.acordeoes.secoes.recolhivelHorizontal')} descricao={<>orientacao=&quot;horizontal&quot; anima a largura em vez da altura.</>}>
        <div>
          <Botao rotulo={t('paginas.acordeoes.textos.alternarNaLargura')} formato="retangulo" onClick={() => setLateral((v) => !v)} aria-expanded={lateral} />
        </div>
        <div className="demo-recolhivel-faixa">
          <Recolhivel aberto={lateral} orientacao="horizontal">
            <div className="demo-recolhivel-caixa demo-recolhivel-caixa--largura">{t('paginas.acordeoes.textos.esteConteudoApareceAbrindo')}</div>
          </Recolhivel>
        </div>
      </Bloco>
    </div>
  );
}
