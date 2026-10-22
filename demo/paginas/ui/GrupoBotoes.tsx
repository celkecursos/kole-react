import { useState } from 'react';
import { BarraBotoes, Botao, CabecalhoPagina, CampoTexto, GrupoAlternancia, GrupoBotoes, MenuSuspenso, useToast } from '../../../src';
import { Bloco } from '../Bloco';

export function PaginaGrupoBotoes() {
  const toast = useToast();
  const [aba, setAba] = useState<string | null>('ativos');
  const [colunas, setColunas] = useState<string[]>(['cliente', 'total']);
  const [periodo, setPeriodo] = useState<string | null>('mes');
  const [alinhamento, setAlinhamento] = useState<string | null>('esq');
  const [pagina, setPagina] = useState(1);
  const [tocando, setTocando] = useState(false);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Grupo de botões" icone="layout-grid" trilha />

      <div className="demo-colunas-4">
        <Bloco titulo="Básico">
          <div>
            <GrupoBotoes rotulo="Controles do player" severidade="info" formato="retangulo">
              <Botao icone="chevrons-left" dica="Anterior" aria-label="Anterior" />
              <Botao icone={tocando ? 'circle' : 'arrow-right'} dica={tocando ? 'Pausar' : 'Tocar'} aria-label={tocando ? 'Pausar' : 'Tocar'} onClick={() => setTocando((x) => !x)} />
              <Botao icone="chevrons-right" dica="Próxima" aria-label="Próxima" />
            </GrupoBotoes>
          </div>
        </Bloco>
        <Bloco titulo="Navegação" descricao="O selecionado fica pressionado.">
          <div>
            <GrupoAlternancia
              rotulo="Filtro rápido"
              aparencia="solido"
              formato="retangulo"
              opcoes={[
                { valor: 'ativos', rotulo: 'Ativos' },
                { valor: 'pagos', rotulo: 'Pagos' },
                { valor: 'todos', rotulo: 'Todos' },
              ]}
              valor={aba}
              aoMudar={setAba}
            />
          </div>
        </Bloco>
        <Bloco titulo="Estilos misturados">
          <div>
            <GrupoBotoes rotulo="Decisão" formato="retangulo">
              <Botao rotulo="Recusar" severidade="err" />
              <Botao rotulo="Adiar" severidade="warn" />
              <Botao rotulo="Aprovar" severidade="ok" />
            </GrupoBotoes>
          </div>
        </Bloco>
        <Bloco titulo="Contorno">
          <div>
            <GrupoBotoes rotulo="Alinhamento" aparencia="contorno" formato="retangulo">
              <Botao rotulo="Esquerda" />
              <Botao rotulo="Centro" />
              <Botao rotulo="Direita" />
            </GrupoBotoes>
          </div>
        </Bloco>
      </div>

      <div className="demo-colunas">
        <Bloco titulo="Seleção múltipla" descricao="Como caixas de marcação: cada botão liga/desliga.">
          <div>
            <GrupoAlternancia
              multiplo
              rotulo="Colunas visíveis"
              formato="retangulo"
              opcoes={[
                { valor: 'cliente', rotulo: 'Cliente' },
                { valor: 'total', rotulo: 'Total' },
                { valor: 'entrega', rotulo: 'Entrega' },
              ]}
              valor={colunas}
              aoMudar={setColunas}
            />
          </div>
          <code className="demo-util-res">valor: {JSON.stringify(colunas)}</code>
        </Bloco>
        <Bloco titulo="Seleção única" descricao="Como rádio: só um fica marcado.">
          <div>
            <GrupoAlternancia
              rotulo="Período"
              formato="retangulo"
              opcoes={[
                { valor: 'dia', rotulo: 'Hoje' },
                { valor: 'semana', rotulo: 'Semana' },
                { valor: 'mes', rotulo: 'Mês' },
              ]}
              valor={periodo}
              aoMudar={setPeriodo}
            />
          </div>
          <code className="demo-util-res">valor: {JSON.stringify(periodo)}</code>
        </Bloco>

        <Bloco titulo="Tamanhos">
          <div className="demo-linha demo-linha--centro">
            {(['grande', 'medio', 'pequeno'] as const).map((t) => (
              <GrupoBotoes key={t} rotulo={`Grupo ${t}`} severidade="ok" aparencia="contorno" formato="retangulo" tamanho={t}>
                <Botao rotulo="Esquerda" />
                <Botao rotulo="Centro" />
                <Botao rotulo="Direita" />
              </GrupoBotoes>
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Vertical">
          <div className="demo-linha" style={{ alignItems: 'flex-start', gap: '1.5rem' }}>
            <GrupoBotoes orientacao="vertical" rotulo="Ações do pedido">
              <Botao rotulo="Editar" icone="pencil" />
              <Botao rotulo="Duplicar" icone="copy" />
              <Botao rotulo="Imprimir" icone="printer" />
              <Botao rotulo="Enviar" icone="send" />
            </GrupoBotoes>
            <GrupoBotoes orientacao="vertical" rotulo="Exportar" severidade="info">
              <Botao rotulo="PDF" />
              <Botao rotulo="Excel" />
              <Botao rotulo="CSV" />
            </GrupoBotoes>
            <GrupoAlternancia
              orientacao="vertical"
              rotulo="Alinhamento do texto"
              severidade="err"
              opcoes={[
                { valor: 'esq', rotulo: 'Esquerda' },
                { valor: 'cen', rotulo: 'Centro' },
                { valor: 'dir', rotulo: 'Direita' },
              ]}
              valor={alinhamento}
              aoMudar={setAlinhamento}
            />
          </div>
        </Bloco>

        <Bloco titulo="Barra de ferramentas" descricao="BarraBotoes agrupa vários grupos (e campos) lado a lado.">
          <BarraBotoes rotulo="Paginação e ações">
            <GrupoAlternancia
              rotulo="Páginas"
              aparencia="suave"
              formato="retangulo"
              opcoes={[1, 2, 3, 4].map((n) => ({ valor: n, rotulo: String(n) }))}
              valor={pagina}
              aoMudar={setPagina}
            />
            <GrupoBotoes rotulo="Mais páginas" severidade="destaque" formato="retangulo">
              <Botao rotulo="5" />
              <Botao rotulo="6" />
              <Botao rotulo="7" />
            </GrupoBotoes>
            <Botao rotulo="8" severidade="info" formato="retangulo" />
          </BarraBotoes>
          <BarraBotoes rotulo="Busca e ações" distribuicao="entre">
            <GrupoBotoes rotulo="Ações" severidade="err" aparencia="contorno" formato="retangulo">
              <Botao icone="pencil" dica="Editar" aria-label="Editar" />
              <Botao icone="copy" dica="Duplicar" aria-label="Duplicar" />
              <Botao icone="trash-2" dica="Excluir" aria-label="Excluir" onClick={() => toast.warn('Excluir')} />
            </GrupoBotoes>
            <CampoTexto rotulo="Buscar" variante="inline" prefixo="@" placeholder="cliente ou pedido" />
          </BarraBotoes>
        </Bloco>

        <Bloco titulo="Aninhado" descricao="Um grupo dentro do outro; o último vira o botão de mais opções.">
          <div>
            <GrupoBotoes rotulo="Ações com mais opções" formato="retangulo">
              <Botao rotulo="Salvar" icone="save" />
              <Botao rotulo="Salvar e enviar" icone="send" />
              <MenuSuspenso
                icone="chevron-down"
                semSeta
                aria-label="Mais opções"
                alinhamento="fim"
                itens={[
                  { id: 'rascunho', rotulo: 'Salvar como rascunho', icone: 'file-pen' },
                  { id: 'modelo', rotulo: 'Salvar como modelo', icone: 'copy' },
                ]}
                aoEscolher={(id) => toast.info('Mais opções', id)}
              />
            </GrupoBotoes>
          </div>
        </Bloco>
      </div>
    </div>
  );
}
