import { useState } from 'react';
import { Botao, CabecalhoPagina, Card, Carregando, Girador, Skeleton, type CorGirador, type SeveridadeBotao } from '../../../src';
import { Bloco } from '../Bloco';
import { useT } from '../../i18n/useT';
import { rico } from '../../i18n/rico';

const CORES: CorGirador[] = ['pri', 'secundario', 'ok', 'err', 'warn', 'info', 'destaque', 'escuro'];

export function PaginaGiradores() {
  const { t } = useT();
  const [salvando, setSalvando] = useState(false);

  const salvar = () => {
    setSalvando(true);
    window.setTimeout(() => setSalvando(false), 2000);
  };

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.giradores.titulo')} icone="loader-circle" trilha />

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.giradores.secoes.anel')} descricao={t('paginas.giradores.textos.giraSemPararO')}>
          <div>
            <Girador />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.giradores.secoes.anelEmCores')}>
          <div className="demo-linha demo-linha--centro">
            {CORES.map((c) => (
              <Girador key={c} cor={c} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.giradores.secoes.pulso')} descricao={t('paginas.giradores.textos.cresceESomePara')}>
          <div>
            <Girador tipo="pulso" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.giradores.secoes.pulsoEmCores')}>
          <div className="demo-linha demo-linha--centro">
            {CORES.map((c) => (
              <Girador key={c} tipo="pulso" cor={c} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.giradores.secoes.pontos')} descricao={t('paginas.giradores.textos.tresPontosPiscandoEm')}>
          <div>
            <Girador tipo="pontos" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.giradores.secoes.pontosEmCores')}>
          <div className="demo-linha demo-linha--centro">
            {CORES.map((c) => (
              <Girador key={c} tipo="pontos" cor={c} tamanho="pequeno" />
            ))}
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.giradores.secoes.alinhamentoComFlex')} descricao={t('paginas.giradores.textos.textoDeUmLado')}>
          <div className="demo-gir-flex">
            <Girador />
          </div>
          <div className="demo-gir-flex demo-gir-flex--entre">{rico(t('paginas.giradores.textos.carregando'))}<Girador rotulo={t('paginas.giradores.textos.carregandoALista')} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.giradores.secoes.alinhamentoFlutuante')}>
          <div className="demo-gir-fluxo">
            <Girador className="demo-gir-direita" />
          </div>
          <div className="demo-gir-fluxo">
            <Girador className="demo-gir-esquerda" />
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.giradores.secoes.centralizado')}>
          <div className="demo-gir-centro">
            <Girador />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.giradores.secoes.comMargem')} descricao={t('paginas.giradores.textos.espacoEmVoltaSeparado')}>
          <div>
            <Girador className="demo-gir-margem" />
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.giradores.secoes.tamanhos')} descricao={t('paginas.giradores.textos.pequenoMedioGrandeOu')}>
          <div className="demo-linha demo-linha--centro">
            <Girador tamanho="pequeno" />
            <Girador tipo="pulso" tamanho="pequeno" />
            <Girador tamanho="medio" />
            <Girador tipo="pulso" tamanho="medio" />
            <Girador tamanho="grande" />
            <Girador tipo="pulso" tamanho="grande" />
            <Girador tamanho="3.5rem" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.giradores.secoes.comRotuloVisivel')}>
          <div className="demo-linha demo-linha--centro">
            <Girador mostrarRotulo tamanho="pequeno" />
            <Girador tipo="pulso" cor="ok" mostrarRotulo rotulo={t('paginas.giradores.textos.sincronizando')} tamanho="pequeno" />
            <Girador tipo="pontos" cor="destaque" mostrarRotulo rotulo={t('paginas.giradores.textos.digitando')} tamanho="pequeno" />
          </div>
        </Bloco>
      </div>

      <Bloco titulo={t('paginas.giradores.secoes.emBotoes')} descricao={<>Use cor=&quot;atual&quot; para o girador herdar a cor do botão.</>}>
        <div className="demo-linha demo-linha--centro">
          <Botao icone={<Girador tamanho="0.875rem" cor="atual" />} aparencia="suave" formato="retangulo" aria-label={t('paginas.giradores.textos.carregando2')} disabled />
          <Botao icone={<Girador tamanho="0.875rem" cor="atual" rotulo="" />} rotulo={t('paginas.giradores.textos.carregando3')} aparencia="suave" formato="retangulo" disabled />
          <Botao icone={<Girador tipo="pulso" tamanho="0.875rem" cor="atual" />} aparencia="suave" formato="retangulo" aria-label={t('paginas.giradores.textos.carregando2')} disabled />
          {(['pri', 'secundario', 'ok', 'info', 'warn', 'err'] as SeveridadeBotao[]).map((s) => (
            <Botao key={s} icone={<Girador tipo="pulso" tamanho="0.875rem" cor="atual" rotulo="" />} rotulo={t('paginas.giradores.textos.carregando3')} severidade={s} aparencia="suave" formato="retangulo" disabled />
          ))}
          <Botao icone={<Girador tamanho="0.875rem" cor="atual" rotulo="" />} rotulo={t('paginas.giradores.textos.carregando3')} severidade="escuro" formato="retangulo" disabled />
        </div>
        <div className="demo-linha demo-linha--centro">
          <Botao rotulo={salvando ? t('paginas.giradores.textos.salvando') : t('paginas.giradores.textos.salvar')} icone="save" carregando={salvando} formato="retangulo" onClick={salvar} />
          <span className="demo-bloco-desc demo-gir-nota">{t('paginas.giradores.textos.oProprioBotaoTem')}</span>
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.giradores.secoes.silhuetas')} descricao={t('paginas.giradores.textos.skeletonOcupaOLugar')}>
          <Card>
            <div className="demo-pilha-p">
              <Skeleton largura="60%" />
              <Skeleton />
              <Skeleton largura="80%" />
              <Skeleton largura="2.5rem" altura="2.5rem" formato="circulo" />
            </div>
          </Card>
        </Bloco>
        <Bloco titulo={t('paginas.giradores.secoes.carregando')} descricao={t('paginas.giradores.textos.giradorComMensagemPara')}>
          <Card>
            <Carregando mensagem={t('paginas.giradores.textos.carregando2')} />
          </Card>
        </Bloco>
      </div>
    </div>
  );
}
