import { useState, type ReactNode } from 'react';
import { Avatar, Badge, Botao, CabecalhoPagina, Chip, ComBadge, Icone, Placa, Status, type BadgeProps, type CorBadge } from '../../../src';
import { Bloco, retrato } from '../Bloco';
import { useT, type TradutorDemo } from '../../i18n/useT';

const CORES = (t: TradutorDemo['t']): { cor: CorBadge; nome: string }[] => ([
  { cor: 'pri', nome: t('paginas.badges.textos.principal') },
  { cor: 'destaque', nome: t('paginas.badges.textos.destaque') },
  { cor: 'ok', nome: t('paginas.badges.textos.sucesso') },
  { cor: 'err', nome: t('paginas.badges.textos.erro') },
  { cor: 'warn', nome: t('paginas.badges.textos.atencao') },
  { cor: 'info', nome: t('paginas.badges.textos.info') },
  { cor: 'neutral', nome: t('paginas.badges.textos.neutro') },
]);

/** Uma linha com o badge em todas as cores. */
function Todas(props: Omit<BadgeProps, 'cor' | 'rotulo'>) {
  const { t, tc } = useT();
  return (
    <div className="demo-linha demo-linha--centro">
      {CORES(t).map((c) => (
        <Badge key={c.cor} cor={c.cor} rotulo={tc(c.nome)} {...props} />
      ))}
    </div>
  );
}

// recebe o `t` do componente: os textos ficam no dicionário
const titulosDe = (t: TradutorDemo['t']): [string, ReactNode][] => [
  ['h1', <h1 key="1">{t('paginas.badges.textos.tituloDeExemplo')}<Badge tamanho="herdar" rotulo={t('paginas.badges.textos.novo')} /></h1>],
  ['h2', <h2 key="2">{t('paginas.badges.textos.tituloDeExemplo')}<Badge tamanho="herdar" rotulo={t('paginas.badges.textos.novo')} /></h2>],
  ['h3', <h3 key="3">{t('paginas.badges.textos.tituloDeExemplo')}<Badge tamanho="herdar" rotulo={t('paginas.badges.textos.novo')} /></h3>],
  ['h4', <h4 key="4">{t('paginas.badges.textos.tituloDeExemplo')}<Badge tamanho="herdar" rotulo={t('paginas.badges.textos.novo')} /></h4>],
  ['h5', <h5 key="5">{t('paginas.badges.textos.tituloDeExemplo')}<Badge tamanho="herdar" rotulo={t('paginas.badges.textos.novo')} /></h5>],
  ['h6', <h6 key="6">{t('paginas.badges.textos.tituloDeExemplo')}<Badge tamanho="herdar" rotulo={t('paginas.badges.textos.novo')} /></h6>],
];

const CHIPS = (t: TradutorDemo['t']) => ([t('paginas.badges.textos.pix'), 'PR', t('paginas.badges.textos.pago')]);

