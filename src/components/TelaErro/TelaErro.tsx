import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import type { Marca } from '../Estrutura/Estrutura';
import './TelaErro.css';

export interface TelaErroProps {
  /** Código grande em destaque (ex.: 404). */
  codigo: string | number;
  /** Frase principal (vira o `h1` da página). */
  titulo: string;
  descricao?: ReactNode;
  /** Ícone no selo acima do código. */
  icone?: IconeProp;
  /** Cor do código: `pri` (padrão) · `warn` · `err`. */
  cor?: 'pri' | 'warn' | 'err';
  /** Botões (voltar, tentar de novo, entrar…). */
  acoes?: ReactNode;
  /** Informação técnica miúda (ex.: código do incidente para o suporte). */
  detalhe?: ReactNode;
  /** Marca no topo, como na tela de login. */
  marca?: Marca;
  /** `cheia` (padrão) ocupa a janela; `contida` cabe dentro da moldura do sistema. */
  tela?: 'cheia' | 'contida';
  className?: string;
}

/** Página de erro (401, 404, 500…) com código em destaque e caminhos de saída. */
export function TelaErro({ codigo, titulo, descricao, icone, cor = 'pri', acoes, detalhe, marca, tela = 'cheia', className }: TelaErroProps) {
  return (
    <div className={cx('lp-erro', `lp-erro--${tela}`, cor !== 'pri' && `lp-erro--${cor}`, className)}>
      <div className="lp-erro-fundo" aria-hidden="true">
        <span className="lp-erro-mancha lp-erro-mancha--1" />
        <span className="lp-erro-mancha lp-erro-mancha--2" />
        <span className="lp-erro-grade" />
      </div>

      {marca && tela === 'cheia' && (
        <header className="lp-erro-cab">
          {marca.logo ? (
            <img className="lp-erro-logo" src={marca.logo} alt="" />
          ) : (
            <span className="lp-erro-escudo" aria-hidden="true">
              <Icone icone="shield" />
            </span>
          )}
          <span className="lp-erro-marca">
            <strong>{marca.nome}</strong>
            {marca.subtitulo && <span>{marca.subtitulo}</span>}
          </span>
        </header>
      )}

      <main className="lp-erro-main">
        {icone && (
          <span className="lp-erro-selo" aria-hidden="true">
            <Icone icone={icone} />
          </span>
        )}
        <p className="lp-erro-codigo" aria-hidden="true">
          {codigo}
        </p>
        <h1 className="lp-erro-titulo">
          <span className="lp-sr">Erro {codigo}: </span>
          {titulo}
        </h1>
        {descricao && <div className="lp-erro-desc">{descricao}</div>}
        {acoes && <div className="lp-erro-acoes">{acoes}</div>}
        {detalhe && <div className="lp-erro-detalhe">{detalhe}</div>}
      </main>
    </div>
  );
}
