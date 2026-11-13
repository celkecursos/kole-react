import { useIdioma, useTextos } from '../../i18n/contexto';
import { IDIOMAS_PADRAO, interpolar, type Idioma } from '../../i18n/idiomas';
import { textosDe } from '../../i18n/textos';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import { MenuSuspenso, type AlinhamentoMenu } from '../MenuSuspenso/MenuSuspenso';
import { usePreferenciasOpcional } from '../Preferencias/Preferencias';
import { Bandeira } from './Bandeira';
import './SeletorIdioma.css';

export interface SeletorIdiomaProps {
  /** Idiomas oferecidos, na ordem do menu. Padrão: pt-BR, inglês e espanhol. */
  idiomas?: readonly Idioma[];
  /** Idioma atual. Padrão: o do `ProvedorPreferencias`. */
  valor?: Idioma;
  /** Padrão: troca o idioma do `ProvedorPreferencias` (que avisa o sistema em `aoMudarIdioma`). */
  aoMudar?: (idioma: Idioma) => void;
  /**
   * `icone` = só a bandeira, num botão redondo (topo da `Estrutura`) ·
   * `botao` = bandeira e nome do idioma (tela de login, preferências).
   */
  aparencia?: 'icone' | 'botao';
  alinhamento?: AlinhamentoMenu;
  className?: string;
}

/**
 * Troca o idioma dos textos da biblioteca. Cada idioma aparece com o nome no
 * próprio idioma ("Português", "English", "Español") e a bandeira; o atual
 * fica marcado.
 */
export function SeletorIdioma({ idiomas = IDIOMAS_PADRAO, valor, aoMudar, aparencia = 'botao', alinhamento = 'fim', className }: SeletorIdiomaProps) {
  const t = useTextos();
  const doContexto = useIdioma();
  const prefs = usePreferenciasOpcional();
  const atual = valor ?? doContexto;
  const mudar = aoMudar ?? prefs?.definirIdioma;
  const nome = (i: Idioma) => textosDe(i).idioma.nome;
  const rotulo = interpolar(t.idioma.atual, { nome: nome(atual) });

  return (
    <MenuSuspenso
      className={cx('lp-idioma', `lp-idioma--${aparencia}`, className)}
      aria-label={t.idioma.seletor}
      alinhamento={alinhamento}
      larguraMenu="11rem"
      itens={[
        { tipo: 'titulo', rotulo: t.idioma.seletor },
        ...idiomas.map((i) => ({ id: i, rotulo: nome(i), icone: <Bandeira idioma={i} />, ativo: i === atual })),
      ]}
      aoEscolher={(id) => id !== atual && mudar?.(id)}
      gatilho={(props, aberto) => (
        <button
          type="button"
          {...props}
          className={cx('lp-idioma-gatilho', aparencia === 'icone' && 'lp-tb-icon', aberto && (aparencia === 'icone' ? 'lp-menu-open' : 'is-aberto'))}
          aria-label={rotulo}
          title={aparencia === 'icone' ? rotulo : undefined}
          // o nome do idioma lido no próprio idioma
          lang={atual}
        >
          <Bandeira idioma={atual} />
          {aparencia === 'botao' && (
            <>
              <span className="lp-idioma-nome">{nome(atual)}</span>
              <Icone icone="chevron-down" className="lp-idioma-seta" />
            </>
          )}
        </button>
      )}
    />
  );
}
