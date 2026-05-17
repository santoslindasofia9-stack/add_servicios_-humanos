"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  MapPin, 
  Calendar, 
  Star, 
  ShieldCheck, 
  ChevronRight, 
  Camera, 
  X, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight, 
  Unlock, 
  Bell, 
  Info,
  Menu,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/dashboard/BottomNav";

// Reusable Types
interface Contract {
  id: string;
  proName: string;
  avatar: string;
  category: string;
  date: string;
  amount: string;
  status: "Completado" | "En progreso" | "En revisión";
  desc: string;
}

interface Review {
  id: number;
  proName: string;
  avatar: string;
  category: string;
  date: string;
  stars: number;
  comment: string;
  publishDate: string;
}

const DEFAULT_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuDw-ZTCrIPqnjF5sFLMvL4wpBrJUFCX1TOgGK8ITvhzCBb0Vc8cACs0EksoF88cxj10bvpUSYSzwE6C2sNzfAhvFwjlA9sEKfgLY2CcoTQ_rgVdbWYefpu5BUMd3nuM0881x9QKUJjs2pz9Kudga6_lCIvXqAgZ5WkCCf18CXFXE1vXTmw2NXLFtDybgdxpOXMCVfZerpafcg-jugKCv1sEvtgehLB_hPmzgza6sKAlVRBu19gZU8rlcAGwBBWoNuNmtUw33Ruopg";

