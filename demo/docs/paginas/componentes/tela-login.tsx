import { Botao } from '../../../../src';
import { C, Codigo } from '../../Codigo';
import { PaginaComponente } from '../../PaginaDoc';

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
  return (
    <PaginaComponente
      titulo="Tela de login"
      icone="log-in"
      componente="TelaLogin"
      importar={['type ApresentacaoLogin', 'type CredenciaisLogin', 'type ResultadoLogin']}
      resumo="Tela de entrada completa: apresentação do sistema, formulário com CPF, e-mail ou usuário, senha, e a etapa do código de verificação em duas etapas."
      notas={
        <ul className="doc-lista">
          <li>
            Todo o fluxo vem do retorno do <C>aoEntrar</C>: nada = entrou, <C>'codigo'</C> = mostra a etapa do código,{' '}
            <C>{'{ erro }'}</C> = mostra a mensagem no formulário.
          </li>
          <li>
            <C>identificador</C> escolhe o campo de usuário (<C>cpf</C>, <C>email</C> ou <C>usuario</C>), com máscara e validação.
          </li>
          <li>
            <C>modelo="formulario"</C> tira a apresentação e deixa só o cartão centralizado.
          </li>
          <li>Ocupa a janela inteira, fora da Estrutura. Os campos já trazem o autocomplete certo para gerenciadores de senha.</li>
        </ul>
      }
    >
      <p className="doc-p">
        A tela ocupa a janela inteira, então o exemplo abre numa página própria da demo. Teste com qualquer CPF válido; a senha{' '}
        <C>123456</C> pede o código (também <C>123456</C>).
      </p>
      <div className="demo-linha">
        <Botao rotulo="Abrir com apresentação" icone="log-in" onClick={() => (window.location.hash = '/login')} />
        <Botao rotulo="Abrir só o formulário" icone="lock" aparencia="contorno" onClick={() => (window.location.hash = '/login/simples')} />
      </div>
      <h3 className="doc-exemplo-titulo">Código</h3>
      <Codigo codigo={USO} />
    </PaginaComponente>
  );
}
