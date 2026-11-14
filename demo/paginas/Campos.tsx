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
import { useT, type TradutorDemo } from '../i18n/useT';

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

const PERMISSOES = (t: TradutorDemo['t']) => ([t('paginas.campos.textos.cadastrarPedido'), t('paginas.campos.textos.editarPedido'), t('paginas.campos.textos.excluirPedido'), t('paginas.campos.textos.aprovarDesconto'), t('paginas.campos.textos.emitirNotaFiscal'), t('paginas.campos.textos.gerenciarCategorias'), t('paginas.campos.textos.verRelatorios'), t('paginas.campos.textos.exportarDados')]);

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
  const { t, tc } = useT();
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
  const [permissoes, setPermissoes] = useState<PicklistValor<string>>({ fonte: PERMISSOES(t).slice(2), alvo: PERMISSOES(t).slice(0, 2) });
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
      <CabecalhoPagina titulo={t('paginas.campos.titulo')} icone="pencil" trilha />

      <Bloco titulo={t('paginas.campos.secoes.camposBasicos')} descricao={t('paginas.campos.textos.textoIconeErroAviso')}>
        <div className="demo-grade">
          <CampoTexto rotulo={t('paginas.campos.textos.texto')} placeholder={t('paginas.campos.textos.digite')} valor={texto} aoMudar={setTexto} dica={t('paginas.campos.textos.textoDeAjuda')} />
          <CampoTexto rotulo={t('paginas.campos.textos.comIcone')} icone="search" placeholder={t('paginas.campos.textos.pesquisar')} />
          <CampoTexto rotulo={t('paginas.campos.textos.obrigatorioComErro')} obrigatorio erro={t('paginas.campos.textos.campoObrigatorio')} />
          <CampoTexto rotulo={t('paginas.campos.textos.comAviso')} aviso={t('paginas.campos.textos.confiraSeOValor')} defaultValue="123" />
          <CampoTexto rotulo={t('paginas.campos.textos.desabilitado')} disabled defaultValue={t('paginas.campos.textos.naoEditavel')} />
          <CampoTexto rotulo={t('paginas.campos.textos.somenteLeitura')} readOnly defaultValue={t('paginas.campos.textos.somenteLeitura')} />
          <CampoSelect rotulo={t('paginas.campos.textos.select')} opcoes={OPCOES_PAGAMENTO.map((o) => ({ ...o, rotulo: tc(o.rotulo) }))} placeholder={t('paginas.campos.textos.formaDePagamento')} />
        </div>
        <div className="demo-linha">
          <CampoTexto variante="inline" rotulo={t('paginas.campos.textos.inline')} placeholder={t('paginas.campos.textos.valor')} />
          <CampoSelect variante="inline" rotulo={t('paginas.campos.textos.pagamento')} opcoes={OPCOES_PAGAMENTO.map((o) => ({ ...o, rotulo: tc(o.rotulo) }))} placeholder={t('paginas.campos.textos.todos')} />
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.campos.secoes.escolhasEMarcacao')}>
        <div className="demo-linha">
          <Escolha
            rotulo={t('paginas.campos.textos.segmentado')}
            opcoes={[
              { valor: 'dia', rotulo: t('paginas.campos.textos.dia') },
              { valor: 'semana', rotulo: t('paginas.campos.textos.semana') },
              { valor: 'mes', rotulo: t('paginas.campos.textos.mes') },
            ]}
            valor={esc}
            aoMudar={setEsc}
          />
          <Escolha
            rotulo={t('paginas.campos.textos.radio')}
            aparencia="radio"
            opcoes={[
              { valor: 'a', rotulo: t('paginas.campos.textos.opcaoA') },
              { valor: 'b', rotulo: t('paginas.campos.textos.opcaoB') },
            ]}
            valor={radio}
            aoMudar={setRadio}
          />
          <CampoMarcacao rotulo={t('paginas.campos.textos.caixaDeMarcacao')} valor={marc} aoMudar={setMarc} />
          <CampoMarcacao rotulo={t('paginas.campos.textos.chave')} aparencia="chave" valor={chave} aoMudar={setChave} />
        </div>
      </Bloco>

      <Bloco
        titulo={t('paginas.campos.secoes.camposTipadosBr')}
        descricao={t('paginas.campos.textos.mascaraPlaceholderEValidacao')}
      >
        <div className="demo-grade">
          <CampoCpf rotulo={t('paginas.campos.textos.cpf')} valor={doc.cpf} aoMudar={mudar('cpf')} />
          <CampoCnpj rotulo={t('paginas.campos.textos.cnpj')} valor={doc.cnpj} aoMudar={mudar('cnpj')} dica={t('paginas.campos.textos.teste11222333')} />
          <CampoCpfCnpj rotulo={t('paginas.campos.textos.cpfOuCnpj')} valor={doc.cpfCnpj} aoMudar={mudar('cpfCnpj')} dica={t('paginas.campos.textos.aMascaraMudaPelo')} />
          <CampoEmail rotulo={t('paginas.campos.textos.eMail')} valor={doc.email} aoMudar={mudar('email')} />
          <CampoTelefone rotulo={t('paginas.campos.textos.telefone')} valor={doc.telefone} aoMudar={mudar('telefone')} dica={t('paginas.campos.textos.fixoOuCelular')} />
          <CampoTelefone rotulo={t('paginas.campos.textos.celular')} tipo="celular" valor={doc.celular} aoMudar={mudar('celular')} />
          <CampoPlaca rotulo={t('paginas.campos.textos.placa')} valor={doc.placa} aoMudar={mudar('placa')} dica={t('paginas.campos.textos.antigaOuMercosul')} />
          <CampoRenavam rotulo={t('paginas.campos.textos.renavam')} valor={doc.renavam} aoMudar={mudar('renavam')} />
          <CampoChassi rotulo={t('paginas.campos.textos.chassi')} valor={doc.chassi} aoMudar={mudar('chassi')} dica={t('paginas.campos.textos.teste9bwzzz377vt004251')} />
          <CampoCnh rotulo={t('paginas.campos.textos.cnh')} valor={doc.cnh} aoMudar={mudar('cnh')} dica={t('paginas.campos.textos.teste02650306461')} />
          <CampoImei rotulo={t('paginas.campos.textos.imei')} valor={doc.imei} aoMudar={mudar('imei')} dica={t('paginas.campos.textos.teste490154203237518')} />
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.campos.secoes.dominioUfCidadeE')} descricao={t('paginas.campos.textos.trocarAUfLimpa')}>
        <div className="demo-grade">
          <CampoUf rotulo={t('paginas.campos.textos.uf')} valor={uf} aoMudar={setUf} />
          <CampoCidade rotulo={t('paginas.campos.textos.cidade')} uf={uf ?? ''} buscarPorUf={buscarMunicipios} valor={cidade} aoMudar={setCidade} dica={t('paginas.campos.textos.comSugestoesPrSp')} />
          <CampoCidade rotulo={t('paginas.campos.textos.cidadeTextoLivre')} uf={uf ?? ''} valor={cidadeLivre} aoMudar={setCidadeLivre} dica={t('paginas.campos.textos.semBuscarporufAceitaTexto')} />
          <CampoTipoPessoa rotulo={t('paginas.campos.textos.tipoDePessoa')} valor={tipoPessoa} aoMudar={setTipoPessoa} />
          <CampoUfMultiplo className="lp-col-2" rotulo={t('paginas.campos.textos.ufsDeAtuacao')} exibicao="sigla" valor={ufs} aoMudar={setUfs} botaoLimpar />
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.campos.secoes.buscaRemota')} descricao={t('paginas.campos.textos.esperaADigitacaoParar')}>
        <div className="demo-grade-2">
          <CampoBusca<Servidor>
            rotulo={t('paginas.campos.textos.servidorResponsavel')}
            buscar={buscarServidores}
            paraRotulo={(s) => s.nome}
            paraDetalhe={(s) => `Matrícula ${s.matricula} · ${s.lotacao}`}
            valor={servidor}
            aoMudar={setServidor}
            placeholder={t('paginas.campos.textos.digiteONome')}
          />
          <div className="demo-util-res">{t('paginas.campos.textos.valor2')}{servidor ? JSON.stringify(servidor) : 'null'}</div>
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.campos.secoes.senha')}>
        <div className="demo-grade-2">
          <CampoSenha rotulo={t('paginas.campos.textos.senhaAtual')} valor={senha} aoMudar={setSenha} dica={t('paginas.campos.textos.loginSemMedidorNem')} />
          <CampoSenha
            rotulo={t('paginas.campos.textos.novaSenha')}
            forca
            politica={{ minimo: 10, exigirMaiuscula: true, exigirDigito: true, exigirSimbolo: true }}
            autoComplete="new-password"
            valor={novaSenha}
            aoMudar={setNovaSenha}
          />
          <CampoSenha
            rotulo={t('paginas.campos.textos.confirmarNovaSenha')}
            autoComplete="new-password"
            valor={confirmar}
            aoMudar={setConfirmar}
            validar={(v) => (v === novaSenha ? '' : tc('As senhas não conferem'))}
          />
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.campos.secoes.picklist')} descricao={t('paginas.campos.textos.cliqueCtrlParaVarios')}>
        <Picklist rotulo={t('paginas.campos.textos.permissoesDoPerfil')} rotuloFonte={t('paginas.campos.textos.disponiveis')} rotuloAlvo={tc("Concedidas")} filtro valor={permissoes} aoMudar={setPermissoes} />
      </Bloco>

      <Bloco titulo={t('paginas.campos.secoes.anexos')} descricao={t('paginas.campos.textos.cliqueNumAnexoPara')}>
        <CampoAnexo ref={anexoRef} rotulo={t('paginas.campos.textos.documentos')} valor={anexos} aoMudar={setAnexos} maxTamanho={5 * 1024 * 1024} accept="image/*,.pdf,.doc,.docx" />
        <div className="demo-linha">
          <Botao
            rotulo={t('paginas.campos.textos.enviarAnexos')}
            icone="upload"
            severidade="secundario"
            onClick={() => {
              const daSessao = anexos.filter((a) => anexoRef.current?.arquivoDe(a));
              toast.info(t('paginas.campos.textos.uploadSimulado'), t('paginas.campos.textos.nArquivoSNovo', { n: daSessao.length, v: anexos.length - daSessao.length }));
            }}
          />
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.campos.secoes.visualizadorDeArquivo')} descricao={t('paginas.campos.textos.naImagemEAmpliam')}>
        <Escolha
          rotulo={t('paginas.campos.textos.arquivo')}
          valor={arquivo}
          aoMudar={setArquivo}
          opcoes={[
            { valor: 'imagem', rotulo: t('paginas.campos.textos.imagem') },
            { valor: 'outro', rotulo: t('paginas.campos.textos.planilhaNaoRenderiza') },
            { valor: 'semUrl', rotulo: t('paginas.campos.textos.semUrl') },
          ]}
        />
        <div style={{ height: '22rem', display: 'flex', border: 'var(--hairline) solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
          <VisualizadorArquivo arquivo={ARQUIVOS[arquivo]} aoFalhar={(a) => toast.err(t('paginas.campos.textos.falhaAoCarregar'), tc(a.nome))} />
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.campos.secoes.pendenciasReveladasAoSalvar')} descricao={t('paginas.campos.textos.semMexerNosCampos')}>
        <FormDemo />
      </Bloco>
    </div>
  );
}

