import { useState } from 'react';
import { AcaoLinha, Botao, CabecalhoPagina, useToast, type BotaoProps, type SeveridadeBotao } from '../../../src';
import { Bloco } from '../Bloco';
import { useT, type TradutorDemo } from '../../i18n/useT';

const CORES = (t: TradutorDemo['t']): { cor: SeveridadeBotao; nome: string }[] => ([
  { cor: 'pri', nome: t('paginas.botoes.textos.principal') },
  { cor: 'destaque', nome: t('paginas.botoes.textos.destaque') },
  { cor: 'ok', nome: t('paginas.botoes.textos.sucesso') },
  { cor: 'err', nome: t('paginas.botoes.textos.erro') },
  { cor: 'warn', nome: t('paginas.botoes.textos.atencao') },
  { cor: 'info', nome: t('paginas.botoes.textos.info') },
  { cor: 'secundario', nome: t('paginas.botoes.textos.secundario') },
  { cor: 'escuro', nome: t('paginas.botoes.textos.escuro') },
]);

/** O botão em todas as cores. */
function Todas(props: Omit<BotaoProps, 'severidade' | 'rotulo'>) {
  const { t, tc } = useT();
  return (
    <div className="demo-linha">
      {CORES(t).map((c) => (
        <Botao key={c.cor} severidade={c.cor} rotulo={tc(c.nome)} {...props} />
      ))}
    </div>
  );
}

