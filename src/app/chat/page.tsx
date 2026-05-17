"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  MessageSquare, 
  Bell, 
  ShieldCheck, 
  CheckCheck, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Lock, 
  Filter,
  FileText,
  Coins,
  Inbox
} from "lucide-react";

// ── Interfaces ──────────────────────────────────────────────────────────────
interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  budget: string;
  status: "active" | "negotiating" | "completed";
  statusText: string;
  type: string;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "escrow" | "signature" | "file" | "price";
  isRead: boolean;
}

// ── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_CHATS: ChatItem[] = [
  {
    id: "job1",
    name: "Elena Varas",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    role: "Cliente • Frontend Developer",
    lastMessage: "¡Claro que sí! Podemos incluir la optimización básica de SEO sin costo adicional.",
    time: "10m",
    unread: true,
    budget: "450 USD",
    status: "active",
    statusText: "Contrato Activo • Custodia en Escrow",
    type: "Figma a Next.js"
  },
  {
    id: "job2",
    name: "Carlos Gómez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    role: "Cliente • AWS Architect",
    lastMessage: "Prefiero crearte un usuario IAM con permisos restringidos a EC2, ASG y Route53.",
    time: "1h",
    unread: false,
    budget: "120 USD",
    status: "active",
    statusText: "Contrato Activo • Custodia en Escrow",
    type: "AWS Support Express"
  },
  {
    id: "job3",
    name: "Sofía Beltrán",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    role: "Cliente • SEO Specialist",
    lastMessage: "Excelente. Me parece un trato justo. Te adjunto el reporte actual de performance.",
    time: "2h",
    unread: false,
    budget: "320 USD",
    status: "active",
    statusText: "Contrato Activo • Custodia en Escrow",
    type: "Lighthouse Performance"
  },
  {
    id: "f1",
    name: "Elena Rodríguez",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200",
    role: "Experto • Diseño de Interiores",
    lastMessage: "He actualizado la oferta formal con un incremento del 15% para cubrir las horas adicionales.",
    time: "Ayer",
    unread: false,
    budget: "1,250 USD",
    status: "negotiating",
    statusText: "En Negociación",
    type: "Diseño y Decoración"
  },
  {
    id: "e1",
    name: "Laura Vásquez",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    role: "Experto • Consultoría Tech",
    lastMessage: "¡Gracias por la entrega! La calidad de los mockups supera nuestras expectativas.",
    time: "5 días",
    unread: false,
    budget: "850 USD",
    status: "completed",
    statusText: "Contrato Completado • Fondos Liberados",
    type: "UX/UI Re-design"
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "Depósito Escrow Confirmado",
    desc: "Elena Varas ha depositado $450.00 USD de forma segura en la billetera multifirma TrustMarket.",
    time: "Hace 10 min",
    type: "escrow",
    isRead: false
  },
  {
    id: "n2",
    title: "Contrato Inteligente Firmado",
    desc: "El contrato para la Asistencia AWS Express ha sido firmado digitalmente por Carlos Gómez.",
    time: "Hace 1 hora",
    type: "signature",
    isRead: false
  },
  {
    id: "n3",
    title: "Auditoría Lighthouse Adjuntada",
    desc: "Sofía Beltrán subió 'Lighthouse_Audit_Initial.pdf' (3.1 MB) en la sala de chat.",
    time: "Hace 2 horas",
    type: "file",
    isRead: true
  },
  {
    id: "n4",
    title: "Nueva Propuesta de Negociación",
    desc: "Elena Rodríguez actualizó la cotización a $1,250 USD debido a requerimientos de soporte post-entrega.",
    time: "Hace 1 día",
    type: "price",
    isRead: true
  }
];

