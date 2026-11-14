import { useState, type ReactNode } from 'react';
import {
  CabecalhoPagina,
  CampoMoeda,
  CampoSelect,
  CampoTexto,
  ESTADOS,
  Icone,
  Escolha,
  Status,
  TIPOS_CAMPO,
  TIPOS_DE_CAMPO,
  TIPOS_PESSOA,
  aplicarMascara,
  decodificarJwt,
  expiracaoJwt,
  formatBytes,
  formatCpfCnpj,
  formatarNumero,
  iconeArquivo,
  iniciais,
  jwtExpirado,
  listaPorExtenso,
  nomeCurto,
  nomeDeArquivo,
  nomeProprio,
  normalizar,
  numeroPorExtenso,
  parseDataBr,
  saudacaoPorHora,
  situacaoPrazo,
  tempoRelativo,
  severidadeCor,
  SEVERIDADES,
  tipoDeArquivo,
  tituloDeEntidade,
  validar,
  valorMonetarioPorExtenso,
  type Modo,
  type TipoDeCampo,
} from '../../src';
import { Bloco } from './Bloco';
import { useT, type TradutorDemo } from '../i18n/useT';

function Linha({ codigo, children }: { codigo: string; children: ReactNode }) {
  return (
    <>
      <code>{codigo}</code>
      <div className="demo-util-res">{children}</div>
    </>
  );
}

