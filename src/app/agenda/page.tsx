"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Plus, 
  CheckCircle, 
  Clock, 
  User, 
  Briefcase, 
  ShieldCheck, 
  ArrowLeft,
  X,
  PlusCircle,
  TrendingUp
} from "lucide-react";

// ── Interfaces ──────────────────────────────────────────────────────────────
interface EventItem {
  id: string;
  time: string;
  period: "AM" | "PM";
  title: string;
  client: string;
  clientType: "person" | "corp";
  status: "completed" | "pending";
}

type EventsMap = Record<number, EventItem[]>;

// ── Initial Mock Data ────────────────────────────────────────────────────────
const INITIAL_EVENTS: EventsMap = {
  3: [
    { id: "e1", time: "05:00", period: "PM", title: "Revisión de Términos", client: "Javier Solís", clientType: "person", status: "pending" }
  ],
  7: [
    { id: "e2", time: "09:00", period: "AM", title: "Auditoría de Landing Page", client: "Elena Varas", clientType: "person", status: "completed" },
    { id: "e3", time: "02:30", period: "PM", title: "Consultoría AWS Express", client: "Carlos Gómez", clientType: "person", status: "completed" }
  ],
  9: [
    { id: "e4", time: "11:00", period: "AM", title: "Configuración AWS ASG", client: "Carlos Gómez", clientType: "person", status: "pending" }
  ],
  11: [
    { id: "e5", time: "10:30", period: "AM", title: "Alineación SEO WordPress", client: "Sofía Beltrán", clientType: "person", status: "pending" }
  ]
};

