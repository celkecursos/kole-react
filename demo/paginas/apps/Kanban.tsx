import { useMemo, useState, type ReactNode } from 'react';
import {
  Botao,
  CabecalhoPagina,
  CampoData,
  CampoMarcacao,
  CampoSelect,
  CampoSelectMultiplo,
  CampoTextarea,
  CampoTexto,
  Card,
  CartaoKanban,
  Dialogo,
  Escolha,
  GrupoAvatares,
  Kanban,
  ListaCards,
  PRIORIDADES,
  Progresso,
  Vazio,
  normalizar,
  tempoRelativo,
  useConfirmacao,
  useToast,
  type CorKanban,
  type Prioridade,
} from '../../../src';
import {
  ETIQUETAS,
  PESSOAS,
  dia,
  etiquetas,
  formatarMoeda,
  pessoa,
  pessoas,
  quadrosIniciais,
  type CartaoDemo,
  type ColunaDemo,
  type QuadroDemo,
} from './dados';
import './apps.css';
import { useT } from '../../i18n/useT';

const OPCOES_PRIORIDADE = (Object.keys(PRIORIDADES) as Prioridade[]).map((p) => ({ valor: p, rotulo: PRIORIDADES[p].rotulo }));
const OPCOES_PESSOAS = PESSOAS.map((p) => ({ valor: p.id, rotulo: p.nome }));
const OPCOES_ETIQUETAS = ETIQUETAS.map((e) => ({ valor: e.id, rotulo: e.rotulo }));
const CORES_QUADRO: { valor: CorKanban; rotulo: string }[] = [
  { valor: 'pri', rotulo: 'Azul' },
  { valor: 'graf-3', rotulo: 'Verde' },
  { valor: 'graf-2', rotulo: 'Laranja' },
  { valor: 'graf-4', rotulo: 'Roxo' },
  { valor: 'graf-5', rotulo: 'Rosa' },
];

