/**
 * Ponte entre texto pt-BR (`dd/mm/aaaa`, `HH:mm`) e `Date`.
 * A validação é por ida e volta: `31/04/2026` vira `null`, não 1º de maio.
 */

const p2 = (n: number) => String(n).padStart(2, '0');

/** `dd/mm/aaaa` → `Date`, ou `null` se malformado ou inexistente no calendário. */
export function parseDataBr(s: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((s ?? '').trim());
  if (!m) return null;
  const [d, mes, a] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(a, mes - 1, d);
  return dt.getFullYear() === a && dt.getMonth() === mes - 1 && dt.getDate() === d ? dt : null;
}

export function formatDataBr(d: Date): string {
  return `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** `HH:mm` → `Date` de HOJE com esse horário. */
export function parseHoraBr(s: string): Date | null {
  const m = /^(\d{2}):(\d{2})$/.exec((s ?? '').trim());
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return null;
  const d = new Date();
  d.setHours(Number(m[1]), Number(m[2]), 0, 0);
  return d;
}

export function formatHoraBr(d: Date): string {
  return `${p2(d.getHours())}:${p2(d.getMinutes())}`;
}

/** `dd/mm/aaaa[ HH:mm]` → `Date` (sem hora = 00:00). */
export function parseDataHoraBr(s: string): Date | null {
  const [data, hora] = (s ?? '').trim().split(/\s+/);
  const d = parseDataBr(data ?? '');
  if (!d) return null;
  if (hora) {
    const h = parseHoraBr(hora);
    if (!h) return null;
    d.setHours(h.getHours(), h.getMinutes(), 0, 0);
  }
  return d;
}

export function formatDataHoraBr(d: Date): string {
  return `${formatDataBr(d)} ${formatHoraBr(d)}`;
}

/** ISO `aaaa-mm-dd` (valor do `CampoData`) → `dd/mm/aaaa`. Vazio se não for ISO. */
export function isoParaDataBr(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}

/** `dd/mm/aaaa` → ISO `aaaa-mm-dd` (para o `CampoData`). Vazio se a data não existir. */
export function dataBrParaIso(s: string): string {
  const d = parseDataBr(s);
  return d ? `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}` : '';
}
