import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { iniciais } from '../../utils/texto';
import { MenuSuspenso, type ItemMenuSuspenso } from '../MenuSuspenso/MenuSuspenso';
import './SeletorContexto.css';
import { useTextos } from '../../i18n/contexto';
import { interpolar } from '../../i18n/idiomas';

export interface OpcaoContexto {
  id: string;
  nome: string;
  /** Linha miúda (ex.: "Pessoal", o CNPJ, a cidade da filial). */
  descricao?: string;
  /** Ícone no quadrado; sem ele, as iniciais do nome. */
  icone?: IconeProp;
  /** Cor do quadrado: `pri`, `ok`, `warn`, `err`, `info`, `graf-1` a `graf-6` ou qualquer cor CSS. */
  cor?: string;
}

export interface SeletorContextoProps {
  opcoes: OpcaoContexto[];
  /** `id` da opção atual. */
  valor: string;
  aoMudar: (id: string) => void;
  /** Título do menu e nome acessível. Padrão "Trocar de espaço". */
  rotulo?: string;
  /** Itens depois das opções (ex.: "Gerenciar espaços"), separados por um divisor. */
  acoes?: ItemMenuSuspenso[];
  aoEscolherAcao?: (id: string) => void;
  /** Só o quadrado, sem o nome (topo estreito). Padrão: some sozinho abaixo de 40rem. */
  compacto?: boolean;
  className?: string;
}

const TOKENS = new Set(['pri', 'ok', 'warn', 'err', 'info']);
function corDoQuadro(cor?: string) {
  if (!cor) return undefined;
  if (TOKENS.has(cor)) return `var(--${cor === 'pri' ? 'pri' : `${cor}-solid`})`;
  if (/^graf-\d$/.test(cor)) return `var(--${cor})`;
  return cor;
}

function Quadro({ opcao }: { opcao: OpcaoContexto }) {
  return (
    <span className="lp-ctx-quadro" style={{ background: corDoQuadro(opcao.cor) }} aria-hidden="true">
      {opcao.icone ? <Icone icone={opcao.icone} /> : iniciais(opcao.nome)}
    </span>
  );
}

/**
 * Troca o contexto do sistema inteiro: Pessoal × Empresa, a empresa do grupo,
 * a filial, a escola. Fica no topo (prop `contexto` da `Estrutura`) ou onde o
 * app quiser.
 */
export function SeletorContexto({ opcoes, valor, aoMudar, rotulo: rotuloProp, acoes, aoEscolherAcao, compacto, className }: SeletorContextoProps) {
  const t = useTextos();
  const rotulo = rotuloProp ?? t.contexto.trocar;
  const atual = opcoes.find((o) => o.id === valor) ?? opcoes[0];
  const ids = new Set(opcoes.map((o) => o.id));
  const itens: ItemMenuSuspenso[] = [
    { tipo: 'titulo', rotulo },
    ...opcoes.map((o) => ({ id: o.id, rotulo: o.nome, extra: o.descricao, icone: o.icone, ativo: o.id === atual?.id })),
    ...(acoes?.length ? [{ tipo: 'divisor' as const }, ...acoes] : []),
  ];
  if (!atual) return null;

  return (
    <MenuSuspenso
      className={cx('lp-ctx', compacto && 'lp-ctx--compacto', className)}
      itens={itens}
      larguraMenu="15rem"
      aoEscolher={(id) => (ids.has(id) ? id !== atual.id && aoMudar(id) : aoEscolherAcao?.(id))}
      gatilho={(props, aberto) => (
        <button
          type="button"
          {...props}
          className={cx('lp-ctx-gatilho', aberto && 'is-aberto')}
          aria-label={interpolar(t.contexto.atual, { rotulo, nome: `${atual.nome}${atual.descricao ? `, ${atual.descricao}` : ''}` })}
        >
          <Quadro opcao={atual} />
          <span className="lp-ctx-textos">
            <span className="lp-ctx-nome">{atual.nome}</span>
            {atual.descricao && <span className="lp-ctx-desc">{atual.descricao}</span>}
          </span>
          <Icone icone="chevron-down" className="lp-ctx-seta" />
        </button>
      )}
    />
  );
}