export default function WorkAgendaPage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number>(7);
  const [events, setEvents] = useState<EventsMap>(INITIAL_EVENTS);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  
  // Modal states for creating a new event
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("09:00");
  const [newEventClient, setNewEventClient] = useState("");
  const [newEventDay, setNewEventDay] = useState<number>(7);
  const [newEventClientType, setNewEventClientType] = useState<"person" | "corp">("person");

  // User details load
  const [userName, setUserName] = useState("Elena Martínez");
  const [userAvatar, setUserAvatar] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuCK3_JnyJWRxCmrlviTSm-rKEiZuojrmB0WnnB5BvKsFCJGaFfPzGS5kqHNzeytLq_ePt1prTwKyyyZEHJWSMcF_AsRvUBpRu0SFpx_B_DJ3vDJf9hadi1R8-M9GSIGKGAomltp3WiaaHjAoNQeAapDKCNtKi_MaYuEPjC2tmM8RH4_6sp2ZplEGJxr7lXyoKpPusP-UsG8cpb_P25zBtc5E6WK8cCfF9uPALOa2AaV7OYrpOupKde8gtqeeGqvE8kX_HNDp4T0kg");

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedName) setUserName(savedName);
    if (savedAvatar) setUserAvatar(savedAvatar);
  }, []);

  const handleToggleStatus = (day: number, id: string) => {
    setEvents(prev => {
      const dayEvents = prev[day] || [];
      const updated: EventItem[] = dayEvents.map(evt => {
        if (evt.id === id) {
          return { ...evt, status: evt.status === "completed" ? "pending" : "completed" };
        }
        return evt;
      });
      return { ...prev, [day]: updated };
    });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventClient.trim()) return;

    const timeParts = newEventTime.split(":");
    const hour = parseInt(timeParts[0]);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedTime = newEventTime;

    const newEvent: EventItem = {
      id: Math.random().toString(36).substring(2, 9),
      time: formattedTime,
      period,
      title: newEventTitle.trim(),
      client: newEventClient.trim(),
      clientType: newEventClientType,
      status: "pending"
    };

    setEvents(prev => {
      const existing = prev[newEventDay] || [];
      return { ...prev, [newEventDay]: [...existing, newEvent] };
    });

    // Reset fields & close
    setNewEventTitle("");
    setNewEventClient("");
    setIsModalOpen(false);
    setSelectedDay(newEventDay);
  };

  // Build Calendar Days for October 2024
  // October 1st, 2024 was a Tuesday. So we have 2 empty cells (Sun, Mon) in the first row.
  const emptySlots = 2; 
  const totalDays = 31;
  const calendarCells = [];

  for (let i = 0; i < emptySlots; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    calendarCells.push(d);
  }

  // Filter events of the selected day
  const dayEvents = events[selectedDay] || [];
  const filteredEvents = dayEvents.filter(evt => {
    if (filter === "completed") return evt.status === "completed";
    if (filter === "pending") return evt.status === "pending";
    return true;
  });

  return (
    <div className="min-h-screen w-screen bg-[#f8f9ff] flex flex-col font-plus-jakarta pb-28 select-none">
      
      {/* ── Navbar Superior ─────────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-sky-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-base font-black text-[#0d1c2e] leading-none">Portal del Profesional</h1>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Agenda de Confianza</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-[#0d1c2e]">{userName}</p>
              <p className="text-[10px] text-pink-600 font-extrabold uppercase tracking-widest mt-0.5">Nivel Premium</p>
            </div>
            <img 
              alt="Perfil" 
              className="w-10 h-10 rounded-full border-2 border-pink-100 object-cover shadow-sm" 
              src={userAvatar}
            />
          </div>
        </div>
      </header>

      {/* ── Main Content Container ───────────────────────────────────────────── */}
      <main className="pt-24 px-6 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Welcome Banner and CTAs */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
          <div>
            <span className="font-label-caps text-slate-400 uppercase tracking-widest text-[10px] font-black">Planificador Mensual</span>
            <h2 className="text-2xl font-black text-[#0d1c2e] mt-1">Mi Agenda de Trabajo</h2>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200/50">
              <Download size={14} />
              <span>Exportar</span>
            </button>
            <button 
              onClick={() => {
                setNewEventDay(selectedDay);
                setIsModalOpen(true);
              }}
              className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-pink-100 flex items-center justify-center gap-1.5"
            >
              <Plus size={14} />
              <span>Nuevo Evento</span>
            </button>
          </div>
        </section>

        {/* Dashboard Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: The Interactive Calendar */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-md shadow-slate-100/50 border border-sky-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-black text-[#0d1c2e]">Octubre 2024</h3>
                <div className="flex items-center bg-slate-50 rounded-full p-1 border border-slate-100">
                  <button className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full transition-all text-slate-500"><ChevronLeft size={16} /></button>
                  <button className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full transition-all text-slate-500"><ChevronRight size={16} /></button>
                </div>
              </div>
              <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completado</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-400"></span> Pendiente</div>
              </div>
            </div>

            {/* Calendar Grid Header */}
            <div className="grid grid-cols-7 text-center font-bold text-slate-400 text-xs mb-3 px-1">
              <span>DOM</span><span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span><span>VIE</span><span>SAB</span>
            </div>

            {/* Grid of October 2024 Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="aspect-square rounded-2xl bg-slate-50/20" />;
                }

                const dayHasEvents = events[day] && events[day].length > 0;
                const hasPending = dayHasEvents && events[day].some(e => e.status === "pending");
                const hasCompleted = dayHasEvents && events[day].every(e => e.status === "completed");
                const isSelected = selectedDay === day;

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-2xl border flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                      isSelected 
                        ? "border-[#D81B60] bg-[#FCE4EC]/35 ring-2 ring-[#D81B60]/20" 
                        : "border-slate-100 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className={`text-xs md:text-sm font-extrabold ${
                      isSelected ? "text-[#D81B60]" : "text-[#0d1c2e]"
                    }`}>
                      {day}
                    </span>

                    {/* Action marker dot */}
                    {dayHasEvents && (
                      <div className="absolute bottom-2 flex gap-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          hasPending ? "bg-pink-400" : "bg-emerald-400"
                        }`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Day's Tasks and Financial Actions */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Today's Tasks */}
            <div className="bg-white rounded-3xl p-6 shadow-md shadow-slate-100/50 border border-sky-50 flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h4 className="text-base font-black text-[#0d1c2e]">Tareas del Día</h4>
                  <p className="text-[10px] font-extrabold text-pink-600 uppercase tracking-widest mt-1">
                    {selectedDay} de Octubre, 2024
                  </p>
                </div>
                
                {/* Filter Toggles */}
                <div className="flex bg-slate-50 p-0.5 rounded-lg border border-slate-100 text-[9px] font-black uppercase tracking-wider">
                  <button 
                    onClick={() => setFilter("all")}
                    className={`px-2 py-1 rounded-md transition-colors ${filter === "all" ? "bg-white text-[#0d1c2e] shadow-sm" : "text-slate-400"}`}
                  >
                    Todo
                  </button>
                  <button 
                    onClick={() => setFilter("pending")}
                    className={`px-2 py-1 rounded-md transition-colors ${filter === "pending" ? "bg-white text-[#0d1c2e] shadow-sm" : "text-slate-400"}`}
                  >
                    Pend.
                  </button>
                </div>
              </div>

              {/* Task Items List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-10 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                    <Clock size={20} className="text-slate-300 mb-2" />
                    <p className="text-xs text-slate-400 font-bold">Sin tareas programadas</p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="text-[10px] font-extrabold text-pink-500 hover:text-pink-600 mt-2 flex items-center gap-1"
                    >
                      <PlusCircle size={10} /> Añadir tarea
                    </button>
                  </div>
                ) : (
                  filteredEvents.map((evt) => (
                    <div 
                      key={evt.id}
                      onClick={() => handleToggleStatus(selectedDay, evt.id)}
                      className={`flex gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                        evt.status === "completed"
                          ? "bg-slate-50/70 border-slate-100/70 opacity-75"
                          : "bg-white border-sky-100 hover:border-pink-200 hover:shadow-sm"
                      }`}
                    >
                      <div className={`flex flex-col items-center justify-center border-r pr-3 min-w-[44px] ${
                        evt.status === "completed" ? "border-slate-200" : "border-sky-50"
                      }`}>
                        <span className={`text-xs font-black ${
                          evt.status === "completed" ? "text-slate-400" : "text-slate-800"
                        }`}>{evt.time}</span>
                        <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">{evt.period}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h5 className={`text-xs font-black truncate ${
                          evt.status === "completed" ? "text-slate-400 line-through" : "text-[#0d1c2e]"
                        }`}>
                          {evt.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1 truncate">
                          {evt.clientType === "corp" ? <Briefcase size={10} /> : <User size={10} />}
                          <span>{evt.client}</span>
                        </p>
                      </div>

                      <div className="flex items-center shrink-0">
                        <CheckCircle 
                          size={18} 
                          className={`transition-colors ${
                            evt.status === "completed" 
                              ? "text-emerald-500 fill-emerald-50" 
                              : "text-slate-200 hover:text-pink-300"
                          }`} 
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Financial Protected Action Banner */}
            <div className="bg-gradient-to-br from-[#0d1c2e] to-[#1a2d42] text-white p-6 rounded-3xl shadow-lg border border-white/10 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Garantía Protegida</p>
                </div>
                <h4 className="text-sm font-extrabold leading-snug mb-3">Tienes 3 contratos activos en custodia Escrow.</h4>
                <p className="text-[11px] text-slate-300 font-medium mb-4">Los fondos están resguardados hasta la entrega final.</p>
                <button 
                  onClick={() => router.push("/dashboard-pro")}
                  className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-pink-900/30 flex items-center justify-center gap-1.5"
                >
                  <TrendingUp size={14} />
                  Revisar Garantías
                </button>
              </div>
              
              {/* Glow decoration */}
              <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-pink-500/10 rounded-full blur-2xl" />
            </div>
            
          </div>
        </div>
      </main>

      {/* ── Modal Dialog for creating a new Event ────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-sky-50 animate-fadeIn">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-pink-500" />
                <h3 className="text-base font-black text-[#0d1c2e]">Crear Nuevo Evento</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Día del Evento</label>
                <select 
                  value={newEventDay}
                  onChange={(e) => setNewEventDay(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-pink-300"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d} de Octubre</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Título del Evento</label>
                <input 
                  type="text" 
                  placeholder="Ej: Entrega de Mockups, Configuración..."
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-pink-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Hora (24h)</label>
                  <input 
                    type="time" 
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-pink-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tipo de Cliente</label>
                  <select 
                    value={newEventClientType}
                    onChange={(e) => setNewEventClientType(e.target.value as "person" | "corp")}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-pink-300"
                  >
                    <option value="person">Persona</option>
                    <option value="corp">Corporación</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nombre del Cliente / Empresa</label>
                <input 
                  type="text" 
                  placeholder="Ej: Sofía Beltrán, Javier..."
                  value={newEventClient}
                  onChange={(e) => setNewEventClient(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-pink-300"
                  required
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-pink-100"
                >
                  Añadir Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Navigation Bottom Bar ────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-8 bg-white/90 backdrop-blur-xl border-t border-sky-50 shadow-[0_-10px_40px_rgba(13,28,46,0.06)] rounded-t-[32px] z-40">
        <div className="flex justify-around items-center w-full max-w-lg mx-auto">
          {/* Perfil */}
          <a 
            href="/perfil-y-editor-de-servicios-2" 
            className="flex flex-col items-center justify-center text-slate-400 hover:text-[#0d1c2e] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">account_circle</span>
            <span className="text-[10px] font-semibold mt-1">Perfil</span>
          </a>

          {/* Dashboard */}
          <a 
            href="/dashboard-pro" 
            className="flex flex-col items-center justify-center text-slate-400 hover:text-[#0d1c2e] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">analytics</span>
            <span className="text-[10px] font-semibold mt-1">Dashboard</span>
          </a>

          {/* Mapa */}
          <a 
            href="/mapa-expertos" 
            className="flex flex-col items-center justify-center text-slate-400 hover:text-[#0d1c2e] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">map</span>
            <span className="text-[10px] font-semibold mt-1">Mapa</span>
          </a>

          {/* Agenda (Active - Pink style matching requested bottom nav layout) */}
          <a 
            href="#" 
            className="flex flex-col items-center justify-center text-[#D81B60] bg-[#FCE4EC]/85 rounded-2xl px-5 py-2 cursor-pointer transition-all border border-[#FCE4EC]/40"
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
            <span className="text-[10px] font-bold mt-1">Agenda</span>
          </a>

          {/* Mensajes */}
          <a 
            href="/chat" 
            className="flex flex-col items-center justify-center text-slate-400 hover:text-[#0d1c2e] transition-colors cursor-pointer relative"
          >
            <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
            <span className="text-[10px] font-semibold mt-1">Mensajes</span>
          </a>
        </div>
      </nav>

      {/* Font & Keyframes imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
