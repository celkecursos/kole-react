import { useState } from 'react';
import { NavegadorPeriodo, Paginacao, SeletorIdioma, Tabela, formatarMoeda, periodoDe, tempoRelativo, useIdioma } from '../../../../src';

export default function Exemplo() {
  // o idioma é o do ProvedorPreferencias: trocar aqui troca a página inteira (e a topbar)
  const idioma = useIdioma();
  const [periodo, setPeriodo] = useState(() => periodoDe('mes'));
  const [pagina, setPagina] = useState(2);
  return (
    <div className="demo-pilha">
      <SeletorIdioma />
      <div className="demo-util">
        <code>formatarMoeda(1234.5, {'{'} idioma {'}'})</code>
        <div className="demo-util-res">{formatarMoeda(1234.5, { idioma })}</div>
        <code>tempoRelativo(ontem, agora, idioma)</code>
        <div className="demo-util-res">{tempoRelativo(new Date(Date.now() - 86_400_000 * 3), new Date(), idioma)}</div>
      </div>
      <NavegadorPeriodo valor={periodo} aoMudar={setPeriodo} />
      <Paginacao total={87} pagina={pagina} tamanho={10} aoMudarPagina={setPagina} />
      <Tabela colunas={[{ campo: 'nome', rotulo: 'Nome' }]} registros={[]} />
    </div>
  );
}
