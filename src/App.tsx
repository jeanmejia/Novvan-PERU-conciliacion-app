import { useState } from 'react';
import { WeekPicker } from './components/WeekPicker';
import { todayISO } from './lib/utils';
import { useData } from './state/DataContext';
import type { ISODate } from './types';
import { RedRecargas } from './views/RedRecargas';
import { Resumen } from './views/Resumen';
import { RvBancos } from './views/RvBancos';
import { VentaOB } from './views/VentaOB';

const TABS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'red', label: 'Red de recargas' },
  { id: 'bancos', label: 'RV Bancos' },
  { id: 'ob', label: 'Venta de Recargas OB' },
] as const;
type TabId = (typeof TABS)[number]['id'];

export default function App() {
  const { sales } = useData();
  const [tab, setTab] = useState<TabId>('resumen');
  // Arranca en la semana del último día con ventas
  const [day, setDay] = useState<ISODate>(() => sales.red.at(-1)?.fecha ?? todayISO());

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-300 bg-white">
        <div className="mx-auto max-w-[1700px] px-6 pt-5">
          <h1 className="text-xl font-semibold">Control de recargas y abonos</h1>
          <nav role="tablist" aria-label="Vistas" className="mt-4 flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-sem ${
                  tab === t.id ? 'border-sem text-sem' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1700px] space-y-5 px-6 py-6">
        <WeekPicker day={day} onChange={setDay} />
        {tab === 'resumen' && <Resumen day={day} />}
        {tab === 'red' && <RedRecargas day={day} />}
        {tab === 'bancos' && <RvBancos day={day} />}
        {tab === 'ob' && <VentaOB day={day} />}
      </main>
    </div>
  );
}
