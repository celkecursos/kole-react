import { useEffect, useRef, useState } from 'react';
import { normalizar } from '../../utils/texto';
import type { CampoBaseProps } from '../Campo/Campo';
import { CampoTexto } from '../CampoTexto/CampoTexto';
import { CampoBusca } from './CampoBusca';

export interface Municipio {
  id: string | number;
  nome: string;
}

export interface CampoCidadeProps extends CampoBaseProps {
  /** UF que filtra os municípios (`''` = nenhuma). Trocar de UF limpa a cidade. */
  uf: string;
  /**
   * Municípios da UF. Sem esta função o campo vira texto livre
   * (continua utilizável, só não sugere).
   */
  buscarPorUf?: (uf: string) => Promise<Municipio[]>;
  /** O município escolhido — ou o texto digitado, no modo texto livre. */
  valor?: Municipio | string | null;
  aoMudar?: (valor: Municipio | string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * Município filtrado pela UF, com a cascata UF → cidade embutida: quando a
 * UF muda, a cidade da UF anterior é limpa pelo próprio campo.
 */
export function CampoCidade({ uf, buscarPorUf, valor = null, aoMudar, placeholder = 'Município', disabled, ...p }: CampoCidadeProps) {
  const [lista, setLista] = useState<Municipio[]>([]);
  const ufAnterior = useRef(uf);

  useEffect(() => {
    if (!buscarPorUf || !uf) {
      setLista([]);
      return;
    }
    let vivo = true;
    buscarPorUf(uf)
      .then((l) => vivo && setLista(l))
      .catch(() => vivo && setLista([]));
    return () => {
      vivo = false;
    };
    // a função costuma ser recriada a cada render; a lista depende só da UF
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uf, !!buscarPorUf]);

  // cascata: a cidade escolhida sob outra UF deixa de valer
  useEffect(() => {
    if (ufAnterior.current !== uf) {
      ufAnterior.current = uf;
      if (valor) aoMudar?.(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uf]);

  if (!buscarPorUf) {
    return (
      <CampoTexto
        {...p}
        disabled={disabled}
        placeholder={placeholder}
        valor={typeof valor === 'string' ? valor : valor?.nome ?? ''}
        aoMudar={(t) => aoMudar?.(t || null)}
      />
    );
  }

  return (
    <CampoBusca<Municipio>
      {...p}
      disabled={disabled || !uf}
      placeholder={uf ? placeholder : 'Escolha a UF primeiro'}
      minimo={1}
      atraso={0}
      buscar={async (termo) => {
        const t = normalizar(termo);
        return lista.filter((m) => normalizar(m.nome).includes(t)).slice(0, 50);
      }}
      paraRotulo={(m) => m.nome}
      chave={(m) => m.id}
      valor={typeof valor === 'object' ? valor : null}
      aoMudar={aoMudar}
    />
  );
}
