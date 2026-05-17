"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  User, 
  Shield, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Star, 
  CheckCircle2, 
  Bell, 
  Settings, 
  LogOut, 
  FileText, 
  MessageSquare,
  ArrowUpRight,
  Zap,
  ChevronRight
} from "lucide-react";

export default function DashboardPro() {
  const [nombre, setNombre] = useState("Profesional");
  const [especialidad, setEspecialidad] = useState("Desarrollo de Software");
  const [avatar, setAvatar] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tarifa, setTarifa] = useState("35");
  const [experiencia, setExperiencia] = useState("3");
  const [certificadosCount, setCertificadosCount] = useState("1");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read details from localStorage set during verification
    const savedName = localStorage.getItem("userName");
    const savedRole = localStorage.getItem("userRole");
    const savedSpec = localStorage.getItem("proSpecialty");
    const savedAv = localStorage.getItem("proAvatar");
    const savedDesc = localStorage.getItem("proDescription");
    const savedTarifa = localStorage.getItem("proTarifa");
    const savedExp = localStorage.getItem("proExperiencia");
    const savedCertCount = localStorage.getItem("proCertificadosCount");

    if (savedName) setNombre(savedName);
    if (savedSpec) setEspecialidad(savedSpec);
    if (savedAv) setAvatar(savedAv);
    if (savedDesc) setDescripcion(savedDesc);
    if (savedTarifa) setTarifa(savedTarifa);
    if (savedExp) setExperiencia(savedExp);
    if (savedCertCount) setCertificadosCount(savedCertCount);
    
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9ff]">
        <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#f8f9ff] font-plus-jakarta pb-16">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 right-0 h-[280px] bg-gradient-to-b from-[#E0F2FE]/60 to-transparent -z-10" />
      
      {/* Top Navbar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-sky-50 py-4 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold shadow-sm">T</span>
            <span className="text-lg font-bold text-[#0d1c2e] tracking-tight">TrustMarket Pro</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full hover:scale-105 transition-all">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white animate-pulse" />
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-full border border-pink-100 transition-all hover:scale-[1.02]"
            >
              <LogOut size={14} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 pt-8 grid lg:grid-cols-12 gap-8">
        
        {/* Header Hero Area */}
        <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 backdrop-blur-md border border-white p-6 rounded-[28px] shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-sky-600 uppercase tracking-widest">Panel Profesional</span>
              <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                <Shield size={10} className="fill-emerald-700 text-white" /> Verificado Premium
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0d1c2e] mt-1 tracking-tight">
              ¡Bienvenido de nuevo, {nombre}!
            </h1>
            <p className="text-sm text-slate-500 font-semibold mt-0.5">
              Tu perfil está activo y visible para miles de clientes que buscan servicios profesionales en Latinoamérica.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-4.5 py-3 bg-[#0d1c2e] hover:bg-black text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-[0.98]">
              <Zap size={14} className="text-amber-300 fill-amber-300" />
              <span>Ver Ofertas Activas</span>
            </button>
          </div>
        </div>

        {/* Left Side: Stats and Performance Grid */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Key Metrics Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
              <div className="flex justify-between items-center text-slate-400">
                <DollarSign size={20} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ingresos</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-[#0d1c2e]">$1,480.00</span>
                <span className="text-[9px] font-bold text-emerald-600">+$350 esta semana</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
              <div className="flex justify-between items-center text-slate-400">
                <Briefcase size={20} className="text-sky-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Trabajos</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-[#0d1c2e]">4 Activos</span>
                <span className="text-[9px] font-bold text-sky-600">2 Contratos firmados</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
              <div className="flex justify-between items-center text-slate-400">
                <Star size={20} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Calificación</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-[#0d1c2e]">5.0</span>
                <span className="text-[9px] font-bold text-amber-600">100% comentarios pos.</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
              <div className="flex justify-between items-center text-slate-400">
                <Clock size={20} className="text-pink-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Respuesta</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-[#0d1c2e]">12 Min</span>
                <span className="text-[9px] font-bold text-emerald-600">Tiempo de respuesta rápido</span>
              </div>
            </div>

          </div>

          {/* Active Projects Timeline */}
          <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#0d1c2e]">Tus Proyectos Activos</h3>
                <p className="text-xs text-slate-400">Seguimiento de contratos protegidos con garantía TrustMarket</p>
              </div>
              <button className="text-xs font-bold text-sky-600 hover:underline">Ver todo</button>
            </div>

            <div className="space-y-4">
              
              {/* Project Item 1 */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold shrink-0">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0d1c2e]">Desarrollo de Dashboard Corporativo</h4>
                    <p className="text-xs text-slate-400">Cliente: Inmobiliaria Andina • Contrato digital firmado con IA</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="text-right">
                    <span className="block text-sm font-extrabold text-[#0d1c2e]">$850.00</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Protegido en Escrow</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 hidden md:block" />
                </div>
              </div>

              {/* Project Item 2 */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 font-bold shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0d1c2e]">Auditoría de Sistemas Cloud & Seguridad</h4>
                    <p className="text-xs text-slate-400">Cliente: Startup Tech Solutions • Hito 1 Completado</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="text-right">
                    <span className="block text-sm font-extrabold text-[#0d1c2e]">$630.00</span>
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">Liberación en Progreso</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 hidden md:block" />
                </div>
              </div>

            </div>
          </div>

          {/* Security & Reputational Trust Center */}
          <div className="bg-gradient-to-br from-[#0d1c2e] to-slate-900 text-white rounded-[28px] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-sky-500/10 rounded-full blur-xl" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold tracking-widest uppercase">
                  <Shield size={14} className="fill-sky-400/20" />
                  <span>Seguridad de Contratos Inteligentes</span>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">
                  Tus fondos están protegidos mediante depósito en garantía (Escrow).
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  En TrustMarket, el cliente deposita el pago por adelantado. Una vez finalizado el trabajo, el dinero se deposita directamente en tu cuenta bancaria de forma 100% automática y transparente.
                </p>
              </div>

              <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center w-full md:w-36">
                <span className="text-xs font-bold text-slate-300">Nivel de Confianza</span>
                <span className="text-3xl font-extrabold text-sky-400 mt-1">AAA</span>
                <span className="text-[9px] font-semibold text-emerald-400 mt-0.5">Excelente Historial</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Professional Identity Card */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Real-time Dynamic Profile Card */}
          <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#0d1c2e] uppercase tracking-wider">Tu Identidad en la Red</h3>
              <span className="text-[10px] font-bold text-slate-400">Verificado</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-md bg-slate-100">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={36} />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <CheckCircle2 size={14} className="fill-emerald-500 text-white" />
                </div>
              </div>

              <h4 className="text-lg font-bold text-[#0d1c2e]">{nombre}</h4>
              <span className="text-xs font-semibold text-sky-600 px-3 py-1 bg-sky-50 rounded-full mt-1 border border-sky-100/50">
                {especialidad}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-4 text-center">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experiencia</span>
                <span className="text-base font-extrabold text-[#0d1c2e]">{experiencia} Años</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarifa por Hora</span>
                <span className="text-base font-extrabold text-emerald-600">${tarifa}/hr</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biografía Comercial</span>
              <p className="text-xs text-[#5e6f79] font-medium leading-relaxed italic bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                {descripcion || "No has ingresado ninguna descripción sobre en qué trabajas."}
              </p>
            </div>

            {/* Checklist of Credentials */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estatus de Auditoría Técnica</span>
              
              <div className="space-y-2 text-xs font-medium">
                <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Identificación Oficial Aprobada</span>
                  </div>
                  <span className="text-[9px] font-bold">100%</span>
                </div>

                <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Hoja de Vida Validada con IA</span>
                  </div>
                  <span className="text-[9px] font-bold">100%</span>
                </div>

                <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>{certificadosCount} Certificado(s) Activo(s)</span>
                  </div>
                  <span className="text-[9px] font-bold">Verificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
