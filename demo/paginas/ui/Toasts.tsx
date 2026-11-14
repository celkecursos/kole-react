import { useState } from 'react';
import { Botao, CabecalhoPagina, Toast, useToast, type CorToast, type PosicaoToast, type SeveridadeBotao } from '../../../src';
import { Bloco } from '../Bloco';
import { useT } from '../../i18n/useT';

const POSICOES: Array<{ posicao: PosicaoToast; rotulo: string }> = [
  { posicao: 'topo-esquerda', rotulo: 'Topo à esquerda' },
  { posicao: 'topo-centro', rotulo: 'Topo ao centro' },
  { posicao: 'topo-direita', rotulo: 'Topo à direita' },
  { posicao: 'meio-esquerda', rotulo: 'Meio à esquerda' },
  { posicao: 'meio-centro', rotulo: 'Meio ao centro' },
  { posicao: 'meio-direita', rotulo: 'Meio à direita' },
  { posicao: 'base-esquerda', rotulo: 'Base à esquerda' },
  { posicao: 'base-centro', rotulo: 'Base ao centro' },
  { posicao: 'base-direita', rotulo: 'Base à direita' },
];

const CORES: Array<{ cor: CorToast; rotulo: string }> = [
  { cor: 'pri', rotulo: 'Primário' },
  { cor: 'secundario', rotulo: 'Secundário' },
  { cor: 'warn', rotulo: 'Aviso' },
  { cor: 'info', rotulo: 'Info' },
  { cor: 'ok', rotulo: 'Sucesso' },
  { cor: 'err', rotulo: 'Perigo' },
];

