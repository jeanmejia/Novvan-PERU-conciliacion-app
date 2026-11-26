import * as XLSX from 'xlsx';
import type { AbonosOB, ISODate } from '../types';

const p2 = (n: number) => String(n).padStart(2, '0');
const norm = (s: unknown) => String(s ?? '').trim().toUpperCase();
const num = (v: unknown) =>
  typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^0-9.-]/g, '')) || 0;

function toISODate(v: unknown): ISODate | null {
  if (typeof v === 'number' && v > 20000) {
    const c = XLSX.SSF.parse_date_code(v); // fecha serial de Excel
    return `${c.y}-${p2(c.m)}-${p2(c.d)}`;
  }
  const s = String(v ?? '').trim();
  let m = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(s); // dd/mm/yyyy
  if (m) return `${m[3]}-${p2(+m[2])}-${p2(+m[1])}`;
  m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

async function rowsOf(file: File): Promise<Record<string, unknown>[]> {
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils
    .sheet_to_json<Record<string, unknown>>(ws, { raw: true, defval: null })
    .map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [norm(k), v])));
}

function nonEmpty<T>(out: Record<ISODate, T>, columns: string) {
  if (!Object.keys(out).length) {
    throw new Error(`No se encontraron filas válidas. El archivo debe tener las columnas ${columns}.`);
  }
  return out;
}

/** Red de recargas y RV Bancos: una fila por depósito (FECHA del abono, MONTO). */
export async function parseSimple(file: File): Promise<Record<ISODate, number>> {
  const out: Record<ISODate, number> = {};
  for (const r of await rowsOf(file)) {
    const d = toISODate(r['FECHA']);
    if (d) out[d] = (out[d] ?? 0) + num(r['MONTO']);
  }
  return nonEmpty(out, 'FECHA y MONTO');
}

/** Venta de Recargas OB: una fila por fecha con el abono de cada operador. */
export async function parseOB(file: File): Promise<Record<ISODate, AbonosOB>> {
  const out: Record<ISODate, AbonosOB> = {};
  for (const r of await rowsOf(file)) {
    const d = toISODate(r['FECHA']);
    if (!d) continue;
    const a = (out[d] ??= { ctga: 0, cjmf: 0, futuro: 0, nueva: 0 });
    a.ctga += num(r['CTGA']);
    a.cjmf += num(r['CJMF']);
    a.futuro += num(r['FUTURO EXPRESS']);
    a.nueva += num(r['NUEVA ALTERNATIVA']);
  }
  return nonEmpty(out, 'FECHA, CTGA, CJMF, FUTURO EXPRESS y NUEVA ALTERNATIVA');
}
