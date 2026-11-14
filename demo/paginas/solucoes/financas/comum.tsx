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
  useIdioma,
  useValoresOcultos,
  type OpcoesMoeda,
} from '../../../../src';
import { CENTROS_CUSTO, CONTATOS, ESPACOS, dia, novoId, type Categoria, type Conta, type Espaco, type Lancamento, type TipoConta, type TipoLancamento } from './dados';
import { acoes, categoriasDo, contasDo, useFinancas } from './estado';
import { useT, type TradutorDemo } from '../../../i18n/useT';

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
  const idioma = useIdioma();
  return (v: number, opcoes?: OpcoesMoeda) => (ocultos ? 'R$ ••••' : formatarMoeda(v, { idioma, ...opcoes }));
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
  const { t } = useT();
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
      acoes={[{ id: 'novo', rotulo: t('paginas.financas.textos.adicionarEmpresa'), icone: 'plus' }]}
      aoEscolherAcao={() => toast.info(t('paginas.financas.textos.adicionarEmpresa'), t('paginas.financas.textos.aquiEntrariaOCadastro'))}
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

const TIPOS = (t: TradutorDemo['t']): { valor: TipoLancamento; rotulo: string }[] => ([
  { valor: 'despesa', rotulo: t('paginas.financas.textos.despesa') },
  { valor: 'receita', rotulo: t('paginas.financas.textos.receita') },
  { valor: 'transferencia', rotulo: t('paginas.financas.textos.transferencia') },
]);

type Repetir = 'nao' | 'parcelado' | 'fixo';

