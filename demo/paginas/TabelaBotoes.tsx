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

/** Modelo de tabela com BOTÕES (texto + ícone) nas ações, em vez de só ícones. */
export function PaginaTabelaBotoes() {
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
    const ok = await confirmar.remover({ titulo: 'Apagar categoria?', mensagem: `"${c.nome}" será apagada definitivamente.`, rotuloAceitar: 'Apagar' });
    if (!ok) return;
    setRegistros((l) => l.filter((x) => x.id !== c.id));
    toast.ok('Categoria apagada', c.nome);
  };

  return (
    <div className="demo-pilha">
      <CabecalhoPagina
        titulo="Tabela com botões"
        icone="table"
        trilha
        acoes={<Botao rotulo="Nova categoria" icone="plus" onClick={() => toast.info('Nova categoria')} />}
      />

      <Tabela<Categoria>
        rotulo="Categorias"
        registros={ordenados.slice((pagina - 1) * tamanho, pagina * tamanho)}
        ordenacao={ordem}
        aoOrdenar={(campo) =>
          setOrdem((o) => (o?.campo === campo ? { campo, direcao: o.direcao === 'asc' ? 'desc' : 'asc' } : { campo, direcao: 'asc' }))
        }
        acoes={(c) => (
          <>
            <Botao rotulo="Visualizar" icone="eye" aparencia="suave" tamanho="pequeno" formato="retangulo" onClick={() => setVendo(c)} />
            <Botao
              rotulo="Editar"
              icone="pencil"
              severidade="destaque"
              aparencia="suave"
              tamanho="pequeno"
              formato="retangulo"
              onClick={() => toast.info('Editar', c.nome)}
            />
            <Botao rotulo="Apagar" icone="trash-2" severidade="err" aparencia="suave" tamanho="pequeno" formato="retangulo" onClick={() => apagar(c)} />
          </>
        )}
        colunas={[
          { campo: 'codigo', rotulo: 'Código', ordenavel: true, largura: '6rem' },
          { campo: 'nome', rotulo: 'Categoria', ordenavel: true, destaque: true },
          { campo: 'descricao', rotulo: 'Descrição' },
          { campo: 'produtos', rotulo: 'Produtos', ordenavel: true, alinhamento: 'direita' },
          { campo: 'ativa', rotulo: 'Situação', formato: (v) => (v ? 'Ativa' : 'Inativa'), severidade: (c) => (c.ativa ? 'ok' : 'neutral') },
        ]}
        vazioTitulo="Nenhuma categoria"
        vazioAcoes={<Botao rotulo="Restaurar categorias" severidade="secundario" onClick={() => setRegistros(TABELA_CATEGORIAS)} />}
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
        titulo="Visualizar categoria"
        icone="tags"
        tamanho="pequeno"
        rodape={
          <>
            <Botao rotulo="Fechar" severidade="secundario" onClick={() => setVendo(null)} />
            <Botao
              rotulo="Editar"
              icone="pencil"
              severidade="destaque"
              onClick={() => {
                toast.info('Editar', vendo?.nome);
                setVendo(null);
              }}
            />
          </>
        }
      >
        {vendo && (
          <div className="demo-grade">
            <Detalhes rotulo="Código" valor={vendo.codigo} />
            <Detalhes rotulo="Categoria" valor={vendo.nome} />
            <Detalhes rotulo="Produtos" valor={vendo.produtos} />
            <Detalhes rotulo="Situação">
              <Status rotulo={vendo.ativa ? 'Ativa' : 'Inativa'} severidade={vendo.ativa ? 'ok' : 'neutral'} />
            </Detalhes>
            <Detalhes rotulo="Descrição" valor={vendo.descricao} />
          </div>
        )}
      </Dialogo>
    </div>
  );
}
