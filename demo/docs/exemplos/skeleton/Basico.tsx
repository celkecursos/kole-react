import { Skeleton } from '../../../../src';

export default function Exemplo() {
  return (
    // a silhueta imita o conteúdo que está chegando
    <div className="demo-linha" style={{ alignItems: 'center', gap: '0.875rem' }}>
      <Skeleton formato="circulo" largura="3rem" altura="3rem" />
      <div className="demo-pilha-p" style={{ flex: 1 }}>
        <Skeleton largura="40%" altura="1.125rem" />
        <Skeleton largura="85%" />
        <Skeleton largura="70%" />
      </div>
    </div>
  );
}
