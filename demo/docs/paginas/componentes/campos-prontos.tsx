import { C } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaComponente } from '../../PaginaDoc';

export default function Pagina() {
  return (
    <PaginaComponente
      titulo="Campos prontos"
      icone="id-card"
      componente="CampoTelefone"
      importar={[
        'CampoCpf',
        'CampoCnpj',
        'CampoCpfCnpj',
        'CampoCep',
        'CampoEmail',
        'CampoMoeda',
        'CampoInteiro',
        'CampoData',
        'CampoHora',
        'CampoDataHora',
        'CampoPlaca',
        'CampoRenavam',
        'CampoChassi',
        'CampoCnh',
        'CampoImei',
      ]}
      resumo="CampoTexto com máscara, placeholder, teclado e validação prontos para os formatos brasileiros mais comuns."
      notas={
        <ul className="doc-lista">
          <li>
            Todos aceitam as props do <C>CampoTexto</C> (rótulo, dica, obrigatório, erro), menos a <C>mascara</C>, que já vem definida.
            A tabela abaixo é a do <C>CampoTelefone</C>, o único com prop própria (<C>tipo</C>).
          </li>
          <li>
            CPF, CNPJ, CNH e IMEI conferem o dígito verificador; os demais conferem o formato. Os validadores também estão soltos para
            outro uso: <C>isCpf</C>, <C>isCnpj</C>, <C>isPlaca</C> e companhia.
          </li>
          <li>
            <C>CampoMoeda</C> e <C>CampoInteiro</C> trabalham com <C>number | null</C>; os demais, com texto (já mascarado). Para gravar
            só os dígitos, use <C>semMascara(valor)</C>.
          </li>
          <li>
            Os formatos ficam em <C>TIPOS_CAMPO</C>, a mesma fonte que monta máscara, placeholder e validação.
          </li>
        </ul>
      }
    >
      <Exemplo id="campos-prontos/Documentos" titulo="Documentos e contato">
        O CPF vem com o dígito verificador errado de propósito: valor que já chega inválido mostra o aviso na hora, e o texto é mantido.
      </Exemplo>
      <Exemplo id="campos-prontos/Numeros" titulo="Moeda, número e datas" />
      <Exemplo id="campos-prontos/Veiculos" titulo="Veículos e aparelhos" />
    </PaginaComponente>
  );
}
