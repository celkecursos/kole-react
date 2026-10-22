import { createContext, useContext, useEffect, useId, useState, type CSSProperties, type FormEvent, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { tituloDeEntidade, type Entidade, type Modo } from '../../utils/entidade';
import { Botao } from '../Botao/Botao';
import { Trilha, type ItemTrilha } from '../Trilha/Trilha';
import { RevelarCamposCtx } from '../Campo/Campo';
import { Dialogo, type TamanhoDialogo } from '../Dialogo/Dialogo';
import './Form.css';

interface CtxForm {
  arranjo: 'pagina' | 'modal';
}

const FormCtx = createContext<CtxForm>({ arranjo: 'pagina' });

/** Item do menu lateral: cada um leva a um formulário do mesmo cadastro. */
export interface ItemMenuForm {
  id: string;
  rotulo: string;
  icone?: IconeProp;
  /** Com `href` o item vira link (ex.: `#/pedidos/novo/itens`). */
  href?: string;
  /** Chip de pendências ao lado do rótulo. */
  pendencias?: number;
  desabilitado?: boolean;
}

export interface FormProps {
  /** `pagina` = tela cheia com menu lateral opcional · `modal` = dentro de diálogo. */
  arranjo?: 'pagina' | 'modal';
  /**
   * Título do cabeçalho. Com `entidade`, pode ser omitido: vira
   * "Cadastrar/Editar/Visualizar <entidade>" conforme o `modo`.
   */
  titulo?: string;
  /** Entidade do cadastro (`'veículo'` ou `{ nome, novo: 'Firmar contrato' }`). */
  entidade?: string | Entidade;
  /** Fase do registro na tela (padrão: `novo`). Em `leitura` some o Salvar. */
  modo?: Modo;
  /**
   * Página: trilha de navegação abaixo do título. `true` = caminho automático
   * do menu; lista = automático + estes passos no fim.
   */
  trilha?: boolean | ItemTrilha[];
  /** Identificação do registro (ex.: "Protocolo 2026/0012"). */
  identidade?: string;
  icone?: IconeProp;
  /** Modal: controla a abertura. */
  aberto?: boolean;
  tamanho?: TamanhoDialogo;
  aoSalvar?: () => void;
  aoCancelar?: () => void;
  salvando?: boolean;
  /** Quantos campos faltam corrigir — mostrado no rodapé. */
  pendencias?: number;
  /** Página: menu lateral com os formulários do cadastro. */
  menu?: ItemMenuForm[];
  /** Título do card do menu (padrão: "Formulários"). */
  menuTitulo?: string;
  /** `id` do item do menu que corresponde a este formulário. */
  menuAtivo?: string;
  /** Clique num item do menu; num item com `href`, chame `preventDefault` para navegar por conta própria. */
  aoEscolherMenu?: (id: string, evento: MouseEvent) => void;
  /** Botões extras no rodapé, antes de Cancelar/Salvar. */
  acoes?: ReactNode;
  /** Cancelar + Salvar no rodapé (padrão: sim). */
  acoesPadrao?: boolean;
  /**
   * Página: onde ficam os botões. `secao` (padrão) = card logo abaixo das
   * seções · `fixo` = barra presa ao pé da tela.
   */
  posicaoAcoes?: 'secao' | 'fixo';
  rotuloSalvar?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Formulário de cadastro. Agrupe os campos em `<FormSecao>`; a grade de
 * colunas, o menu lateral e o rodapé com Salvar/Cancelar vêm prontos.
 */
export function Form({
  arranjo = 'pagina',
  titulo: tituloProp,
  entidade,
  modo = 'novo',
  trilha,
  identidade,
  icone,
  aberto = true,
  tamanho = 'grande',
  aoSalvar,
  aoCancelar,
  salvando = false,
  pendencias,
  menu,
  menuTitulo = 'Formulários',
  menuAtivo,
  aoEscolherMenu,
  acoes,
  acoesPadrao = true,
  posicaoAcoes = 'secao',
  rotuloSalvar = 'Salvar',
  children,
  className,
}: FormProps) {
  const formId = `lp-form-${useId().replace(/:/g, '')}`;
  const titulo = tituloProp ?? (entidade ? tituloDeEntidade(entidade, modo) : '');
  const leitura = modo === 'leitura';
  // cada envio revela as pendências de todos os campos; reabrir zera
  const [tentativas, setTentativas] = useState(0);
  useEffect(() => {
    if (aberto) setTentativas(0);
  }, [aberto]);

  const aoSubmeter = (e: FormEvent) => {
    e.preventDefault();
    setTentativas((n) => n + 1);
    if (!salvando) aoSalvar?.();
  };

  const rodape = (
    <div className="lp-form-rodape">
      {pendencias !== undefined && (
        <span className={cx('lp-form-pend', pendencias ? 'is-warn' : 'is-ok')} role="status">
          <Icone icone={pendencias ? 'circle-alert' : 'circle-check'} />
          {pendencias ? `${pendencias} campo(s) a corrigir` : 'Pronto para salvar'}
        </span>
      )}
      <span className="lp-form-rodape-esp" />
      {acoes}
      {acoesPadrao && (
        <>
          <Botao rotulo={leitura ? 'Fechar' : 'Cancelar'} severidade="secundario" disabled={salvando} onClick={aoCancelar} />
          {!leitura && <Botao type="submit" form={formId} rotulo={rotuloSalvar} icone="save" carregando={salvando} />}
        </>
      )}
    </div>
  );

  const corpo = (
    <form id={formId} className="lp-form-secoes" onSubmit={aoSubmeter} noValidate>
      <RevelarCamposCtx.Provider value={tentativas}>
        {leitura ? (
          <fieldset className="lp-form-leitura" disabled>
            {children}
          </fieldset>
        ) : (
          children
        )}
      </RevelarCamposCtx.Provider>
    </form>
  );

  const ctx: CtxForm = { arranjo };

  if (arranjo === 'modal') {
    return (
      <FormCtx.Provider value={ctx}>
        <Dialogo
          aberto={aberto}
          aoFechar={() => aoCancelar?.()}
          titulo={titulo}
          subtitulo={identidade}
          icone={icone}
          tamanho={tamanho}
          dispensavel={!salvando}
          rodape={acoesPadrao || acoes ? rodape : undefined}
          className={className}
        >
          {corpo}
        </Dialogo>
      </FormCtx.Provider>
    );
  }

  if (!aberto) return null;
  const comMenu = !!menu?.length;
  const temAcoes = acoesPadrao || !!acoes;

  return (
    <FormCtx.Provider value={ctx}>
      <div className={cx('lp-form-pagina', className)}>
        <header className="lp-form-cab">
          {aoCancelar && (
            <button type="button" className="lp-voltar" aria-label="Voltar" title="Voltar" onClick={aoCancelar}>
              <Icone icone="arrow-left" />
            </button>
          )}
          {icone && (
            <span className="lp-form-cab-ic">
              <Icone icone={icone} />
            </span>
          )}
          <div className="lp-form-titulos-col">
            <div className="lp-form-titulos">
              <h2 className="lp-form-titulo">{titulo}</h2>
              {identidade && <span className="lp-form-ident">{identidade}</span>}
            </div>
            {trilha && <Trilha extras={Array.isArray(trilha) ? trilha : undefined} className="lp-form-trilha" />}
          </div>
        </header>

        <div className={cx('lp-form-corpo', !comMenu && 'sem-menu')}>
          {comMenu && (
            <aside className="lp-form-menu">
              <div className="lp-form-menu-cab">
                <h3 className="lp-form-menu-titulo">{menuTitulo}</h3>
              </div>
              <nav className="lp-form-menu-nav" aria-label={menuTitulo}>
                {menu.map((item) => {
                  const on = item.id === menuAtivo;
                  const conteudo = (
                    <>
                      <Icone icone={item.icone} />
                      <span className="lp-form-menu-rot">{item.rotulo}</span>
                      {!!item.pendencias && <span className="lp-form-pendchip">{item.pendencias}</span>}
                    </>
                  );
                  const props = {
                    className: cx('lp-form-menu-item', on && 'is-on'),
                    'aria-current': on ? ('page' as const) : undefined,
                    onClick: (e: MouseEvent) => aoEscolherMenu?.(item.id, e),
                  };
                  return item.href && !item.desabilitado ? (
                    <a key={item.id} href={item.href} {...props}>
                      {conteudo}
                    </a>
                  ) : (
                    <button key={item.id} type="button" disabled={item.desabilitado} {...props}>
                      {conteudo}
                    </button>
                  );
                })}
              </nav>
            </aside>
          )}
          <div className="lp-form-col">
            {corpo}
            {temAcoes && posicaoAcoes === 'secao' && <div className="lp-fsec lp-form-acoes">{rodape}</div>}
          </div>
        </div>

        {temAcoes && posicaoAcoes === 'fixo' && (
          <footer className="lp-form-pe">
            <div className="lp-form-pe-col">{rodape}</div>
          </footer>
        )}
      </div>
    </FormCtx.Provider>
  );
}

export interface FormSecaoProps {
  legenda: string;
  icone?: IconeProp;
  /** Botões no cabeçalho da seção. */
  acoes?: ReactNode;
  /** Colunas da grade (padrão: 4 na página, 3 no modal). */
  colunas?: number;
  children: ReactNode;
  className?: string;
}

/**
 * Seção de formulário: card com título e grade de campos.
 * Larguras: `className="lp-col-2"`, `lp-col-3` ou `lp-col-full` no campo.
 */
export function FormSecao({ legenda, icone, acoes, colunas, children, className }: FormSecaoProps) {
  const { arranjo } = useContext(FormCtx);
  const id = `lp-sec-${useId().replace(/:/g, '')}`;

  const estilo = colunas ? ({ '--lp-colunas': colunas } as CSSProperties) : undefined;
  const grade = (
    <div className={cx('lp-fsec-grade', !!colunas && 'tem-colunas')} style={estilo}>
      {children}
    </div>
  );

  if (arranjo === 'modal') {
    return (
      <fieldset id={id} className={cx('lp-fsec lp-fsec--modal', !!acoes && 'tem-acoes', className)}>
        <legend className="lp-fsec-legenda-up">
          <Icone icone={icone} />
          {legenda}
        </legend>
        {acoes && <div className="lp-fsec-acoes lp-fsec-acoes--borda">{acoes}</div>}
        {grade}
      </fieldset>
    );
  }

  return (
    <section id={id} className={cx('lp-fsec lp-fsec--pagina', className)} aria-labelledby={`${id}-t`}>
      <div className="lp-fsec-legenda">
        <Icone icone={icone} />
        <span className="lp-fsec-legenda-txt" id={`${id}-t`}>
          {legenda}
        </span>
        {acoes && <span className="lp-fsec-acoes">{acoes}</span>}
      </div>
      {grade}
    </section>
  );
}