export function PaginaBadges() {
  const { t, tc } = useT();
  const [chips, setChips] = useState(CHIPS(t));

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.badges.titulo')} icone="tag" trilha />

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.badges.secoes.padrao')}>
          <Todas />
        </Bloco>
        <Bloco titulo={t('paginas.badges.secoes.pilula')}>
          <Todas formato="pilula" />
        </Bloco>
        <Bloco titulo={t('paginas.badges.secoes.suaves')}>
          <Todas aparencia="suave" />
        </Bloco>
        <Bloco titulo={t('paginas.badges.secoes.suavesEmPilula')}>
          <Todas aparencia="suave" formato="pilula" />
        </Bloco>
        <Bloco titulo={t('paginas.badges.secoes.contorno')}>
          <Todas aparencia="contorno" />
        </Bloco>
        <Bloco titulo={t('paginas.badges.secoes.contornoEmPilula')}>
          <Todas aparencia="contorno" formato="pilula" />
        </Bloco>
        <Bloco titulo={t('paginas.badges.secoes.gradiente')}>
          <Todas aparencia="gradiente" />
        </Bloco>
        <Bloco titulo={t('paginas.badges.secoes.gradienteEmPilula')}>
          <Todas aparencia="gradiente" formato="pilula" />
        </Bloco>
      </div>

      <Bloco titulo={t('paginas.badges.secoes.botoesComBadges')} descricao={t('paginas.badges.textos.badgeInversoFundoClaro')}>
        <div className="demo-linha">
          <Botao severidade="err">{t('paginas.badges.textos.notificacoes')}<Badge cor="err" aparencia="inverso" rotulo="777" />
          </Botao>
          <Botao>{t('paginas.badges.textos.notificacoes')}<Badge cor="pri" aparencia="inverso" rotulo="4" />
          </Botao>
          <Botao severidade="ok">{t('paginas.badges.textos.notificacoes')}<Badge cor="ok" aparencia="inverso" rotulo="12" />
          </Botao>
          <Botao severidade="warn">{t('paginas.badges.textos.notificacoes')}<Badge cor="warn" aparencia="inverso" rotulo="7" />
          </Botao>
          <Botao severidade="secundario">{t('paginas.badges.textos.notificacoes')}<Badge cor="neutral" rotulo="32" />
          </Botao>
        </div>
      </Bloco>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.badges.secoes.botoesComBadgesColoridos')}>
          <div className="demo-linha">
            <Botao>{t('paginas.badges.textos.pedidos')}<Badge cor="destaque" rotulo="4" />
            </Botao>
            <Botao severidade="ok">{t('paginas.badges.textos.pagos')}<Badge cor="pri" rotulo="7" />
            </Botao>
            <Botao severidade="err">{t('paginas.badges.textos.cancelados')}<Badge cor="warn" rotulo="12" />
            </Botao>
            <Botao severidade="secundario">{t('paginas.badges.textos.rascunhos')}<Badge cor="info" rotulo="32" />
            </Botao>
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.badges.secoes.botoesDeContornoCom')}>
          <div className="demo-linha">
            <Botao aparencia="contorno">{t('paginas.badges.textos.pedidos')}<Badge cor="pri" rotulo="4" />
            </Botao>
            <Botao aparencia="contorno" severidade="err">{t('paginas.badges.textos.cancelados')}<Badge cor="err" rotulo="7" />
            </Botao>
            <Botao aparencia="contorno" severidade="ok">{t('paginas.badges.textos.pagos')}<Badge cor="ok" rotulo="12" />
            </Botao>
            <Botao aparencia="contorno" severidade="secundario">{t('paginas.badges.textos.rascunhos')}<Badge cor="neutral" aparencia="suave" rotulo="32" />
            </Botao>
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.badges.secoes.emTitulos')} descricao={t('paginas.badges.textos.tamanhoHerdarAcompanhaO')}>
          <div className="demo-badges-titulos">{titulosDe(t).map(([, el]) => el)}</div>
        </Bloco>

        <div className="demo-pilha">
          <Bloco titulo={t('paginas.badges.secoes.posicionados')} descricao={t('paginas.badges.textos.combadgePoeOPonto')}>
            <div className="demo-linha demo-linha--centro demo-badges-pos">
              <ComBadge ponto cor="ok" descricao={t('paginas.badges.textos.online')}>
                <Avatar nome="Ana Pereira" foto={retrato('#1f5fe0', 'A')} formato="quadrado" tamanho="2.5rem" />
              </ComBadge>
              <ComBadge ponto cor="ok" posicao="inferior-direita" descricao={t('paginas.badges.textos.online')}>
                <Avatar nome="Bruno Lima" foto={retrato('#f7931e', 'B')} tamanho="2.5rem" />
              </ComBadge>
              <ComBadge conteudo={1240} max={999} cor="destaque" descricao={t('paginas.badges.textos.novosAlertas')}>
                <Avatar nome="Carla Dias" foto={retrato('#15803d', 'C')} tamanho="2.5rem" />
              </ComBadge>
              <ComBadge ponto cor="ok" descricao={t('paginas.badges.textos.online')}>
                <Botao rotulo={t('paginas.badges.textos.perfil')} severidade="secundario" />
              </ComBadge>
              <ComBadge conteudo={128} descricao={t('paginas.badges.textos.mensagensNaoLidas')}>
                <Botao rotulo={t('paginas.badges.textos.caixaDeEntrada')} aparencia="contorno" />
              </ComBadge>
            </div>
          </Bloco>

          <Bloco titulo={t('paginas.badges.secoes.personalizados')}>
            <div className="demo-linha demo-linha--centro demo-badges-pos">
              <Badge cor="info" aparencia="contorno" tamanho="medio" icone="house" rotulo={t('paginas.badges.textos.inicio')} />
              <Badge cor="ok" tamanho="medio" icone="house" rotulo={t('paginas.badges.textos.inicio')} />
              <ComBadge conteudo={14} cor="ok" descricao={t('paginas.badges.textos.notificacoes2')}>
                <span className="demo-badge-sino">
                  <Icone icone="bell" />
                </span>
              </ComBadge>
              <Badge cor="neutral" aparencia="suave" tamanho="medio" icone="eye" rotulo={t('paginas.badges.textos.t132Mil')} />
              <ComBadge conteudo={32} cor="ok" descricao={t('paginas.badges.textos.mensagens')}>
                <span className="demo-badge-texto">{t('paginas.badges.textos.caixaDeEntrada')}</span>
              </ComBadge>
            </div>
          </Bloco>
        </div>
      </div>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.badges.secoes.status')} descricao={t('paginas.badges.textos.situacaoDeUmRegistro')}>
          <div className="demo-linha demo-linha--centro">
            <Status rotulo={t('paginas.badges.textos.entregue')} severidade="ok" />
            <Status rotulo={t('paginas.badges.textos.pago')} severidade="info" icone="clock" />
            <Status rotulo={t('paginas.badges.textos.aguardandoPagamento')} severidade="warn" />
            <Status rotulo={t('paginas.badges.textos.cancelado')} severidade="err" />
            <Status rotulo={t('paginas.badges.textos.enviado')} />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.badges.secoes.chipsDeFiltro')} descricao={t('paginas.badges.textos.filtrosAplicadosORemove')}>
          <div className="demo-linha demo-linha--centro">
            {chips.map((c) => (
              <Chip key={c} campo={tc("Filtro")} rotulo={c} aoRemover={() => setChips((l) => l.filter((x) => x !== c))} />
            ))}
            {chips.length === 0 && <Botao rotulo={t('paginas.badges.textos.restaurarFiltros')} severidade="secundario" aparencia="texto" onClick={() => setChips(CHIPS(t))} />}
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.badges.secoes.placaDeVeiculo')} descricao={t('paginas.badges.textos.padraoAntigoOuMercosul')}>
          <div className="demo-linha demo-linha--centro">
            <Placa numero="QBX-7H42" uf="PR" />
            <Placa numero="rta2b19" uf="go" />
            <Placa numero="NJU-4021" uf="SP" />
          </div>
        </Bloco>
      </div>
    </div>
  );
}
