import { useState, type ChangeEvent } from 'react';
import { useData, type AbonosKind } from '../state/DataContext';

interface Props {
  kind: AbonosKind;
  title: string;
  hint: string;
}

export function UploadAbonos({ kind, title, hint }: Props) {
  const { upload } = useData();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const n = await upload(kind, file);
      setMsg({ ok: true, text: `${n} día(s) de abonos cargados desde ${file.name}.` });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'No se pudo leer el archivo.' });
    } finally {
      e.target.value = '';
    }
  }

  return (
    <section className="rounded border border-slate-300 bg-white p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1 max-w-3xl text-sm text-slate-600">{hint}</p>
      <label className="mt-3 inline-block cursor-pointer rounded bg-sem px-3 py-1.5 text-sm font-medium text-white focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sem">
        Subir archivo (.xls, .xlsx)
        <input type="file" accept=".xls,.xlsx" onChange={onFile} className="sr-only" />
      </label>
      {msg && (
        <p role="status" className={`mt-2 text-sm ${msg.ok ? 'text-green-700' : 'text-red-700'}`}>
          {msg.text}
        </p>
      )}
    </section>
  );
}
