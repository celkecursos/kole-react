import { useState } from 'react';
import { CampoCep, CampoCnpj, CampoCpf, CampoCpfCnpj, CampoEmail, CampoTelefone } from '../../../../src';

export default function Exemplo() {
  const [d, setD] = useState({ cpf: '529.982.247-24', cnpj: '', cpfCnpj: '', cep: '', email: '', celular: '' });
  const mudar = (campo: keyof typeof d) => (valor: string) => setD({ ...d, [campo]: valor });

  return (
    // máscara, placeholder e validação (inclusive dígito verificador) já vêm prontos
    <div className="demo-grade-2">
      <CampoCpf rotulo="CPF" valor={d.cpf} aoMudar={mudar('cpf')} />
      <CampoCnpj rotulo="CNPJ" valor={d.cnpj} aoMudar={mudar('cnpj')} />
      <CampoCpfCnpj rotulo="CPF ou CNPJ" valor={d.cpfCnpj} aoMudar={mudar('cpfCnpj')} />
      <CampoCep rotulo="CEP" valor={d.cep} aoMudar={mudar('cep')} />
      <CampoEmail rotulo="E-mail" valor={d.email} aoMudar={mudar('email')} />
      <CampoTelefone rotulo="Celular" tipo="celular" valor={d.celular} aoMudar={mudar('celular')} />
    </div>
  );
}
