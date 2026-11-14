import { useMemo, useState, type Key, type ReactNode } from 'react';
import type { ChaveTexto } from '../i18n/tipos';
import { useT } from '../i18n/useT';
import {
  AcaoLinha,
  Botao,
  CabecalhoPagina,
  Escolha,
  Tabela,
  valorDoCampo,
  useConfirmacao,
  useToast,
  type Coluna,
  type Ordenacao,
} from '../../src';
import {
  TABELA_CATEGORIAS,
  TABELA_PAGAMENTOS,
  TABELA_CIDADES,
  TABELA_ESTADOS,
  type Categoria,
  type FormaPagamento,
  type Cidade,
  type Estado,
} from './dados';

const NUM = new Intl.NumberFormat('pt-BR');

function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="demo-bloco">
      <h2 className="demo-bloco-titulo">{titulo}</h2>
      <div className="demo-bloco-corpo">{children}</div>
    </section>
  );
}

interface ConfigTabela<T> {
  titulo: string;
  /** Título do cabeçalho da página no dicionário (demo/i18n). */
  chaveTitulo: ChaveTexto;
  icone: string;
  /** Nome do registro no singular, para mensagens. */
  item: string;
  registros: T[];
  colunas: Coluna<T>[];
  /** Texto que identifica o registro em toasts e confirmações. */
  descrever: (linha: T) => string;
  ordemInicial: string;
}

const PCT = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CATEGORIAS: ConfigTabela<Categoria> = {
  titulo: 'Categorias',
  chaveTitulo: 'paginas.categorias.titulo',
  icone: 'tags',
  item: 'categoria',
  registros: TABELA_CATEGORIAS,
  descrever: (c) => c.nome,
  ordemInicial: 'nome',
  colunas: [
    { campo: 'codigo', rotulo: 'Código', ordenavel: true, largura: '6rem' },
    { campo: 'nome', rotulo: 'Categoria', ordenavel: true, destaque: true },
    { campo: 'descricao', rotulo: 'Descrição' },
    { campo: 'produtos', rotulo: 'Produtos', ordenavel: true, alinhamento: 'direita' },
    { campo: 'ativa', rotulo: 'Situação', formato: (v) => (v ? 'Ativa' : 'Inativa'), severidade: (c) => (c.ativa ? 'ok' : 'neutral') },
  ],
};

const PAGAMENTOS: ConfigTabela<FormaPagamento> = {
  titulo: 'Formas de pagamento',
  chaveTitulo: 'paginas.formasPagamento.titulo',
  icone: 'credit-card',
  item: 'forma de pagamento',
  registros: TABELA_PAGAMENTOS,
  descrever: (f) => f.nome,
  ordemInicial: 'nome',
  colunas: [
    { campo: 'nome', rotulo: 'Forma de pagamento', ordenavel: true, destaque: true },
    { campo: 'tipo', rotulo: 'Tipo', ordenavel: true, severidade: (f) => (f.tipo === 'À vista' ? 'ok' : 'info') },
    { campo: 'taxa', rotulo: 'Taxa', ordenavel: true, alinhamento: 'direita', formato: (v) => `${PCT.format(v as number)}%` },
    { campo: 'prazo', rotulo: 'Recebimento', ordenavel: true, alinhamento: 'direita', formato: (v) => (v ? `${v} dia(s)` : 'Na hora') },
  ],
};

const ESTADOS: ConfigTabela<Estado> = {
  titulo: 'Estados',
  chaveTitulo: 'paginas.estados.titulo',
  icone: 'map',
  item: 'estado',
  registros: TABELA_ESTADOS,
  descrever: (e) => e.nome,
  ordemInicial: 'sigla',
  colunas: [
    { campo: 'sigla', rotulo: 'UF', ordenavel: true, destaque: true, alinhamento: 'centro', largura: '5rem' },
    { campo: 'nome', rotulo: 'Nome', ordenavel: true },
    { campo: 'regiao', rotulo: 'Região', ordenavel: true },
    { campo: 'capital', rotulo: 'Capital', ordenavel: true },
  ],
};

