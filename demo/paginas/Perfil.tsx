import { useState } from 'react';
import {
  Avatar,
  Botao,
  CabecalhoPagina,
  CampoAnexo,
  CampoCpf,
  CampoEmail,
  CampoSenha,
  CampoTexto,
  Card,
  Detalhes,
  Escolha,
  Form,
  FormSecao,
  Foto,
  Icone,
  Status,
  formatarNumero,
  isCpf,
  isEmail,
  useToast,
  type Anexo,
  type ItemMenuForm,
} from '../../src';
import { retrato } from './Bloco';

export interface DadosPerfil {
  nome: string;
  email: string;
  cpf: string;
  apelido: string;
  cargo: string;
  foto?: string;
  fotoVisivel: boolean;
  verificado: boolean;
}

export const PERFIL_INICIAL: DadosPerfil = {
  nome: 'Gabrielly Ribeiro da Silva',
  email: 'gabrielly.ribeiro@exemplo.com.br',
  cpf: '529.982.247-25',
  apelido: 'Gabi',
  cargo: 'Gerente comercial',
  foto: retrato('#1f5fe0', 'GR'),
  fotoVisivel: true,
  verificado: true,
};

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const PEDIDOS_RECENTES = [
  { numero: 'PED-2026-0057', cliente: 'Mercado Bom Preço', total: 4870.4 },
  { numero: 'PED-2026-0054', cliente: 'Farmácia Vida Plena', total: 1239.9 },
  { numero: 'PED-2026-0049', cliente: 'Construtora Alicerce', total: 15320.0 },
];
const ATIVIDADES = [
  { icone: 'circle-check', texto: 'Confirmou o pagamento do PED-2026-0042', tempo: 'há 25 min' },
  { icone: 'user-plus', texto: 'Cadastrou o cliente Papelaria Ponto Final', tempo: 'há 2 h' },
  { icone: 'tag', texto: 'Aprovou desconto de 5% no PED-2026-0039', tempo: 'ontem' },
];

// cada item do menu é um formulário próprio, com rota e Salvar independentes
const FORMULARIOS = [
  { id: 'editar', rota: '/perfil/editar', rotulo: 'Editar perfil', icone: 'user-pen' },
  { id: 'senha', rota: '/perfil/senha', rotulo: 'Editar senha', icone: 'lock' },
  { id: 'foto', rota: '/perfil/foto', rotulo: 'Editar foto', icone: 'image' },
] as const;

type IdFormulario = (typeof FORMULARIOS)[number]['id'];

interface PaginaPerfilProps {
  rota: string;
  navegar: (r: string) => void;
  perfil: DadosPerfil;
  aoSalvar: (perfil: DadosPerfil) => void;
}

export function PaginaPerfil(props: PaginaPerfilProps) {
  const atual = FORMULARIOS.find((f) => f.rota === props.rota)?.id;
  // `key` reinicia o rascunho ao trocar de formulário
  return atual ? <EditarPerfil key={atual} atual={atual} {...props} /> : <VisualizarPerfil {...props} />;
}

/* ---------------- visualizar ---------------- */

