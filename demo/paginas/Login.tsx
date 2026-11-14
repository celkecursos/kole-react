import { TelaLogin, isCpf, useToast, type ApresentacaoLogin } from '../../src';
import { useT } from '../i18n/useT';

/** Ilustração do painel: evolução do faturamento (decorativa). */
function GraficoFaturamento() {
  const { t } = useT();
  return (
    <div className="demo-login-grafico" aria-hidden="true">
      <div className="demo-login-grafico-cab">
        <span>{t('paginas.login.textos.faturamentoUltimos7Meses')}</span>
        <span className="demo-login-grafico-var">+12,4%</span>
      </div>
      <svg viewBox="0 0 300 90">
        <defs>
          <linearGradient id="demo-login-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--pri)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--pri)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 72 L50 64 L100 67 L150 50 L200 46 L250 30 L300 18 L300 90 L0 90 Z" fill="url(#demo-login-area)" />
        <path d="M0 72 L50 64 L100 67 L150 50 L200 46 L250 30 L300 18" fill="none" stroke="var(--pri)" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="300" cy="18" r="4" fill="var(--acento-claro)" />
      </svg>
    </div>
  );
}

const APRESENTACAO: ApresentacaoLogin = {
  chamada: 'Plataforma comercial',
  titulo: 'Vendas, estoque e clientes num só lugar.',
  descricao: 'Cadastre pedidos, acompanhe pagamentos e entregas e veja o faturamento do mês com os números reais da operação.',
  destaques: [
    { icone: 'shopping-cart', texto: 'Pedidos, produtos e clientes organizados' },
    { icone: 'chart-line', texto: 'Faturamento e ticket médio atualizados' },
    { icone: 'shield', texto: 'Acesso seguro com verificação em duas etapas' },
  ],
  extra: <GraficoFaturamento />,
};

/** Tela de login de exemplo. Senha "123456" pede o código; código "123456" entra. */
export function PaginaLogin({ navegar, modelo }: { navegar: (r: string) => void; modelo: 'conteudo' | 'formulario' }) {
  const { t } = useT();
  const toast = useToast();
  return (
    <TelaLogin
      modelo={modelo}
      apresentacao={APRESENTACAO}
      marca={{ nome: 'Gestor', subtitulo: t('paginas.login.textos.gestaoComercial') }}
      ambiente={{ rotulo: t('paginas.login.textos.homologacao'), severidade: 'warn' }}
      descricao={t('paginas.login.textos.useQualquerCpfValido')}
      aoEntrar={async ({ usuario, senha }) => {
        await new Promise((r) => setTimeout(r, 700));
        if (!isCpf(usuario)) return { erro: t('paginas.login.textos.cpfInvalido') };
        if (senha === '123456') return 'codigo';
        if (senha.length < 4) return { erro: t('paginas.login.textos.cpfOuSenhaIncorretos') };
        toast.ok(t('paginas.login.textos.bemVindaDeVolta'));
        navegar('/');
      }}
      aoConfirmarCodigo={async (codigo, confiar) => {
        await new Promise((r) => setTimeout(r, 600));
        if (codigo !== '123456') return { erro: t('paginas.login.textos.codigoIncorretoConfiraNo') };
        toast.ok(t('paginas.login.textos.bemVindaDeVolta'), confiar ? t('paginas.login.textos.esteDispositivoFoiMarcado') : undefined);
        navegar('/');
      }}
      linkSenha={
        <a href="#/login" onClick={(e) => (e.preventDefault(), toast.info(t('paginas.login.textos.recuperacaoDeSenha')))}>{t('paginas.login.textos.esqueciMinhaSenha')}</a>
      }
      acoes={
        <>
          <a href={modelo === 'conteudo' ? '#/login/simples' : '#/login'}>
            {modelo === 'conteudo' ? 'Ver modelo só com formulário' : 'Ver modelo com conteúdo'}
          </a>
          <a href="#/">{t('paginas.login.textos.voltarAoPainel')}</a>
        </>
      }
      rodape="Celke Kole · v0.1.0"
    />
  );
}
