import { useMemo, useState } from 'react';
import {
  Botao,
  CabecalhoPagina,
  Detalhes,
  Dialogo,
  Status,
  Tabela,
  useConfirmacao,
  useToast,
  valorDoCampo,
  type Ordenacao,
} from '../../src';
import { TABELA_CATEGORIAS, type Categoria } from './dados';
import { useT } from '../i18n/useT';

/** Modelo de tabela com BOTÕES (texto + ícone) nas ações, em vez de só ícones. */
export function PaginaTabelaBotoes() {
  const { t, tc } = useT();
  const toast = useToast();
  const confirmar = useConfirmacao();
  const [registros, setRegistros] = useState(TABELA_CATEGORIAS);
  const [ordem, setOrdem] = useState<Ordenacao | null>({ campo: 'nome', direcao: 'asc' });
  const [pagina, setPagina] = useState(1);
  const [tamanho, setTamanho] = useState(5);
  const [vendo, setVendo] = useState<Categoria | null>(null);

  const ordenados = useMemo(() => {
    if (!ordem) return registros;
    return [...registros].sort((a, b) => {
      const va = valorDoCampo(a, ordem.campo);
      const vb = valorDoCampo(b, ordem.campo);
      const r = typeof va === 'string' ? va.localeCompare(String(vb), 'pt-BR') : Number(va) - Number(vb);
      return ordem.direcao === 'asc' ? r : -r;
    });
  }, [registros, ordem]);

  const apagar = async (c: Categoria) => {
    const ok = await confirmar.remover({ titulo: t('paginas.tabelaBotoes.textos.apagarCategoria'), mensagem: t('paginas.tabelaBotoes.textos.nomeSeraApagadaDefinitivamente', { nome: c.nome }), rotuloAceitar: tc('Apagar') });
    if (!ok) return;
    setRegistros((l) => l.filter((x) => x.id !== c.id));
    toast.ok(t('paginas.tabelaBotoes.textos.categoriaApagada'), tc(c.nome));
  };

  return (
    <div className="demo-pilha">
      <CabecalhoPagina
        titulo={t('paginas.tabelaBotoes.titulo')}
        icone="table"
        trilha
        acoes={<Botao rotulo={t('paginas.tabelaBotoes.textos.novaCategoria')} icone="plus" onClick={() => toast.info(t('paginas.tabelaBotoes.textos.novaCategoria'))} />}
      />

      <Tabela<Categoria>
        rotulo={t('paginas.tabelaBotoes.textos.categorias')}
        registros={ordenados.slice((pagina - 1) * tamanho, pagina * tamanho)}
        ordenacao={ordem}
        aoOrdenar={(campo) =>
          setOrdem((o) => (o?.campo === campo ? { campo, direcao: o.direcao === 'asc' ? 'desc' : 'asc' } : { campo, direcao: 'asc' }))
        }
        acoes={(c) => (
          <>
            <Botao rotulo={t('paginas.tabelaBotoes.textos.visualizar')} icone="eye" aparencia="suave" tamanho="pequeno" formato="retangulo" onClick={() => setVendo(c)} />
            <Botao
              rotulo={t('paginas.tabelaBotoes.textos.editar')}
              icone="pencil"
              severidade="destaque"
              aparencia="suave"
              tamanho="pequeno"
              formato="retangulo"
              onClick={() => toast.info(t('paginas.tabelaBotoes.textos.editar'), tc(c.nome))}
            />
            <Botao rotulo={t('paginas.tabelaBotoes.textos.apagar')} icone="trash-2" severidade="err" aparencia="suave" tamanho="pequeno" formato="retangulo" onClick={() => apagar(c)} />
          </>
        )}
        colunas={[
          { campo: 'codigo', rotulo: t('paginas.tabelaBotoes.textos.codigo'), ordenavel: true, largura: '6rem' },
          { campo: 'nome', rotulo: t('paginas.tabelaBotoes.textos.categoria'), ordenavel: true, destaque: true, formato: (v) => tc(v as string) },
          { campo: 'descricao', rotulo: t('paginas.tabelaBotoes.textos.descricao'), formato: (v) => tc(v as string) },
          { campo: 'produtos', rotulo: t('paginas.tabelaBotoes.textos.produtos'), ordenavel: true, alinhamento: 'direita' },
          { campo: 'ativa', rotulo: t('paginas.tabelaBotoes.textos.situacao'), formato: (v) => (v ? tc('Ativa') : tc('Inativa')), severidade: (c) => (c.ativa ? 'ok' : 'neutral') },
        ]}
        vazioTitulo={t('paginas.tabelaBotoes.textos.nenhumaCategoria')}
        vazioAcoes={<Botao rotulo={t('paginas.tabelaBotoes.textos.restaurarCategorias')} severidade="secundario" onClick={() => setRegistros(TABELA_CATEGORIAS)} />}
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

      <Dialogo
        aberto={!!vendo}
        aoFechar={() => setVendo(null)}
        titulo={t('paginas.tabelaBotoes.textos.visualizarCategoria')}
        icone="tags"
        tamanho="pequeno"
        rodape={
          <>
            <Botao rotulo={t('paginas.tabelaBotoes.textos.fechar')} severidade="secundario" onClick={() => setVendo(null)} />
            <Botao
              rotulo={t('paginas.tabelaBotoes.textos.editar')}
              icone="pencil"
              severidade="destaque"
              onClick={() => {
                toast.info(t('paginas.tabelaBotoes.textos.editar'), tc(vendo?.nome));
                setVendo(null);
              }}
            />
          </>
        }
      >
        {vendo && (
          <div className="demo-grade">
            <Detalhes rotulo={t('paginas.tabelaBotoes.textos.codigo')} valor={vendo.codigo} />
            <Detalhes rotulo={t('paginas.tabelaBotoes.textos.categoria')} valor={vendo.nome} />
            <Detalhes rotulo={t('paginas.tabelaBotoes.textos.produtos')} valor={vendo.produtos} />
            <Detalhes rotulo={t('paginas.tabelaBotoes.textos.situacao')}>
              <Status rotulo={vendo.ativa ? t('paginas.tabelaBotoes.textos.ativa') : t('paginas.tabelaBotoes.textos.inativa')} severidade={vendo.ativa ? 'ok' : 'neutral'} />
            </Detalhes>
            <Detalhes rotulo={t('paginas.tabelaBotoes.textos.descricao')} valor={vendo.descricao} />
          </div>
        )}
      </Dialogo>
    </div>
  );
}
