import { useState } from 'react';
import { CampoChassi, CampoCnh, CampoImei, CampoPlaca, CampoRenavam } from '../../../../src';

export default function Exemplo() {
  const [v, setV] = useState({ placa: '', renavam: '', chassi: '', cnh: '', imei: '' });
  const mudar = (campo: keyof typeof v) => (valor: string) => setV({ ...v, [campo]: valor });

  return (
    <div className="demo-grade-2">
      <CampoPlaca rotulo="Placa" valor={v.placa} aoMudar={mudar('placa')} />
      <CampoRenavam rotulo="Renavam" valor={v.renavam} aoMudar={mudar('renavam')} />
      <CampoChassi rotulo="Chassi" valor={v.chassi} aoMudar={mudar('chassi')} />
      <CampoCnh rotulo="CNH" valor={v.cnh} aoMudar={mudar('cnh')} />
      <CampoImei rotulo="IMEI" valor={v.imei} aoMudar={mudar('imei')} />
    </div>
  );
}