const contarCartoes = (q: QuadroDemo) => q.colunas.reduce((n, c) => n + c.itens.length, 0);
const concluidos = (q: QuadroDemo) => q.colunas.find((c) => c.id === q.colunaConcluida)?.itens.length ?? 0;
const novoId = (prefixo: string) => `${prefixo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/** Listagem (/apps/kanban) e quadro (/apps/kanban/<id>), com os quadros guardados aqui enquanto a demo está aberta. */
export function PaginaKanban({ rota, navegar }: { rota: string; navegar: (rota: string) => void }) {
  const { t } = useT();
  const [quadros, setQuadros] = useState(quadrosIniciais);
  const id = rota.startsWith('/apps/kanban/') ? rota.slice('/apps/kanban/'.length) : null;
  const alterar = (qid: string, f: (q: QuadroDemo) => QuadroDemo) => setQuadros((qs) => qs.map((q) => (q.id === qid ? { ...f(q), atualizado: new Date() } : q)));
  const alternarFavorito = (qid: string) => setQuadros((qs) => qs.map((q) => (q.id === qid ? { ...q, favorito: !q.favorito } : q)));

  if (!id)
    return (
      <ListaQuadros
        quadros={quadros}
        abrir={(q) => navegar(`/apps/kanban/${q.id}`)}
        alternarFavorito={alternarFavorito}
        criar={(q) => {
          setQuadros((qs) => [q, ...qs]);
          navegar(`/apps/kanban/${q.id}`);
        }}
      />
    );

  const quadro = quadros.find((q) => q.id === id);
  if (!quadro)
    return (
      <div className="demo-pilha">
        <CabecalhoPagina titulo={t('paginas.kanban.textos.naoEncontrado')} icone="square-kanban" />
        <Vazio titulo="Quadro não encontrado" descricao="O quadro que você procura não existe ou foi excluído." icone="square-kanban">
          <Botao rotulo="Voltar para os quadros" icone="arrow-left" onClick={() => navegar('/apps/kanban')} />
        </Vazio>
      </div>
    );

  return <PaginaQuadro key={quadro.id} quadro={quadro} alterar={(f) => alterar(quadro.id, f)} alternarFavorito={() => alternarFavorito(quadro.id)} />;
}

// ------------------------------------------------------------- listagem

function ListaQuadros({
  quadros,
  abrir,
  alternarFavorito,
  criar,
}: {
  quadros: QuadroDemo[];
  abrir: (q: QuadroDemo) => void;
  alternarFavorito: (id: string) => void;
  criar: (q: QuadroDemo) => void;
}) {
  const { t } = useT();
  const [busca, setBusca] = useState('');
  const [criando, setCriando] = useState(false);
  const termo = normalizar(busca);
  const achados = quadros.filter((q) => !termo || normalizar(`${q.nome} ${q.descricao}`).includes(termo));
  const favoritos = achados.filter((q) => q.favorito);

  const card = (q: QuadroDemo) => {
    const total = contarCartoes(q);
    const feitos = concluidos(q);
    return (
      <Card
        className={`demo-quadro lp-kb-cor--${q.cor}`}
        aoClicar={() => abrir(q)}
        aria-label={`Abrir o quadro ${q.nome}`}
        titulo={q.nome}
        subtitulo={q.descricao}
        ferramentas={
          <Botao
            icone="star"
            aparencia="texto"
            severidade={q.favorito ? 'destaque' : 'secundario'}
            tamanho="pequeno"
            pressionado={q.favorito}
            aria-label={q.favorito ? `Tirar ${q.nome} dos favoritos` : `Favoritar ${q.nome}`}
            dica={q.favorito ? 'Tirar dos favoritos' : 'Favoritar'}
            className={q.favorito ? 'demo-favorito is-favorito' : 'demo-favorito'}
            onClick={() => alternarFavorito(q.id)}
          />
        }
        rodape={
          <div className="demo-quadro-rodape">
            <GrupoAvatares pessoas={pessoas(q.membros)} rotulo="Membros" />
            <small>Atualizado {tempoRelativo(q.atualizado)}</small>
          </div>
        }
      >
        <div className="demo-quadro-numeros">
          <span>
            {q.colunas.length} {q.colunas.length === 1 ? 'coluna' : 'colunas'}
          </span>
          <span>
            {total} {total === 1 ? 'cartão' : 'cartões'}
          </span>
        </div>
        {total > 0 && q.colunaConcluida && (
          <Progresso valor={feitos} max={total} altura="sm" mostrarValor="fim" cor="ok" rotulo={`Concluídos em ${q.nome}`} />
        )}
      </Card>
    );
  };

  return (
    <div className="demo-pilha">
      <CabecalhoPagina
        titulo={t('paginas.kanban.titulo')}
        icone="square-kanban"
        trilha
        acoes={<Botao rotulo="Criar quadro" icone="plus" onClick={() => setCriando(true)} />}
      >
        Organize projetos e tarefas em colunas.
      </CabecalhoPagina>
      <div className="demo-apps-barra">
        <CampoTexto icone="search" placeholder="Buscar quadro" aria-label="Buscar quadro" valor={busca} aoMudar={setBusca} />
      </div>
      {favoritos.length > 0 && (
        <section className="demo-apps-secao" aria-labelledby="quadros-favoritos">
          <h2 id="quadros-favoritos" className="demo-apps-secao-titulo">
            Favoritos
          </h2>
          <ListaCards itens={favoritos} card={card} chave={(q) => q.id} larguraMin="17rem" rotulo="Quadros favoritos" />
        </section>
      )}
      <section className="demo-apps-secao" aria-labelledby="quadros-todos">
        <h2 id="quadros-todos" className="demo-apps-secao-titulo">
          Todos os quadros
        </h2>
        <ListaCards
          itens={achados}
          card={card}
          chave={(q) => q.id}
          larguraMin="17rem"
          rotulo="Todos os quadros"
          vazioTitulo={busca ? 'Nenhum quadro encontrado' : 'Nenhum quadro ainda'}
          vazioDescricao={busca ? 'Tente outra busca.' : 'Crie o primeiro quadro para organizar projetos e tarefas.'}
          vazioIcone="square-kanban"
        />
      </section>
      <DialogoNovoQuadro aberto={criando} aoFechar={() => setCriando(false)} aoCriar={criar} />
    </div>
  );
}

function DialogoNovoQuadro({ aberto, aoFechar, aoCriar }: { aberto: boolean; aoFechar: () => void; aoCriar: (q: QuadroDemo) => void }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cor, setCor] = useState<CorKanban>('pri');
  const [modelo, setModelo] = useState<'basico' | 'vazio'>('basico');
  const [erro, setErro] = useState('');
  const fechar = () => {
    setNome('');
    setDescricao('');
    setErro('');
    aoFechar();
  };
  const criar = () => {
    if (!nome.trim()) return setErro('Informe o nome do quadro.');
    const colunas: ColunaDemo[] =
      modelo === 'basico'
        ? [
            { id: novoId('col'), titulo: 'A fazer', cor: 'neutro', itens: [] },
            { id: novoId('col'), titulo: 'Em andamento', cor: 'info', itens: [] },
            { id: 'feito', titulo: 'Concluído', cor: 'ok', itens: [] },
          ]
        : [];
    aoCriar({
      id: novoId('quadro'),
      nome: nome.trim(),
      descricao: descricao.trim(),
      cor,
      favorito: false,
      atualizado: new Date(),
      membros: ['ana'],
      colunaConcluida: modelo === 'basico' ? 'feito' : undefined,
      colunas,
    });
    fechar();
  };
  return (
    <Dialogo
      aberto={aberto}
      aoFechar={fechar}
      titulo="Criar quadro"
      icone="square-kanban"
      rodape={
        <>
          <Botao rotulo="Cancelar" aparencia="contorno" severidade="secundario" onClick={fechar} />
          <Botao rotulo="Criar quadro" icone="plus" onClick={criar} />
        </>
      }
    >
      <div className="demo-apps-form">
        <CampoTexto rotulo="Nome" obrigatorio valor={nome} aoMudar={(v) => (setNome(v), setErro(''))} erro={erro} autoFocus />
        <CampoTextarea rotulo="Descrição" valor={descricao} aoMudar={setDescricao} rows={2} />
        <CampoSelect rotulo="Cor" opcoes={CORES_QUADRO} valor={cor} aoMudar={(v) => v && setCor(v)} />
        <Escolha
          rotulo="Colunas"
          opcoes={[
            { valor: 'basico', rotulo: 'A fazer, Em andamento, Concluído' },
            { valor: 'vazio', rotulo: 'Começar sem colunas' },
          ]}
          valor={modelo}
          aoMudar={(v) => setModelo(v as 'basico' | 'vazio')}
          aparencia="radio"
        />
      </div>
    </Dialogo>
  );
}

// ---------------------------------------------------------------- quadro

function PaginaQuadro({
  quadro,
  alterar,
  alternarFavorito,
}: {
  quadro: QuadroDemo;
  alterar: (f: (q: QuadroDemo) => QuadroDemo) => void;
  alternarFavorito: () => void;
}) {
  const toast = useToast();
  const confirmar = useConfirmacao();
  const [busca, setBusca] = useState('');
  const [filtroEtiquetas, setFiltroEtiquetas] = useState<string[]>([]);
  const [filtroPessoas, setFiltroPessoas] = useState<string[]>([]);
  const [filtroPrioridades, setFiltroPrioridades] = useState<Prioridade[]>([]);
  // cartão aberto no detalhe: id existente, ou { coluna } para um novo
  const [aberto, setAberto] = useState<{ id?: string; coluna: string } | null>(null);

  const temFiltro = !!(busca || filtroEtiquetas.length || filtroPessoas.length || filtroPrioridades.length);
  const termo = normalizar(busca);
  const filtro = useMemo(() => {
    if (!temFiltro) return undefined;
    return (c: CartaoDemo) =>
      (!termo || normalizar(`${c.titulo} ${c.descricao ?? ''} ${c.negocio?.empresa ?? ''}`).includes(termo)) &&
      (!filtroEtiquetas.length || filtroEtiquetas.some((e) => c.etiquetas.includes(e))) &&
      (!filtroPessoas.length || filtroPessoas.some((p) => c.responsaveis.includes(p))) &&
      (!filtroPrioridades.length || (!!c.prioridade && filtroPrioridades.includes(c.prioridade)));
  }, [temFiltro, termo, filtroEtiquetas, filtroPessoas, filtroPrioridades]);
  const limpar = () => {
    setBusca('');
    setFiltroEtiquetas([]);
    setFiltroPessoas([]);
    setFiltroPrioridades([]);
  };

  const colunas = quadro.colunas;
  const mudarColunas = (f: (cs: ColunaDemo[]) => ColunaDemo[]) => alterar((q) => ({ ...q, colunas: f(q.colunas) }));
  const colunaDe = (id: string) => colunas.find((c) => c.itens.some((i) => i.id === id));
  const cartaoAberto = aberto?.id ? colunas.flatMap((c) => c.itens).find((i) => i.id === aberto.id) : undefined;

  const salvarCartao = (c: CartaoDemo, colunaId: string) => {
    mudarColunas((cs) => {
      const semEle = cs.map((col) => ({ ...col, itens: col.itens.filter((i) => i.id !== c.id) }));
      const daqui = cs.find((col) => col.itens.some((i) => i.id === c.id));
      return semEle.map((col) => {
        if (col.id !== colunaId) return col;
        // na mesma coluna, fica no lugar; em outra, vai para o fim
        if (daqui?.id === colunaId) {
          const i = daqui.itens.findIndex((x) => x.id === c.id);
          const itens = [...col.itens];
          itens.splice(i, 0, c);
          return { ...col, itens };
        }
        return { ...col, itens: [...col.itens, c] };
      });
    });
    toast.ok(aberto?.id ? 'Cartão salvo' : 'Cartão criado');
    setAberto(null);
  };

  const excluirCartao = async (c: CartaoDemo) => {
    if (!(await confirmar.remover({ titulo: 'Excluir o cartão?', mensagem: `"${c.titulo}" será excluído.`, rotuloAceitar: 'Excluir' }))) return;
    mudarColunas((cs) => cs.map((col) => ({ ...col, itens: col.itens.filter((i) => i.id !== c.id) })));
    setAberto(null);
    toast.ok('Cartão excluído');
  };

  return (
    <div className="demo-pilha">
      <CabecalhoPagina
        titulo={quadro.nome}
        icone="square-kanban"
        trilha
        acoes={
          <div className="demo-apps-acoes">
            <GrupoAvatares pessoas={pessoas(quadro.membros)} rotulo="Membros" max={4} tamanho="2rem" />
            <Botao
              icone="star"
              aparencia="contorno"
              severidade={quadro.favorito ? 'destaque' : 'secundario'}
              pressionado={quadro.favorito}
              aria-label={quadro.favorito ? 'Tirar dos favoritos' : 'Favoritar'}
              dica={quadro.favorito ? 'Tirar dos favoritos' : 'Favoritar'}
              className={quadro.favorito ? 'demo-favorito is-favorito' : 'demo-favorito'}
              onClick={alternarFavorito}
            />
            {colunas.length > 0 && <Botao rotulo="Novo cartão" icone="plus" onClick={() => setAberto({ coluna: colunas[0].id })} />}
          </div>
        }
      >
        {quadro.descricao}
      </CabecalhoPagina>

      {colunas.length > 0 && (
        <div className="demo-apps-filtros" role="search" aria-label="Filtrar cartões">
          <CampoTexto icone="search" placeholder="Buscar cartões" aria-label="Buscar cartões" valor={busca} aoMudar={setBusca} />
          <CampoSelectMultiplo placeholder="Etiquetas" aria-label="Etiquetas" opcoes={OPCOES_ETIQUETAS} valor={filtroEtiquetas} aoMudar={setFiltroEtiquetas} />
          <CampoSelectMultiplo placeholder="Responsáveis" aria-label="Responsáveis" opcoes={OPCOES_PESSOAS} valor={filtroPessoas} aoMudar={setFiltroPessoas} />
          <CampoSelectMultiplo placeholder="Prioridade" aria-label="Prioridade" opcoes={OPCOES_PRIORIDADE} valor={filtroPrioridades} aoMudar={setFiltroPrioridades} />
          {temFiltro && <Botao rotulo="Limpar" icone="funnel-x" aparencia="texto" severidade="secundario" onClick={limpar} />}
        </div>
      )}

      <Kanban<CartaoDemo, ColunaDemo>
        rotulo={`Quadro ${quadro.nome}`}
        colunas={colunas}
        aoMudar={(cs) => mudarColunas(() => cs)}
        aoSoltar={({ item, para, de }) => {
          if (para.coluna !== de.coluna) toast.info(`"${item.titulo}" foi para ${colunas.find((c) => c.id === para.coluna)?.titulo}`);
        }}
        aoSoltarColuna={() => toast.info('Ordem das colunas salva')}
        filtro={filtro}
        nomeItem={(c) => c.titulo}
        renderCartao={(c, alca) => (
          <CartaoQuadro cartao={c} alca={alca} concluido={colunaDe(c.id)?.id === quadro.colunaConcluida} abrir={() => setAberto({ id: c.id, coluna: colunaDe(c.id)!.id })} />
        )}
        aoAdicionarCartao={(colunaId, titulo) =>
          mudarColunas((cs) => cs.map((c) => (c.id === colunaId ? { ...c, itens: [...c.itens, { id: novoId('c'), titulo, etiquetas: [], responsaveis: [], subtarefas: [], comentarios: [] }] } : c)))
        }
        aoAdicionarColuna={(titulo) => mudarColunas((cs) => [...cs, { id: novoId('col'), titulo, itens: [] }])}
        aoRenomearColuna={(cid, titulo) => mudarColunas((cs) => cs.map((c) => (c.id === cid ? { ...c, titulo } : c)))}
        aoRecolherColuna={(cid, recolhida) => mudarColunas((cs) => cs.map((c) => (c.id === cid ? { ...c, recolhida } : c)))}
        aoExcluirColuna={async (cid) => {
          const col = colunas.find((c) => c.id === cid)!;
          const n = col.itens.length;
          const ok = await confirmar.remover({
            titulo: `Excluir a coluna "${col.titulo}"?`,
            mensagem: n ? `Os ${n === 1 ? 'cartão dela também será excluído' : `${n} cartões dela também serão excluídos`}.` : 'A coluna está vazia.',
            rotuloAceitar: 'Excluir coluna',
          });
          if (ok) mudarColunas((cs) => cs.filter((c) => c.id !== cid));
        }}
        acoesColuna={(c) => [{ id: 'limite', rotulo: c.limite ? `Tirar o limite (${c.limite})` : 'Limitar a 3 cartões', icone: 'sliders-horizontal' }]}
        aoEscolherAcaoColuna={(acao, c) => {
          if (acao === 'limite') mudarColunas((cs) => cs.map((x) => (x.id === c.id ? { ...x, limite: x.limite ? undefined : 3 } : x)));
        }}
      />

      {aberto && (
        <DialogoCartao
          key={aberto.id ?? 'novo'}
          cartao={cartaoAberto}
          colunaInicial={aberto.coluna}
          colunas={colunas}
          aoFechar={() => setAberto(null)}
          aoSalvar={salvarCartao}
          aoExcluir={excluirCartao}
        />
      )}
    </div>
  );
}

/** O cartão do quadro, montado com os dados da demo (o funil de vendas usa o espaço `extra`). */
function CartaoQuadro({ cartao: c, alca, concluido, abrir }: { cartao: CartaoDemo; alca: ReactNode; concluido: boolean; abrir: () => void }) {
  const feitas = c.subtarefas.filter((s) => s.feita).length;
  return (
    <CartaoKanban
      titulo={c.titulo}
      descricao={c.descricao}
      capa={c.capa}
      etiquetas={etiquetas(c.etiquetas)}
      prioridade={c.prioridade}
      vencimento={c.vencimento}
      concluido={concluido}
      subtarefas={c.subtarefas.length ? { feitas, total: c.subtarefas.length } : undefined}
      anexos={c.anexos}
      comentarios={c.comentarios.length}
      responsaveis={pessoas(c.responsaveis)}
      alca={alca}
      aoAbrir={abrir}
      extra={
        c.negocio && (
          <div className="demo-negocio">
            <span>{c.negocio.empresa}</span>
            <strong>{formatarMoeda(c.negocio.valor)}</strong>
            <Progresso valor={c.negocio.chance} altura="xs" cor={c.negocio.chance >= 70 ? 'ok' : 'pri'} rotulo="Chance de fechar" />
            <small>{c.negocio.chance}% de chance</small>
          </div>
        )
      }
    />
  );
}

function DialogoCartao({
  cartao,
  colunaInicial,
  colunas,
  aoFechar,
  aoSalvar,
  aoExcluir,
}: {
  cartao?: CartaoDemo;
  colunaInicial: string;
  colunas: ColunaDemo[];
  aoFechar: () => void;
  aoSalvar: (c: CartaoDemo, colunaId: string) => void;
  aoExcluir: (c: CartaoDemo) => void;
}) {
  const [c, setC] = useState<CartaoDemo>(
    () => cartao ?? { id: novoId('c'), titulo: '', etiquetas: [], responsaveis: [], subtarefas: [], comentarios: [] },
  );
  const [coluna, setColuna] = useState(colunaInicial);
  const [novaSub, setNovaSub] = useState('');
  const [comentario, setComentario] = useState('');
  const [erro, setErro] = useState('');
  const mudar = (parcial: Partial<CartaoDemo>) => setC((x) => ({ ...x, ...parcial }));

  const salvar = () => {
    if (!c.titulo.trim()) return setErro('Informe o título do cartão.');
    aoSalvar({ ...c, titulo: c.titulo.trim() }, coluna);
  };
  const adicionarSub = () => {
    if (!novaSub.trim()) return;
    mudar({ subtarefas: [...c.subtarefas, { id: novoId('s'), texto: novaSub.trim(), feita: false }] });
    setNovaSub('');
  };
  const comentar = () => {
    if (!comentario.trim()) return;
    mudar({ comentarios: [...c.comentarios, { autor: 'ana', texto: comentario.trim(), quando: new Date() }] });
    setComentario('');
  };
  const feitas = c.subtarefas.filter((s) => s.feita).length;

  return (
    <Dialogo
      aberto
      aoFechar={aoFechar}
      titulo={cartao ? 'Detalhes do cartão' : 'Novo cartão'}
      subtitulo={cartao ? `em ${colunas.find((x) => x.id === colunaInicial)?.titulo}` : undefined}
      icone="square-kanban"
      tamanho="grande"
      telaCheiaAbaixo="md"
      rodape={
        <>
          {cartao && <Botao rotulo="Excluir" icone="trash-2" aparencia="texto" severidade="err" className="demo-apps-rodape-esq" onClick={() => aoExcluir(cartao)} />}
          <Botao rotulo="Cancelar" aparencia="contorno" severidade="secundario" onClick={aoFechar} />
          <Botao rotulo={cartao ? 'Salvar' : 'Criar cartão'} icone="save" onClick={salvar} />
        </>
      }
    >
      <div className="demo-cartao-detalhe">
        <div className="demo-apps-form">
          <CampoTexto rotulo="Título" obrigatorio valor={c.titulo} aoMudar={(v) => (mudar({ titulo: v }), setErro(''))} erro={erro} autoFocus={!cartao} />
          <CampoTextarea rotulo="Descrição" placeholder="Adicione uma descrição…" valor={c.descricao ?? ''} aoMudar={(v) => mudar({ descricao: v || undefined })} rows={3} />

          <fieldset className="demo-apps-grupo">
            <legend>
              Subtarefas{' '}
              {c.subtarefas.length > 0 && (
                <small>
                  {feitas} de {c.subtarefas.length}
                </small>
              )}
            </legend>
            {c.subtarefas.length > 0 && <Progresso valor={feitas} max={c.subtarefas.length} altura="xs" cor={feitas === c.subtarefas.length ? 'ok' : 'pri'} rotulo="Subtarefas feitas" />}
            {c.subtarefas.map((s) => (
              <div key={s.id} className="demo-sub">
                <CampoMarcacao rotulo={s.texto} valor={s.feita} aoMudar={(v) => mudar({ subtarefas: c.subtarefas.map((x) => (x.id === s.id ? { ...x, feita: v } : x)) })} />
                <Botao
                  icone="x"
                  aparencia="texto"
                  severidade="secundario"
                  tamanho="pequeno"
                  aria-label={`Remover a subtarefa ${s.texto}`}
                  onClick={() => mudar({ subtarefas: c.subtarefas.filter((x) => x.id !== s.id) })}
                />
              </div>
            ))}
            <div className="demo-apps-linha">
              <CampoTexto
                placeholder="Nova subtarefa"
                aria-label="Nova subtarefa"
                valor={novaSub}
                aoMudar={setNovaSub}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    adicionarSub();
                  }
                }}
              />
              <Botao rotulo="Adicionar" icone="plus" aparencia="contorno" severidade="secundario" onClick={adicionarSub} disabled={!novaSub.trim()} />
            </div>
          </fieldset>

          <fieldset className="demo-apps-grupo">
            <legend>Atividade</legend>
            {c.comentarios.length === 0 && <p className="demo-apps-nada">Nenhum comentário ainda.</p>}
            <ul className="demo-comentarios">
              {c.comentarios.map((m, i) => (
                <li key={i}>
                  <GrupoAvatares pessoas={[pessoa(m.autor)]} tamanho="1.75rem" rotulo="Autor" />
                  <div>
                    <strong>{pessoa(m.autor).nome}</strong> <small>{tempoRelativo(m.quando)}</small>
                    <p>{m.texto}</p>
                  </div>
                </li>
              ))}
            </ul>
            <CampoTextarea placeholder="Escreva um comentário…" aria-label="Comentário" valor={comentario} aoMudar={setComentario} rows={2} />
            <div>
              <Botao rotulo="Comentar" icone="send" tamanho="pequeno" onClick={comentar} disabled={!comentario.trim()} />
            </div>
          </fieldset>
        </div>

        <aside className="demo-apps-form demo-cartao-lado" aria-label="Propriedades do cartão">
          <CampoSelect rotulo="Coluna" opcoes={colunas.map((x) => ({ valor: x.id, rotulo: x.titulo }))} valor={coluna} aoMudar={(v) => v && setColuna(v)} />
          <CampoSelect rotulo="Prioridade" opcoes={OPCOES_PRIORIDADE} valor={c.prioridade ?? null} aoMudar={(v) => mudar({ prioridade: v ?? undefined })} botaoLimpar placeholder="Sem prioridade" />
          <CampoData rotulo="Vencimento" valor={c.vencimento ?? ''} aoMudar={(v) => mudar({ vencimento: v || undefined })} />
          <div className="demo-apps-linha">
            <Botao rotulo="Hoje" aparencia="texto" tamanho="pequeno" onClick={() => mudar({ vencimento: dia(0) })} />
            <Botao rotulo="Amanhã" aparencia="texto" tamanho="pequeno" onClick={() => mudar({ vencimento: dia(1) })} />
            <Botao rotulo="Em 1 semana" aparencia="texto" tamanho="pequeno" onClick={() => mudar({ vencimento: dia(7) })} />
          </div>
          <CampoSelectMultiplo rotulo="Responsáveis" opcoes={OPCOES_PESSOAS} valor={c.responsaveis} aoMudar={(v) => mudar({ responsaveis: v })} comBusca />
          <CampoSelectMultiplo rotulo="Etiquetas" opcoes={OPCOES_ETIQUETAS} valor={c.etiquetas} aoMudar={(v) => mudar({ etiquetas: v })} />
          <CampoTexto
            rotulo="Anexos"
            type="number"
            min={0}
            valor={String(c.anexos ?? 0)}
            aoMudar={(v) => mudar({ anexos: Number(v) || undefined })}
            dica="Na demo, só a contagem."
          />
        </aside>
      </div>
    </Dialogo>
  );
}
