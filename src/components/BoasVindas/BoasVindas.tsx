import { Icone } from '../../utils/Icone';
import { useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { nomeCurto, saudacaoPorHora } from '../../utils/texto';
import { Avatar } from '../Avatar/Avatar';
import './BoasVindas.css';
import { useIdioma, useTextos } from '../../i18n/contexto';
import { formatoData, interpolar } from '../../i18n/idiomas';

export interface BoasVindasProps {
  /** Nome completo (a saudação usa primeiro + último). */
  nome: string;
  cargo?: string;
  /** Sigla da unidade (ex.: RH). */
  sigla?: string;
  foto?: string;
  /** Último acesso; sem ele a linha some. */
  ultimoAcesso?: Date | null;
  /** Ações da página inicial (ex.: "Novo cadastro"). */
  children?: ReactNode;
  className?: string;
}


/**
 * Cabeçalho de sessão da página inicial: foto, data por extenso, saudação
 * pela hora, cargo · unidade e último acesso. Substitui o `CabecalhoPagina` na home.
 */
export function BoasVindas({ nome, cargo, sigla, foto, ultimoAcesso, children, className }: BoasVindasProps) {
  const t = useTextos();
  const idioma = useIdioma();
  // congelados no primeiro render: a página não fica aberta virando a hora
  const [agora] = useState(() => new Date());
  const cargoLinha = [cargo, sigla].filter(Boolean).join(' · ');
  const hoje = formatoData(idioma, { dateStyle: 'full' }).format(agora);

  return (
    <header className={cx('lp-bv', className)}>
      <Avatar nome={nome} foto={foto} tom="escuro" tamanho="3.5rem" />
      <div className="lp-bv-txt">
        <span className="lp-bv-data">{hoje.charAt(0).toUpperCase() + hoje.slice(1)}</span>
        <h1 className="lp-bv-saudacao">
          {saudacaoPorHora(agora, idioma)}, {nomeCurto(nome).split(' ')[0]}
        </h1>
        {cargoLinha && <span className="lp-bv-cargo">{cargoLinha}</span>}
        {ultimoAcesso && (
          <span className="lp-bv-acesso">
            <Icone icone="clock" />
            {interpolar(t.boasVindas.ultimoAcesso, { data: formatoData(idioma, { dateStyle: 'short' }).format(ultimoAcesso), hora: formatoData(idioma, { timeStyle: 'short' }).format(ultimoAcesso) })}
          </span>
        )}
      </div>
      {children && <div className="lp-bv-acoes">{children}</div>}
    </header>
  );
}