const CIDADES: ConfigTabela<Cidade> = {
  titulo: 'Cidades',
  chaveTitulo: 'paginas.cidades.titulo',
  icone: 'map-pin',
  item: 'cidade',
  registros: TABELA_CIDADES,
  descrever: (c) => `${c.nome}/${c.uf}`,
  ordemInicial: 'nome',
  colunas: [
    { campo: 'nome', rotulo: 'Cidade', ordenavel: true, destaque: true },
    { campo: 'uf', rotulo: 'UF', ordenavel: true, alinhamento: 'centro', largura: '5rem' },
    { campo: 'populacao', rotulo: 'População', ordenavel: true, alinhamento: 'direita', formato: (v) => NUM.format(v as number) },
    { campo: 'capital', rotulo: 'Capital', formato: (v) => (v ? 'Sim' : 'Não'), severidade: (c) => (c.capital ? 'info' : 'neutral') },
  ],
};

function ExemplosTabela<T extends { id: number }>({ config }: { config: ConfigTabela<T> }) {
  const { t } = useT();
  const toast = useToast();
  const confirmar = useConfirmacao();
  const [registros, setRegistros] = useState(config.registros);
  const [ordem, setOrdem] = useState<Ordenacao | null>({ campo: config.ordemInicial, direcao: 'asc' });
  const [pagina, setPagina] = useState(1);
  const [tamanho, setTamanho] = useState(5);
  const [selUnica, setSelUnica] = useState<Key[]>([]);
  const [selMultipla, setSelMultipla] = useState<Key[]>([]);
  const [estado, setEstado] = useState('carregando');

  const ordenados = useMemo(() => {
    if (!ordem) return registros;
    return [...registros].sort((a, b) => {
      const va = valorDoCampo(a, ordem.campo);
      const vb = valorDoCampo(b, ordem.campo);
      const r = typeof va === 'string' ? va.localeCompare(String(vb), 'pt-BR') : Number(va) - Number(vb);
      return ordem.direcao === 'asc' ? r : -r;
    });
  }, [registros, ordem]);

  const aoOrdenar = (campo: string) =>
    setOrdem((o) => (o?.campo === campo ? { campo, direcao: o.direcao === 'asc' ? 'desc' : 'asc' } : { campo, direcao: 'asc' }));

  const excluir = async (linha: T) => {
    const ok = await confirmar({
      titulo: t('paginas.tabelas.textos.excluirItem', { item: config.item }),
      mensagem: t('paginas.tabelas.textos.valorSeraRemovidoDefinitivamente', { valor: config.descrever(linha) }),
      severidade: 'err',
      rotuloAceitar: 'Excluir',
      iconeAceitar: 'trash-2',
    });
    if (!ok) return;
    setRegistros((l) => l.filter((x) => x.id !== linha.id));
    toast.ok(t('paginas.tabelas.textos.registroExcluido'), config.descrever(linha));
  };

  const selecionado = registros.find((r) => r.id === selUnica[0]);

  return (
    <>
      <Bloco titulo={t('paginas.tabelas.secoes.listradaOrdenacaoPaginacaoE')}>
        <Tabela<T>
          rotulo={config.titulo}
          registros={ordenados.slice((pagina - 1) * tamanho, pagina * tamanho)}
          colunas={config.colunas}
          ordenacao={ordem}
          aoOrdenar={aoOrdenar}
          acoes={(l) => (
            <>
              <AcaoLinha icone="pencil" rotulo={t('paginas.tabelas.textos.editar')} severidade="destaque" onClick={() => toast.info(t('paginas.tabelas.textos.editar'), config.descrever(l))} />
              <AcaoLinha icone="trash-2" rotulo={t('paginas.tabelas.textos.excluir')} severidade="err" onClick={() => excluir(l)} />
            </>
          )}
          vazioAcoes={<Botao rotulo={t('paginas.tabelas.textos.restaurarRegistros')} severidade="secundario" onClick={() => setRegistros(config.registros)} />}
          paginacao={{
            total: ordenados.length,
            pagina,
            tamanho,
            tamanhoOpcoes: [5, 10, 20],
            aoMudarPagina: setPagina,
            aoMudarTamanho: (t) => {
              setTamanho(t);
              setPagina(1);
            },
          }}
        />
      </Bloco>

      <Bloco titulo={t('paginas.tabelas.secoes.gradeSelecaoUnica')}>
        <Tabela<T>
          aparencia="grade"
          rotulo={t('paginas.tabelas.textos.tituloSelecaoUnica', { titulo: config.titulo })}
          registros={ordenados.slice(0, 5)}
          colunas={config.colunas}
          selecao="unica"
          selecionados={selUnica}
          aoMudarSelecao={setSelUnica}
        />
        <span>{t('paginas.tabelas.textos.selecionado')}{selecionado ? config.descrever(selecionado) : 'nenhum'}</span>
      </Bloco>

      <Bloco titulo={t('paginas.tabelas.secoes.selecaoMultiplaELinha')}>
        <Tabela<T>
          rotulo={t('paginas.tabelas.textos.tituloSelecaoMultipla', { titulo: config.titulo })}
          registros={ordenados.slice(0, 5)}
          colunas={config.colunas}
          selecao="multipla"
          selecionados={selMultipla}
          aoMudarSelecao={setSelMultipla}
        />
        <span>{t('paginas.tabelas.textos.nSelecionadoS', { n: selMultipla.length })}</span>
        <Tabela<T>
          rotulo={t('paginas.tabelas.textos.tituloLinhaClicavel', { titulo: config.titulo })}
          registros={ordenados.slice(0, 3)}
          colunas={config.colunas}
          aoClicarLinha={(l) => toast.info(t('paginas.tabelas.textos.linhaClicada'), config.descrever(l))}
        />
      </Bloco>

      <Bloco titulo={t('paginas.tabelas.secoes.estados')}>
        <Escolha
          rotulo={t('paginas.tabelas.textos.estadoDaTabela')}
          valor={estado}
          aoMudar={setEstado}
          opcoes={[
            { valor: 'carregando', rotulo: t('paginas.tabelas.textos.carregando') },
            { valor: 'atualizando', rotulo: t('paginas.tabelas.textos.atualizando') },
            { valor: 'erro', rotulo: t('paginas.tabelas.textos.erro') },
            { valor: 'vazio', rotulo: t('paginas.tabelas.textos.vazio') },
          ]}
        />
        <Tabela<T>
          rotulo={`${config.titulo} (${estado})`}
          registros={estado === 'vazio' ? [] : ordenados.slice(0, 5)}
          colunas={config.colunas}
          carregando={estado === 'carregando'}
          atualizando={estado === 'atualizando'}
          erro={estado === 'erro'}
          aoRecarregar={() => setEstado('atualizando')}
          vazioTitulo={t('paginas.tabelas.textos.nenhumRegistroCadastrado')}
          vazioDescricao={t('paginas.tabelas.textos.cadastreOPrimeiroRegistro')}
          vazioAcoes={<Botao rotulo={t('paginas.tabelas.textos.cadastrar')} icone="plus" onClick={() => toast.info(t('paginas.tabelas.textos.cadastrar'))} />}
        />
      </Bloco>
    </>
  );
}

export function PaginaTabelas({ tabela }: { tabela: string }) {
  const toast = useToast();
  const { t } = useT();
  const config = { categorias: CATEGORIAS, pagamentos: PAGAMENTOS, estados: ESTADOS, cidades: CIDADES }[tabela] ?? CATEGORIAS;

  return (
    <div className="demo-pilha">
      <CabecalhoPagina
        titulo={t(config.chaveTitulo)}
        trilha
        icone={config.icone}
        acoes={<Botao rotulo={t('paginas.tabelas.textos.adicionar')} icone="plus" onClick={() => toast.info(t('paginas.tabelas.textos.adicionarItem', { item: config.item }))} />}
      />
      {/* `key` reinicia o estado ao trocar de tabela. */}
      <ExemplosTabela key={tabela} config={config as unknown as ConfigTabela<{ id: number }>} />
    </div>
  );
}
