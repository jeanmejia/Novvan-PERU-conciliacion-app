import type { ReactNode } from 'react';
import { fmtDay, fmtMoney, fmtShort, round2, sum } from '../lib/utils';

export type Cell = number | string | null;
export type ColKind = 'date' | 'shortDate' | 'text' | 'qty' | 'money' | 'moneyBold';
export interface HeadCell {
  label: string;
  className: string; // fondo + color de texto
  colSpan?: number;
  rowSpan?: number;
}

export const cantMonto = (className: string): HeadCell[] => [
  { label: 'CANT', className },
  { label: 'MONTO', className },
];
export const pairs = (n: number): ColKind[] =>
  Array.from({ length: n }, (): ColKind[] => ['qty', 'money']).flat();

const isAmount = (k: ColKind) => k === 'qty' || k === 'money' || k === 'moneyBold';

function show(kind: ColKind, v: Cell): ReactNode {
  if (v === null) return isAmount(kind) ? '-' : '';
  if (typeof v === 'string') {
    return kind === 'date' ? fmtDay(v) : kind === 'shortDate' ? fmtShort(v) : v;
  }
  if (kind === 'qty') return v.toLocaleString('en-US');
  if (kind === 'money' || kind === 'moneyBold') return fmtMoney(v);
  return v;
}

/** Fila de totales: suma cada columna de cantidades y montos. */
export function totalsRow(label: string, rows: Cell[][], cols: ColKind[]): Cell[] {
  return cols.map((k, i) => {
    if (i === 0) return label;
    if (!isAmount(k)) return null;
    const vals = rows.map((r) => r[i]).filter((v): v is number => typeof v === 'number');
    return k === 'qty' && !vals.length ? null : round2(sum(vals));
  });
}

const align = (k: ColKind) => (k === 'money' || k === 'moneyBold' ? 'text-right' : 'text-center');
const weight = (k: ColKind) => (k === 'date' || k === 'moneyBold' ? 'font-bold' : '');
const cell = 'border border-slate-400 px-2 py-1 text-sm whitespace-nowrap tabular-nums';

interface Props {
  headRows: HeadCell[][];
  cols: ColKind[];
  rows: Cell[][];
  footer?: Cell[];
  /** Diferencia ventas − abonos: agrega el recuadro amarillo DIF del Excel. */
  dif?: number;
}

export function GroupedTable({ headRows, cols, rows, footer, dif }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse bg-white">
        <thead>
          {headRows.map((row, r) => (
            <tr key={r}>
              {row.map((h, i) => (
                <th
                  key={i}
                  colSpan={h.colSpan}
                  rowSpan={h.rowSpan}
                  className={`${cell} text-center font-bold ${h.className}`}
                >
                  {h.label}
                </th>
              ))}
              {dif !== undefined && r === 0 && <th rowSpan={headRows.length} className="w-16" />}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((v, i) => (
                <td key={i} className={`${cell} ${align(cols[i])} ${weight(cols[i])}`}>
                  {show(cols[i], v)}
                </td>
              ))}
              {dif !== undefined && (
                <td className="px-2 text-sm font-bold">{r === rows.length - 1 ? 'DIF' : ''}</td>
              )}
            </tr>
          ))}
        </tbody>
        {footer && (
          <tfoot>
            <tr className="bg-slate-100 font-bold">
              {footer.map((v, i) => (
                <td key={i} className={`${cell} ${align(cols[i])}`}>
                  {show(i === 0 ? 'text' : cols[i], v)}
                </td>
              ))}
              {dif !== undefined && (
                <td className="border border-slate-400 bg-dif px-2 py-1 text-right text-sm font-bold tabular-nums">
                  {fmtMoney(dif)}
                </td>
              )}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