function DialogoLancamento({ inicial, novo, aoFechar }: { inicial: Lancamento; novo: boolean; aoFechar: () => void }) {
  const { t, tc } = useT();
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
    descricao: !l.descricao.trim() ? t('paginas.financas.textos.informeADescricao') : undefined,
    valor: !(l.valor > 0) ? tc('Informe o valor') : undefined,
    data: !l.data ? tc('Informe a data') : undefined,
    categoria: l.tipo !== 'transferencia' && !l.categoria ? tc('Escolha a categoria') : undefined,
    contaDestino: l.tipo === 'transferencia' && (!l.contaDestino || l.contaDestino === l.conta) ? tc('Escolha outra conta') : undefined,
    vezes: repetir !== 'nao' && (Number(vezes) < 2 || Number(vezes) > 60) ? tc('De 2 a 60') : undefined,
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
    toast.ok(novo ? (lista.length > 1 ? t('paginas.financas.textos.nLancamentosCriados', { n: lista.length }) : t('paginas.financas.textos.lancamentoCriado')) : t('paginas.financas.textos.lancamentoSalvo'), tc(base.descricao));
    aoFechar();
  };

  const excluir = async () => {
    const sim = await confirmar.remover({ titulo: t('paginas.financas.textos.excluirLancamento'), mensagem: t('paginas.financas.textos.descricaoSaiDosSaldos', { descricao: l.descricao }), rotuloAceitar: tc('Excluir') });
    if (!sim) return;
    acoes.excluir([l.id]);
    toast.ok(t('paginas.financas.textos.lancamentoExcluido'), tc(l.descricao));
    aoFechar();
  };

  const rotuloPago = l.tipo === 'receita' ? tc('Já recebi') : l.tipo === 'transferencia' ? tc('Já transferi') : tc('Já paguei');

  return (
    <Dialogo
      aberto
      aoFechar={aoFechar}
      titulo={novo ? t('paginas.financas.textos.novoLancamento') : t('paginas.financas.textos.editarLancamento')}
      subtitulo={tc(ESPACOS.find((e) => e.id === l.espaco)?.nome)}
      icone={l.tipo === 'transferencia' ? 'arrow-left-right' : l.tipo === 'receita' ? 'trending-up' : 'trending-down'}
      tamanho="medio"
      telaCheiaAbaixo="sm"
      rodape={
        <>
          {!novo && <Botao rotulo={t('paginas.financas.textos.excluir')} icone="trash-2" severidade="err" aparencia="texto" onClick={excluir} className="fin-dlg-excluir" />}
          <Botao rotulo={t('paginas.financas.textos.cancelar')} severidade="secundario" aparencia="contorno" onClick={aoFechar} />
          <Botao rotulo={t('paginas.financas.textos.salvar')} icone="check" onClick={salvar} />
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
          ariaLabel={tc("Tipo")}
          className="fin-form-inteiro"
          opcoes={TIPOS(t)}
          valor={l.tipo}
          aoMudar={(tipo) => mudar({ tipo, categoria: undefined, contato: undefined, pago: tipo !== 'receita' ? l.pago : false })}
          disabled={!novo && !!l.parcela}
        />
        <CampoTexto className="fin-form-inteiro" rotulo={t('paginas.financas.textos.descricao')} obrigatorio valor={l.descricao} aoMudar={(descricao) => mudar({ descricao })} erro={mostrar(erros.descricao)} autoFocus={novo} />
        <CampoMoeda rotulo={repetir === 'parcelado' ? t('paginas.financas.textos.valorTotal') : t('paginas.financas.textos.valor')} obrigatorio valor={l.valor || null} aoMudar={(v) => mudar({ valor: v ?? 0 })} erro={mostrar(erros.valor)} />
        <CampoData rotulo={l.pago ? t('paginas.financas.textos.data') : t('paginas.financas.textos.vencimento')} obrigatorio valor={l.data} aoMudar={(data) => mudar({ data })} erro={mostrar(erros.data)} />
        <CampoSelect
          rotulo={l.tipo === 'transferencia' ? t('paginas.financas.textos.de') : l.tipo === 'receita' ? t('paginas.financas.textos.recebeNaConta') : t('paginas.financas.textos.pagaCom')}
          obrigatorio
          opcoes={contas.filter((c) => l.tipo === 'despesa' || c.tipo !== 'cartao').map((c) => ({ valor: c.id, rotulo: `${tc(c.nome)} · ${tc(c.instituicao)}` }))}
          valor={l.conta}
          aoMudar={(conta) => conta && mudar({ conta })}
        />
        {l.tipo === 'transferencia' ? (
          <CampoSelect
            rotulo={t('paginas.financas.textos.para')}
            obrigatorio
            opcoes={contas.filter((c) => c.id !== l.conta).map((c) => ({ valor: c.id, rotulo: `${tc(c.nome)} · ${tc(c.instituicao)}` }))}
            valor={l.contaDestino ?? null}
            aoMudar={(contaDestino) => mudar({ contaDestino: contaDestino ?? undefined })}
            erro={mostrar(erros.contaDestino)}
          />
        ) : (
          <CampoSelect
            rotulo={t('paginas.financas.textos.categoria')}
            obrigatorio
            comBusca
            opcoes={categorias.map((c) => ({ valor: c.id, rotulo: tc(c.nome) }))}
            valor={l.categoria ?? null}
            aoMudar={(categoria) => mudar({ categoria: categoria ?? undefined })}
            erro={mostrar(erros.categoria)}
          />
        )}
        {l.espaco === 'empresa' && l.tipo !== 'transferencia' && (
          <>
            <CampoSelect
              rotulo={l.tipo === 'receita' ? t('paginas.financas.textos.cliente') : t('paginas.financas.textos.fornecedor')}
              placeholder={t('paginas.financas.textos.nenhum')}
              botaoLimpar
              comBusca
              opcoes={contatos.map((c) => ({ valor: c.id, rotulo: tc(c.nome) }))}
              valor={l.contato ?? null}
              aoMudar={(contato) => mudar({ contato: contato ?? undefined })}
            />
            <CampoSelect
              rotulo={t('paginas.financas.textos.centroDeCusto')}
              placeholder={t('paginas.financas.textos.nenhum')}
              botaoLimpar
              opcoes={CENTROS_CUSTO.map((c) => ({ valor: c.id, rotulo: tc(c.nome) }))}
              valor={l.centroCusto ?? null}
              aoMudar={(centroCusto) => mudar({ centroCusto: centroCusto ?? undefined })}
            />
          </>
        )}
        {novo && (
          <>
            <Escolha
              rotulo={t('paginas.financas.textos.repetir')}
              opcoes={[
                { valor: 'nao', rotulo: t('paginas.financas.textos.nao') },
                { valor: 'parcelado', rotulo: t('paginas.financas.textos.parcelado') },
                { valor: 'fixo', rotulo: t('paginas.financas.textos.todoMes') },
              ]}
              valor={repetir}
              aoMudar={(v) => setRepetir(v as Repetir)}
            />
            {repetir !== 'nao' ? (
              <CampoTexto
                rotulo={repetir === 'parcelado' ? t('paginas.financas.textos.parcelas') : t('paginas.financas.textos.porQuantosMeses')}
                type="number"
                min={2}
                max={60}
                valor={vezes}
                aoMudar={setVezes}
                erro={mostrar(erros.vezes)}
                dica={repetir === 'parcelado' && l.valor > 0 && !erros.vezes ? t('paginas.financas.textos.nDeValor', { n, valor: dividirEmParcelas(l.valor, n).at(-1)!.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }) : undefined}
              />
            ) : (
              <span />
            )}
          </>
        )}
        {!novo && l.parcela && (
          <p className="fin-form-inteiro fin-form-nota">
            <Icone icone="info" />{t('paginas.financas.textos.parcelaNumeroDeTotal', { numero: l.parcela.numero, total: l.parcela.total })}</p>
        )}
        <CampoMarcacao className="fin-form-inteiro" aparencia="chave" rotulo={rotuloPago} valor={l.pago} aoMudar={(pago) => mudar({ pago })} />
        <CampoTextarea className="fin-form-inteiro" rotulo={t('paginas.financas.textos.observacao')} rows={2} maxLength={300} valor={l.observacao ?? ''} aoMudar={(observacao) => mudar({ observacao: observacao || undefined })} />
        <button type="submit" hidden />
      </form>
    </Dialogo>
  );
}

// ---------- cabeçalho comum ----------

export function BotaoNovoLancamento({ tamanho }: { tamanho?: 'pequeno' }) {
  const { t } = useT();
  const abrir = useEditorLancamento();
  return (
    <MenuSuspenso
      rotulo={t('paginas.financas.textos.novoLancamento')}
      icone="plus"
      dividido
      tamanho={tamanho}
      alinhamento="fim"
      aoClicarPrincipal={() => abrir('despesa')}
      itens={[
        { id: 'despesa', rotulo: t('paginas.financas.textos.despesa'), icone: 'trending-down' },
        { id: 'receita', rotulo: t('paginas.financas.textos.receita'), icone: 'trending-up' },
        { id: 'transferencia', rotulo: t('paginas.financas.textos.transferencia'), icone: 'arrow-left-right' },
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
