import { GroupedTable, cantMonto, pairs, totalsRow, type Cell, type ColKind, type HeadCell } from '../components/GroupedTable';
import { UploadAbonos } from '../components/UploadAbonos';
import { OB_KEYS, obAbonosTotal, obMonto } from '../lib/totals';
import { qm, round2, weekDates } from '../lib/utils';
import { useData } from '../state/DataContext';
import type { ISODate } from '../types';

const C = 'bg-ctga text-white';
const J = 'bg-cjmf text-white';
const P = 'bg-cpab text-white';
const W = 'bg-white text-slate-900';
const A = 'bg-abono text-white';
const PASAJE = 'VENTA DE PASAJE';
const RECARGA = 'VENTA DE RECARGA';

const head: HeadCell[][] = [
  [
    { label: 'FECHA', rowSpan: 4, className: W },
    { label: 'CTGA', colSpan: 4, rowSpan: 2, className: C },
    { label: 'CJMF', colSpan: 2, rowSpan: 2, className: J },
    { label: 'CPAB', colSpan: 8, className: P },
    { label: 'TOTAL SISTEMA', colSpan: 2, rowSpan: 3, className: W },
    { label: 'ABONOS', colSpan: 4, rowSpan: 2, className: A },
    { label: 'TOTAL ABONOS', rowSpan: 4, className: A },
  ],
  [
    { label: 'FUTURO EXPRESS', colSpan: 4, className: P },
    { label: 'NUEVA ALTERNATIVA', colSpan: 4, className: P },
  ],
  [
    { label: PASAJE, colSpan: 2, className: C },
    { label: RECARGA, colSpan: 2, className: C },
    { label: RECARGA, colSpan: 2, className: J },
    { label: PASAJE, colSpan: 2, className: P },
    { label: RECARGA, colSpan: 2, className: P },
    { label: PASAJE, colSpan: 2, className: P },
    { label: RECARGA, colSpan: 2, className: P },
    { label: 'CTGA', rowSpan: 2, className: A },
    { label: 'CJMF', rowSpan: 2, className: A },
    { label: 'CPAB', colSpan: 2, className: A },
  ],
  [
    ...cantMonto(C), ...cantMonto(C), ...cantMonto(J),
    ...cantMonto(P), ...cantMonto(P), ...cantMonto(P), ...cantMonto(P),
    ...cantMonto(W),
    { label: 'FUTURO EXPRESS', className: A },
    { label: 'NUEVA ALTERNATIVA', className: A },
  ],
];
const cols: ColKind[] = ['date', ...pairs(7), 'qty', 'moneyBold', 'money', 'money', 'money', 'money', 'moneyBold'];

export function VentaOB({ day }: { day: ISODate }) {
  const { sales, abonos } = useData();

  const rows: Cell[][] = weekDates(day).map((f) => {
    const d = sales.ob.find((x) => x.fecha === f);
    const a = abonos.ob[f];
    return [
      f,
      ...OB_KEYS.flatMap((k) => qm(d?.v[k])),
      null,
      d ? obMonto(d) : null,
      a?.ctga ?? 0,
      a?.cjmf ?? 0,
      a?.futuro ?? 0,
      a?.nueva ?? 0,
      obAbonosTotal(a),
    ];
  });
  const footer = totalsRow('Total General', rows, cols);
  const dif = round2(Number(footer[15]) - Number(footer[21]));

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">Ventas obtenidas del SSAF, sin incluir MDS.</p>
      <UploadAbonos
        kind="ob"
        title="Abonos de operadores de bus"
        hint="Se suben los miércoles al final del día. Una fila por FECHA con las columnas CTGA, CJMF, FUTURO EXPRESS y NUEVA ALTERNATIVA."
      />
      <GroupedTable headRows={head} cols={cols} rows={rows} footer={footer} dif={dif} />
    </div>
  );
}
