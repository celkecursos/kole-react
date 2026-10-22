import { useRef, useState } from 'react';
import {
  Botao,
  CabecalhoPagina,
  CampoAnexo,
  CampoBusca,
  CampoChassi,
  CampoCidade,
  CampoCnh,
  CampoCnpj,
  CampoCpf,
  CampoCpfCnpj,
  CampoEmail,
  CampoImei,
  CampoMarcacao,
  CampoPlaca,
  CampoRenavam,
  CampoSelect,
  CampoSenha,
  CampoTelefone,
  CampoTexto,
  CampoTipoPessoa,
  CampoUf,
  CampoUfMultiplo,
  Escolha,
  Form,
  FormSecao,
  Picklist,
  VisualizadorArquivo,
  isCpf,
  useToast,
  type Anexo,
  type CampoAnexoRef,
  type Municipio,
  type PicklistValor,
} from '../../src';
import { Bloco, retrato } from './Bloco';
import { OPCOES_PAGAMENTO } from './dados';

interface Servidor {
  id: number;
  nome: string;
  matricula: string;
  lotacao: string;
}

const SERVIDORES: Servidor[] = [
  'Ana Pereira',
  'Bruno Lima',
  'Carla Dias',
  'Daniel Moreira',
  'Eduarda Martins',
  'Fábio Andrade',
  'Gabriela Rocha',
  'Henrique Alves',
  'Isabela Costa',
  'João Ribeiro',
  'Larissa Gomes',
  'Marcelo Nunes',
].map((nome, i) => ({ id: i + 1, nome, matricula: `${2010 + i}${String(i * 37).padStart(4, '0')}`, lotacao: ['TI', 'RH', 'Financeiro', 'Jurídico'][i % 4] }));

// simula a API do módulo: atraso variável, para mostrar o descarte de resposta velha
const buscarServidores = (termo: string) =>
  new Promise<Servidor[]>((r) =>
    setTimeout(() => r(SERVIDORES.filter((s) => s.nome.toLowerCase().includes(termo.toLowerCase()))), 300 + Math.random() * 500),
  );

const MUNICIPIOS: Record<string, string[]> = {
  PR: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais', 'Foz do Iguaçu', 'Colombo', 'Guarapuava', 'Paranaguá'],
  SP: ['São Paulo', 'Campinas', 'Guarulhos', 'São Bernardo do Campo', 'Santos', 'Ribeirão Preto', 'Sorocaba'],
  GO: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia'],
};
const buscarMunicipios = async (uf: string): Promise<Municipio[]> => (MUNICIPIOS[uf] ?? []).map((nome, i) => ({ id: `${uf}-${i}`, nome }));

const PERMISSOES = ['Cadastrar pedido', 'Editar pedido', 'Excluir pedido', 'Aprovar desconto', 'Emitir nota fiscal', 'Gerenciar categorias', 'Ver relatórios', 'Exportar dados'];

const ARQUIVOS: Record<string, Anexo | null> = {
  imagem: { nome: 'perfil.svg', tamanho: 17_500, tipo: 'image/svg+xml', url: retrato('#1f5fe0', 'AP') },
  outro: { nome: 'relatorio-final.xlsx', tamanho: 1_482_000, tipo: 'application/vnd.ms-excel', url: '#' },
  semUrl: { nome: 'reuniao-gravada.mp4', tamanho: 0, tipo: 'video/mp4' },
};

