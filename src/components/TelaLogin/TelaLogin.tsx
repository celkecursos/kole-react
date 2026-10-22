import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icone, type IconeProp } from '../../utils/Icone';
import { Alerta } from '../Alerta/Alerta';
import { Botao } from '../Botao/Botao';
import { CampoMarcacao } from '../CampoMarcacao/CampoMarcacao';
import { CampoSenha } from '../CampoSenha/CampoSenha';
import { CampoCpf, CampoEmail, CampoTexto } from '../CampoTexto/CampoTexto';
import { Dialogo } from '../Dialogo/Dialogo';
import { Dica } from '../Dica/Dica';
import type { Marca } from '../Estrutura/Estrutura';
import { usePreferenciasOpcional } from '../Preferencias/Preferencias';
import { Status } from '../Status/Status';
import './TelaLogin.css';

export interface CredenciaisLogin {
  usuario: string;
  senha: string;
}

/**
 * Resposta do `aoEntrar`: nada = entrou · `'codigo'` = pedir o código de
 * verificação em duas etapas · `{ erro }` = mensagem para o usuário.
 */
export type ResultadoLogin = void | 'codigo' | { erro: string };

/** Painel institucional do modelo `conteudo`. */
export interface ApresentacaoLogin {
  /** Chamada em caixa alta acima do título (ex.: "Plataforma comercial"). */
  chamada?: string;
  titulo: string;
  descricao?: ReactNode;
  /** Até 3–4 pontos fortes do sistema, cada um com ícone. */
  destaques?: { icone: IconeProp; texto: string }[];
  /** Conteúdo livre abaixo dos destaques (ilustração, gráfico, depoimento). */
  extra?: ReactNode;
}

export interface TelaLoginProps {
  marca: Marca;
  /**
   * `conteudo` (padrão) = apresentação do sistema à esquerda + cartão do
   * formulário · `formulario` = só o cartão, centralizado.
   */
  modelo?: 'conteudo' | 'formulario';
  /** Conteúdo da lateral esquerda no modelo `conteudo` (some em telas estreitas). */
  apresentacao?: ApresentacaoLogin;
  /** Selo de ambiente sob o subtítulo (Homologação, Treinamento…). Produção: omita. */
  ambiente?: { rotulo: string; severidade?: 'warn' | 'err' | 'info' | 'neutral' };
  /** Como o usuário se identifica (padrão: CPF). */
  identificador?: 'cpf' | 'email' | 'usuario';
  titulo?: string;
  descricao?: string;
  aoEntrar: (credenciais: CredenciaisLogin) => Promise<ResultadoLogin> | ResultadoLogin;
  /** Confirma o código de 6 dígitos; devolva `{ erro }` para manter o diálogo aberto. */
  aoConfirmarCodigo?: (codigo: string, confiarDispositivo: boolean) => Promise<void | { erro: string }> | void | { erro: string };
  /** Mostra "Confiar neste dispositivo" no diálogo do código (padrão: sim). */
  confiarDispositivo?: boolean;
  /** Onde o usuário encontra o código (ex.: "Abra o aplicativo autenticador no celular…"). */
  instrucaoCodigo?: string;
  /** Link sob a senha, alinhado à direita (ex.: "Esqueci minha senha"). */
  linkSenha?: ReactNode;
  /** Links ou botões abaixo do Entrar. */
  acoes?: ReactNode;
  rodape?: ReactNode;
  className?: string;
}

const TAMANHO_CODIGO = 6;

