/** Utilitários de JWT (só leitura do payload — NÃO confere assinatura). */

/** Decodifica o payload (Base64Url, aceita acentos); `null` se malformado. */
export function decodificarJwt<T = Record<string, unknown>>(token: string): T | null {
  const partes = (token ?? '').split('.');
  if (partes.length !== 3) return null;
  try {
    const b64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '='));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}

/** Data de expiração (`exp`), ou `null`. */
export function expiracaoJwt(token: string): Date | null {
  const exp = decodificarJwt<{ exp?: number }>(token)?.exp;
  return typeof exp === 'number' ? new Date(exp * 1000) : null;
}

/** `true` se inválido ou se expira em menos de `margemSegundos` (renovação proativa). */
export function jwtExpirado(token: string, margemSegundos = 0): boolean {
  const exp = expiracaoJwt(token);
  if (!exp) return true;
  return exp.getTime() - Date.now() < margemSegundos * 1000;
}

/** Limita a margem de renovação à metade da vida do token. */
export function margemRefreshJwt(token: string, margemSegundos: number): number {
  const p = decodificarJwt<{ exp?: number; iat?: number }>(token);
  if (!p || typeof p.exp !== 'number' || typeof p.iat !== 'number' || p.exp <= p.iat) return margemSegundos;
  return Math.min(margemSegundos, (p.exp - p.iat) / 2);
}

/** Convenção de ambiente: `'#'` marca uma API não configurada. */
export function apiDefinida(url: string | null | undefined): url is string {
  return !!url && url !== '#';
}