export function PaginaBotoes() {
  const { t } = useT();
  const toast = useToast();
  const [alternado, setAlternado] = useState(false);
  const [carregandoDemo, setCarregandoDemo] = useState(false);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.botoes.titulo')} icone="square-mouse-pointer" trilha />

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.botoes.secoes.padrao')} descricao={t('paginas.botoes.textos.formatoRetangulo')}>
          <Todas formato="retangulo" />
          <div className="demo-linha">
            <Botao rotulo={t('paginas.botoes.textos.link')} aparencia="texto" formato="retangulo" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.botoes.secoes.arredondados')} descricao={t('paginas.botoes.textos.pilulaEOFormato')}>
          <Todas />
          <div className="demo-linha">
            <Botao rotulo={t('paginas.botoes.textos.link')} aparencia="texto" />
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.botoes.secoes.suaves')} descricao={t('paginas.botoes.textos.aparenciaSuave')}>
          <Todas aparencia="suave" formato="retangulo" />
        </Bloco>
        <Bloco titulo={t('paginas.botoes.secoes.suavesArredondados')}>
          <Todas aparencia="suave" />
        </Bloco>

        <Bloco titulo={t('paginas.botoes.secoes.contorno')}>
          <Todas aparencia="contorno" formato="retangulo" />
        </Bloco>
        <Bloco titulo={t('paginas.botoes.secoes.contornoArredondados')}>
          <Todas aparencia="contorno" />
        </Bloco>

        <Bloco titulo={t('paginas.botoes.secoes.gradiente')}>
          <Todas aparencia="gradiente" formato="retangulo" />
        </Bloco>
        <Bloco titulo={t('paginas.botoes.secoes.gradienteArredondados')}>
          <Todas aparencia="gradiente" />
        </Bloco>

        <Bloco titulo={t('paginas.botoes.secoes.desabilitados')}>
          <div className="demo-linha">
            <Botao rotulo={t('paginas.botoes.textos.principal')} disabled />
            <Botao rotulo={t('paginas.botoes.textos.secundario')} severidade="secundario" disabled />
            <Botao rotulo={t('paginas.botoes.textos.principal')} aparencia="contorno" disabled />
            <Botao rotulo={t('paginas.botoes.textos.erro')} severidade="err" aparencia="contorno" disabled />
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.botoes.secoes.alternancia')} descricao={t('paginas.botoes.textos.pressionadoLigaEDesliga')}>
          <div className="demo-linha">
            <Botao rotulo={alternado ? t('paginas.botoes.textos.ligado') : t('paginas.botoes.textos.desligado')} icone={alternado ? 'check' : 'x'} pressionado={alternado} onClick={() => setAlternado((x) => !x)} />
            <Botao rotulo={t('paginas.botoes.textos.semprePressionado')} severidade="destaque" pressionado />
            <Botao rotulo={t('paginas.botoes.textos.alternanciaDesabilitada')} severidade="info" disabled />
          </div>
        </Bloco>
      </div>

      <Bloco titulo={t('paginas.botoes.secoes.carregando')} descricao={t('paginas.botoes.textos.oSpinnerSubstituiO')}>
        <div className="demo-linha">
          <Botao rotulo={t('paginas.botoes.textos.carregando')} carregando />
          <Botao rotulo={t('paginas.botoes.textos.carregando')} severidade="destaque" aparencia="contorno" carregando />
          <Botao rotulo={t('paginas.botoes.textos.carregando')} severidade="info" aparencia="suave" carregando />
          <Botao rotulo={t('paginas.botoes.textos.carregando')} severidade="warn" aparencia="suave" carregando posicaoIcone="direita" />
          <Botao
            rotulo={carregandoDemo ? t('paginas.botoes.textos.salvando') : t('paginas.botoes.textos.cliqueParaSalvar')}
            icone="save"
            severidade="ok"
            carregando={carregandoDemo}
            onClick={() => {
              setCarregandoDemo(true);
              setTimeout(() => {
                setCarregandoDemo(false);
                toast.ok(t('paginas.botoes.textos.salvo'));
              }, 1500);
            }}
          />
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.botoes.secoes.soIcone')} descricao={t('paginas.botoes.textos.semRotuloOBotao')}>
        <div className="demo-linha">
          {(
            [
              ['building-2', 'pri', 'retangulo', 'solido'],
              ['package', 'info', 'retangulo', 'solido'],
              ['trash-2', 'err', 'retangulo', 'solido'],
              ['calendar', 'warn', 'retangulo', 'solido'],
              ['house', 'pri', 'pilula', 'suave'],
              ['trash-2', 'err', 'pilula', 'suave'],
              ['bell', 'ok', 'pilula', 'suave'],
              ['shopping-cart', 'destaque', 'pilula', 'suave'],
              ['phone', 'pri', 'pilula', 'contorno'],
              ['message-square', 'info', 'pilula', 'contorno'],
              ['video', 'ok', 'pilula', 'contorno'],
              ['save', 'err', 'pilula', 'contorno'],
            ] as const
          ).map(([icone, cor, formato, aparencia], i) => (
            <Botao key={i} icone={icone} severidade={cor} formato={formato} aparencia={aparencia} dica={icone} aria-label={icone} />
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.botoes.secoes.fantasma')} descricao={t('paginas.botoes.textos.contornoDiscretoQueSe')}>
          <Todas aparencia="fantasma" formato="retangulo" />
        </Bloco>
        <Bloco titulo={t('paginas.botoes.secoes.tipos')} descricao={t('paginas.botoes.textos.typeDoBotaoHtml')}>
          <form className="demo-linha" onSubmit={(e) => (e.preventDefault(), toast.info(t('paginas.botoes.textos.formularioEnviadoSubmit')))} onReset={() => toast.info(t('paginas.botoes.textos.formularioLimpoReset'))}>
            <Botao rotulo={t('paginas.botoes.textos.botao')} formato="retangulo" />
            <Botao rotulo={t('paginas.botoes.textos.enviar')} type="submit" severidade="ok" formato="retangulo" />
            <Botao rotulo={t('paginas.botoes.textos.limpar')} type="reset" severidade="secundario" formato="retangulo" />
          </form>
        </Bloco>

        <Bloco titulo={t('paginas.botoes.secoes.tamanhos')}>
          <div className="demo-linha demo-linha--centro">
            <Botao rotulo={t('paginas.botoes.textos.pequeno')} tamanho="pequeno" />
            <Botao rotulo={t('paginas.botoes.textos.medioPadrao')} severidade="destaque" />
            <Botao rotulo={t('paginas.botoes.textos.grande')} tamanho="grande" severidade="ok" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.botoes.secoes.larguras')} descricao={t('paginas.botoes.textos.larguraMinimaViaStyle')}>
          <div className="demo-linha">
            {(['5rem', '7rem', '9rem', '11rem'] as const).map((w, i) => (
              <Botao key={w} rotulo={['P', 'M', 'G', 'GG'][i]} severidade={(['pri', 'destaque', 'warn', 'info'] as const)[i]} formato="retangulo" style={{ minWidth: w }} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.botoes.secoes.sombras')}>
          <div className="demo-linha demo-linha--centro">
            <Botao rotulo={t('paginas.botoes.textos.pequena')} sombra="pequena" formato="retangulo" />
            <Botao rotulo={t('paginas.botoes.textos.media')} sombra="media" formato="retangulo" />
            <Botao rotulo={t('paginas.botoes.textos.grande')} sombra="grande" formato="retangulo" />
            <Botao rotulo={t('paginas.botoes.textos.pequena')} severidade="destaque" tamanho="pequeno" sombra="pequena" formato="retangulo" />
            <Botao rotulo={t('paginas.botoes.textos.media')} severidade="info" sombra="media" formato="retangulo" />
            <Botao rotulo={t('paginas.botoes.textos.grande')} severidade="ok" tamanho="grande" sombra="grande" formato="retangulo" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.botoes.secoes.elevados')} descricao={t('paginas.botoes.textos.sombraElevadoSombraDa')}>
          <Todas sombra="elevado" formato="retangulo" />
        </Bloco>

        <Bloco titulo={t('paginas.botoes.secoes.comIconeDestacado')} descricao={t('paginas.botoes.textos.iconedestacadoPoeOIcone')}>
          <div className="demo-linha">
            <Botao rotulo={t('paginas.botoes.textos.principal')} icone="message-square" iconeDestacado formato="retangulo" />
            <Botao rotulo={t('paginas.botoes.textos.destaque')} icone="settings" severidade="destaque" iconeDestacado formato="retangulo" />
            <Botao rotulo={t('paginas.botoes.textos.atencao')} icone="circle-alert" severidade="warn" iconeDestacado />
            <Botao rotulo={t('paginas.botoes.textos.info')} icone="phone" severidade="info" iconeDestacado />
            <Botao rotulo={t('paginas.botoes.textos.sucesso')} icone="check" severidade="ok" iconeDestacado posicaoIcone="direita" formato="retangulo" />
            <Botao rotulo={t('paginas.botoes.textos.cancelar')} icone="x" severidade="err" iconeDestacado posicaoIcone="direita" />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.botoes.secoes.comIcone')}>
          <div className="demo-linha">
            <Botao rotulo={t('paginas.botoes.textos.novoPedido')} icone="plus" />
            <Botao rotulo={t('paginas.botoes.textos.exportar')} icone="download" severidade="secundario" />
            <Botao rotulo={t('paginas.botoes.textos.proximo')} icone="arrow-right" posicaoIcone="direita" aparencia="contorno" />
            <Botao rotulo={t('paginas.botoes.textos.excluir')} icone="trash-2" severidade="err" aparencia="suave" />
          </div>
        </Bloco>
      </div>

      <Bloco titulo={t('paginas.botoes.secoes.acoesDeLinha')} descricao={t('paginas.botoes.textos.acaolinhaBotaoSoDe')}>
        <div className="demo-linha">
          <AcaoLinha icone="eye" rotulo={t('paginas.botoes.textos.visualizar')} severidade="pri" />
          <AcaoLinha icone="pencil" rotulo={t('paginas.botoes.textos.editar')} severidade="destaque" />
          <AcaoLinha icone="trash-2" rotulo={t('paginas.botoes.textos.excluir')} severidade="err" />
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.botoes.secoes.bloco')} descricao={t('paginas.botoes.textos.blocoOcupaTodaA')}>
        <Botao rotulo={t('paginas.botoes.textos.finalizarPedido')} icone="check" bloco formato="retangulo" />
        <Botao rotulo={t('paginas.botoes.textos.continuarComprando')} severidade="destaque" bloco formato="retangulo" />
        <div className="demo-botoes-meio">
          <Botao rotulo={t('paginas.botoes.textos.salvarRascunho')} severidade="err" aparencia="suave" bloco formato="retangulo" />
          <Botao rotulo={t('paginas.botoes.textos.agendarEnvio')} severidade="warn" bloco formato="retangulo" />
        </div>
        <div className="demo-linha" style={{ justifyContent: 'flex-end' }}>
          <Botao rotulo={t('paginas.botoes.textos.cancelar')} severidade="secundario" formato="retangulo" />
          <Botao rotulo={t('paginas.botoes.textos.confirmar')} severidade="info" formato="retangulo" />
        </div>
      </Bloco>
    </div>
  );
}
