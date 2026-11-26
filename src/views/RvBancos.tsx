import { GroupedTable, cantMonto, pairs, totalsRow, type Cell, type ColKind, type HeadCell } from '../components/GroupedTable';
import { UploadAbonos } from '../components/UploadAbonos';
import { BANKS, bancosTotal } from '../lib/totals';
import { qm, round2, weekDates } from '../lib/utils';
import { useData } from '../state/DataContext';
import type { ISODate } from '../types';

const W = 'bg-white text-slate-900';
const G = 'bg-soft-green text-slate-900';
const B = 'bg-soft-blue text-slate-900';
const bankHeads = BANKS.map(([label]) => ({ label, colSpan: 2, className: W }));
const head: HeadCell[][] = [
  [
    { label: 'FECHA', rowSpan: 4, className: W },
    { label: 'VENTA DE RECARGAS VIRTUALES', colSpan: 18, className: G },
    { label: 'ABONOS', rowSpan: 4, className: W },
  ],
  [
    { label: 'TAPEADOS', colSpan: 8, className: B },
    { label: 'NO TAPEADOS', colSpan: 8, className: B },
    { label: 'TOTAL SISTEMA', colSpan: 2, rowSpan: 2, className: W },
  ],
  [...bankHeads, ...bankHeads],
  Array.from({ length: 9 }, () => cantMonto(W)).flat(),
];
const cols: ColKind[] = ['date', ...pairs(8), 'qty', 'moneyBold', 'money'];

export function RvBancos({ day }: { day: ISODate }) {
  const { sales, abonos } = useData();

  const rows: Cell[][] = weekDates(day).map((f) => {
    const d = sales.bancos.find((x) => x.fecha === f);
    return [
      f,
      ...BANKS.flatMap(([, k]) => qm(d?.tapeados[k])),
      ...BANKS.flatMap(([, k]) => qm(d?.noTapeados[k])),
      null,
      d ? bancosTotal(d) : null,
      abonos.bancos[f] ?? 0,
    ];
  });
  const footer = totalsRow('Suma:', rows, cols);
  const dif = round2(Number(footer[18]) - Number(footer[19]));

  return (
    <div className="space-y-5">
      <UploadAbonos
        kind="bancos"
        title="Abonos de RV Bancos"
        hint="Cada fila es un depósito con su FECHA de abono y su MONTO. Se suman en el día que corresponde de la semana consultada."
      />
      <GroupedTable headRows={head} cols={cols} rows={rows} footer={footer} dif={dif} />
    </div>
  );
}
