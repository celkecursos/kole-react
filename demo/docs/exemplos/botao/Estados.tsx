import { useState } from 'react';
import { Botao } from '../../../../src';

export default function Exemplo() {
  const [salvando, setSalvando] = useState(false);
  const [favorito, setFavorito] = useState(false);

  const salvar = () => {
    setSalvando(true);
    setTimeout(() => setSalvando(false), 1500);
  };

  return (
    <div className="demo-linha">
      <Botao rotulo={salvando ? 'Salvando…' : 'Salvar'} carregando={salvando} onClick={salvar} />
      <Botao rotulo="Desabilitado" disabled />
      <Botao
        rotulo="Favorito"
        icone="star"
        aparencia="contorno"
        pressionado={favorito}
        onClick={() => setFavorito((f) => !f)}
      />
    </div>
  );
}
