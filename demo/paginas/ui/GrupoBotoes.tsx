import { useState } from 'react';
import { BarraBotoes, Botao, CabecalhoPagina, CampoTexto, GrupoAlternancia, GrupoBotoes, MenuSuspenso, useToast } from '../../../src';
import { Bloco } from '../Bloco';
import { useT } from '../../i18n/useT';

export function PaginaGrupoBotoes() {
  const { t: tx } = useT();
  const { t } = useT();
  const toast = useToast();
  const [aba, setAba] = useState<string | null>('ativos');
  const [colunas, setColunas] = useState<string[]>(['cliente', 'total']);
  const [periodo, setPeriodo] = useState<string | null>('mes');
  const [alinhamento, setAlinhamento] = useState<string | null>('esq');
  const [pagina, setPagina] = useState(1);
  const [tocando, setTocando] = useState(false);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.grupoBotoes.titulo')} icone="layout-grid" trilha />

      <div className="demo-colunas-4">
        <Bloco titulo={t('paginas.grupoBotoes.secoes.basico')}>
          <div>
            <GrupoBotoes rotulo={t('paginas.grupoBotoes.textos.controlesDoPlayer')} severidade="info" formato="retangulo">
              <Botao icone="chevrons-left" dica={t('paginas.grupoBotoes.textos.anterior')} aria-label={t('paginas.grupoBotoes.textos.anterior')} />
              <Botao icone={tocando ? 'circle' : 'arrow-right'} dica={tocando ? t('paginas.grupoBotoes.textos.pausar') : t('paginas.grupoBotoes.textos.tocar')} aria-label={tocando ? t('paginas.grupoBotoes.textos.pausar') : t('paginas.grupoBotoes.textos.tocar')} onClick={() => setTocando((x) => !x)} />
              <Botao icone="chevrons-right" dica={t('paginas.grupoBotoes.textos.proxima')} aria-label={t('paginas.grupoBotoes.textos.proxima')} />
            </GrupoBotoes>
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.grupoBotoes.secoes.navegacao')} descricao={t('paginas.grupoBotoes.textos.oSelecionadoFicaPressionado')}>
          <div>
            <GrupoAlternancia
              rotulo={t('paginas.grupoBotoes.textos.filtroRapido')}
              aparencia="solido"
              formato="retangulo"
              opcoes={[
                { valor: 'ativos', rotulo: t('paginas.grupoBotoes.textos.ativos') },
                { valor: 'pagos', rotulo: t('paginas.grupoBotoes.textos.pagos') },
                { valor: 'todos', rotulo: t('paginas.grupoBotoes.textos.todos') },
              ]}
              valor={aba}
              aoMudar={setAba}
            />
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.grupoBotoes.secoes.estilosMisturados')}>
          <div>
            <GrupoBotoes rotulo={t('paginas.grupoBotoes.textos.decisao')} formato="retangulo">
              <Botao rotulo={t('paginas.grupoBotoes.textos.recusar')} severidade="err" />
              <Botao rotulo={t('paginas.grupoBotoes.textos.adiar')} severidade="warn" />
              <Botao rotulo={t('paginas.grupoBotoes.textos.aprovar')} severidade="ok" />
            </GrupoBotoes>
          </div>
        </Bloco>
        <Bloco titulo={t('paginas.grupoBotoes.secoes.contorno')}>
          <div>
            <GrupoBotoes rotulo={t('paginas.grupoBotoes.textos.alinhamento')} aparencia="contorno" formato="retangulo">
              <Botao rotulo={t('paginas.grupoBotoes.textos.esquerda')} />
              <Botao rotulo={t('paginas.grupoBotoes.textos.centro')} />
              <Botao rotulo={t('paginas.grupoBotoes.textos.direita')} />
            </GrupoBotoes>
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo={t('paginas.grupoBotoes.secoes.selecaoMultipla')} descricao={t('paginas.grupoBotoes.textos.comoCaixasDeMarcacao')}>
          <div>
            <GrupoAlternancia
              multiplo
              rotulo={t('paginas.grupoBotoes.textos.colunasVisiveis')}
              formato="retangulo"
              opcoes={[
                { valor: 'cliente', rotulo: t('paginas.grupoBotoes.textos.cliente') },
                { valor: 'total', rotulo: t('paginas.grupoBotoes.textos.total') },
                { valor: 'entrega', rotulo: t('paginas.grupoBotoes.textos.entrega') },
              ]}
              valor={colunas}
              aoMudar={setColunas}
            />
          </div>
          <code className="demo-util-res">valor: {JSON.stringify(colunas)}</code>
        </Bloco>
        <Bloco titulo={t('paginas.grupoBotoes.secoes.selecaoUnica')} descricao={t('paginas.grupoBotoes.textos.comoRadioSoUm')}>
          <div>
            <GrupoAlternancia
              rotulo={t('paginas.grupoBotoes.textos.periodo')}
              formato="retangulo"
              opcoes={[
                { valor: 'dia', rotulo: t('paginas.grupoBotoes.textos.hoje') },
                { valor: 'semana', rotulo: t('paginas.grupoBotoes.textos.semana') },
                { valor: 'mes', rotulo: t('paginas.grupoBotoes.textos.mes') },
              ]}
              valor={periodo}
              aoMudar={setPeriodo}
            />
          </div>
          <code className="demo-util-res">valor: {JSON.stringify(periodo)}</code>
        </Bloco>

        <Bloco titulo={t('paginas.grupoBotoes.secoes.tamanhos')}>
          <div className="demo-linha demo-linha--centro">
            {(['grande', 'medio', 'pequeno'] as const).map((t) => (
              <GrupoBotoes key={t} rotulo={tx('paginas.grupoBotoes.textos.grupoT', { t })} severidade="ok" aparencia="contorno" formato="retangulo" tamanho={t}>
                <Botao rotulo={tx('paginas.grupoBotoes.textos.esquerda')} />
                <Botao rotulo={tx('paginas.grupoBotoes.textos.centro')} />
                <Botao rotulo={tx('paginas.grupoBotoes.textos.direita')} />
              </GrupoBotoes>
            ))}
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.grupoBotoes.secoes.vertical')}>
          <div className="demo-linha" style={{ alignItems: 'flex-start', gap: '1.5rem' }}>
            <GrupoBotoes orientacao="vertical" rotulo={t('paginas.grupoBotoes.textos.acoesDoPedido')}>
              <Botao rotulo={t('paginas.grupoBotoes.textos.editar')} icone="pencil" />
              <Botao rotulo={t('paginas.grupoBotoes.textos.duplicar')} icone="copy" />
              <Botao rotulo={t('paginas.grupoBotoes.textos.imprimir')} icone="printer" />
              <Botao rotulo={t('paginas.grupoBotoes.textos.enviar')} icone="send" />
            </GrupoBotoes>
            <GrupoBotoes orientacao="vertical" rotulo={t('paginas.grupoBotoes.textos.exportar')} severidade="info">
              <Botao rotulo={t('paginas.grupoBotoes.textos.pdf')} />
              <Botao rotulo={t('paginas.grupoBotoes.textos.excel')} />
              <Botao rotulo={t('paginas.grupoBotoes.textos.csv')} />
            </GrupoBotoes>
            <GrupoAlternancia
              orientacao="vertical"
              rotulo={t('paginas.grupoBotoes.textos.alinhamentoDoTexto')}
              severidade="err"
              opcoes={[
                { valor: 'esq', rotulo: t('paginas.grupoBotoes.textos.esquerda') },
                { valor: 'cen', rotulo: t('paginas.grupoBotoes.textos.centro') },
                { valor: 'dir', rotulo: t('paginas.grupoBotoes.textos.direita') },
              ]}
              valor={alinhamento}
              aoMudar={setAlinhamento}
            />
          </div>
        </Bloco>

        <Bloco titulo={t('paginas.grupoBotoes.secoes.barraDeFerramentas')} descricao={t('paginas.grupoBotoes.textos.barrabotoesAgrupaVariosGrupos')}>
          <BarraBotoes rotulo={t('paginas.grupoBotoes.textos.paginacaoEAcoes')}>
            <GrupoAlternancia
              rotulo={t('paginas.grupoBotoes.textos.paginas')}
              aparencia="suave"
              formato="retangulo"
              opcoes={[1, 2, 3, 4].map((n) => ({ valor: n, rotulo: String(n) }))}
              valor={pagina}
              aoMudar={setPagina}
            />
            <GrupoBotoes rotulo={t('paginas.grupoBotoes.textos.maisPaginas')} severidade="destaque" formato="retangulo">
              <Botao rotulo="5" />
              <Botao rotulo="6" />
              <Botao rotulo="7" />
            </GrupoBotoes>
            <Botao rotulo="8" severidade="info" formato="retangulo" />
          </BarraBotoes>
          <BarraBotoes rotulo={t('paginas.grupoBotoes.textos.buscaEAcoes')} distribuicao="entre">
            <GrupoBotoes rotulo={t('paginas.grupoBotoes.textos.acoes')} severidade="err" aparencia="contorno" formato="retangulo">
              <Botao icone="pencil" dica={t('paginas.grupoBotoes.textos.editar')} aria-label={t('paginas.grupoBotoes.textos.editar')} />
              <Botao icone="copy" dica={t('paginas.grupoBotoes.textos.duplicar')} aria-label={t('paginas.grupoBotoes.textos.duplicar')} />
              <Botao icone="trash-2" dica={t('paginas.grupoBotoes.textos.excluir')} aria-label={t('paginas.grupoBotoes.textos.excluir')} onClick={() => toast.warn(t('paginas.grupoBotoes.textos.excluir'))} />
            </GrupoBotoes>
            <CampoTexto rotulo={t('paginas.grupoBotoes.textos.buscar')} variante="inline" prefixo="@" placeholder={t('paginas.grupoBotoes.textos.clienteOuPedido')} />
          </BarraBotoes>
        </Bloco>

        <Bloco titulo={t('paginas.grupoBotoes.secoes.aninhado')} descricao={t('paginas.grupoBotoes.textos.umGrupoDentroDo')}>
          <div>
            <GrupoBotoes rotulo={t('paginas.grupoBotoes.textos.acoesComMaisOpcoes')} formato="retangulo">
              <Botao rotulo={t('paginas.grupoBotoes.textos.salvar')} icone="save" />
              <Botao rotulo={t('paginas.grupoBotoes.textos.salvarEEnviar')} icone="send" />
              <MenuSuspenso
                icone="chevron-down"
                semSeta
                aria-label={t('paginas.grupoBotoes.textos.maisOpcoes')}
                alinhamento="fim"
                itens={[
                  { id: 'rascunho', rotulo: t('paginas.grupoBotoes.textos.salvarComoRascunho'), icone: 'file-pen' },
                  { id: 'modelo', rotulo: t('paginas.grupoBotoes.textos.salvarComoModelo'), icone: 'copy' },
                ]}
                aoEscolher={(id) => toast.info(t('paginas.grupoBotoes.textos.maisOpcoes'), id)}
              />
            </GrupoBotoes>
          </div>
        </Bloco>
      </div>
    </div>
  );
}