/** Tela de login institucional: imagem + painel com identificação, senha e 2FA. */
export function TelaLogin({
  marca,
  modelo = 'conteudo',
  apresentacao,
  ambiente,
  identificador = 'cpf',
  titulo = 'Acesse sua conta',
  descricao = 'Entre com suas credenciais institucionais.',
  aoEntrar,
  aoConfirmarCodigo,
  confiarDispositivo = true,
  instrucaoCodigo = 'Digite o código de 6 dígitos gerado no aplicativo de autenticação.',
  linkSenha,
  acoes,
  rodape,
  className,
}: TelaLoginProps) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState('');
  const [tentou, setTentou] = useState(false);
  const [pedindoCodigo, setPedindoCodigo] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [confiar, setConfiar] = useState(false);
  const [erroCodigo, setErroCodigo] = useState('');
  const [confirmando, setConfirmando] = useState(false);
  const prefs = usePreferenciasOpcional();
  const tituloId = useId();
  const comConteudo = modelo === 'conteudo' && !!apresentacao;

  const entrar = async (e: FormEvent) => {
    e.preventDefault();
    setTentou(true);
    if (!usuario.trim() || !senha) return;
    setErro('');
    setEntrando(true);
    try {
      const r = await aoEntrar({ usuario, senha });
      if (r === 'codigo') {
        setCodigo('');
        setConfiar(false);
        setErroCodigo('');
        setPedindoCodigo(true);
      } else if (r && typeof r === 'object') setErro(r.erro);
    } catch {
      setErro('Não foi possível entrar agora. Tente de novo em instantes.');
    } finally {
      setEntrando(false);
    }
  };

  const confirmar = async (e?: FormEvent) => {
    e?.preventDefault();
    if (codigo.length !== TAMANHO_CODIGO) {
      setErroCodigo(`Informe os ${TAMANHO_CODIGO} dígitos`);
      return;
    }
    setConfirmando(true);
    try {
      const r = await aoConfirmarCodigo?.(codigo, confiar);
      if (r && typeof r === 'object') setErroCodigo(r.erro);
      else setPedindoCodigo(false);
    } catch {
      setErroCodigo('Não foi possível validar o código. Tente de novo.');
    } finally {
      setConfirmando(false);
    }
  };

  const obrig = (v: string) => (tentou && !v.trim() ? 'Campo obrigatório' : undefined);
  const propsUsuario = { valor: usuario, aoMudar: setUsuario, obrigatorio: true, erro: obrig(usuario), autoFocus: true };

  return (
    <div className={cx('lp-login', comConteudo ? 'lp-login--conteudo' : 'lp-login--formulario', className)}>
      {/* fundo decorativo: duas manchas desfocadas + grade que some nas bordas */}
      <div className="lp-login-fundo" aria-hidden="true">
        <span className="lp-login-mancha lp-login-mancha--1" />
        <span className="lp-login-mancha lp-login-mancha--2" />
        <span className="lp-login-grade" />
      </div>

      <header className="lp-login-cab">
        <div className="lp-login-marca">
          {marca.logo ? (
            <img src={marca.logo} alt="" className="lp-login-logo" />
          ) : (
            <span className="lp-login-escudo" aria-hidden="true">
              <Icone icone="shield" />
            </span>
          )}
          <div>
            <div className="lp-login-nome">{marca.nome}</div>
            {marca.subtitulo && <div className="lp-login-sub">{marca.subtitulo}</div>}
          </div>
          {ambiente?.rotulo && ambiente.rotulo !== '#' && <Status rotulo={ambiente.rotulo} severidade={ambiente.severidade ?? 'err'} />}
        </div>
        {prefs && (
          <Dica texto={prefs.escuro ? 'Tema claro' : 'Tema escuro'}>
            <button type="button" className="lp-login-tema" aria-label={prefs.escuro ? 'Tema claro' : 'Tema escuro'} onClick={prefs.alternarTema}>
              <Icone icone={prefs.escuro ? 'sun' : 'moon'} />
            </button>
          </Dica>
        )}
      </header>

      <main className="lp-login-main">
        {comConteudo && apresentacao && (
          <section className="lp-login-apres" aria-label="Sobre o sistema">
            {apresentacao.chamada && <p className="lp-login-chamada">{apresentacao.chamada}</p>}
            <h2 className="lp-login-apres-titulo">{apresentacao.titulo}</h2>
            {apresentacao.descricao && <p className="lp-login-apres-desc">{apresentacao.descricao}</p>}
            {!!apresentacao.destaques?.length && (
              <ul className="lp-login-destaques">
                {apresentacao.destaques.map((d) => (
                  <li key={d.texto}>
                    <span className="lp-login-destaque-ic" aria-hidden="true">
                      <Icone icone={d.icone} />
                    </span>
                    {d.texto}
                  </li>
                ))}
              </ul>
            )}
            {apresentacao.extra && <div className="lp-login-extra">{apresentacao.extra}</div>}
          </section>
        )}

        <section className="lp-login-cartao density-cozy" aria-labelledby={tituloId}>
          <div className="lp-login-cartao-cab">
            <span className="lp-login-filete" aria-hidden="true" />
            <h1 className="lp-login-titulo" id={tituloId}>
              {titulo}
            </h1>
            {descricao && <p className="lp-login-desc">{descricao}</p>}
          </div>

          {erro && <Alerta severidade="err" mensagem={erro} />}

          <form className="lp-login-form" onSubmit={entrar} noValidate>
            {identificador === 'cpf' ? (
              <CampoCpf rotulo="CPF" autoComplete="username" {...propsUsuario} />
            ) : identificador === 'email' ? (
              <CampoEmail rotulo="E-mail" autoComplete="username" placeholder="voce@empresa.com.br" {...propsUsuario} />
            ) : (
              <CampoTexto rotulo="Usuário" autoComplete="username" icone="user" {...propsUsuario} />
            )}
            <div className="lp-login-senha">
              <CampoSenha rotulo="Senha" placeholder="••••••••" valor={senha} aoMudar={setSenha} obrigatorio erro={obrig(senha)} />
              {linkSenha && <div className="lp-login-link-senha">{linkSenha}</div>}
            </div>
            <Botao type="submit" rotulo={entrando ? 'Entrando…' : 'Entrar'} icone="log-in" bloco carregando={entrando} />
          </form>

          {acoes && <div className="lp-login-acoes">{acoes}</div>}
          {rodape && <div className="lp-login-rodape">{rodape}</div>}
        </section>
      </main>

      <Dialogo
        aberto={pedindoCodigo}
        aoFechar={() => setPedindoCodigo(false)}
        titulo="Verificação em duas etapas"
        subtitulo="Precisamos confirmar que é você"
        icone="lock"
        tamanho="pequeno"
        dispensavel={!confirmando}
        rodape={
          <>
            <Botao rotulo="Cancelar" severidade="secundario" disabled={confirmando} onClick={() => setPedindoCodigo(false)} />
            <Botao rotulo="Confirmar" icone="check" carregando={confirmando} onClick={() => confirmar()} />
          </>
        }
      >
        <form className="lp-login-otp" onSubmit={confirmar} noValidate>
          <p className="lp-login-desc">{instrucaoCodigo}</p>
          <CampoTexto
            rotulo="Código"
            className="lp-login-otp-campo"
            mascara="000000"
            inputMode="numeric"
            autoComplete="one-time-code"
            data-foco-inicial
            valor={codigo}
            aoMudar={(v) => {
              setCodigo(v);
              setErroCodigo('');
            }}
            erro={erroCodigo || undefined}
          />
          {confiarDispositivo && (
            <CampoMarcacao
              rotulo="Confiar neste dispositivo"
              dica="O código não será pedido de novo neste computador."
              valor={confiar}
              aoMudar={setConfiar}
            />
          )}
        </form>
      </Dialogo>
    </div>
  );
}
