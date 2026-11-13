import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react';
import { Car, Gamepad2, GraduationCap, HeartPulse, Megaphone, Plane, Shirt, ShoppingBasket, Utensils, Zap } from 'lucide-react';
import {
  Botao,
  BotaoOcultarValores,
  CabecalhoPagina,
  CampoData,
  CampoMarcacao,
  CampoMoeda,
  CampoSelect,
  CampoTextarea,
  CampoTexto,
  Dialogo,
  Escolha,
  Icone,
  MenuSuspenso,
  NavegadorPeriodo,
  SeletorContexto,
  dataIso,
  dividirEmParcelas,
  formatarMoeda,
  paraData,
  registrarIcones,
  useConfirmacao,
  useToast,
  useValoresOcultos,
  type OpcoesMoeda,
} from '../../../../src';
import { CENTROS_CUSTO, CONTATOS, ESPACOS, dia, novoId, type Categoria, type Conta, type Espaco, type Lancamento, type TipoConta, type TipoLancamento } from './dados';
import { acoes, categoriasDo, contasDo, useFinancas } from './estado';

// ícones das categorias: o app registra os que a biblioteca não traz
registrarIcones({
  car: Car,
  'gamepad-2': Gamepad2,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  megaphone: Megaphone,
  plane: Plane,
  shirt: Shirt,
  'shopping-basket': ShoppingBasket,
  utensils: Utensils,
  zap: Zap,
});

export const DATA = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
export const DIA_SEMANA = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
export const dataBr = (iso: string) => DATA.format(paraData(iso));

/** `formatarMoeda` que respeita o "ocultar valores" (para textos fora do `Valor`: indicadores, eixos). */
export function useMoeda() {
  const { ocultos } = useValoresOcultos();
  return (v: number, opcoes?: OpcoesMoeda) => (ocultos ? 'R$ ••••' : formatarMoeda(v, opcoes));
}

const ICONE_CONTA: Record<TipoConta, string> = { corrente: 'landmark', poupanca: 'piggy-bank', investimento: 'trending-up', carteira: 'wallet', cartao: 'credit-card' };
export const TIPO_CONTA: Record<TipoConta, string> = { corrente: 'Conta corrente', poupanca: 'Poupança', investimento: 'Investimento', carteira: 'Dinheiro', cartao: 'Cartão de crédito' };

export function IconeConta({ conta }: { conta: Conta }) {
  return (
    <span className="fin-ic" style={{ '--fin-cor': conta.cor } as CSSProperties} aria-hidden="true">
      <Icone icone={ICONE_CONTA[conta.tipo]} />
    </span>
  );
}

/** Quadrado colorido com o ícone da categoria (ou da transferência). */
export function IconeCategoria({ categoria, transferencia, tamanho }: { categoria?: Categoria; transferencia?: boolean; tamanho?: 'pequeno' }) {
  const cor = transferencia ? 'var(--t3)' : categoria?.cor ?? 'var(--t4)';
  return (
    <span className={`fin-ic${tamanho === 'pequeno' ? ' fin-ic--p' : ''}`} style={{ '--fin-cor': cor } as CSSProperties} aria-hidden="true">
      <Icone icone={transferencia ? 'arrow-left-right' : categoria?.icone ?? 'circle'} />
    </span>
  );
}

/** O seletor Pessoal × Empresa, no topo da `Estrutura`. */
export function SeletorEspaco({ aoMudar }: { aoMudar?: (espaco: Espaco) => void }) {
  const { espaco } = useFinancas();
  const toast = useToast();
  return (
    <SeletorContexto
      opcoes={ESPACOS.map((e) => ({ ...e }))}
      valor={espaco}
      aoMudar={(id) => {
        acoes.trocarEspaco(id as Espaco);
        aoMudar?.(id as Espaco);
      }}
      acoes={[{ id: 'novo', rotulo: 'Adicionar empresa', icone: 'plus' }]}
      aoEscolherAcao={() => toast.info('Adicionar empresa', 'Aqui entraria o cadastro do CNPJ.')}
    />
  );
}

// ---------- editor de lançamento (um só, aberto de qualquer tela) ----------

