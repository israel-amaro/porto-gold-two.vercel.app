import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, MapPin, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdministrativo } from '../hooks/useAdministrativo';
import { AGENDA_ROLES, CompromissoPorto, dataLocal } from '../utils/administrativo';

export default function AgendaPorto() {
  const { temPermissao } = useAuth();
  const allowed = temPermissao(AGENDA_ROLES);
  const agenda = useAdministrativo<CompromissoPorto>('agendaPorto', allowed);
  const dialog = useRef<HTMLDialogElement>(null);
  const [date, setDate] = useState(dataLocal());
  useEffect(() => { if (!allowed) dialog.current?.close(); }, [allowed]);
  if (!allowed) return null;
  const events = agenda.items.filter(item => item.data === date).sort((a, b) => a.inicio.localeCompare(b.inicio));
  const todayCount = agenda.items.filter(item => item.data === dataLocal()).length;
  return <>
    <button type="button" onClick={() => dialog.current?.showModal()} className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-[10px] font-bold uppercase text-[#0F2A52] hover:bg-blue-100">
      <CalendarDays size={16} /> Agenda do Porto {todayCount > 0 && <span className="rounded-full bg-[#0F2A52] px-2 text-white">{todayCount}</span>}
    </button>
    <dialog ref={dialog} aria-labelledby="agenda-porto-title" className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh w-full max-w-md border-0 bg-[#F8FAFC] p-0 text-[#0F2A52] shadow-2xl backdrop:bg-slate-950/40" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <div className="min-h-full p-6">
        <div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[#F4901E]">Compromissos da unidade</p><h2 id="agenda-porto-title" className="text-2xl font-black">Agenda do Porto</h2></div><button autoFocus aria-label="Fechar agenda" onClick={() => dialog.current?.close()} className="rounded-xl p-2 hover:bg-slate-200"><X /></button></div>
        <label className="block text-sm font-bold">Consultar data<input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white p-3" /></label>
        <button className="my-4 text-sm font-bold text-blue-700" onClick={() => setDate(dataLocal())}>Voltar para hoje</button>
        {agenda.loading ? <p role="status">Carregando agenda…</p> : agenda.error ? <p role="alert" className="text-red-700">{agenda.error}</p> : events.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center"><CalendarDays className="mx-auto mb-3 text-slate-400" /><p className="font-bold">Nenhum compromisso nesta data</p><p className="mt-2 text-sm text-slate-500">Os compromissos publicados pelo Administrativo aparecem aqui.</p></div> : <div className="space-y-3">{events.map(item => <article key={item.id} className="rounded-2xl border border-slate-200 border-l-4 border-l-[#F4901E] bg-white p-5"><p className="text-xs font-bold text-blue-700">{item.inicio} — {item.fim}</p><h3 className="mt-1 break-words text-lg font-bold">{item.titulo}</h3>{item.local && <p className="mt-2 flex items-center gap-2 text-sm"><MapPin size={14} />{item.local}</p>}{item.descricao && <p className="mt-3 whitespace-pre-wrap break-words text-sm text-slate-500">{item.descricao}</p>}</article>)}</div>}
      </div>
    </dialog>
  </>;
}
