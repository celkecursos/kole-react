import { Icone } from '../../utils/Icone';
import { createContext, useCallback, useContext, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Botao, type SeveridadeBotao } from '../Botao/Botao';
import { Sobreposicao } from '../Dialogo/Sobreposicao';
import './Confirmacao.css';

export interface OpcoesConfirmacao {
  titulo: string;
  mensagem?: ReactNode;
  severidade?: Exclude<SeveridadeBotao, 'secundario'>;
  icone?: string;
  rotuloAceitar?: string;
  rotuloRecusar?: string;
  iconeAceitar?: string;
  /** Só o botão de OK (aviso). */
  somenteOk?: boolean;
}

/** Remoção: sempre vermelha e com lixeira (não dá para trocar). */
export type OpcoesRemocao = Omit<Partial<OpcoesConfirmacao>, 'severidade' | 'iconeAceitar' | 'somenteOk'>;

/** Aviso: um botão só, para ciência. */
export type OpcoesAviso = Omit<OpcoesConfirmacao, 'somenteOk' | 'rotuloRecusar'>;

export interface Confirmar {
  (opcoes: OpcoesConfirmacao): Promise<boolean>;
  /** Atalho institucional de exclusão de dado salvo (irreversível). */
  remover: (opcoes?: OpcoesRemocao) => Promise<boolean>;
  /** Só ciência — "alertar" é `avisar({ severidade: 'err' })`. */
  avisar: (opcoes: OpcoesAviso) => Promise<void>;
}

const Ctx = createContext<Confirmar | null>(null);

const ICONE_PADRAO: Record<string, string> = {
  pri: 'circle-question-mark',
  ok: 'circle-check',
  warn: 'triangle-alert',
  err: 'trash-2',
};

/** Fornece `useConfirmacao()` para a árvore. Já incluso no `ProvedorUi`. */
export function ProvedorConfirmacao({ children }: { children: ReactNode }) {
  const [atual, setAtual] = useState<OpcoesConfirmacao | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);
  const tituloId = useId();
  const msgId = useId();

  const confirmar = useCallback((opcoes: OpcoesConfirmacao) => {
    resolver.current?.(false);
    setAtual(opcoes);
    return new Promise<boolean>((res) => {
      resolver.current = res;
    });
  }, []);

  const api = useMemo<Confirmar>(
    () =>
      Object.assign((o: OpcoesConfirmacao) => confirmar(o), {
        remover: (o: OpcoesRemocao = {}) =>
          confirmar({
            titulo: 'Remover registro?',
            mensagem: 'Esta ação não pode ser desfeita.',
            rotuloAceitar: 'Remover',
            ...o,
            severidade: 'err',
            icone: 'trash-2',
            iconeAceitar: 'trash-2',
          }),
        avisar: (o: OpcoesAviso) =>
          confirmar({ rotuloAceitar: 'Entendi', icone: o.severidade && o.severidade !== 'pri' ? undefined : 'info', ...o, somenteOk: true }).then(
            () => undefined,
          ),
      }),
    [confirmar],
  );

  const responder = (v: boolean) => {
    resolver.current?.(v);
    resolver.current = null;
    setAtual(null);
  };

  const sev = atual?.severidade ?? 'pri';

  return (
    <Ctx.Provider value={api}>
      {children}
      {atual && (
        <Sobreposicao
          aoDispensar={() => responder(false)}
          rotuloId={tituloId}
          descricaoId={atual.mensagem ? msgId : undefined}
          focoInicial="[data-aceitar]"
          className="lp-dlg lp-dlg--pequeno lp-conf"
        >
          <div className="lp-conf-cab">
            <span className="lp-conf-selo" data-sev-conf={sev}>
              <Icone icone={atual.icone ?? ICONE_PADRAO[sev]} />
            </span>
            <span className="lp-conf-titulo" id={tituloId}>
              {atual.titulo}
            </span>
          </div>
          {atual.mensagem && (
            <p className="lp-conf-msg" id={msgId}>
              {atual.mensagem}
            </p>
          )}
          <div className="lp-conf-rodape">
            {!atual.somenteOk && (
              <Botao rotulo={atual.rotuloRecusar ?? 'Cancelar'} aparencia="texto" severidade="secundario" onClick={() => responder(false)} />
            )}
            <Botao
              data-aceitar=""
              rotulo={atual.rotuloAceitar ?? (atual.somenteOk ? 'OK' : 'Confirmar')}
              icone={atual.iconeAceitar}
              severidade={sev}
              onClick={() => responder(true)}
            />
          </div>
        </Sobreposicao>
      )}
    </Ctx.Provider>
  );
}

/**
 * `const confirmar = useConfirmacao();`
 * `if (await confirmar({ titulo: 'Excluir?', severidade: 'err' })) …`
 * `if (await confirmar.remover({ mensagem: '"TJ-PR 2026" será removido.' })) …`
 * `await confirmar.avisar({ titulo: 'Prazo encerrado', severidade: 'warn' })`
 */
export function useConfirmacao(): Confirmar {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useConfirmacao precisa de <ProvedorConfirmacao> (ou <ProvedorUi>) acima na árvore.');
  return ctx;
}
