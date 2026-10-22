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

function Linha({ codigo, children }: { codigo: string; children: ReactNode }) {
  return (
    <>
      <code>{codigo}</code>
      <div className="demo-util-res">{children}</div>
    </>
  );
}

// token de exemplo (assinatura falsa): só o payload é lido
const JWT_EXEMPLO = [
  'eyJhbGciOiJIUzI1NiJ9',
  btoa(JSON.stringify({ sub: '52998224725', name: 'GABRIELLY RIBEIRO DA SILVA', iat: 1790000000, exp: 1790003600 }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''),
  'assinatura',
].join('.');

export function PaginaUtilitarios() {
  const [tipo, setTipo] = useState<TipoDeCampo | null>('cpf');
  const [valorTipo, setValorTipo] = useState('529.982.247-25');
  const [numero, setNumero] = useState('1234567');
  const [moeda, setMoeda] = useState<number | null>(1500.5);
  const [itens, setItens] = useState('Contato, Endereço, Documentos');
  const [data, setData] = useState('31/02/2026');
  const [entidade, setEntidade] = useState('veículo');
  const [modo, setModo] = useState<Modo>('novo');
  const [nome, setNome] = useState('GABRIELLY RIBEIRO DA SILVA');
  const [bytes, setBytes] = useState('5242880');
  const [arquivo, setArquivo] = useState('relatorio.xlsx');
  const [jwt, setJwt] = useState(JWT_EXEMPLO);

  const msg = tipo ? validar(tipo, valorTipo) : '';
  const meta = tipo ? TIPOS_CAMPO[tipo] : null;
  const payload = decodificarJwt(jwt);
  const exp = expiracaoJwt(jwt);
  const dataBr = parseDataBr(data);

  return (
    <div className="demo-pilha">
      <CabecalhoPagina titulo="Utilitários" icone="code" trilha />

      <Bloco titulo="Validadores e tipos de campo" descricao="validar(tipo, valor) devolve '' quando vazio ou válido; separa 'incompleto' de 'inválido'.">
        <div className="demo-grade">
          <CampoSelect<TipoDeCampo> rotulo="Tipo" opcoes={TIPOS_DE_CAMPO.map((t) => ({ valor: t, rotulo: t }))} valor={tipo} aoMudar={setTipo} />
          <CampoTexto
            className="lp-col-2"
            rotulo="Valor"
            valor={valorTipo}
            aoMudar={(v) => setValorTipo(meta?.mascara ? aplicarMascara(v, meta.mascara) : v)}
            placeholder={meta?.placeholder}
          />
          <div style={{ alignSelf: 'end' }}>
            {valorTipo.trim() ? <Status rotulo={msg || 'Válido'} severidade={msg ? 'err' : 'ok'} /> : <Status rotulo="Vazio (válido)" />}
          </div>
        </div>
        <div className="demo-util">
          <Linha codigo="TIPOS_CAMPO[tipo].mascara">{meta?.mascara ? JSON.stringify(meta.mascara) : '— (digitação livre)'}</Linha>
          <Linha codigo="TIPOS_CAMPO[tipo].placeholder">{meta?.placeholder}</Linha>
        </div>
      </Bloco>

      <Bloco titulo="Por extenso (documentos)">
        <div className="demo-grade">
          <CampoTexto rotulo="Número" valor={numero} aoMudar={(v) => setNumero(v.replace(/[^\d-]/g, ''))} inputMode="numeric" />
          <CampoMoeda rotulo="Valor em reais" valor={moeda} aoMudar={setMoeda} />
          <CampoTexto className="lp-col-2" rotulo="Itens (separados por vírgula)" valor={itens} aoMudar={setItens} />
        </div>
        <div className="demo-util">
          <Linha codigo={`numeroPorExtenso(${numero || 0})`}>{numeroPorExtenso(Number(numero) || 0)}</Linha>
          <Linha codigo={`valorMonetarioPorExtenso(${moeda ?? 0})`}>{valorMonetarioPorExtenso(moeda ?? 0)}</Linha>
          <Linha codigo="listaPorExtenso(itens)">{listaPorExtenso(itens.split(','))}</Linha>
          <Linha codigo="formatarNumero(12400, { compacto: true })">{formatarNumero(12400, { compacto: true })}</Linha>
        </div>
      </Bloco>

      <Bloco titulo="Texto e nomes">
        <div className="demo-grade">
          <CampoTexto className="lp-col-2" rotulo="Nome" valor={nome} aoMudar={setNome} />
        </div>
        <div className="demo-util">
          <Linha codigo="nomeProprio(nome)">{nomeProprio(nome)}</Linha>
          <Linha codigo="nomeCurto(nome)">{nomeCurto(nome)}</Linha>
          <Linha codigo="iniciais(nome)">{iniciais(nome)}</Linha>
          <Linha codigo="normalizar(nome)">{normalizar(nome)}</Linha>
          <Linha codigo="saudacaoPorHora()">{saudacaoPorHora()}</Linha>
          <Linha codigo="formatCpfCnpj('11222333000181')">{formatCpfCnpj('11222333000181')}</Linha>
        </div>
      </Bloco>

      <Bloco titulo="Datas pt-BR" descricao="Validação por ida e volta: 31/02 não vira 3 de março.">
        <div className="demo-grade">
          <CampoTexto rotulo="Data" mascara="00/00/0000" placeholder="dd/mm/aaaa" valor={data} aoMudar={setData} />
        </div>
        <div className="demo-util">
          <Linha codigo={`parseDataBr('${data}')`}>{dataBr ? dataBr.toString() : 'null'}</Linha>
        </div>
      </Bloco>

      <Bloco titulo="Entidade e títulos de tela" descricao="Verbo + substantivo, sem artigo; a entidade declara a frase inteira quando a regra não serve.">
        <div className="demo-grade">
          <CampoTexto rotulo="Entidade" valor={entidade} aoMudar={setEntidade} />
          <Escolha
            className="lp-col-2"
            rotulo="Modo"
            valor={modo}
            aoMudar={setModo}
            opcoes={[
              { valor: 'novo', rotulo: 'novo' },
              { valor: 'editar', rotulo: 'editar' },
              { valor: 'leitura', rotulo: 'leitura' },
            ]}
          />
        </div>
        <div className="demo-util">
          <Linha codigo={`tituloDeEntidade('${entidade}', '${modo}')`}>{tituloDeEntidade(entidade, modo)}</Linha>
          <Linha codigo={`tituloDeEntidade({ nome: 'contrato', novo: 'Firmar contrato' }, '${modo}')`}>{tituloDeEntidade({ nome: 'contrato', novo: 'Firmar contrato' }, modo)}</Linha>
          <Linha codigo={`nomeDeArquivo('Ficha: Cliente/Fornecedor "X"')`}>{nomeDeArquivo('Ficha: Cliente/Fornecedor "X"')}</Linha>
        </div>
      </Bloco>

      <Bloco titulo="Anexos">
        <div className="demo-grade">
          <CampoTexto rotulo="Bytes" valor={bytes} aoMudar={(v) => setBytes(v.replace(/\D/g, ''))} inputMode="numeric" />
          <CampoTexto rotulo="Nome do arquivo" valor={arquivo} aoMudar={setArquivo} />
        </div>
        <div className="demo-util">
          <Linha codigo={`formatBytes(${bytes || 0})`}>{formatBytes(Number(bytes))}</Linha>
          <Linha codigo={`tipoDeArquivo('', '${arquivo}')`}>{tipoDeArquivo('', arquivo)}</Linha>
          <Linha codigo={`iconeArquivo('', '${arquivo}')`}>
            <Icone icone={iconeArquivo('', arquivo)} /> {iconeArquivo('', arquivo)}
          </Linha>
        </div>
      </Bloco>

      <Bloco titulo="JWT" descricao="Só lê o payload — não confere a assinatura.">
        <CampoTexto rotulo="Token" valor={jwt} aoMudar={setJwt} />
        <div className="demo-util">
          <Linha codigo="decodificarJwt(token)">{payload ? JSON.stringify(payload) : 'null'}</Linha>
          <Linha codigo="expiracaoJwt(token)">{exp ? exp.toLocaleString('pt-BR') : 'null'}</Linha>
          <Linha codigo="jwtExpirado(token, 60)">{String(jwtExpirado(jwt, 60))}</Linha>
        </div>
      </Bloco>

      <Bloco titulo="Constantes e severidades">
        <div className="demo-util">
          <Linha codigo="ESTADOS.length">{ESTADOS.length} (26 estados + DF)</Linha>
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
