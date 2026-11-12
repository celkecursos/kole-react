import { Botao, useToast } from '../../src';

/** Bloco de código com botão de copiar. */
export function Codigo({ codigo, linguagem = 'tsx' }: { codigo: string; linguagem?: string }) {
  const toast = useToast();
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
      toast.ok('Código copiado');
    } catch {
      toast.err('Não deu para copiar', 'Selecione o código e copie manualmente.');
    }
  };
  return (
    <div className="doc-codigo">
      <div className="doc-codigo-barra">
        <span className="doc-codigo-ling">{linguagem}</span>
        <Botao icone="copy" aparencia="texto" tamanho="pequeno" dica="Copiar código" aria-label="Copiar código" onClick={copiar} />
      </div>
      <pre>
        <code>{codigo}</code>
      </pre>
    </div>
  );
}

/** Código inline (nome de prop, valor). */
export function C({ children }: { children: string }) {
  return <code className="doc-c">{children}</code>;
}