const AVATAR_PRESETS = [
  { name: "Mariana Rodríguez (Original)", url: DEFAULT_AVATAR },
  { name: "Sarah Jenkins (Marketing)", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBr7PKkLTLkZtiZc6R7YN01A70SXNomxN6ykcs-mH7V-Et7rS5d8yUVZx3yoyrBqSMpxKTAkyrY2VbEGwTK22uFPObfQXfUYFY96AVlHZyh5uXL07hecOI0GHHGax9RsF3DbhyAX9WgawyfCvmK6MSsvVnY23Nxsl1SI_mEDl5mhVihCF1kWpizNBEyM4mD-hIX8Z3GrXPyjOy4CQi5BCaOfO87HR6pmsL6dDdrcsLoJpYeNHiokz6v-sJ2mzu72uQD0ToW9MT39g" },
  { name: "Elena Varas (Diseño)", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWc_kFd0aemAFl39YK6A86WDQZy9EtY8k_kFwtYsbWZ1-6CjnBpIbAFWF1AM9ck39dCop7Gx73h9-BMcjHkseZNl2e5n-Sxjuhco-zmrwEBqHlyQ7mVNc8bx-t9xZ-XYy1wld7BikSYng8qybJcwiG-NKYgRA01V9O9ZmfTqyJdSDqBBYzpL1nX-w1hcBHwcywCWQ_Ssfyo2FZ8i4OxHoxNDY20FtUWLfr8DdkgJhLSgZoaVVRDbR84AAJ38WvAsjVpwlXSYxW0Q" },
  { name: "David García (Tech)", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8PciBPx8J_AUKCIHBcXBGUlgRG_SmQklphaaOPBS7Io20uuJq9Yqq-LmnM5BE-jHMcSyCpPIvnICQJWKKlKTgI19ULZNR0yb5Zy2WjUz8C9GFMo8ovXVyg3r11ofkBuX3rfH-4GmDWyNrDpT_y2GPaEybrpRNVbFfVCdj5jBUsHDOQlJ4dx1n1IFo4WvjuYtSZiPl6qsw4viIzPKZwxMjTn_4NAFIUWX18Dnqf0EOhnKuC7df6IwgwyT-oAmPAOQZwqp9EHv3YQ" }
];

export default function PerfilPage() {
  const router = useRouter();
  
  // 1. Core Profile States
  const [userName, setUserName] = useState<string>("Mariana Rodríguez");
  const [userAvatar, setUserAvatar] = useState<string>(DEFAULT_AVATAR);
  const [userLocation, setUserLocation] = useState<string>("Ciudad de México (CDMX)");
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  
  // Form Edit States
  const [editName, setEditName] = useState<string>("");
  const [editLocation, setEditLocation] = useState<string>("");
  const [editPhoto, setEditPhoto] = useState<string>("");

  // 2. Interactive Navigation States
  const [activeTab, setActiveTab] = useState<"contratos" | "reseñas" | "escrow">("contratos");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  // Escrow Simulated Funds State
  const [escrowReleased, setEscrowReleased] = useState<boolean>(false);
  const [releasing, setReleasing] = useState<boolean>(false);
  
  // Toast State
  const [toastMessage, setToastMessage] = useState<{ title: string; body: string } | null>(null);

  // Initialize and Seed Profile Data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("userName");
      const savedAvatar = localStorage.getItem("userAvatar");
      const savedLocation = localStorage.getItem("userLocation");

      if (savedName) setUserName(savedName);
      else localStorage.setItem("userName", "Mariana Rodríguez");

      if (savedAvatar) setUserAvatar(savedAvatar);
      else localStorage.setItem("userAvatar", DEFAULT_AVATAR);

      if (savedLocation) setUserLocation(savedLocation);
      else localStorage.setItem("userLocation", "Ciudad de México (CDMX)");
    }
  }, []);

  // Show customized Toast notifications
  const triggerToast = (title: string, body: string) => {
    setToastMessage({ title, body });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle manual saving
  const handleSaveProfile = () => {
    if (!editName.trim()) {
      alert("Por favor introduce un nombre válido.");
      return;
    }
    setUserName(editName);
    setUserLocation(editLocation);
    setUserAvatar(editPhoto);
    
    localStorage.setItem("userName", editName);
    localStorage.setItem("userLocation", editLocation);
    localStorage.setItem("userAvatar", editPhoto);

    setIsEditOpen(false);
    triggerToast("Perfil Actualizado", "Tus datos personales y foto de avatar se han guardado con éxito.");
  };

  // Process Custom File uploads to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditPhoto(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Release Escrow payment
  const handleReleaseEscrow = () => {
    setReleasing(true);
    setTimeout(() => {
      setReleasing(false);
      setEscrowReleased(true);
      triggerToast(
        "Pago Autorizado", 
        "El saldo en garantía de $1,224.00 ha sido transferido de forma segura a la cuenta de Alex Martínez."
      );
    }, 1500);
  };

  // Data mocks
  const trabajos: Contract[] = [
    {
      id: "TL-88902-MX",
      proName: "Carlos Mendoza",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLfMkE0eIjiorpTX7KHrhhNVU5H8sfQ91m-dTGBkgScoChIpAdGqqpGqdOA2RA0zzp-r9S1Bf18i9sHg1DyFmGqFksmDeb9Q1R5aohsKkGi5-iedYVECItlTDvBs08zyOfFyWQU2xD52GIxwo9UMSkuyIdtJcux8Ifklbj-fWCB1QMgHCv-MEzegoUUbuAPiV29v3IArh25MXHCfkA9gvU6zPqRgZoW54o1_sA2utOEobe1PQEMh09AsXfWu4rUIcDiNWJBQg0Mg",
      category: "Diseño de Interiores",
      date: "Noviembre, 2023",
      amount: "$840.00 USD",
      status: "Completado",
      desc: "Proyecto de remodelación conceptual de la sala principal y pasillo de entrada. Incluye modelado 3D, paleta de colores sugerida, lista de compras de mobiliario comercial, y dos revisiones completas sobre el plano original."
    },
    {
      id: "TL-74391-US",
      proName: "Elena Varas",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWc_kFd0aemAFl39YK6A86WDQZy9EtY8k_kFwtYsbWZ1-6CjnBpIbAFWF1AM9ck39dCop7Gx73h9-BMcjHkseZNl2e5n-Sxjuhco-zmrwEBqHlyQ7mVNc8bx-t9xZ-XYy1wld7BikSYng8qybJcwiG-NKYgRA01V9O9ZmfTqyJdSDqBBYzpL1nX-w1hcBHwcywCWQ_Ssfyo2FZ8i4OxHoxNDY20FtUWLfr8DdkgJhLSgZoaVVRDbR84AAJ38WvAsjVpwlXSYxW0Q",
      category: "Consultoría Financiera",
      date: "Octubre, 2023",
      amount: "$1,550.00 USD",
      status: "Completado",
      desc: "Revisión tributaria anual, auditoría de flujo de caja para e-commerce e integración de modelos financieros automatizados. Se entregaron tres plantillas de cálculo dinámicas y un informe corporativo detallado de mitigación de riesgo."
    },
    {
      id: "TL-62044-ES",
      proName: "Roberto Sánchez",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaB0pHqFtfXILqLbDfWCrSVVQ87Ob-0lfgrZfGjCPWfJC2R1cF_PBJcLNpxRk9_Xg81KwZbdhbdqM5ShsazjdnKhPg0je0oaAqdWDrMl0OmyutJ21EQ1-WFqkEWp4Eonzlv66A5aJElEI9wPhypaCh6W5nGoDksmY7_LaiE00PS6dGZXFR8SQAjz4cqYr34LTf6kvZtbTTk9UuNvOJGO38DEkDcvU2NLEUsHrlPkfVvolMeuYO5vjFrY1MEJr3VsGYU38rCjeI2A",
      category: "Fotografía Comercial",
      date: "Septiembre, 2023",
      amount: "$620.00 USD",
      status: "Completado",
      desc: "Sesión fotográfica de producto en estudio para catálogo digital. Incluye 24 tomas retocadas digitalmente en alta resolución, optimización de balances lumínicos y derechos de explotación comercial exclusivos para redes sociales."
    },
    {
      id: "TL-55102-MX",
      proName: "Sofía Castillo",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
      category: "Redacción y Contenidos",
      date: "Agosto, 2023",
      amount: "$320.00 USD",
      status: "Completado",
      desc: "Elaboración de 8 artículos educativos especializados de 1,200 palabras cada uno, enfocados en SEO y experiencia de usuario. Temas: finanzas personales, microinversiones e introducción a fondos colectivos de ahorro."
    }
  ];

  const reseñas: Review[] = [
    {
      id: 1,
      proName: "Carlos Mendoza",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLfMkE0eIjiorpTX7KHrhhNVU5H8sfQ91m-dTGBkgScoChIpAdGqqpGqdOA2RA0zzp-r9S1Bf18i9sHg1DyFmGqFksmDeb9Q1R5aohsKkGi5-iedYVECItlTDvBs08zyOfFyWQU2xD52GIxwo9UMSkuyIdtJcux8Ifklbj-fWCB1QMgHCv-MEzegoUUbuAPiV29v3IArh25MXHCfkA9gvU6zPqRgZoW54o1_sA2utOEobe1PQEMh09AsXfWu4rUIcDiNWJBQg0Mg",
      category: "Diseño de Interiores",
      date: "Nov, 2023",
      stars: 5,
      comment: "Excelente trabajo. Carlos capturó perfectamente lo que queríamos para el diseño de la sala de estar. El render en 3D fue de gran ayuda para visualizar el espacio final. Muy recomendable y profesional en todo momento.",
      publishDate: "20 de Nov, 2023"
    },
    {
      id: 2,
      proName: "Elena Varas",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWc_kFd0aemAFl39YK6A86WDQZy9EtY8k_kFwtYsbWZ1-6CjnBpIbAFWF1AM9ck39dCop7Gx73h9-BMcjHkseZNl2e5n-Sxjuhco-zmrwEBqHlyQ7mVNc8bx-t9xZ-XYy1wld7BikSYng8qybJcwiG-NKYgRA01V9O9ZmfTqyJdSDqBBYzpL1nX-w1hcBHwcywCWQ_Ssfyo2FZ8i4OxHoxNDY20FtUWLfr8DdkgJhLSgZoaVVRDbR84AAJ38WvAsjVpwlXSYxW0Q",
      category: "Consultoría Financiera",
      date: "Oct, 2023",
      stars: 5,
      comment: "Elena nos ayudó de manera increíble a organizar nuestras finanzas y planificar el crecimiento de nuestro ecommerce. Su experiencia comercial es evidente y sus plantillas de Excel nos han ahorrado horas de trabajo administrativo.",
      publishDate: "05 de Oct, 2023"
    },
    {
      id: 3,
      proName: "Roberto Sánchez",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaB0pHqFtfXILqLbDfWCrSVVQ87Ob-0lfgrZfGjCPWfJC2R1cF_PBJcLNpxRk9_Xg81KwZbdhbdqM5ShsazjdnKhPg0je0oaAqdWDrMl0OmyutJ21EQ1-WFqkEWp4Eonzlv66A5aJElEI9wPhypaCh6W5nGoDksmY7_LaiE00PS6dGZXFR8SQAjz4cqYr34LTf6kvZtbTTk9UuNvOJGO38DEkDcvU2NLEUsHrlPkfVvolMeuYO5vjFrY1MEJr3VsGYU38rCjeI2A",
      category: "Fotografía Comercial",
      date: "Sep, 2023",
      stars: 4.8,
      comment: "Las fotos del evento corporativo quedaron espectaculares y capturaron momentos muy espontáneos. El único detalle fue que la entrega final se retrasó un par de días de la fecha acordada, pero valió completamente la pena por la calidad visual final.",
      publishDate: "12 de Sep, 2023"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#f8f9ff] font-sans pb-24 selection:bg-[#E0F2FE]">
      {/* Decorative Blob backgrounds */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-200/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-pink-100/10 rounded-full blur-[60px] pointer-events-none" />

      {/* 1. Header (Standardized styling with Home) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e6eeff] h-16 md:h-20 flex items-center">
        <div className="max-w-[1280px] mx-auto w-full px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#5e6f79] p-2">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/home-cliente')}>
              <div className="w-8 h-8 bg-[#0d1c2e] rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">hub</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-[#0d1c2e] tracking-tight">Tool Link</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/home-cliente" className="text-[#5e6f79] hover:text-[#0d1c2e] font-semibold transition-colors">Inicio</Link>
            <Link href="/resultados" className="text-[#5e6f79] hover:text-[#0d1c2e] font-semibold transition-colors">Buscar</Link>
            <Link href="/chat" className="text-[#5e6f79] hover:text-[#0d1c2e] font-semibold transition-colors">Mensajes</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="relative p-2 hover:bg-slate-100 rounded-full transition-all cursor-pointer hidden md:block">
              <Bell size={22} className="text-[#5e6f79]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#e6eeff] bg-white flex items-center justify-center cursor-pointer shrink-0">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#0d1c2e] font-bold text-sm uppercase">{userName.charAt(0)}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Sticky Profile Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 h-fit">
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_15px_40px_rgba(13,28,46,0.03)] border border-[#e6eeff] flex flex-col items-center text-center">
              
              {/* Avatar Uploader Indicator */}
              <div className="relative mb-6">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full p-1.5 bg-gradient-to-tr from-sky-300 via-pink-300 to-indigo-300 relative group overflow-hidden">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white shadow-inner flex items-center justify-center">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Client avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#0d1c2e] font-bold text-4xl uppercase">{userName.charAt(0)}</span>
                    )}
                  </div>
                  
                  {/* Camera overlay */}
                  <button 
                    onClick={() => {
                      setEditName(userName);
                      setEditLocation(userLocation);
                      setEditPhoto(userAvatar);
                      setIsEditOpen(true);
                    }}
                    className="absolute inset-1.5 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-white"
                  >
                    <Camera size={20} />
                  </button>
                </div>
              </div>

              {/* User Bio */}
              <h2 className="text-xl font-bold text-[#0d1c2e] mb-1 line-clamp-1">{userName}</h2>
              
              <div className="flex items-center gap-1 text-[#5e6f79] text-xs font-semibold mb-4 bg-slate-50 px-3 py-1 rounded-full">
                <MapPin size={12} className="text-sky-500" />
                <span>{userLocation}</span>
              </div>

              <div className="w-full border-t border-slate-100 my-4"></div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4 w-full text-center mb-6">
                <div className="bg-[#f8f9ff] p-3 rounded-2xl border border-[#e6eeff]/60">
                  <span className="text-[10px] font-bold text-[#5e6f79] uppercase block tracking-wider mb-0.5">TRABAJOS</span>
                  <p className="text-lg font-black text-[#0d1c2e]">{trabajos.length}</p>
                </div>
                <div className="bg-[#f8f9ff] p-3 rounded-2xl border border-[#e6eeff]/60">
                  <span className="text-[10px] font-bold text-[#5e6f79] uppercase block tracking-wider mb-0.5">RESEÑAS</span>
                  <p className="text-lg font-black text-pink-600">{reseñas.length}</p>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button 
                onClick={() => {
                  setEditName(userName);
                  setEditLocation(userLocation);
                  setEditPhoto(userAvatar);
                  setIsEditOpen(true);
                }}
                className="w-full py-3.5 bg-[#0d1c2e] hover:bg-[#233144] text-white rounded-full font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Editar Perfil</span>
              </button>
            </div>
          </aside>

          {/* Right Column: Multi-tab Activity Dashboard */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            
            {/* Tab Controller */}
            <div className="bg-white rounded-full p-1.5 shadow-[0_8px_30px_rgba(13,28,46,0.02)] border border-[#e6eeff] flex w-full">
              <button 
                onClick={() => setActiveTab("contratos")}
                className={`flex-1 py-3 px-2 text-center rounded-full text-xs md:text-sm font-bold transition-all ${
                  activeTab === "contratos" 
                    ? "bg-[#E0F2FE] text-[#0288D1]" 
                    : "text-[#5e6f79] hover:text-[#0d1c2e]"
                }`}
              >
                Trabajos Contratados
              </button>
              <button 
                onClick={() => setActiveTab("reseñas")}
                className={`flex-1 py-3 px-2 text-center rounded-full text-xs md:text-sm font-bold transition-all ${
                  activeTab === "reseñas" 
                    ? "bg-[#FCE4EC] text-[#D81B60]" 
                    : "text-[#5e6f79] hover:text-[#0d1c2e]"
                }`}
              >
                Nuestras Reseñas
              </button>
              <button 
                onClick={() => setActiveTab("escrow")}
                className={`flex-1 py-3 px-2 text-center rounded-full text-xs md:text-sm font-bold transition-all ${
                  activeTab === "escrow" 
                    ? "bg-[#E8F5E9] text-[#2E7D32]" 
                    : "text-[#5e6f79] hover:text-[#0d1c2e]"
                }`}
              >
                Garantías y Escrow
              </button>
            </div>

            {/* Dynamic Content Panel */}
            <div className="min-h-[400px]">
              
              {/* Tab 1: Contracted Jobs */}
              {activeTab === "contratos" && (
                <div className="space-y-4">
                  {trabajos.map((trabajo) => (
                    <div 
                      key={trabajo.id} 
                      className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#e6eeff] hover:border-sky-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-inner">
                          <img src={trabajo.avatar} alt={trabajo.proName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[#0d1c2e] text-base group-hover:text-[#0288D1] transition-colors">{trabajo.proName}</h3>
                            <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{trabajo.status}</span>
                          </div>
                          <p className="text-xs text-[#5e6f79] font-medium mt-0.5">{trabajo.category} • {trabajo.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                        <div className="text-left md:text-right">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">MONTO</span>
                          <span className="text-sm font-extrabold text-[#0d1c2e]">{trabajo.amount}</span>
                        </div>
                        <button 
                          onClick={() => setSelectedContract(trabajo)}
                          className="px-6 py-2.5 bg-slate-50 hover:bg-[#E0F2FE] hover:text-[#0288D1] border border-slate-100 rounded-full font-bold text-xs text-[#0d1c2e] transition-colors shadow-sm active:scale-95"
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Reviews Written by User */}
              {activeTab === "reseñas" && (
                <div className="space-y-4">
                  {reseñas.map((reseña) => (
                    <div 
                      key={reseña.id} 
                      className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#e6eeff] hover:border-pink-200 transition-all"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 shrink-0">
                          <img src={reseña.avatar} alt={reseña.proName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <h4 className="font-bold text-[#0d1c2e] text-sm">Reseña para {reseña.proName}</h4>
                              <p className="text-[11px] text-[#5e6f79] font-medium">{reseña.category} • Contratado en {reseña.date}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                              <Star size={14} className="fill-amber-400 text-amber-400" />
                              <span>{reseña.stars.toFixed(1)}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-600 mt-3 leading-relaxed bg-[#f8f9ff]/60 p-4 rounded-2xl border border-slate-50">
                            "{reseña.comment}"
                          </p>
                          
                          <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-[#5e6f79] uppercase tracking-wider">
                            <span>Publicado el {reseña.publishDate}</span>
                            <span className="text-[#0288D1] flex items-center gap-1">
                              <ShieldCheck size={14} /> Verificada por Escrow
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Guarantees and Custody (Escrow) */}
              {activeTab === "escrow" && (
                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-[#e6eeff]">
                  
                  {/* Card Header Info */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-inner">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr7PKkLTLkZtiZc6R7YN01A70SXNomxN6ykcs-mH7V-Et7rS5d8yUVZx3yoyrBqSMpxKTAkyrY2VbEGwTK22uFPObfQXfUYFY96AVlHZyh5uXL07hecOI0GHHGax9RsF3DbhyAX9WgawyfCvmK6MSsvVnY23Nxsl1SI_mEDl5mhVihCF1kWpizNBEyM4mD-hIX8Z3GrXPyjOy4CQi5BCaOfO87HR6pmsL6dDdrcsLoJpYeNHiokz6v-sJ2mzu72uQD0ToW9MT39g" 
                          alt="Alex Martínez" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">CONTRATO ACTIVO</span>
                        <h3 className="font-extrabold text-[#0d1c2e] text-lg leading-tight">Alex Martínez</h3>
                        <p className="text-xs text-[#5e6f79] font-medium mt-0.5">Desarrollo Web Full-Stack</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#E8F5E9] border border-[#a5d6a7]/30 text-[#2E7D32] px-4 py-2 rounded-2xl flex flex-col text-right">
                      <span className="text-[8px] font-bold uppercase tracking-wider block">FONDOS EN GARANTÍA</span>
                      <span className="text-lg font-black leading-none">$1,224.00 USD</span>
                    </div>
                  </div>

                  {/* Escrow Steps Progression */}
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-[#0d1c2e] mb-4">Progreso del Fideicomiso Escrow</h4>
                    
                    <div className="relative">
                      {/* Grey Bar */}
                      <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 rounded-full z-0" />
                      {/* Filled Active Green Bar */}
                      <div 
                        className="absolute top-5 left-6 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-700" 
                        style={{ width: escrowReleased ? "100%" : "66%" }}
                      />

                      <div className="relative z-10 grid grid-cols-3 gap-2">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            ✓
                          </div>
                          <span className="text-[10px] font-extrabold text-[#0d1c2e] mt-2 block uppercase tracking-wider">Depositado</span>
                          <span className="text-[9px] text-[#5e6f79] mt-0.5">04 May, 2026</span>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            ✓
                          </div>
                          <span className="text-[10px] font-extrabold text-[#0d1c2e] mt-2 block uppercase tracking-wider">Entregado</span>
                          <span className="text-[9px] text-[#5e6f79] mt-0.5">14 May, 2026</span>
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-300 ${
                            escrowReleased ? "bg-emerald-500 text-white" : "bg-white text-emerald-500 border-2 border-emerald-500"
                          }`}>
                            {escrowReleased ? "✓" : "3"}
                          </div>
                          <span className="text-[10px] font-extrabold text-[#0d1c2e] mt-2 block uppercase tracking-wider">Liberado</span>
                          <span className="text-[9px] text-[#5e6f79] mt-0.5">
                            {escrowReleased ? "Hoy" : "Pendiente"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alert notification block */}
                  <div className="bg-[#f8f9ff] border border-[#e6eeff] p-5 rounded-2xl flex gap-3 items-start mb-6">
                    <Info className="text-sky-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-[#5e6f79] leading-relaxed">
                      El trabajo ha sido entregado en la plataforma. Por favor, revisa detalladamente que todos los entregables acordados funcionen de manera correcta antes de presionar el botón de liberación de fondos. Una vez liberados, los fondos se transferirán permanentemente al contratista.
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => router.push("/chat")}
                      className="flex-1 min-w-[150px] py-3.5 border border-slate-200 hover:bg-slate-50 text-[#0d1c2e] rounded-full font-bold text-sm shadow-sm transition-all"
                    >
                      Hablar con Alex
                    </button>
                    
                    <button 
                      onClick={handleReleaseEscrow}
                      disabled={escrowReleased || releasing}
                      className={`flex-2 min-w-[200px] py-3.5 rounded-full font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                        escrowReleased 
                          ? "bg-emerald-100 text-emerald-700 cursor-default" 
                          : "bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95"
                      }`}
                    >
                      {releasing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Liberando Fondos...</span>
                        </>
                      ) : escrowReleased ? (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Fondos Liberados</span>
                        </>
                      ) : (
                        <>
                          <Unlock size={16} />
                          <span>Autorizar y Liberar Pago</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* 2. Success Toast System */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 right-4 md:right-8 bg-white rounded-3xl p-5 shadow-[0_12px_40px_rgba(13,28,46,0.12)] border border-[#e6eeff] flex gap-4 max-w-sm w-full z-50 pointer-events-auto"
          >
            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 text-emerald-500">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-extrabold text-[#0d1c2e] text-sm">{toastMessage.title}</h4>
              <p className="text-xs text-[#5e6f79] mt-0.5 leading-relaxed">{toastMessage.body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Reusable Contract Details Modal */}
      <AnimatePresence>
        {selectedContract && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[2rem] p-6 md:p-8 max-w-xl w-full shadow-2xl border border-[#e6eeff] relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">RESUMEN DEL CONTRATO</span>
                  <h3 className="text-xl font-extrabold text-[#0d1c2e] tracking-tight">{selectedContract.proName}</h3>
                  <p className="text-xs text-[#5e6f79] font-medium mt-0.5">{selectedContract.category} • Habilitado el {selectedContract.date}</p>
                </div>
                <button 
                  onClick={() => setSelectedContract(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all text-[#5e6f79]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6">
                
                {/* Description */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">DESCRIPCIÓN DEL PROYECTO</label>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                    {selectedContract.desc}
                  </p>
                </div>

                {/* Amount and ID grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f8f9ff] border border-[#e6eeff]/60 p-4 rounded-2xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ID DEL CONTRATO</span>
                    <p className="text-sm font-bold text-[#0d1c2e] mt-0.5 font-mono">{selectedContract.id}</p>
                  </div>
                  <div className="bg-[#f8f9ff] border border-[#e6eeff]/60 p-4 rounded-2xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL PAGADO</span>
                    <p className="text-sm font-bold text-pink-600 mt-0.5">{selectedContract.amount}</p>
                  </div>
                </div>

                {/* Digital Verification seal */}
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex gap-3 items-center">
                  <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                  <div className="text-left">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">CUSTODIA ESCROW FIRMADA</span>
                    <p className="text-[10px] text-emerald-700 leading-none mt-0.5 font-semibold">
                      Transacción sellada digitalmente e inalterable bajo protocolo seguro de fideicomiso.
                    </p>
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="flex gap-4 mt-8 pt-5 border-t border-slate-100">
                <button 
                  onClick={() => setSelectedContract(null)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] rounded-full font-bold text-xs transition-colors shadow-sm"
                >
                  Cerrar Detalles
                </button>
                <button 
                  onClick={() => {
                    setSelectedContract(null);
                    triggerToast("Descarga de Contrato", "El comprobante de contrato digital se ha descargado correctamente en tu dispositivo.");
                  }}
                  className="flex-1 py-3.5 bg-sky-50 hover:bg-[#E0F2FE] text-[#0288D1] rounded-full font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <FileText size={14} />
                  <span>Descargar PDF</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Edit Profile Modal Dialog */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#e6eeff] relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-[#0d1c2e] tracking-tight">Editar Datos de Perfil</h3>
                  <p className="text-xs text-[#5e6f79] font-medium mt-0.5">Mantén tu información actualizada para la comunidad.</p>
                </div>
                <button 
                  onClick={() => setIsEditOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all text-[#5e6f79]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-5">
                
                {/* Photo Preview & Custom Selector */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative group cursor-pointer mb-3">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-50 shadow-md bg-slate-100 flex items-center justify-center">
                      {editPhoto ? (
                        <img src={editPhoto} alt="User Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[#0d1c2e] font-bold text-2xl uppercase">U</span>
                      )}
                    </div>
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer text-[10px] font-bold">
                      <Camera size={14} className="mb-0.5" />
                      <span>Cargar</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Foto de Perfil</span>
                </div>

                {/* Preset Avatars Selection */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Selecciona un Preset Profesional</label>
                  <div className="grid grid-cols-4 gap-3">
                    {AVATAR_PRESETS.map((preset, index) => (
                      <button 
                        key={index}
                        onClick={() => setEditPhoto(preset.url)}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-transform duration-200 hover:scale-105 shrink-0 bg-slate-50 ${
                          editPhoto === preset.url ? "border-[#0288D1] scale-105" : "border-slate-100"
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={`Preset ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name field */}
                <div>
                  <label className="text-[10px] font-bold text-[#0d1c2e] uppercase tracking-wider ml-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0288D1] focus:ring-2 focus:ring-[#E0F2FE] transition-all text-[#0d1c2e] font-medium"
                    placeholder="Introduce tu nombre..."
                  />
                </div>

                {/* Location field */}
                <div>
                  <label className="text-[10px] font-bold text-[#0d1c2e] uppercase tracking-wider ml-1">Ubicación / Ciudad</label>
                  <input 
                    type="text" 
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0288D1] focus:ring-2 focus:ring-[#E0F2FE] transition-all text-[#0d1c2e] font-medium"
                    placeholder="Ej. CDMX, México"
                  />
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="flex gap-4 mt-8 pt-5 border-t border-slate-100">
                <button 
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] rounded-full font-bold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 py-3.5 bg-[#0288D1] hover:bg-[#0277bd] text-white rounded-full font-bold text-xs transition-colors shadow-md"
                >
                  Guardar Cambios
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Mobile bottom nav bar */}
      <BottomNav />
    </div>
  );
}
