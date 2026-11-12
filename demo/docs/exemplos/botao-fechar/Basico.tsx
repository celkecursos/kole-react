import { BotaoFechar } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <BotaoFechar onClick={() => undefined} />
      <BotaoFechar tamanho="pequeno" rotulo="Fechar aviso" />
      <BotaoFechar disabled />
      {/* claro: sobre fundo escuro (cabeçalho na cor da marca, imagem) */}
      <span style={{ background: 'var(--navy)', padding: 8, borderRadius: 8, display: 'inline-flex' }}>
        <BotaoFechar variante="claro" />
      </span>
    </div>
  );
}