const ANEXOS_INICIAIS: Anexo[] = [
  { nome: 'retrato-ana.svg', tamanho: 18_432, tipo: 'image/svg+xml', url: retrato('#1f5fe0', 'AP') },
  { nome: 'proposta-comercial-2026.docx', tamanho: 254_000, tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
];

export function PaginaCampos() {
  const toast = useToast();
  const anexoRef = useRef<CampoAnexoRef>(null);
  const [doc, setDoc] = useState({ cpf: '529.982.247-24', cnpj: '', cpfCnpj: '', email: '', telefone: '', celular: '', placa: '', renavam: '', chassi: '', cnh: '', imei: '' });
  const [senha, setSenha] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [uf, setUf] = useState<string | null>('PR');
  const [ufs, setUfs] = useState<string[]>(['PR', 'SC']);
  const [cidade, setCidade] = useState<Municipio | string | null>(null);
  const [cidadeLivre, setCidadeLivre] = useState<Municipio | string | null>('');
  const [tipoPessoa, setTipoPessoa] = useState<'F' | 'J' | null>('F');
  const [servidor, setServidor] = useState<Servidor | null>(null);
  const [permissoes, setPermissoes] = useState<PicklistValor<string>>({ fonte: PERMISSOES.slice(2), alvo: PERMISSOES.slice(0, 2) });
  const [anexos, setAnexos] = useState<Anexo[]>(ANEXOS_INICIAIS);
  const [arquivo, setArquivo] = useState('imagem');
  const [texto, setTexto] = useState('');
  const [esc, setEsc] = useState('mes');
  const [radio, setRadio] = useState('a');
  const [marc, setMarc] = useState(true);
  const [chave, setChave] = useState(false);

  const mudar = (k: keyof typeof doc) => (v: string) => setDoc((d) => ({ ...d, [k]: v }));

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Campos e arquivos" icone="pencil" trilha />

      <Bloco titulo="Campos básicos" descricao="Texto, ícone, erro, aviso, desabilitado, somente leitura e select; a variante inline fica na mesma linha do rótulo.">
        <div className="demo-grade">
          <CampoTexto rotulo="Texto" placeholder="Digite…" valor={texto} aoMudar={setTexto} dica="Texto de ajuda" />
          <CampoTexto rotulo="Com ícone" icone="search" placeholder="Pesquisar" />
          <CampoTexto rotulo="Obrigatório com erro" obrigatorio erro="Campo obrigatório." />
          <CampoTexto rotulo="Com aviso" aviso="Confira se o valor está correto." defaultValue="123" />
          <CampoTexto rotulo="Desabilitado" disabled defaultValue="Não editável" />
          <CampoTexto rotulo="Somente leitura" readOnly defaultValue="Somente leitura" />
          <CampoSelect rotulo="Select" opcoes={OPCOES_PAGAMENTO} placeholder="Forma de pagamento" />
        </div>
        <div className="demo-linha">
          <CampoTexto variante="inline" rotulo="Inline" placeholder="valor" />
          <CampoSelect variante="inline" rotulo="Pagamento" opcoes={OPCOES_PAGAMENTO} placeholder="Todos" />
        </div>
      </Bloco>

      <Bloco titulo="Escolhas e marcação">
        <div className="demo-linha">
          <Escolha
            rotulo="Segmentado"
            opcoes={[
              { valor: 'dia', rotulo: 'Dia' },
              { valor: 'semana', rotulo: 'Semana' },
              { valor: 'mes', rotulo: 'Mês' },
            ]}
            valor={esc}
            aoMudar={setEsc}
          />
          <Escolha
            rotulo="Radio"
            aparencia="radio"
            opcoes={[
              { valor: 'a', rotulo: 'Opção A' },
              { valor: 'b', rotulo: 'Opção B' },
            ]}
            valor={radio}
            aoMudar={setRadio}
          />
          <CampoMarcacao rotulo="Caixa de marcação" valor={marc} aoMudar={setMarc} />
          <CampoMarcacao rotulo="Chave" aparencia="chave" valor={chave} aoMudar={setChave} />
        </div>
      </Bloco>

      <Bloco
        titulo="Campos tipados BR"
        descricao="Máscara, placeholder e validação vêm do mesmo descritor (TIPOS_CAMPO). O CPF já chega preenchido com um dígito errado: valor carregado de fora vira aviso, não erro."
      >
        <div className="demo-grade">
          <CampoCpf rotulo="CPF" valor={doc.cpf} aoMudar={mudar('cpf')} />
          <CampoCnpj rotulo="CNPJ" valor={doc.cnpj} aoMudar={mudar('cnpj')} dica="Teste: 11.222.333/0001-81" />
          <CampoCpfCnpj rotulo="CPF ou CNPJ" valor={doc.cpfCnpj} aoMudar={mudar('cpfCnpj')} dica="A máscara muda pelo tamanho" />
          <CampoEmail rotulo="E-mail" valor={doc.email} aoMudar={mudar('email')} />
          <CampoTelefone rotulo="Telefone" valor={doc.telefone} aoMudar={mudar('telefone')} dica="Fixo ou celular" />
          <CampoTelefone rotulo="Celular" tipo="celular" valor={doc.celular} aoMudar={mudar('celular')} />
          <CampoPlaca rotulo="Placa" valor={doc.placa} aoMudar={mudar('placa')} dica="Antiga ou Mercosul" />
          <CampoRenavam rotulo="RENAVAM" valor={doc.renavam} aoMudar={mudar('renavam')} />
          <CampoChassi rotulo="Chassi" valor={doc.chassi} aoMudar={mudar('chassi')} dica="Teste: 9BWZZZ377VT004251" />
          <CampoCnh rotulo="CNH" valor={doc.cnh} aoMudar={mudar('cnh')} dica="Teste: 02650306461" />
          <CampoImei rotulo="IMEI" valor={doc.imei} aoMudar={mudar('imei')} dica="Teste: 490154203237518" />
        </div>
      </Bloco>

      <Bloco titulo="Domínio: UF, cidade e tipo de pessoa" descricao="Trocar a UF limpa a cidade escolhida (cascata embutida no CampoCidade).">
        <div className="demo-grade">
          <CampoUf rotulo="UF" valor={uf} aoMudar={setUf} />
          <CampoCidade rotulo="Cidade" uf={uf ?? ''} buscarPorUf={buscarMunicipios} valor={cidade} aoMudar={setCidade} dica="Com sugestões (PR, SP, GO)" />
          <CampoCidade rotulo="Cidade (texto livre)" uf={uf ?? ''} valor={cidadeLivre} aoMudar={setCidadeLivre} dica="Sem buscarPorUf: aceita texto" />
          <CampoTipoPessoa rotulo="Tipo de pessoa" valor={tipoPessoa} aoMudar={setTipoPessoa} />
          <CampoUfMultiplo className="lp-col-2" rotulo="UFs de atuação" exibicao="sigla" valor={ufs} aoMudar={setUfs} botaoLimpar />
        </div>
      </Bloco>

      <Bloco titulo="Busca remota" descricao="Espera a digitação parar e descarta resposta atrasada. O valor é o registro escolhido, não o texto.">
        <div className="demo-grade-2">
          <CampoBusca<Servidor>
            rotulo="Servidor responsável"
            buscar={buscarServidores}
            paraRotulo={(s) => s.nome}
            paraDetalhe={(s) => `Matrícula ${s.matricula} · ${s.lotacao}`}
            valor={servidor}
            aoMudar={setServidor}
            placeholder="Digite o nome"
          />
          <div className="demo-util-res">valor: {servidor ? JSON.stringify(servidor) : 'null'}</div>
        </div>
      </Bloco>

      <Bloco titulo="Senha">
        <div className="demo-grade-2">
          <CampoSenha rotulo="Senha atual" valor={senha} aoMudar={setSenha} dica="Login: sem medidor nem política" />
          <CampoSenha
            rotulo="Nova senha"
            forca
            politica={{ minimo: 10, exigirMaiuscula: true, exigirDigito: true, exigirSimbolo: true }}
            autoComplete="new-password"
            valor={novaSenha}
            aoMudar={setNovaSenha}
          />
          <CampoSenha
            rotulo="Confirmar nova senha"
            autoComplete="new-password"
            valor={confirmar}
            aoMudar={setConfirmar}
            validar={(v) => (v === novaSenha ? '' : 'As senhas não conferem')}
          />
        </div>
      </Bloco>

      <Bloco titulo="Picklist" descricao="Clique (Ctrl para vários), duplo clique, Enter, arrastar e soltar; Alt + setas reordena.">
        <Picklist rotulo="Permissões do perfil" rotuloFonte="Disponíveis" rotuloAlvo="Concedidas" filtro valor={permissoes} aoMudar={setPermissoes} />
      </Bloco>

      <Bloco titulo="Anexos" descricao="Clique num anexo para abrir o visualizador (← → folheia). O File real sai por ref.arquivoDe(anexo).">
        <CampoAnexo ref={anexoRef} rotulo="Documentos" valor={anexos} aoMudar={setAnexos} maxTamanho={5 * 1024 * 1024} accept="image/*,.pdf,.doc,.docx" />
        <div className="demo-linha">
          <Botao
            rotulo="Enviar anexos"
            icone="upload"
            severidade="secundario"
            onClick={() => {
              const daSessao = anexos.filter((a) => anexoRef.current?.arquivoDe(a));
              toast.info('Upload simulado', `${daSessao.length} arquivo(s) novo(s) desta sessão; ${anexos.length - daSessao.length} já salvo(s).`);
            }}
          />
        </div>
      </Bloco>

      <Bloco titulo="Visualizador de arquivo" descricao="Na imagem: + e − ampliam, 0 ajusta, R gira, duplo clique alterna 200%, arraste quando ampliada.">
        <Escolha
          rotulo="Arquivo"
          valor={arquivo}
          aoMudar={setArquivo}
          opcoes={[
            { valor: 'imagem', rotulo: 'Imagem' },
            { valor: 'outro', rotulo: 'Planilha (não renderiza)' },
            { valor: 'semUrl', rotulo: 'Sem URL' },
          ]}
        />
        <div style={{ height: '22rem', display: 'flex', border: 'var(--hairline) solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
          <VisualizadorArquivo arquivo={ARQUIVOS[arquivo]} aoFalhar={(a) => toast.err('Falha ao carregar', a.nome)} />
        </div>
      </Bloco>

      <Bloco titulo="Pendências reveladas ao salvar" descricao="Sem mexer nos campos, clique em Salvar: todo campo obrigatório ou fora do formato acusa a pendência.">
        <FormDemo />
      </Bloco>
    </div>
  );
}

const FORM_VAZIO = { email: '', cpf: '', responsavel: null as Servidor | null, anexos: [] as Anexo[] };

function FormDemo() {
  const toast = useToast();
  const [aberto, setAberto] = useState(false);
  const [obrig, setObrig] = useState(FORM_VAZIO);
  return (
    <>
      <div className="demo-linha">
        <Botao
          rotulo="Abrir formulário"
          icone="app-window"
          severidade="secundario"
          onClick={() => {
            setObrig(FORM_VAZIO);
            setAberto(true);
          }}
        />
      </div>
      <Form
        arranjo="modal"
        entidade="servidor"
        tamanho="medio"
        aberto={aberto}
        aoCancelar={() => setAberto(false)}
        aoSalvar={() => {
          const ok = obrig.email && isCpf(obrig.cpf) && obrig.responsavel && obrig.anexos.length;
          if (ok) {
            setAberto(false);
            toast.ok('Servidor salvo');
          }
        }}
      >
        <FormSecao legenda="Identificação" icone="id-card">
          <CampoCpf rotulo="CPF" obrigatorio valor={obrig.cpf} aoMudar={(cpf) => setObrig((o) => ({ ...o, cpf }))} />
          <CampoEmail className="lp-col-2" rotulo="E-mail" obrigatorio valor={obrig.email} aoMudar={(email) => setObrig((o) => ({ ...o, email }))} />
          <CampoBusca<Servidor>
            className="lp-col-full"
            rotulo="Chefia imediata"
            obrigatorio
            buscar={buscarServidores}
            paraRotulo={(s) => s.nome}
            valor={obrig.responsavel}
            aoMudar={(responsavel) => setObrig((o) => ({ ...o, responsavel }))}
          />
        </FormSecao>
        <FormSecao legenda="Documentos" icone="paperclip">
          <CampoAnexo className="lp-col-full" rotulo="Portaria de nomeação" minimo={1} multiple={false} valor={obrig.anexos} aoMudar={(anexos) => setObrig((o) => ({ ...o, anexos }))} />
        </FormSecao>
      </Form>
    </>
  );
}
