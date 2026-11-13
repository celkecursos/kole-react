// Gera demo/docs/props.gerado.json: as props de cada componente, lidas dos tipos TypeScript.
//
// Para cada interface exportada por src/index.ts (`XxxProps` vira a chave `Xxx`), registra nome, tipo,
// se é obrigatória, valor padrão (lido da desestruturação no componente `Xxx`),
// descrição (JSDoc) e de qual interface veio. Props herdadas de tipos do React
// (atributos nativos do HTML) não entram: viram só uma nota em `externos`.
//
// Uso: node scripts/gerar-props.mjs          → reescreve o JSON
//      node scripts/gerar-props.mjs --conferir → falha se o JSON estiver desatualizado
import { readFileSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import ts from 'typescript';

const RAIZ = resolve(import.meta.dirname, '..');
const SRC = resolve(RAIZ, 'src');
const SAIDA = resolve(RAIZ, 'demo/docs/props.gerado.json');

const dentroDoSrc = (arquivo) => resolve(arquivo).startsWith(SRC);
const caminho = (arquivo) => relative(RAIZ, arquivo).replace(/\\/g, '/');

const config = ts.getParsedCommandLineOfConfigFile(resolve(RAIZ, 'tsconfig.json'), {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} });
const programa = ts.createProgram([resolve(SRC, 'index.ts')], config.options);
const checker = programa.getTypeChecker();
const indice = programa.getSourceFile(resolve(SRC, 'index.ts'));

/**
 * Opções de uma união de literais, na ordem em que estão escritas, abrindo
 * aliases do src (`SeveridadeBotao`, `Severidade | 'pri'`). `null` se não for.
 */
function opcoesLiterais(no) {
  if (ts.isParenthesizedTypeNode(no)) return opcoesLiterais(no.type);
  if (ts.isLiteralTypeNode(no)) return [no.getText()];
  if (ts.isUnionTypeNode(no)) {
    const partes = no.types.map(opcoesLiterais);
    return partes.every(Boolean) ? partes.flat() : null;
  }
  if (ts.isTypeReferenceNode(no) && !no.typeArguments) {
    let s = checker.getSymbolAtLocation(no.typeName);
    if (s && s.flags & ts.SymbolFlags.Alias) s = checker.getAliasedSymbol(s);
    const d = s?.declarations?.[0];
    if (d && ts.isTypeAliasDeclaration(d) && dentroDoSrc(d.getSourceFile().fileName)) return opcoesLiterais(d.type);
  }
  return null;
}

/** Texto do tipo: união de literais vira `'a' | 'b'`; o resto, como está escrito no código. */
function textoDoTipo(prop, decl) {
  if (decl.type) {
    const opcoes = opcoesLiterais(decl.type);
    if (opcoes) return opcoes.join(' | ');
    return decl.type.getText().replace(/\s+/g, ' ').replace(/\s*\|\s*undefined$/, '');
  }
  return checker.typeToString(checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(prop, decl)));
}

/** Texto de uma base do `extends`, abrindo alias local (`InputNativo` → `Omit<InputHTMLAttributes…>`). */
function textoDaBase(t) {
  let s = checker.getSymbolAtLocation(t.expression);
  if (s && s.flags & ts.SymbolFlags.Alias) s = checker.getAliasedSymbol(s);
  const d = s?.declarations?.[0];
  const local = d && ts.isTypeAliasDeclaration(d) && dentroDoSrc(d.getSourceFile().fileName);
  const texto = local ? d.type.getText() : t.getText();
  return texto.replace(/\s+/g, ' ');
}

// Textos padrão que vêm do dicionário: o pt-BR, lido do próprio fonte.
const PT_BR = (() => {
  const fonte = readFileSync(resolve(SRC, 'i18n/pt-BR.ts'), 'utf8');
  const js = ts.transpileModule(fonte, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const modulo = { exports: {} };
  new Function('module', 'exports', 'require', js)(modulo, modulo.exports, () => ({}));
  return modulo.exports.textosPtBR;
})();
// apelidos usados nos componentes para uma seção inteira do dicionário
const SECAO_DO_APELIDO = { TXT: 'calendario', tg: 'grafico', tq: 'quadro', tp: 'periodo' };

/**
 * `t.tabela.rotulo`, `tx.kanban.quadro`, `TXT.vazioMes`… → `'Tabela de dados'`
 * (o texto em pt-BR, entre aspas, como um padrão escrito no código); `null` se não for do dicionário.
 */
function textoDoDicionario(expr) {
  const m = /^(\w+)((?:\.\w+)+)$/.exec(expr.trim());
  if (!m) return null;
  const partes = m[2].slice(1).split('.');
  if (SECAO_DO_APELIDO[m[1]]) partes.unshift(SECAO_DO_APELIDO[m[1]]);
  const v = partes.reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), PT_BR);
  return typeof v === 'string' ? `'${v}'` : null;
}

