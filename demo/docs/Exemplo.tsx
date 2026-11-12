import { Component, useState, type ComponentType, type ReactNode } from 'react';
import { Alerta, Botao } from '../../src';
import { Codigo } from './Codigo';

// Cada arquivo em exemplos/ é ao mesmo tempo o exemplo que roda e o código que a página mostra.
const MODULOS = import.meta.glob<{ default: ComponentType }>('./exemplos/**/*.tsx', { eager: true });
const FONTES = import.meta.glob<string>('./exemplos/**/*.tsx', { eager: true, query: '?raw', import: 'default' });

/** Um exemplo que quebra mostra o erro no lugar dele, sem derrubar a página. */
class Isolar extends Component<{ children: ReactNode }, { erro: Error | null }> {
  state = { erro: null as Error | null };
  static getDerivedStateFromError(erro: Error) {
    return { erro };
  }
  render() {
    return this.state.erro ? <Alerta severidade="err" titulo="O exemplo falhou" mensagem={this.state.erro.message} /> : this.props.children;
  }
}

/** O código como o app escreveria: importando do pacote, não do src/ da demo. */
function comoNoApp(fonte: string) {
  return fonte.replace(/from '(\.\.\/)+src'/g, "from '@celke/kole-react'").trim();
}

/**
 * Exemplo ao vivo + código. `id` = caminho em exemplos/ sem a extensão
 * (ex.: `botao/Cores` → exemplos/botao/Cores.tsx).
 */
export function Exemplo({ id, titulo, children }: { id: string; titulo: string; children?: ReactNode }) {
  const [verCodigo, setVerCodigo] = useState(false);
  const chave = `./exemplos/${id}.tsx`;
  const Componente = MODULOS[chave]?.default;
  const fonte = FONTES[chave];
  if (!Componente || fonte === undefined) return <Alerta severidade="err" mensagem={`Exemplo não encontrado: ${chave}`} />;

  return (
    <section className="doc-exemplo" id={id.split('/').pop()?.toLowerCase()}>
      <h3 className="doc-exemplo-titulo">{titulo}</h3>
      {children && <div className="doc-exemplo-desc">{children}</div>}
      <div className="doc-exemplo-caixa">
        <div className="doc-exemplo-preview">
          <Isolar>
            <Componente />
          </Isolar>
        </div>
        <div className="doc-exemplo-rodape">
          <Botao
            rotulo={verCodigo ? 'Ocultar código' : 'Ver código'}
            icone="code"
            aparencia="texto"
            tamanho="pequeno"
            aria-expanded={verCodigo}
            onClick={() => setVerCodigo((v) => !v)}
          />
        </div>
        {verCodigo && <Codigo codigo={comoNoApp(fonte)} />}
      </div>
    </section>
  );
}
