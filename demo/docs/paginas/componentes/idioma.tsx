import { C, Codigo } from '../../Codigo';
import { Exemplo } from '../../Exemplo';
import { PaginaGuia, Secao } from '../../PaginaDoc';

const PROVEDOR = `import { Estrutura, ProvedorUi } from '@celke/kole-react';

<ProvedorUi
  idiomaInicial={usuario.locale}             // 'pt-BR' | 'en' | 'es' (sem ele: pt-BR)
  aoMudarIdioma={(idioma) => api.salvarIdioma(idioma)}
>
  <Estrutura idiomas={['pt-BR', 'en', 'es']} {/* sem a prop, o seletor não aparece */}>
    …
  </Estrutura>
</ProvedorUi>`;

const I18NEXT = `import i18n from 'i18next';
import { ProvedorUi, type Idioma } from '@celke/kole-react';

// o kole troca os textos DELE; o sistema troca os seus pelo i18next
const sincronizar = (idioma: Idioma) => {
  i18n.changeLanguage(idioma);          // chamado ao montar e a cada troca
};

<ProvedorUi aoMudarIdioma={sincronizar}>…</ProvedorUi>`;

const LARAVEL = `// routes/web.php — grava a escolha do usuário
Route::put('/preferencias/idioma', function (Request $request) {
    $request->validate(['idioma' => 'in:pt-BR,en,es']);
    $request->user()->update(['locale' => $request->idioma]);
    return response()->noContent();
})->middleware('auth');

// app/Http/Middleware/HandleInertiaRequests.php — devolve no carregamento
'locale' => fn () => $request->user()?->locale ?? 'pt-BR',`;

const LARAVEL_REACT = `const { locale } = usePage().props;

<ProvedorUi
  idiomaInicial={locale}
  aoMudarIdioma={(idioma) => idioma !== locale && axios.put('/preferencias/idioma', { idioma })}
>`;

const TEXTOS = `<ProvedorUi
  textos={{
    // troca um texto da biblioteca
    'pt-BR': { tabela: { rotulo: 'Lista de registros' } },
    // acrescenta um idioma (o que faltar sai em pt-BR)
    fr: { idioma: { nome: 'Français', seletor: 'Langue', atual: 'Langue : {nome}' }, comum: { fechar: 'Fermer' } },
  }}
>
  <Estrutura idiomas={['pt-BR', 'en', 'es', 'fr']}>…</Estrutura>
</ProvedorUi>`;

const SCRIPT = `// no <head> (SSR) — define <html lang> antes da primeira pintura
<script dangerouslySetInnerHTML={{ __html: scriptTemaInicial({ idiomaInicial: usuario.locale }) }} />`;

export default function DocIdioma() {
  return (
    <PaginaGuia
      titulo="Idioma"
      icone="globe"
      resumo="Os textos da própria biblioteca (rótulos padrão, listas vazias, aria-labels, validações, datas e números) em português do Brasil, inglês ou espanhol. O padrão continua pt-BR: nada muda até o sistema pedir."
    >
      <Secao id="ligar" titulo="Ligar o seletor">
        <p className="doc-p">
          O idioma fica no <C>ProvedorPreferencias</C> (ou <C>ProvedorUi</C>), junto com o tema e a densidade, e é lembrado no navegador.
          Sem escolha salva nem <C>idiomaInicial</C>, é <C>pt-BR</C>: o idioma do navegador não é consultado. O seletor aparece na topbar
          da <C>Estrutura</C> só com a prop <C>idiomas</C>.
        </p>
        <Codigo codigo={PROVEDOR} />
        <Exemplo id="idioma/Seletor" titulo="Trocar o idioma (a página inteira muda, sem recarregar)" />
      </Secao>

      <Secao id="o-que-muda" titulo="O que muda e o que não muda">
        <ul className="doc-lista">
          <li>
            Mudam os textos da biblioteca e a formatação de datas e números (<C>1.234,50</C> · <C>1,234.50</C>). A prioridade é: prop
            passada pelo sistema, depois o dicionário do idioma, depois o pt-BR.
          </li>
          <li>
            A moeda não muda com o idioma: <C>formatarMoeda</C> e <C>Valor</C> continuam em real (ou na <C>moeda</C> passada); o idioma muda só
            o separador e a posição do símbolo.
          </li>
          <li>
            Regras brasileiras ficam como são: máscaras e validação de CPF, CNPJ, CEP e telefone, placa, UFs, tipo de pessoa e os valores por
            extenso. Só a mensagem de erro é traduzida.
          </li>
          <li>
            Os textos do sistema não são traduzidos pela biblioteca: ela só informa o idioma escolhido (<C>aoMudarIdioma</C>,{' '}
            <C>usePreferencias().idioma</C> ou <C>useIdioma()</C>) para o sistema trocar os dele.
          </li>
          <li>
            Utilitários aceitam o idioma como parâmetro opcional, sempre com padrão <C>pt-BR</C>: <C>{'formatarNumero(v, { idioma })'}</C>,{' '}
            <C>formatarMoeda</C>, <C>rotuloPeriodo</C>, <C>tempoRelativo(data, agora, idioma)</C>, <C>situacaoPrazo</C>, <C>validar</C>,{' '}
            <C>validarSenha</C>, <C>saudacaoPorHora</C>, <C>listaPorExtenso</C> e <C>tituloDeEntidade</C>.
          </li>
        </ul>
      </Secao>

      <Secao id="sincronizar" titulo="Sincronizar com o sistema">
        <p className="doc-p">
          <C>aoMudarIdioma</C> é chamado ao montar e a cada troca: é o lugar de trocar o i18n do sistema e de gravar a escolha.
        </p>
        <Codigo codigo={I18NEXT} />
        <p className="doc-p">
          Com Laravel, guarde a escolha em <C>users.locale</C> e devolva no carregamento. O <C>idiomaInicial</C> vale enquanto a pessoa não
          troca no navegador; depois, a escolha salva no navegador vence.
        </p>
        <Codigo linguagem="php" codigo={LARAVEL} />
        <Codigo codigo={LARAVEL_REACT} />
      </Secao>

      <Secao id="textos" titulo="Trocar textos ou acrescentar um idioma">
        <p className="doc-p">
          Os dicionários são exportados (<C>textosPtBR</C>, <C>textosEn</C>, <C>textosEs</C>) e organizados por componente (
          <C>tabela.rotulo</C>, <C>paginacao.proxima</C>…). A prop <C>textos</C> do provedor recebe só o que muda, por idioma.
        </p>
        <Codigo codigo={TEXTOS} />
      </Secao>

      <Secao id="sem-piscar" titulo="Sem piscar ao abrir">
        <p className="doc-p">
          O <C>scriptTemaInicial</C> também define o <C>lang</C> do <C>&lt;html&gt;</C> antes da primeira pintura (só quando há idioma salvo ou{' '}
          <C>idiomaInicial</C>; sem eles, fica o <C>lang</C> do HTML). Os textos já saem no idioma certo na primeira renderização, porque o
          provedor lê a escolha salva ao montar.
        </p>
        <Codigo codigo={SCRIPT} />
      </Secao>
    </PaginaGuia>
  );
}