export function PaginaToasts() {
  const { t } = useT();
  const toast = useToast();
  // toasts fixos da página que podem ser fechados
  const [fechados, setFechados] = useState<string[]>([]);
  const fechar = (id: string) => () => setFechados((f) => [...f, id]);
  const aberto = (id: string) => !fechados.includes(id);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.toasts.titulo')} icone="bell" trilha />

      <Bloco titulo={t('paginas.toasts.secoes.posicoes')} descricao={t('paginas.toasts.textos.usetoastMostrarPosicaoCada')}>
        <div className="demo-linha">
          {POSICOES.map((p) => (
            <Botao
              key={p.posicao}
              rotulo={p.rotulo}
              aparencia="contorno"
              formato="retangulo"
              onClick={() => toast.mostrar({ titulo: t('paginas.toasts.textos.celkeKole'), detalhe: t('paginas.toasts.textos.avisoEmValor', { valor: p.rotulo.toLowerCase() }), posicao: p.posicao, aparencia: 'padrao', icone: 'bell' })}
            />
          ))}
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.toasts.secoes.coresSuaves')} descricao={t('paginas.toasts.textos.fundoClaroDaCor')}>
          <div className="demo-linha">
            {CORES.map((c) => (
              <Botao
                key={c.cor}
                rotulo={c.rotulo}
                severidade={c.cor as SeveridadeBotao}
                aparencia="suave"
                formato="retangulo"
                onClick={() => toast.mostrar({ titulo: c.rotulo, detalhe: t('paginas.toasts.textos.seuAvisoApareceAqui'), cor: c.cor, icone: 'bell' })}
              />
            ))}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.toasts.secoes.coresSolidas')}>
          <div className="demo-linha">
            {CORES.map((c) => (
              <Botao
                key={c.cor}
                rotulo={c.rotulo}
                severidade={c.cor as SeveridadeBotao}
                formato="retangulo"
                onClick={() => toast.mostrar({ titulo: c.rotulo, detalhe: t('paginas.toasts.textos.seuAvisoApareceAqui'), cor: c.cor, aparencia: 'solido', icone: 'bell' })}
              />
            ))}
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas-3">
        <div className="demo-pilha">
          <Bloco titulo={t('paginas.toasts.secoes.exemploAoVivo')} descricao={t('paginas.toasts.textos.osAtalhosOkInfo')}>
            <div className="demo-linha">
              <Botao rotulo={t('paginas.toasts.textos.mostrarToast')} formato="retangulo" onClick={() => toast.ok(t('paginas.toasts.textos.pedidoSalvo'), t('paginas.toasts.textos.ped20260042Foi'))} />
              <Botao rotulo={t('paginas.toasts.textos.erro')} severidade="err" aparencia="contorno" formato="retangulo" onClick={() => toast.err(t('paginas.toasts.textos.falhaAoSalvar'), t('paginas.toasts.textos.tenteDeNovoEm'))} />
            </div>
          </Bloco>
          <Bloco titulo={t('paginas.toasts.secoes.esquemasDeCor')} descricao={t('paginas.toasts.textos.toastsFixosSolidosSo')}>
            <div className="demo-toasts-pilha">
              {(
                [
                  ['pri', 'primária'],
                  ['destaque', 'de destaque'],
                  ['ok', 'de sucesso'],
                  ['info', 'informativa'],
                ] as const
              ).map(
                ([c, nome]) =>
                  aberto(`esq-${c}`) && (
                    <Toast key={c} cor={c} aparencia="solido" detalhe={t('paginas.toasts.textos.olaEsteEO', { nome })} aoFechar={fechar(`esq-${c}`)} />
                  ),
              )}
            </div>
          </Bloco>
        </div>

        <div className="demo-pilha">
          <Bloco titulo={t('paginas.toasts.secoes.basico')} descricao={t('paginas.toasts.textos.modeloComCabecalhoIcone')}>
            {aberto('basico') && (
              <Toast modelo="cabecalho" aparencia="padrao" icone="bell" titulo={t('paginas.toasts.textos.celkeKole')} tempo="há 11 min" detalhe={t('paginas.toasts.textos.olaEstaEUma')} aoFechar={fechar('basico')} />
            )}
          </Bloco>
          <Bloco titulo={t('paginas.toasts.secoes.empilhados')} descricao={t('paginas.toasts.textos.variosAvisosUmEmbaixo')}>
            <div className="demo-toasts-pilha">
              {aberto('pilha1') && (
                <Toast modelo="cabecalho" aparencia="padrao" icone="bell" titulo={t('paginas.toasts.textos.celkeKole')} tempo="agora" detalhe={t('paginas.toasts.textos.viuAssimMesmo')} aoFechar={fechar('pilha1')} />
              )}
              {aberto('pilha2') && (
                <Toast modelo="cabecalho" aparencia="padrao" icone="bell" titulo={t('paginas.toasts.textos.celkeKole')} tempo="há 2 s" detalhe={t('paginas.toasts.textos.atencaoOsAvisosSe')} aoFechar={fechar('pilha2')} />
              )}
            </div>
          </Bloco>
        </div>

        <div className="demo-pilha">
          <Bloco titulo={t('paginas.toasts.secoes.translucido')} descricao={t('paginas.toasts.textos.vidroFoscoDeixaO')}>
            <div className="demo-toasts-fundo">
              <Toast modelo="cabecalho" aparencia="translucido" icone="bell" titulo={t('paginas.toasts.textos.celkeKole')} tempo="há 11 min" detalhe={t('paginas.toasts.textos.olaEstaEUma')} aoFechar={() => toast.info(t('paginas.toasts.textos.eSoUmExemplo'), t('paginas.toasts.textos.esteFicaFixo'))} />
            </div>
          </Bloco>
          <Bloco titulo={t('paginas.toasts.secoes.conteudoProprio')} descricao={t('paginas.toasts.textos.botoesELinksDentro')}>
            <div className="demo-toasts-pilha">
              {aberto('proprio') && <Toast aparencia="padrao" detalhe={t('paginas.toasts.textos.olaEstaEUma')} aoFechar={fechar('proprio')} />}
              <Toast
                aparencia="padrao"
                detalhe={t('paginas.toasts.textos.olaEstaEUma')}
                acoes={
                  <>
                    <Botao rotulo={t('paginas.toasts.textos.fazerAlgo')} tamanho="pequeno" formato="retangulo" onClick={() => toast.ok(t('paginas.toasts.textos.feito'))} />
                    <Botao rotulo={t('paginas.toasts.textos.fechar')} severidade="secundario" tamanho="pequeno" formato="retangulo" onClick={() => toast.info(t('paginas.toasts.textos.eSoUmExemplo'), t('paginas.toasts.textos.esteFicaFixo'))} />
                  </>
                }
              />
            </div>
          </Bloco>
        </div>
      </div>

      <Bloco titulo={t('paginas.toasts.secoes.centralizadoComFlex')} descricao={t('paginas.toasts.textos.umToastEUm')}>
        <div className="demo-toasts-centro">
          <Toast modelo="cabecalho" aparencia="padrao" icone="bell" titulo={t('paginas.toasts.textos.celkeKole')} tempo="há 11 min" detalhe={t('paginas.toasts.textos.olaEstaEUma')} />
        </div>
      </Bloco>

      {fechados.length > 0 && (
        <div>
          <Botao rotulo={t('paginas.toasts.textos.reabrirOsToastsFechados')} icone="rotate-cw" aparencia="texto" formato="retangulo" onClick={() => setFechados([])} />
        </div>
      )}
    </div>
  );
}
