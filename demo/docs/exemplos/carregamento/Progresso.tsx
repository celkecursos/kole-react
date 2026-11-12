import { useEffect, useState } from 'react';
import { Botao, Progresso } from '../../../../src';

export default function Exemplo() {
  const [valor, setValor] = useState<number | null>(null);

  // no app: o progresso do upload (XMLHttpRequest.upload.onprogress) ou da importação
  useEffect(() => {
    if (valor === null || valor >= 100) return;
    const t = setTimeout(() => setValor((v) => Math.min(100, (v ?? 0) + 10)), 250);
    return () => clearTimeout(t);
  }, [valor]);

  return (
    <div className="demo-pilha-p">
      <Progresso rotulo="Importação da planilha" valor={valor ?? 0} mostrarValor="fim" cor={valor === 100 ? 'ok' : 'pri'} aparencia="listrado" animado={valor !== null && valor < 100} />
      <div className="demo-linha">
        <Botao rotulo="Importar" icone="upload" aparencia="contorno" onClick={() => setValor(0)} disabled={valor !== null && valor < 100} />
      </div>
    </div>
  );
}