// token de exemplo (assinatura falsa): só o payload é lido
const JWT_EXEMPLO = (t: TradutorDemo['t']) => ([
  'eyJhbGciOiJIUzI1NiJ9',
  btoa(JSON.stringify({ sub: '52998224725', name: t('paginas.utilitarios.textos.gabriellyRibeiroDaSilva'), iat: 1790000000, exp: 1790003600 }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''),
  'assinatura',
].join('.'));

export function PaginaUtilitarios() {
  const { t, idioma } = useT();
  const [tipo, setTipo] = useState<TipoDeCampo | null>('cpf');
  const [valorTipo, setValorTipo] = useState('529.982.247-25');
  const [numero, setNumero] = useState('1234567');
  const [moeda, setMoeda] = useState<number | null>(1500.5);
  const [itens, setItens] = useState('Contato, Endereço, Documentos');
  const [data, setData] = useState('31/02/2026');
  const [vencimento, setVencimento] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [entidade, setEntidade] = useState('veículo');
  const [modo, setModo] = useState<Modo>('novo');
  const [nome, setNome] = useState('GABRIELLY RIBEIRO DA SILVA');
  const [bytes, setBytes] = useState('5242880');
  const [arquivo, setArquivo] = useState('relatorio.xlsx');
  const [jwt, setJwt] = useState(JWT_EXEMPLO(t));

  const msg = tipo ? validar(tipo, valorTipo, idioma) : '';
  const meta = tipo ? TIPOS_CAMPO[tipo] : null;
  const payload = decodificarJwt(jwt);
  const exp = expiracaoJwt(jwt);
  const dataBr = parseDataBr(data);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo={t('paginas.utilitarios.titulo')} icone="code" trilha />

      <Bloco titulo={t('paginas.utilitarios.secoes.validadoresETiposDe')} descricao={t('paginas.utilitarios.textos.validarTipoValorDevolve')}>
        <div className="demo-grade">
          <CampoSelect<TipoDeCampo> rotulo={t('paginas.utilitarios.textos.tipo')} opcoes={TIPOS_DE_CAMPO.map((t) => ({ valor: t, rotulo: t }))} valor={tipo} aoMudar={setTipo} />
          <CampoTexto
            className="lp-col-2"
            rotulo={t('paginas.utilitarios.textos.valor')}
            valor={valorTipo}
            aoMudar={(v) => setValorTipo(meta?.mascara ? aplicarMascara(v, meta.mascara) : v)}
            placeholder={meta?.placeholder}
          />
          <div style={{ alignSelf: 'end' }}>
            {valorTipo.trim() ? <Status rotulo={msg || t('paginas.utilitarios.textos.valido')} severidade={msg ? 'err' : 'ok'} /> : <Status rotulo={t('paginas.utilitarios.textos.vazioValido')} />}
          </div>
        </div>
        <div className="demo-util">
          <Linha codigo="TIPOS_CAMPO[tipo].mascara">{meta?.mascara ? JSON.stringify(meta.mascara) : '— (digitação livre)'}</Linha>
          <Linha codigo="TIPOS_CAMPO[tipo].placeholder">{meta?.placeholder}</Linha>
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.utilitarios.secoes.porExtensoDocumentos')}>
        <div className="demo-grade">
          <CampoTexto rotulo={t('paginas.utilitarios.textos.numero')} valor={numero} aoMudar={(v) => setNumero(v.replace(/[^\d-]/g, ''))} inputMode="numeric" />
          <CampoMoeda rotulo={t('paginas.utilitarios.textos.valorEmReais')} valor={moeda} aoMudar={setMoeda} />
          <CampoTexto className="lp-col-2" rotulo={t('paginas.utilitarios.textos.itensSeparadosPorVirgula')} valor={itens} aoMudar={setItens} />
        </div>
        <div className="demo-util">
          <Linha codigo={`numeroPorExtenso(${numero || 0})`}>{numeroPorExtenso(Number(numero) || 0)}</Linha>
          <Linha codigo={`valorMonetarioPorExtenso(${moeda ?? 0})`}>{valorMonetarioPorExtenso(moeda ?? 0)}</Linha>
          <Linha codigo="listaPorExtenso(itens)">{listaPorExtenso(itens.split(','), idioma)}</Linha>
          <Linha codigo="formatarNumero(12400, { compacto: true })">{formatarNumero(12400, { compacto: true , idioma })}</Linha>
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.utilitarios.secoes.textoENomes')}>
        <div className="demo-grade">
          <CampoTexto className="lp-col-2" rotulo={t('paginas.utilitarios.textos.nome')} valor={nome} aoMudar={setNome} />
        </div>
        <div className="demo-util">
          <Linha codigo="nomeProprio(nome)">{nomeProprio(nome)}</Linha>
          <Linha codigo="nomeCurto(nome)">{nomeCurto(nome)}</Linha>
          <Linha codigo="iniciais(nome)">{iniciais(nome)}</Linha>
          <Linha codigo="normalizar(nome)">{normalizar(nome)}</Linha>
          <Linha codigo="saudacaoPorHora()">{saudacaoPorHora(undefined, idioma)}</Linha>
          <Linha codigo="formatCpfCnpj('11222333000181')">{formatCpfCnpj('11222333000181')}</Linha>
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.utilitarios.secoes.datasPtBr')} descricao={t('paginas.utilitarios.textos.validacaoPorIdaE')}>
        <div className="demo-grade">
          <CampoTexto rotulo={t('paginas.utilitarios.textos.data')} mascara="00/00/0000" placeholder={t('paginas.utilitarios.textos.ddMmAaaa')} valor={data} aoMudar={setData} />
        </div>
        <div className="demo-util">
          <Linha codigo={`parseDataBr('${data}')`}>{dataBr ? dataBr.toString() : 'null'}</Linha>
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.utilitarios.secoes.tempoRelativoEPrazos')} descricao={t('paginas.utilitarios.textos.datasAaaaMmDd')}>
        <div className="demo-grade">
          <CampoTexto rotulo={t('paginas.utilitarios.textos.vencimento')} type="date" valor={vencimento} aoMudar={setVencimento} />
        </div>
        <div className="demo-util">
          <Linha codigo="tempoRelativo(agora - 5 min)">{tempoRelativo(new Date(Date.now() - 5 * 60_000), undefined, idioma)}</Linha>
          <Linha codigo="tempoRelativo(agora - 26 h)">{tempoRelativo(new Date(Date.now() - 26 * 3_600_000), undefined, idioma)}</Linha>
          <Linha codigo="tempoRelativo(agora + 3 dias)">{tempoRelativo(new Date(Date.now() + 3 * 86_400_000), undefined, idioma)}</Linha>
          {vencimento && (
            <Linha codigo={`situacaoPrazo('${vencimento}')`}>{JSON.stringify(situacaoPrazo(vencimento, undefined, undefined, idioma))}</Linha>
          )}
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.utilitarios.secoes.entidadeETitulosDe')} descricao={t('paginas.utilitarios.textos.verboSubstantivoSemArtigo')}>
        <div className="demo-grade">
          <CampoTexto rotulo={t('paginas.utilitarios.textos.entidade')} valor={entidade} aoMudar={setEntidade} />
          <Escolha
            className="lp-col-2"
            rotulo={t('paginas.utilitarios.textos.modo')}
            valor={modo}
            aoMudar={setModo}
            opcoes={[
              { valor: 'novo', rotulo: t('paginas.utilitarios.textos.novo') },
              { valor: 'editar', rotulo: t('paginas.utilitarios.textos.editar') },
              { valor: 'leitura', rotulo: t('paginas.utilitarios.textos.leitura') },
            ]}
          />
        </div>
        <div className="demo-util">
          <Linha codigo={`tituloDeEntidade('${entidade}', '${modo}')`}>{tituloDeEntidade(entidade, modo)}</Linha>
          <Linha codigo={`tituloDeEntidade({ nome: 'contrato', novo: 'Firmar contrato' }, '${modo}')`}>{tituloDeEntidade({ nome: 'contrato', novo: 'Firmar contrato' }, modo)}</Linha>
          <Linha codigo={`nomeDeArquivo('Ficha: Cliente/Fornecedor "X"')`}>{nomeDeArquivo('Ficha: Cliente/Fornecedor "X"')}</Linha>
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.utilitarios.secoes.anexos')}>
        <div className="demo-grade">
          <CampoTexto rotulo={t('paginas.utilitarios.textos.bytes')} valor={bytes} aoMudar={(v) => setBytes(v.replace(/\D/g, ''))} inputMode="numeric" />
          <CampoTexto rotulo={t('paginas.utilitarios.textos.nomeDoArquivo')} valor={arquivo} aoMudar={setArquivo} />
        </div>
        <div className="demo-util">
          <Linha codigo={`formatBytes(${bytes || 0})`}>{formatBytes(Number(bytes))}</Linha>
          <Linha codigo={`tipoDeArquivo('', '${arquivo}')`}>{tipoDeArquivo('', arquivo)}</Linha>
          <Linha codigo={`iconeArquivo('', '${arquivo}')`}>
            <Icone icone={iconeArquivo('', arquivo)} /> {iconeArquivo('', arquivo)}
          </Linha>
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.utilitarios.secoes.jwt')} descricao={t('paginas.utilitarios.textos.soLeOPayload')}>
        <CampoTexto rotulo={t('paginas.utilitarios.textos.token')} valor={jwt} aoMudar={setJwt} />
        <div className="demo-util">
          <Linha codigo="decodificarJwt(token)">{payload ? JSON.stringify(payload) : 'null'}</Linha>
          <Linha codigo="expiracaoJwt(token)">{exp ? exp.toLocaleString('pt-BR') : 'null'}</Linha>
          <Linha codigo="jwtExpirado(token, 60)">{String(jwtExpirado(jwt, 60))}</Linha>
        </div>
      </Bloco>

      <Bloco titulo={t('paginas.utilitarios.secoes.constantesESeveridades')}>
        <div className="demo-util">
          <Linha codigo="ESTADOS.length">{t('paginas.utilitarios.textos.n26EstadosDf', { n: ESTADOS.length })}</Linha>
          <Linha codigo="ESTADOS.find(e => e.uf === 'PR')">{JSON.stringify(ESTADOS.find((e) => e.uf === 'PR'))}</Linha>
          <Linha codigo="TIPOS_PESSOA">{JSON.stringify(TIPOS_PESSOA)}</Linha>
          <Linha codigo="severidadeCor(sev)">
            <span className="demo-linha">
              {SEVERIDADES.map((s) => (
                <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: severidadeCor(s) }} />
                  {s}
                </span>
              ))}
            </span>
          </Linha>
        </div>
      </Bloco>
    </div>
  );
}