function VisualizarPerfil({ navegar, perfil }: PaginaPerfilProps) {
  const atendidos = 1248;
  return (
    <div className="demo-pilha">
      <CabecalhoPagina
        titulo="Meu perfil"
        trilha
        icone="user"
        acoes={<Botao rotulo="Editar" icone="pencil" severidade="warn" onClick={() => navegar('/perfil/editar')} />}
      />

      <div className="demo-perfil">
        <div className="demo-perfil-esq">
          <Card>
            <div className="demo-perfil-id">
              <div className="demo-perfil-foto">
                {perfil.foto ? <Foto nome={perfil.nome} fotos={perfil.foto} tamanho="md" ampliavel /> : <Avatar nome={perfil.nome} tom="escuro" tamanho="7.5rem" />}
                <button type="button" className="demo-perfil-camera" aria-label="Editar foto" title="Editar foto" onClick={() => navegar('/perfil/foto')}>
                  <Icone icone="camera" />
                </button>
              </div>
              <div className="demo-perfil-nome">
                <h2>{perfil.nome}</h2>
                {perfil.verificado && <Status rotulo="Verificado" severidade="ok" icone="circle-check" />}
              </div>
              <span className="demo-perfil-cargo">{perfil.cargo}</span>
              <div className="demo-perfil-stat">
                <strong title={String(atendidos)}>{formatarNumero(atendidos)}</strong>
                <span>pedidos atendidos</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="demo-perfil-secao-titulo">
              <Icone icone="user" />
              Sobre mim
            </div>
            <div className="demo-pilha-p">
              <Detalhes rotulo="Apelido" valor={perfil.apelido || 'Não informado'} disposicao="linha" />
              <Detalhes rotulo="E-mail" valor={perfil.email} disposicao="linha" />
              <Detalhes rotulo="CPF" valor={perfil.cpf || 'Não informado'} disposicao="linha" />
              <Detalhes rotulo="Foto para a equipe" valor={perfil.fotoVisivel ? 'Visível' : 'Oculta'} disposicao="linha" />
            </div>
          </Card>
        </div>

        <div className="demo-perfil-dir">
          <Card>
            <div className="demo-perfil-secao-titulo">
              <span style={{ color: 'var(--pri)', display: 'inline-flex' }}>
                <Icone icone="shopping-cart" />
              </span>
              Meus últimos pedidos
            </div>
            <ul className="demo-perfil-lista">
              {PEDIDOS_RECENTES.map((p) => (
                <li key={p.numero}>
                  <Icone icone="file" />
                  <span style={{ flex: 1 }}>
                    <a href="#/pedidos" className="demo-perfil-lista-tit">
                      {p.numero} — {p.cliente}
                    </a>
                  </span>
                  <span className="demo-perfil-lista-sub">{BRL.format(p.total)}</span>
                </li>
              ))}
            </ul>
            <div className="demo-perfil-mais">
              <Botao rotulo="Ver meus 128 pedidos" icone="list" severidade="secundario" onClick={() => navegar('/pedidos')} />
            </div>
          </Card>

          <Card>
            <div className="demo-perfil-secao-titulo">
              <span style={{ color: 'var(--destaque-ink)', display: 'inline-flex' }}>
                <Icone icone="history" />
              </span>
              Atividades recentes
            </div>
            <ul className="demo-perfil-lista">
              {ATIVIDADES.map((a) => (
                <li key={a.texto}>
                  <Icone icone={a.icone} />
                  <span>
                    <span className="demo-perfil-lista-tit">{a.texto}</span>
                    <span className="demo-perfil-lista-sub">{a.tempo}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------------- editar (3 formulários com menu lateral) ---------------- */

function EditarPerfil({ atual, navegar, perfil, aoSalvar }: PaginaPerfilProps & { atual: IdFormulario }) {
  const toast = useToast();
  const [salvando, setSalvando] = useState(false);
  const [dados, setDados] = useState({ nome: perfil.nome, email: perfil.email, cpf: perfil.cpf, apelido: perfil.apelido });
  const [senha, setSenha] = useState({ atual: '', nova: '', confirmar: '' });
  const [novaFoto, setNovaFoto] = useState<Anexo[]>([]);
  const [fotoVisivel, setFotoNoRanking] = useState(perfil.fotoVisivel ? 'sim' : 'nao');

  const menu: ItemMenuForm[] = FORMULARIOS.map((f) => ({ id: f.id, rotulo: f.rotulo, icone: f.icone, href: `#${f.rota}` }));

  // pendências do formulário aberto (os campos mostram as mensagens sozinhos)
  const pendencias = {
    editar: [!dados.nome.trim(), !isEmail(dados.email), !isCpf(dados.cpf), !dados.apelido.trim()].filter(Boolean).length,
    senha: [!senha.atual, senha.nova.length < 8, !senha.confirmar || senha.nova !== senha.confirmar].filter(Boolean).length,
    foto: 0,
  }[atual];

  const salvar = () => {
    if (pendencias) {
      toast.warn('Há campos a corrigir', `${pendencias} campo(s) a revisar.`);
      return;
    }
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      if (atual === 'editar') {
        aoSalvar({ ...perfil, ...dados });
        toast.ok('Perfil atualizado');
      } else if (atual === 'senha') {
        setSenha({ atual: '', nova: '', confirmar: '' });
        toast.ok('Senha alterada', 'Use a nova senha no próximo acesso.');
      } else {
        aoSalvar({ ...perfil, foto: novaFoto[0]?.url ?? perfil.foto, fotoVisivel: fotoVisivel === 'sim' });
        setNovaFoto([]);
        toast.ok('Foto atualizada');
      }
    }, 900);
  };

  return (
    <Form
      titulo="Meu perfil"
      icone="user"
      trilha={[{ rotulo: FORMULARIOS.find((f) => f.id === atual)!.rotulo }]}
      menu={menu}
      menuTitulo="Configurações"
      menuAtivo={atual}
      aoSalvar={salvar}
      aoCancelar={() => navegar('/perfil')}
      salvando={salvando}
      acoes={<Botao rotulo="Ver perfil" icone="eye" severidade="secundario" aparencia="texto" onClick={() => navegar('/perfil')} />}
    >
      {atual === 'editar' && (
        <FormSecao legenda="Editar perfil" icone="user-pen">
          <CampoTexto
            className="lp-col-2"
            rotulo="Nome"
            obrigatorio
            placeholder="Nome completo do usuário"
            valor={dados.nome}
            aoMudar={(nome) => setDados((d) => ({ ...d, nome }))}
          />
          <CampoEmail
            className="lp-col-2"
            rotulo="E-mail"
            obrigatorio
            placeholder="Melhor e-mail do usuário"
            valor={dados.email}
            aoMudar={(email) => setDados((d) => ({ ...d, email }))}
          />
          <CampoCpf className="lp-col-2" rotulo="CPF" obrigatorio valor={dados.cpf} aoMudar={(cpf) => setDados((d) => ({ ...d, cpf }))} />
          <CampoTexto
            className="lp-col-2"
            rotulo="Apelido"
            obrigatorio
            placeholder="Como prefere ser chamado(a)"
            dica="Aparece para a equipe e nas saudações."
            valor={dados.apelido}
            aoMudar={(apelido) => setDados((d) => ({ ...d, apelido }))}
          />
        </FormSecao>
      )}

      {atual === 'senha' && (
        <FormSecao legenda="Alterar senha" icone="lock">
          <CampoSenha
            className="lp-col-2"
            rotulo="Senha atual"
            obrigatorio
            placeholder="Digite sua senha atual"
            valor={senha.atual}
            aoMudar={(v) => setSenha((s) => ({ ...s, atual: v }))}
          />
          <div className="lp-col-2" />
          <CampoSenha
            className="lp-col-2"
            rotulo="Nova senha"
            obrigatorio
            forca
            autoComplete="new-password"
            placeholder="Mínimo de 8 caracteres"
            valor={senha.nova}
            aoMudar={(v) => setSenha((s) => ({ ...s, nova: v }))}
          />
          <CampoSenha
            className="lp-col-2"
            rotulo="Confirmar nova senha"
            obrigatorio
            autoComplete="new-password"
            placeholder="Repita a nova senha"
            valor={senha.confirmar}
            aoMudar={(v) => setSenha((s) => ({ ...s, confirmar: v }))}
            validar={(v) => (v === senha.nova ? '' : 'As senhas não conferem')}
          />
        </FormSecao>
      )}

      {atual === 'foto' && (
        <>
          <FormSecao legenda="Foto do perfil" icone="image">
            <div className="demo-perfil-foto-atual">
              <Foto nome={perfil.nome} fotos={novaFoto[0]?.url ?? perfil.foto} tamanho="md" />
              <span>{novaFoto.length ? 'Pré-visualização' : 'Foto atual'}</span>
            </div>
            <CampoAnexo
              className="lp-col-3"
              rotulo="Escolher nova foto"
              dica="JPG, PNG ou WEBP, até 2 MB. Prefira uma foto de rosto, com fundo claro."
              accept="image/*"
              multiple={false}
              maxTamanho={2 * 1024 * 1024}
              valor={novaFoto}
              aoMudar={setNovaFoto}
            />
          </FormSecao>
          <FormSecao legenda="Visibilidade da foto" icone="eye">
            <Escolha
              className="lp-col-full"
              aparencia="radio"
              rotulo="Mostrar minha foto para a equipe (pedidos, atividades e comentários)"
              valor={fotoVisivel}
              aoMudar={setFotoNoRanking}
              opcoes={[
                { valor: 'sim', rotulo: 'Exibir para a equipe' },
                { valor: 'nao', rotulo: 'Não exibir' },
              ]}
            />
          </FormSecao>
        </>
      )}
    </Form>
  );
}
