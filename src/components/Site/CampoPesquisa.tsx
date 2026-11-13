import { useId, type FormEvent } from 'react';
import { cx } from '../../utils/cx';
import { Icone } from '../../utils/Icone';
import './CampoPesquisa.css';
import { useTextos } from '../../i18n/contexto';

export interface CampoPesquisaProps {
  valor: string;
  aoMudar: (valor: string) => void;
  /** Enter ou o botão. Recebe o termo sem espaços nas pontas. */
  aoPesquisar?: (termo: string) => void;
  placeholder?: string;
  /** Nome do campo para leitor de tela. Padrão: o `placeholder`. */
  rotulo?: string;
  rotuloBotao?: string;
  /** `padrao` = pílula clara · `destaque` = pílula branca grande com botão laranja, para a faixa marinha. */
  aparencia?: 'padrao' | 'destaque';
  className?: string;
}

/** Busca em pílula com botão (`role="search"`), como nas faixas e listagens do site. */
export function CampoPesquisa({ valor, aoMudar, aoPesquisar, placeholder: placeholderProp, rotulo, rotuloBotao: rotuloBotaoProp, aparencia = 'padrao', className }: CampoPesquisaProps) {
  const t = useTextos();
  const placeholder = placeholderProp ?? t.site.pesquisar;
  const rotuloBotao = rotuloBotaoProp ?? t.comum.buscar;
  const id = useId();
  const enviar = (e: FormEvent) => {
    e.preventDefault();
    aoPesquisar?.(valor.trim());
  };
  return (
    <form role="search" className={cx('lp-pesquisa', `lp-pesquisa--${aparencia}`, className)} onSubmit={enviar}>
      <label className="lp-sr" htmlFor={id}>
        {rotulo ?? placeholder}
      </label>
      <Icone icone="search" className="lp-pesquisa-ic" />
      <input id={id} className="lp-pesquisa-input" type="search" value={valor} placeholder={placeholder} onChange={(e) => aoMudar(e.target.value)} />
      <button type="submit" className="lp-pesquisa-botao">
        {rotuloBotao}
      </button>
    </form>
  );
}
