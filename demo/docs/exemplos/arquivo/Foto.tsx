import { Foto } from '../../../../src';

const retrato = (cor: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="${cor}"/><circle cx="150" cy="150" r="70" fill="#fff" fill-opacity=".85"/><rect x="60" y="250" width="180" height="150" rx="90" fill="#fff" fill-opacity=".85"/></svg>`)}`;

export default function Exemplo() {
  return (
    <div className="demo-linha">
      <Foto nome="Ana Paula Souza" fotos={retrato('#1f5fe0')} ampliavel />
      {/* várias fotos: setas para folhear */}
      <Foto nome="Carlos Lima" fotos={[retrato('#15803d'), retrato('#b45309')]} ampliavel />
      {/* sem foto: as iniciais do nome */}
      <Foto nome="Beatriz Rocha" tamanho="sm" />
    </div>
  );
}
