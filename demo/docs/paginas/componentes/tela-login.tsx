import { Botao } from '../../../../src';
import { Codigo } from '../../Codigo';
import { PaginaComponente } from '../../PaginaDoc';
import { useT } from '../../../i18n/useT';
import { rico } from '../../../i18n/rico';

const USO = `import { TelaLogin, isCpf, type ApresentacaoLogin } from '@celke/kole-react';

const APRESENTACAO: ApresentacaoLogin = {
  chamada: 'Plataforma comercial',
  titulo: 'Vendas, estoque e clientes num só lugar.',
  destaques: [
    { icone: 'shopping-cart', texto: 'Pedidos, produtos e clientes organizados' },
    { icone: 'shield', texto: 'Acesso seguro com verificação em duas etapas' },
  ],
};

export function Login({ entrar }: { entrar: () => void }) {
  return (
    <TelaLogin
      marca={{ nome: 'Gestor', subtitulo: 'Gestão comercial', logo: '/logo.svg' }}
      apresentacao={APRESENTACAO}
      identificador="cpf"
      // devolva nada (entrou), 'codigo' (pedir o código de 6 dígitos) ou { erro }
      aoEntrar={async ({ usuario, senha }) => {
        const r = await api.login(usuario, senha);
        if (r.status === 401) return { erro: 'CPF ou senha incorretos.' };
        if (r.precisaCodigo) return 'codigo';
        entrar();
      }}
      aoConfirmarCodigo={async (codigo, confiarDispositivo) => {
        const r = await api.confirmar(codigo, confiarDispositivo);
        if (!r.ok) return { erro: 'Código incorreto.' };
        entrar();
      }}
      linkSenha={<a href="/recuperar-senha">Esqueci minha senha</a>}
    />
  );
}`;

export default function Pagina() {
  const { t } = useT();
  return (
    <PaginaComponente
      pagina="telaLogin"
      icone="log-in"
      componente="TelaLogin"
      importar={['type ApresentacaoLogin', 'type CredenciaisLogin', 'type ResultadoLogin']}
      notas={
        <ul className="doc-lista">
          <li>{rico(t('docs.telaLogin.textos.todoOFluxoVem'))}</li>
          <li>{rico(t('docs.telaLogin.textos.identificadorEscolheOCampo'))}</li>
          <li>{rico(t('docs.telaLogin.textos.modeloFormularioTiraA'))}</li>
          <li>{t('docs.telaLogin.textos.ocupaAJanelaInteira')}</li>
        </ul>
      }
    >
      <p className="doc-p">{rico(t('docs.telaLogin.textos.aTelaOcupaA'))}</p>
      <div className="demo-linha">
        <Botao rotulo={t('docs.telaLogin.textos.abrirComApresentacao')} icone="log-in" onClick={() => (window.location.hash = '/login')} />
        <Botao rotulo={t('docs.telaLogin.textos.abrirSoOFormulario')} icone="lock" aparencia="contorno" onClick={() => (window.location.hash = '/login/simples')} />
      </div>
      <h3 className="doc-exemplo-titulo">{t('docs.telaLogin.textos.codigo')}</h3>
      <Codigo codigo={USO} />
    </PaginaComponente>
  );
}
