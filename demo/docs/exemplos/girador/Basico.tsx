import { Girador } from '../../../../src';

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Girador />
      <Girador tipo="pulso" cor="destaque" />
      <Girador tipo="pontos" cor="ok" />
      <Girador tamanho="pequeno" cor="secundario" />
      <Girador tamanho="grande" />
      <Girador rotulo="Sincronizando" mostrarRotulo cor="info" />
    </div>
  );
}
