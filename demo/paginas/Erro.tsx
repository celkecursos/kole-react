import { Botao, TelaErro } from '../../src';

const MARCA = { nome: 'Gestor', subtitulo: 'Gestão comercial' };

export function PaginaErro({ codigo, navegar }: { codigo: '401' | '404' | '500'; navegar: (rota: string) => void }) {
  const inicio = <Botao rotulo="Voltar ao início" icone="house" formato="retangulo" onClick={() => navegar('/')} />;

  if (codigo === '401')
    return (
      <TelaErro
        marca={MARCA}
        codigo={401}
        icone="lock"
        cor="warn"
        titulo="Acesso não autorizado"
        descricao={<p>Você precisa entrar no sistema para ver esta página. Se já entrou, a sua sessão pode ter expirado.</p>}
        acoes={
          <>
            <Botao rotulo="Entrar" icone="log-in" formato="retangulo" onClick={() => navegar('/login')} />
            <Botao rotulo="Voltar ao início" icone="house" aparencia="contorno" formato="retangulo" onClick={() => navegar('/')} />
          </>
        }
      />
    );

  if (codigo === '500')
    return (
      <TelaErro
        marca={MARCA}
        codigo={500}
        icone="triangle-alert"
        cor="err"
        titulo="Algo deu errado do nosso lado"
        descricao={<p>Tivemos um problema inesperado no servidor. Nada que você fez causou isso. Tente de novo em instantes.</p>}
        acoes={
          <>
            <Botao rotulo="Tentar de novo" icone="refresh-cw" formato="retangulo" onClick={() => window.location.reload()} />
            <Botao rotulo="Voltar ao início" icone="house" aparencia="contorno" formato="retangulo" onClick={() => navegar('/')} />
          </>
        }
        detalhe="Código do incidente: 7F3A-2C91 · informe ao suporte se o erro continuar"
      />
    );

  return (
    <TelaErro
      marca={MARCA}
      codigo={404}
      icone="search"
      titulo="Página não encontrada"
      descricao={<p>Ops! A página que você procura não existe ou mudou de endereço. Confira o endereço digitado ou volte ao início.</p>}
      acoes={
        <>
          {inicio}
          <Botao rotulo="Voltar à página anterior" icone="arrow-left" aparencia="contorno" formato="retangulo" onClick={() => window.history.back()} />
        </>
      }
    />
  );
}
