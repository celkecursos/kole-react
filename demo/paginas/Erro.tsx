import { Botao, TelaErro } from '../../src';
import { useT, type TradutorDemo } from '../i18n/useT';

const MARCA = (t: TradutorDemo['t']) => ({ nome: t('paginas.erro.textos.gestor'), subtitulo: t('paginas.erro.textos.gestaoComercial') });

export function PaginaErro({ codigo, navegar }: { codigo: '401' | '404' | '500'; navegar: (rota: string) => void }) {
  const { t } = useT();
  const inicio = <Botao rotulo={t('paginas.erro.textos.voltarAoInicio')} icone="house" formato="retangulo" onClick={() => navegar('/')} />;

  if (codigo === '401')
    return (
      <TelaErro
        marca={MARCA(t)}
        codigo={401}
        icone="lock"
        cor="warn"
        titulo={t('paginas.erro.textos.acessoNaoAutorizado')}
        descricao={<p>Você precisa entrar no sistema para ver esta página. Se já entrou, a sua sessão pode ter expirado.</p>}
        acoes={
          <>
            <Botao rotulo={t('paginas.erro.textos.entrar')} icone="log-in" formato="retangulo" onClick={() => navegar('/login')} />
            <Botao rotulo={t('paginas.erro.textos.voltarAoInicio')} icone="house" aparencia="contorno" formato="retangulo" onClick={() => navegar('/')} />
          </>
        }
      />
    );

  if (codigo === '500')
    return (
      <TelaErro
        marca={MARCA(t)}
        codigo={500}
        icone="triangle-alert"
        cor="err"
        titulo={t('paginas.erro.textos.algoDeuErradoDo')}
        descricao={<p>Tivemos um problema inesperado no servidor. Nada que você fez causou isso. Tente de novo em instantes.</p>}
        acoes={
          <>
            <Botao rotulo={t('paginas.erro.textos.tentarDeNovo')} icone="refresh-cw" formato="retangulo" onClick={() => window.location.reload()} />
            <Botao rotulo={t('paginas.erro.textos.voltarAoInicio')} icone="house" aparencia="contorno" formato="retangulo" onClick={() => navegar('/')} />
          </>
        }
        detalhe={t('paginas.erro.textos.codigoDoIncidente7f3a')}
      />
    );

  return (
    <TelaErro
      marca={MARCA(t)}
      codigo={404}
      icone="search"
      titulo={t('paginas.erro.textos.paginaNaoEncontrada')}
      descricao={<p>Ops! A página que você procura não existe ou mudou de endereço. Confira o endereço digitado ou volte ao início.</p>}
      acoes={
        <>
          {inicio}
          <Botao rotulo={t('paginas.erro.textos.voltarAPaginaAnterior')} icone="arrow-left" aparencia="contorno" formato="retangulo" onClick={() => window.history.back()} />
        </>
      }
    />
  );
}