/** `{ nome: 'padrão' }` lido de `function Xxx({ nome = 'padrão' })` ou `forwardRef(function Xxx({ … }))`. */
function padroesDoComponente(arquivo, nome) {
  const padroes = {};
  let achou = false;
  const lerParametro = (fn) => {
    const p = fn.parameters[0]?.name;
    if (!p || !ts.isObjectBindingPattern(p)) return;
    achou = true;
    const corpo = fn.body?.getText() ?? '';
    for (const el of p.elements) {
      const chave = (el.propertyName ?? el.name).getText();
      if (!el.initializer) {
        // texto do idioma: `rotulo: rotuloProp` + `const rotulo = rotuloProp ?? t.tabela.rotulo`
        if (!el.propertyName) continue;
        const local = el.name.getText();
        const m = new RegExp(`const \\w+ = ${local} \\?\\? ([\\w.]+);`).exec(corpo);
        const texto = m && textoDoDicionario(m[1]);
        if (texto) padroes[chave] = texto;
        continue;
      }
      const inicial = el.initializer.getText().replace(/\s+/g, ' ');
      padroes[chave] = textoDoDicionario(inicial) ?? inicial;
    }
  };
  const visitar = (no) => {
    if (achou) return;
    if ((ts.isFunctionDeclaration(no) || ts.isFunctionExpression(no)) && no.name?.text === nome) return lerParametro(no);
    if (ts.isVariableDeclaration(no) && no.name.getText() === nome && no.initializer) {
      const fn = no.initializer;
      if (ts.isArrowFunction(fn)) return lerParametro(fn);
    }
    ts.forEachChild(no, visitar);
  };
  visitar(arquivo);
  return padroes;
}

const resultado = {};
const modulo = checker.getSymbolAtLocation(indice);
for (let simbolo of checker.getExportsOfModule(modulo)) {
  if (simbolo.flags & ts.SymbolFlags.Alias) simbolo = checker.getAliasedSymbol(simbolo);
  const decl = simbolo.declarations?.find(ts.isInterfaceDeclaration);
  if (!decl) continue;

  // XxxProps → chave "Xxx" (o componente); outras interfaces (OpcoesToast, Coluna…) → o próprio nome
  const interfaceNome = decl.name.text;
  const ehProps = interfaceNome.endsWith('Props');
  const componente = ehProps ? interfaceNome.slice(0, -'Props'.length) : interfaceNome;
  if (resultado[componente]) continue;
  const arquivo = decl.getSourceFile();
  const padroes = padroesDoComponente(arquivo, componente);

  // bases de fora do src (atributos do React/HTML): só a nota
  const externos = (decl.heritageClauses ?? [])
    .flatMap((h) => h.types)
    .filter((t) => {
      const s = checker.getTypeAtLocation(t.expression).getSymbol() ?? checker.getSymbolAtLocation(t.expression);
      const arq = s?.declarations?.[0]?.getSourceFile().fileName;
      return !arq || !dentroDoSrc(arq);
    })
    .map(textoDaBase);

  const props = [];
  for (const prop of checker.getPropertiesOfType(checker.getDeclaredTypeOfSymbol(simbolo))) {
    const d = prop.valueDeclaration ?? prop.declarations?.[0];
    if (!d || !dentroDoSrc(d.getSourceFile().fileName)) continue;
    const dono = ts.isInterfaceDeclaration(d.parent) ? d.parent.name.text : interfaceNome;
    props.push({
      nome: prop.name,
      tipo: textoDoTipo(prop, d),
      obrigatorio: !(prop.flags & ts.SymbolFlags.Optional),
      ...(padroes[prop.name] !== undefined && { padrao: padroes[prop.name] }),
      descricao: ts.displayPartsToString(prop.getDocumentationComment(checker)).replace(/\s*\n\s*/g, ' ').trim(),
      ...(dono !== interfaceNome && { de: dono }),
    });
  }

  resultado[componente] = { interface: interfaceNome, arquivo: caminho(arquivo.fileName), externos, props };
}

const ordenado = Object.fromEntries(Object.entries(resultado).sort(([a], [b]) => a.localeCompare(b)));
const json = JSON.stringify(ordenado, null, 2) + '\n';

if (process.argv.includes('--conferir')) {
  let atual = '';
  try {
    atual = readFileSync(SAIDA, 'utf8');
  } catch {
    /* ainda não existe */
  }
  if (atual !== json) {
    console.error('demo/docs/props.gerado.json está desatualizado: rode `npm run docs:props`.');
    process.exit(1);
  }
  console.log(`props.gerado.json em dia (${Object.keys(ordenado).length} componentes).`);
} else {
  writeFileSync(SAIDA, json);
  console.log(`props.gerado.json: ${Object.keys(ordenado).length} componentes.`);
}
