import { GroupedTable, cantMonto, pairs, totalsRow, type Cell, type ColKind, type HeadCell } from '../components/GroupedTable';
import { UploadAbonos } from '../components/UploadAbonos';
import { RETAILERS, redTotal } from '../lib/totals';
import { qm, round2, weekDates } from '../lib/utils';
import { useData } from '../state/DataContext';
import type { ISODate } from '../types';

const W = 'bg-white text-slate-900';
const head: HeadCell[][] = [
  [
    { label: 'FECHA', rowSpan: 3, className: W },
    { label: 'VENTA DE RECARGAS', colSpan: 10, className: W },
    { label: 'ABONOS', rowSpan: 3, className: W },
  ],
  [...RETAILERS.map(([label]) => ({ label, colSpan: 2, className: W })), { label: 'TOTALES', colSpan: 2, className: W }],
  Array.from({ length: 5 }, () => cantMonto(W)).flat(),
];
const cols: ColKind[] = ['date', ...pairs(4), 'qty', 'moneyBold', 'money'];

export function RedRecargas({ day }: { day: ISODate }) {
  const { sales, abonos } = useData();

  const rows: Cell[][] = weekDates(day).map((f) => {
    const d = sales.red.find((x) => x.fecha === f);
    // El abono se muestra en la fecha del depósito, no en la de la venta
    return [f, ...RETAILERS.flatMap(([, k]) => qm(d?.[k])), null, d ? redTotal(d) : null, abonos.red[f] ?? 0];
  });
  const footer = totalsRow('Suma:', rows, cols);
  const dif = round2(Number(footer[10]) - Number(footer[11]));

  return (
    <div className="space-y-5">
      <UploadAbonos
        kind="red"
        title="Abonos de la red de recargas"
        hint="Cada fila es un depósito con su FECHA de abono (día hábil) y su MONTO. El abono se asigna al día del depósito y no al de la venta."
      />
      <GroupedTable headRows={head} cols={cols} rows={rows} footer={footer} dif={dif} />
    </div>
  );
}