const FORM_VAZIO = { email: '', cpf: '', responsavel: null as Servidor | null, anexos: [] as Anexo[] };

function FormDemo() {
  const { t } = useT();
  const toast = useToast();
  const [aberto, setAberto] = useState(false);
  const [obrig, setObrig] = useState(FORM_VAZIO);
  return (
    <>
      <div className="demo-linha">
        <Botao
          rotulo={t('paginas.campos.textos.abrirFormulario')}
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
            toast.ok(t('paginas.campos.textos.servidorSalvo'));
          }
        }}
      >
        <FormSecao legenda={t('paginas.campos.secoes.identificacao')} icone="id-card">
          <CampoCpf rotulo={t('paginas.campos.textos.cpf')} obrigatorio valor={obrig.cpf} aoMudar={(cpf) => setObrig((o) => ({ ...o, cpf }))} />
          <CampoEmail className="lp-col-2" rotulo={t('paginas.campos.textos.eMail')} obrigatorio valor={obrig.email} aoMudar={(email) => setObrig((o) => ({ ...o, email }))} />
          <CampoBusca<Servidor>
            className="lp-col-full"
            rotulo={t('paginas.campos.textos.chefiaImediata')}
            obrigatorio
            buscar={buscarServidores}
            paraRotulo={(s) => s.nome}
            valor={obrig.responsavel}
            aoMudar={(responsavel) => setObrig((o) => ({ ...o, responsavel }))}
          />
        </FormSecao>
        <FormSecao legenda={t('paginas.campos.secoes.documentos')} icone="paperclip">
          <CampoAnexo className="lp-col-full" rotulo={t('paginas.campos.textos.portariaDeNomeacao')} minimo={1} multiple={false} valor={obrig.anexos} aoMudar={(anexos) => setObrig((o) => ({ ...o, anexos }))} />
        </FormSecao>
      </Form>
    </>
  );
}