export default function InboxPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"chats" | "notifications">("chats");
  const [chats, setChats] = useState<ChatItem[]>(INITIAL_CHATS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Sync notification badges
  const unreadChatsCount = chats.filter(c => c.unread).length;
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setChats(prev => prev.map(c => ({ ...c, unread: false })));
  };

  const handleChatClick = (id: string) => {
    // Mark as read locally
    setChats(prev => prev.map(c => c.id === id ? { ...c, unread: false } : c));
    router.push(`/chat/${id}`);
  };

  const filteredChats = chats.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen w-screen bg-[#f8f9ff] flex flex-col font-plus-jakarta pb-28 overflow-hidden select-none">
      
      {/* ── Top Header ───────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-sky-50 px-6 py-4 flex items-center justify-between flex-shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black text-[#0d1c2e] leading-none">Centro de Mensajes</h1>
            <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Historial y Garantías</p>
          </div>
        </div>

        <button 
          onClick={handleMarkAllRead}
          className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-[#0d1c2e] rounded-full text-xs font-bold transition-all border border-slate-100/50"
        >
          Marcar todo como leído
        </button>
      </header>

      {/* ── Dynamic Tab Segmented Control ────────────────────────────────────── */}
      <div className="bg-white px-6 py-3 border-b border-sky-50 flex items-center justify-between flex-shrink-0 z-40">
        <div className="flex bg-slate-100 p-1 rounded-full w-full max-w-md border border-slate-200/50 shadow-inner">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeTab === "chats"
                ? "bg-[#0d1c2e] text-white shadow-md"
                : "text-slate-500 hover:text-[#0d1c2e]"
            }`}
          >
            <MessageSquare size={13} />
            <span>Chats de Contratos</span>
            {unreadChatsCount > 0 && (
              <span className="bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded-full leading-none font-black animate-pulse">
                {unreadChatsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeTab === "notifications"
                ? "bg-[#0d1c2e] text-white shadow-md"
                : "text-slate-500 hover:text-[#0d1c2e]"
            }`}
          >
            <Bell size={13} />
            <span>Notificaciones</span>
            {unreadNotificationsCount > 0 && (
              <span className="bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded-full leading-none font-black animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>

        {/* Floating live shield indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 text-[10px] font-extrabold">
          <Lock size={12} />
          <span>CHAT ENCRIPTADO P2P</span>
        </div>
      </div>

      {/* ── Search Bar Filter ────────────────────────────────────────────────── */}
      {activeTab === "chats" && (
        <div className="px-6 py-3 bg-white border-b border-sky-50 flex items-center gap-3 flex-shrink-0">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, tipo de contrato o mensajes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f8f9ff] border border-[#e0f2fe] rounded-full pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e0f2fe] transition-all font-semibold"
            />
          </div>
          <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-100 text-slate-500">
            <Filter size={14} />
          </button>
        </div>
      )}

      {/* ── Main List Container ──────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {activeTab === "chats" ? (
          // Chats tab render
          filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-[#e0f2fe] rounded-full flex items-center justify-center mb-4 text-[#0288D1]">
                <Inbox size={28} />
              </div>
              <h3 className="font-extrabold text-[#0d1c2e] text-base">No se encontraron chats</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Intenta ajustando los términos de búsqueda.</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                className={`group bg-white rounded-2xl border transition-all cursor-pointer p-4 hover:shadow-md hover:border-pink-200 flex gap-4 items-center relative ${
                  chat.unread ? "border-pink-200 bg-[#FCE4EC]/10" : "border-slate-100"
                }`}
              >
                {/* Unread indicator dot */}
                {chat.unread && (
                  <span className="absolute top-4 right-4 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
                )}

                {/* Avatar with dynamic outline */}
                <div className="relative shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center" />
                </div>

                {/* Body Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#0d1c2e] flex items-center gap-1.5">
                        {chat.name}
                        <span className="text-[10px] font-bold text-slate-400">•</span>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{chat.type}</span>
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{chat.role}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">{chat.time}</span>
                  </div>

                  <p className="text-xs text-[#5e6f79] font-medium line-clamp-1 mt-2 pr-6">
                    {chat.lastMessage}
                  </p>

                  {/* Badges bar */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {/* Status Badge */}
                    <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      chat.status === "active" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : chat.status === "negotiating"
                        ? "bg-pink-50 text-pink-700 border border-pink-100"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {chat.status === "active" && <ShieldCheck size={9} />}
                      {chat.statusText}
                    </span>

                    {/* Escrow Value Badge */}
                    <span className="bg-sky-50 text-[#0288D1] border border-sky-100 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                      Presupuesto: {chat.budget}
                    </span>
                  </div>
                </div>

                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#D81B60] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))
          )
        ) : (
          // Notifications Tab Render
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white p-4 rounded-2xl border transition-all flex gap-3.5 items-start ${
                notif.isRead ? "border-slate-100" : "border-pink-200 bg-[#FCE4EC]/5"
              }`}
            >
              {/* Left Dynamic Icon based on Notification Type */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                notif.type === "escrow"
                  ? "bg-emerald-100 text-emerald-600"
                  : notif.type === "signature"
                  ? "bg-pink-100 text-[#D81B60]"
                  : notif.type === "file"
                  ? "bg-sky-100 text-[#0288D1]"
                  : "bg-amber-100 text-amber-600"
              }`}>
                {notif.type === "escrow" && <Coins size={18} />}
                {notif.type === "signature" && <Lock size={18} />}
                {notif.type === "file" && <FileText size={18} />}
                {notif.type === "price" && <Sparkles size={18} />}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-extrabold text-xs text-[#0d1c2e] uppercase tracking-wider">{notif.title}</h4>
                  <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                    <Clock size={11} />
                    <span className="text-[9px] font-bold">{notif.time}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">{notif.desc}</p>

                {/* Secondary Call to Action based on type */}
                {notif.type === "escrow" && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50/50 w-fit px-2 py-0.5 rounded border border-emerald-100/50">
                    <ShieldCheck size={11} />
                    Custodia Asegurada en Blockchain
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {/* ── Navigation Bottom Bar ────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-8 bg-white/90 backdrop-blur-xl border-t border-sky-50 shadow-[0_-10px_40px_rgba(13,28,46,0.06)] rounded-t-[32px] z-50">
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

          {/* Agenda */}
          <a 
            href="/agenda" 
            className="flex flex-col items-center justify-center text-slate-400 hover:text-[#0d1c2e] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">calendar_today</span>
            <span className="text-[10px] font-semibold mt-1">Agenda</span>
          </a>

          {/* Mensajes (Active - Pink style matching requested bottom nav layout) */}
          <a 
            href="#" 
            className="flex flex-col items-center justify-center text-[#D81B60] bg-[#FCE4EC]/85 rounded-2xl px-5 py-2 cursor-pointer transition-all border border-[#FCE4EC]/40"
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
            <span className="text-[10px] font-bold mt-1">Mensajes</span>
          </a>
        </div>
      </nav>

      {/* Font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
      `}</style>
    </div>
  );
}