type AbrirEditor = (inicial: Lancamento | TipoLancamento, extra?: Partial<Lancamento>) => void;
const EditorCtx = createContext<AbrirEditor>(() => {});
export const useEditorLancamento = () => useContext(EditorCtx);

export function ProvedorEditor({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState<{ l: Lancamento; novo: boolean } | null>(null);
  const { espaco } = useFinancas();
  const abrir: AbrirEditor = (inicial, extra) => {
    if (typeof inicial === 'string') {
      const contas = contasDo(espaco).filter((c) => c.tipo !== 'cartao');
      setAberto({
        novo: true,
        l: { id: novoId(), espaco, tipo: inicial, descricao: '', valor: 0, data: dia(0), pago: inicial !== 'receita', conta: contas[0].id, ...extra },
      });
    } else setAberto({ l: inicial, novo: false });
  };
  return (
    <EditorCtx.Provider value={abrir}>
      {children}
      {aberto && <DialogoLancamento key={aberto.l.id} inicial={aberto.l} novo={aberto.novo} aoFechar={() => setAberto(null)} />}
    </EditorCtx.Provider>
  );
}

const TIPOS: { valor: TipoLancamento; rotulo: string }[] = [
  { valor: 'despesa', rotulo: 'Despesa' },
  { valor: 'receita', rotulo: 'Receita' },
  { valor: 'transferencia', rotulo: 'Transferência' },
];

type Repetir = 'nao' | 'parcelado' | 'fixo';

function DialogoLancamento({ inicial, novo, aoFechar }: { inicial: Lancamento; novo: boolean; aoFechar: () => void }) {
  const toast = useToast();
  const confirmar = useConfirmacao();
  const [l, setL] = useState(inicial);
  const [repetir, setRepetir] = useState<Repetir>('nao');
  const [vezes, setVezes] = useState('2');
  const [tentou, setTentou] = useState(false);
  const mudar = (p: Partial<Lancamento>) => setL((x) => ({ ...x, ...p }));

  const contas = contasDo(l.espaco);
  const categorias = l.tipo === 'transferencia' ? [] : categoriasDo(l.espaco, l.tipo);
  const contatos = CONTATOS.filter((c) => (l.tipo === 'receita' ? c.tipo === 'cliente' : c.tipo === 'fornecedor'));
  const n = Math.max(2, Math.min(60, Number(vezes) || 0));

  const erros = {
    descricao: !l.descricao.trim() ? 'Informe a descrição' : undefined,
    valor: !(l.valor > 0) ? 'Informe o valor' : undefined,
    data: !l.data ? 'Informe a data' : undefined,
    categoria: l.tipo !== 'transferencia' && !l.categoria ? 'Escolha a categoria' : undefined,
    contaDestino: l.tipo === 'transferencia' && (!l.contaDestino || l.contaDestino === l.conta) ? 'Escolha outra conta' : undefined,
    vezes: repetir !== 'nao' && (Number(vezes) < 2 || Number(vezes) > 60) ? 'De 2 a 60' : undefined,
  };
  const ok = Object.values(erros).every((e) => !e);
  const mostrar = (e?: string) => (tentou ? e : undefined);

  const salvar = () => {
    setTentou(true);
    if (!ok) return;
    const base: Lancamento = {
      ...l,
      descricao: l.descricao.trim(),
      categoria: l.tipo === 'transferencia' ? undefined : l.categoria,
      contaDestino: l.tipo === 'transferencia' ? l.contaDestino : undefined,
      contato: l.tipo === 'transferencia' || l.espaco === 'pessoal' ? undefined : l.contato,
      centroCusto: l.espaco === 'pessoal' ? undefined : l.centroCusto,
    };
    let lista = [base];
    if (novo && repetir !== 'nao') {
      const valores = repetir === 'parcelado' ? dividirEmParcelas(l.valor, n) : Array(n).fill(l.valor);
      const d0 = paraData(l.data);
      lista = valores.map((valor, i) => ({
        ...base,
        id: i === 0 ? base.id : novoId(),
        valor,
        data: dataIso(new Date(d0.getFullYear(), d0.getMonth() + i, Math.min(d0.getDate(), new Date(d0.getFullYear(), d0.getMonth() + i + 1, 0).getDate()))),
        // só a primeira pode já estar paga
        pago: i === 0 ? base.pago : false,
        parcela: repetir === 'parcelado' ? { numero: i + 1, total: n } : undefined,
        recorrente: repetir === 'fixo' || undefined,
      }));
    }
    acoes.salvar(lista);
    toast.ok(novo ? (lista.length > 1 ? `${lista.length} lançamentos criados` : 'Lançamento criado') : 'Lançamento salvo', base.descricao);
    aoFechar();
  };

  const excluir = async () => {
    const sim = await confirmar.remover({ titulo: 'Excluir lançamento?', mensagem: `"${l.descricao}" sai dos saldos e dos relatórios.`, rotuloAceitar: 'Excluir' });
    if (!sim) return;
    acoes.excluir([l.id]);
    toast.ok('Lançamento excluído', l.descricao);
    aoFechar();
  };

  const rotuloPago = l.tipo === 'receita' ? 'Já recebi' : l.tipo === 'transferencia' ? 'Já transferi' : 'Já paguei';

  return (
    <Dialogo
      aberto
      aoFechar={aoFechar}
      titulo={novo ? 'Novo lançamento' : 'Editar lançamento'}
      subtitulo={ESPACOS.find((e) => e.id === l.espaco)?.nome}
      icone={l.tipo === 'transferencia' ? 'arrow-left-right' : l.tipo === 'receita' ? 'trending-up' : 'trending-down'}
      tamanho="medio"
      telaCheiaAbaixo="sm"
      rodape={
        <>
          {!novo && <Botao rotulo="Excluir" icone="trash-2" severidade="err" aparencia="texto" onClick={excluir} className="fin-dlg-excluir" />}
          <Botao rotulo="Cancelar" severidade="secundario" aparencia="contorno" onClick={aoFechar} />
          <Botao rotulo="Salvar" icone="check" onClick={salvar} />
        </>
      }
    >
      <form
        className="fin-form"
        onSubmit={(e) => {
          e.preventDefault();
          salvar();
        }}
      >
        <Escolha
          ariaLabel="Tipo"
          className="fin-form-inteiro"
          opcoes={TIPOS}
          valor={l.tipo}
          aoMudar={(tipo) => mudar({ tipo, categoria: undefined, contato: undefined, pago: tipo !== 'receita' ? l.pago : false })}
          disabled={!novo && !!l.parcela}
        />
        <CampoTexto className="fin-form-inteiro" rotulo="Descrição" obrigatorio valor={l.descricao} aoMudar={(descricao) => mudar({ descricao })} erro={mostrar(erros.descricao)} autoFocus={novo} />
        <CampoMoeda rotulo={repetir === 'parcelado' ? 'Valor total' : 'Valor'} obrigatorio valor={l.valor || null} aoMudar={(v) => mudar({ valor: v ?? 0 })} erro={mostrar(erros.valor)} />
        <CampoData rotulo={l.pago ? 'Data' : 'Vencimento'} obrigatorio valor={l.data} aoMudar={(data) => mudar({ data })} erro={mostrar(erros.data)} />
        <CampoSelect
          rotulo={l.tipo === 'transferencia' ? 'De' : l.tipo === 'receita' ? 'Recebe na conta' : 'Paga com'}
          obrigatorio
          opcoes={contas.filter((c) => l.tipo === 'despesa' || c.tipo !== 'cartao').map((c) => ({ valor: c.id, rotulo: `${c.nome} · ${c.instituicao}` }))}
          valor={l.conta}
          aoMudar={(conta) => conta && mudar({ conta })}
        />
        {l.tipo === 'transferencia' ? (
          <CampoSelect
            rotulo="Para"
            obrigatorio
            opcoes={contas.filter((c) => c.id !== l.conta).map((c) => ({ valor: c.id, rotulo: `${c.nome} · ${c.instituicao}` }))}
            valor={l.contaDestino ?? null}
            aoMudar={(contaDestino) => mudar({ contaDestino: contaDestino ?? undefined })}
            erro={mostrar(erros.contaDestino)}
          />
        ) : (
          <CampoSelect
            rotulo="Categoria"
            obrigatorio
            comBusca
            opcoes={categorias.map((c) => ({ valor: c.id, rotulo: c.nome }))}
            valor={l.categoria ?? null}
            aoMudar={(categoria) => mudar({ categoria: categoria ?? undefined })}
            erro={mostrar(erros.categoria)}
          />
        )}
        {l.espaco === 'empresa' && l.tipo !== 'transferencia' && (
          <>
            <CampoSelect
              rotulo={l.tipo === 'receita' ? 'Cliente' : 'Fornecedor'}
              placeholder="Nenhum"
              botaoLimpar
              comBusca
              opcoes={contatos.map((c) => ({ valor: c.id, rotulo: c.nome }))}
              valor={l.contato ?? null}
              aoMudar={(contato) => mudar({ contato: contato ?? undefined })}
            />
            <CampoSelect
              rotulo="Centro de custo"
              placeholder="Nenhum"
              botaoLimpar
              opcoes={CENTROS_CUSTO.map((c) => ({ valor: c.id, rotulo: c.nome }))}
              valor={l.centroCusto ?? null}
              aoMudar={(centroCusto) => mudar({ centroCusto: centroCusto ?? undefined })}
            />
          </>
        )}
        {novo && (
          <>
            <Escolha
              rotulo="Repetir"
              opcoes={[
                { valor: 'nao', rotulo: 'Não' },
                { valor: 'parcelado', rotulo: 'Parcelado' },
                { valor: 'fixo', rotulo: 'Todo mês' },
              ]}
              valor={repetir}
              aoMudar={(v) => setRepetir(v as Repetir)}
            />
            {repetir !== 'nao' ? (
              <CampoTexto
                rotulo={repetir === 'parcelado' ? 'Parcelas' : 'Por quantos meses'}
                type="number"
                min={2}
                max={60}
                valor={vezes}
                aoMudar={setVezes}
                erro={mostrar(erros.vezes)}
                dica={repetir === 'parcelado' && l.valor > 0 && !erros.vezes ? `${n}× de ${dividirEmParcelas(l.valor, n).at(-1)!.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : undefined}
              />
            ) : (
              <span />
            )}
          </>
        )}
        {!novo && l.parcela && (
          <p className="fin-form-inteiro fin-form-nota">
            <Icone icone="info" /> Parcela {l.parcela.numero} de {l.parcela.total}: a mudança vale só para esta parcela.
          </p>
        )}
        <CampoMarcacao className="fin-form-inteiro" aparencia="chave" rotulo={rotuloPago} valor={l.pago} aoMudar={(pago) => mudar({ pago })} />
        <CampoTextarea className="fin-form-inteiro" rotulo="Observação" rows={2} maxLength={300} valor={l.observacao ?? ''} aoMudar={(observacao) => mudar({ observacao: observacao || undefined })} />
        <button type="submit" hidden />
      </form>
    </Dialogo>
  );
}

// ---------- cabeçalho comum ----------

export function BotaoNovoLancamento({ tamanho }: { tamanho?: 'pequeno' }) {
  const abrir = useEditorLancamento();
  return (
    <MenuSuspenso
      rotulo="Novo lançamento"
      icone="plus"
      dividido
      tamanho={tamanho}
      alinhamento="fim"
      aoClicarPrincipal={() => abrir('despesa')}
      itens={[
        { id: 'despesa', rotulo: 'Despesa', icone: 'trending-down' },
        { id: 'receita', rotulo: 'Receita', icone: 'trending-up' },
        { id: 'transferencia', rotulo: 'Transferência', icone: 'arrow-left-right' },
      ]}
      aoEscolher={(id) => abrir(id as TipoLancamento)}
    />
  );
}

export function CabecalhoFinancas({ titulo, icone, semPeriodo, acoes: extras, children }: { titulo: string; icone: string; semPeriodo?: boolean; acoes?: ReactNode; children?: ReactNode }) {
  const { periodo } = useFinancas();
  return (
    <CabecalhoPagina
      titulo={titulo}
      icone={icone}
      trilha
      acoes={
        <>
          {!semPeriodo && <NavegadorPeriodo valor={periodo} aoMudar={acoes.mudarPeriodo} />}
          <BotaoOcultarValores />
          {extras ?? <BotaoNovoLancamento />}
        </>
      }
    >
      {children}
    </CabecalhoPagina>
  );
}
