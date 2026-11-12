import { useState } from 'react';
import { CampoCidade, CampoTipoPessoa, CampoUf, CampoUfMultiplo, type Municipio } from '../../../../src';

const MUNICIPIOS: Record<string, string[]> = {
  PR: ['Curitiba', 'Londrina', 'Maringá', 'Cascavel', 'Ponta Grossa'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau', 'Chapecó'],
};

// no app: a API de municípios do IBGE ou a do próprio sistema
const buscarPorUf = (uf: string) =>
  Promise.resolve<Municipio[]>((MUNICIPIOS[uf] ?? []).map((nome, i) => ({ id: `${uf}-${i}`, nome })));

export default function Exemplo() {
  const [uf, setUf] = useState<string | null>('PR');
  const [cidade, setCidade] = useState<Municipio | string | null>(null);
  const [ufs, setUfs] = useState<string[]>(['PR', 'SC']);
  const [pessoa, setPessoa] = useState<'F' | 'J' | null>('F');

  return (
    <div className="demo-grade-2">
      <CampoUf
        rotulo="UF"
        valor={uf}
        aoMudar={(v) => {
          setUf(v);
          setCidade(null);
        }}
      />
      <CampoCidade rotulo="Cidade" uf={uf ?? ''} buscarPorUf={buscarPorUf} valor={cidade} aoMudar={setCidade} />
      <CampoUfMultiplo rotulo="UFs de atuação" exibicao="sigla" valor={ufs} aoMudar={setUfs} botaoLimpar />
      <CampoTipoPessoa rotulo="Tipo de pessoa" valor={pessoa} aoMudar={setPessoa} />
    </div>
  );
}
