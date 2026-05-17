"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LayoutList,
  X,
  Bell,
  Briefcase,
  UserCheck,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import FiltrosUbicacion from "./components/FiltrosUbicacion";
import MapaBase from "./components/MapaBase";
import PanelLateral from "./components/PanelLateral";

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface Expert {
  id: string;
  nombre_completo: string;
  titulo_profesional: string;
  categoria: string;
  calificacion: number;
  distancia_km?: number;
  foto_perfil?: string;
  tarifa?: string;
  lat?: number;
  lng?: number;
  ciudad?: string;
}

interface JobOffer {
  id: string;
  cliente_nombre: string;
  cliente_avatar?: string;
  cliente_calificacion: number;
  titulo_trabajo: string;
  descripcion: string;
  terminos: string;
  pago: string;
  distancia_km: number;
  lat: number;
  lng: number;
  status: "available" | "accepted" | "declined";
}

// ─── Fallback Experts Data ────────────────────────────────────────────────────
const FALLBACK_EXPERTS: Expert[] = [
  {
    id: "e1",
    nombre_completo: "Sarah Jenkins",
    titulo_profesional: "Diseñadora de Interiores Senior",
    categoria: "Hogar",
    calificacion: 4.9,
    distancia_km: 2.4,
    tarifa: "$85/hr",
    foto_perfil: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200",
    lat: 7.125,
    lng: -73.125,
  },
  {
    id: "e2",
    nombre_completo: "David Chen",
    titulo_profesional: "Consultor Tech & DevOps",
    categoria: "Tech",
    calificacion: 4.8,
    distancia_km: 1.8,
    tarifa: "$120/hr",
    foto_perfil: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200",
    lat: 7.118,
    lng: -73.118,
  },
  {
    id: "e3",
    nombre_completo: "Elena Rodríguez",
    titulo_profesional: "Directora Creativa & Branding",
    categoria: "Creativo",
    calificacion: 5.0,
    distancia_km: 0.5,
    tarifa: "$95/hr",
    foto_perfil: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    lat: 7.121,
    lng: -73.131,
  },
];

// ─── Fallback Job Offers ─────────────────────────────────────────────────────
const MOCK_JOBS: JobOffer[] = [
  {
    id: "job1",
    cliente_nombre: "Elena Varas",
    cliente_avatar: "",
    cliente_calificacion: 4.9,
    titulo_trabajo: "Desarrollo de Landing Page Responsive",
    descripcion: "Requiero un frontend developer experto para maquetar un diseño de Figma en Next.js. Debe incluir soporte completo de SEO y desplegarlo en Vercel.",
    terminos: "Pago retenido de forma segura en Garantía TrustMarket. Plazo de entrega: 5 días.",
    pago: "450",
    distancia_km: 0.8,
    lat: 7.125,
    lng: -73.125,
    status: "available"
  },
  {
    id: "job2",
    cliente_nombre: "Carlos Gómez",
    cliente_avatar: "",
    cliente_calificacion: 4.8,
    titulo_trabajo: "Asistencia Técnica Express en AWS",
    descripcion: "Configuración urgente de grupo de escalamiento automático (ASG) y balanceador de carga en AWS para ecommerce.",
    terminos: "Revisión técnica de 24 horas y liberación inmediata al confirmar despliegue.",
    pago: "120",
    distancia_km: 1.2,
    lat: 7.115,
    lng: -73.118,
    status: "available"
  },
  {
    id: "job3",
    cliente_nombre: "Sofía Beltrán",
    cliente_avatar: "",
    cliente_calificacion: 4.7,
    titulo_trabajo: "Optimización SEO y Performance",
    descripcion: "Optimizar el rendimiento web (Core Web Vitals) de un blog de viajes en WordPress. Busco elevar la calificación en Lighthouse a +95.",
    terminos: "50% anticipo liberado en escrow, 50% al entregar auditoría aprobada.",
    pago: "320",
    distancia_km: 1.9,
    lat: 7.121,
    lng: -73.131,
    status: "available"
  }
];

export default function MapaExpertos() {
  const router = useRouter();

  // Mode state: dynamic segmented control in header
  const [mode, setMode] = useState<"experts" | "jobs">("jobs"); // Default to jobs map for professionals
  
  // Lists
  const [experts, setExperts] = useState<Expert[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>(MOCK_JOBS);
  
  // Selections
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Filters (for experts mode)
  const [busqueda, setBusqueda] = useState("");
  const [pais, setPais] = useState("Colombia");
  const [departamento, setDepartamento] = useState("Santander");
  const [ciudad, setCiudad] = useState("Bucaramanga");
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number} | null>(null);

  // Profile metadata
  const [profileName, setProfileName] = useState("Profesional");

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Sync user metadata and role on mount ───────────────────────────────────
  useEffect(() => {
    // Sync registered name
    const savedName = localStorage.getItem("userName") || localStorage.getItem("proName");
    if (savedName) setProfileName(savedName);

    const syncSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const meta = session.user.user_metadata;
          const regName = meta?.nombre_completo || meta?.full_name || session.user.email?.split("@")[0];
          if (regName) {
            setProfileName(regName);
            localStorage.setItem("userName", regName);
          }
        }
      } catch (err) {
        console.error("Session sync failed:", err);
      }
    };
    syncSession();
  }, []);

  // ── Geolocation ────────────────────────────────────────────────────────────
  const handleMiUbicacion = useCallback(() => {
    if (!navigator.geolocation) {
      showToast("Tu navegador no soporta geolocalización.");
      return;
    }
    showToast("Obteniendo tu ubicación en tiempo real…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(loc);
        setMapCenter(loc);
        localStorage.setItem("userLastLocation", JSON.stringify(loc));
        showToast("✓ Ubicación en tiempo real detectada con éxito.");
      },
      () => {
        // Fallback Bucaramanga center
        const fallback = { lat: 7.1193, lng: -73.1227 };
        setUserLocation(fallback);
        setMapCenter(fallback);
        showToast("✓ Centrado en ubicación predeterminada (Santander)");
      }
    );
  }, [showToast]);

  // Request location on mount
  useEffect(() => {
    handleMiUbicacion();
  }, [handleMiUbicacion]);

  // ── Shift Job Offers relative to user's real GPS coordinates ────────────────
  useEffect(() => {
    if (userLocation) {
      const updated = MOCK_JOBS.map((job, idx) => {
        const offsets = [
          { dLat: 0.005, dLng: 0.005, dist: 0.8 },
          { dLat: -0.004, dLng: -0.004, dist: 1.2 },
          { dLat: 0.002, dLng: -0.007, dist: 1.9 }
        ];
        const off = offsets[idx] || { dLat: 0, dLng: 0, dist: 1.0 };
        return {
          ...job,
          lat: userLocation.lat + off.dLat,
          lng: userLocation.lng + off.dLng,
          distancia_km: off.dist
        };
      });
      setJobs(updated);
    }
  }, [userLocation]);

  // ── Fetch experts from Supabase (for Experts mode) ──────────────────────────
  const fetchExperts = useCallback(async () => {
    if (mode !== "experts") return;
    setIsLoading(true);
    try {
      let query = supabase
        .from("perfiles_profesionales")
        .select(
          "id, nombre_completo, titulo_profesional, categoria, calificacion, distancia_km, foto_perfil, lat, lng, tarifa"
        );

      if (ciudad) query = query.ilike("ciudad", `%${ciudad}%`);
      
      if (busqueda.trim()) {
        query = query.or(
          `nombre_completo.ilike.%${busqueda}%,titulo_profesional.ilike.%${busqueda}%,categoria.ilike.%${busqueda}%`
        );
      }

      const { data, error } = await query.limit(20);

      if (error || !data || data.length === 0) {
        // Fallback data filtering
        const filtered = FALLBACK_EXPERTS.filter((e) => {
          const q = busqueda.toLowerCase();
          return (
            !q ||
            e.nombre_completo.toLowerCase().includes(q) ||
            e.titulo_profesional.toLowerCase().includes(q) ||
            e.categoria.toLowerCase().includes(q)
          );
        });
        setExperts(filtered);
      } else {
        setExperts(data);
      }
    } catch {
      setExperts(FALLBACK_EXPERTS);
    } finally {
      setIsLoading(false);
    }
  }, [busqueda, ciudad, mode]);

  useEffect(() => {
    if (mode === "experts") {
      const timer = setTimeout(fetchExperts, 300);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [fetchExperts, mode]);

  // Geocode filter queries to map center
  useEffect(() => {
    if (mode === "experts" && (ciudad || busqueda)) {
      const query = busqueda ? busqueda : `${ciudad} Santander Colombia`;
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setMapCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
          }
        })
        .catch(() => {});
    }
  }, [ciudad, busqueda, mode]);

  // ── Handlers for Job Accepting workflow ─────────────────────────────────────
  const handleAcceptJob = (jobId: string) => {
    const acceptedJob = jobs.find(j => j.id === jobId);
    if (!acceptedJob) return;
    
    // Update local jobs list state to accepted
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "accepted" } : j));
    setSelectedJobId(null);
    showToast(`✓ Contrato inteligente firmado. ¡Has aceptado el trabajo de ${acceptedJob.cliente_nombre}!`);
  };

  const handleDeclineJob = (jobId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "declined" } : j));
    setSelectedJobId(null);
    showToast("Oferta de trabajo rechazada.");
  };

  const handleVerPerfil = (id: string) => router.push(`/expertos/${id}`);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#f8f9ff] font-plus-jakarta pb-28">

      {/* ── Top Header Navbar ────────────────────────────────────────────────── */}
      <header
        className="z-50 flex justify-between items-center w-full px-6 py-4 bg-white border-b border-sky-50 shadow-sm flex-shrink-0"
      >
        {/* Left: Tool link Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => router.push("/dashboard-pro")}
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-lg flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-lg leading-none font-bold">hub</span>
            </div>
            <h1 className="text-lg font-black text-[#0d1c2e] tracking-tight">
              TrustMarket <span className="text-pink-500">Live</span>
            </h1>
          </div>
        </div>

        {/* Center Segmented Toggle control (Highly polished) */}
        <div className="bg-slate-100 p-1 rounded-full flex items-center shadow-inner border border-slate-200/50">
          <button
            onClick={() => {
              setMode("jobs");
              setSelectedId(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === "jobs"
                ? "bg-[#0d1c2e] text-white shadow-sm"
                : "text-slate-500 hover:text-[#0d1c2e]"
            }`}
          >
            <Briefcase size={12} />
            <span>Mapa de Trabajo</span>
          </button>
          <button
            onClick={() => {
              setMode("experts");
              setSelectedJobId(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === "experts"
                ? "bg-[#0d1c2e] text-white shadow-sm"
                : "text-slate-500 hover:text-[#0d1c2e]"
            }`}
          >
            <UserCheck size={12} />
            <span>Buscar Expertos</span>
          </button>
        </div>

        {/* Right: Notifications & profile avatar */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full hover:scale-105 transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
          </button>

          {/* User profile pill */}
          <div className="flex items-center gap-2 bg-[#FCE4EC] border border-pink-100 px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-pink-500 text-white flex items-center justify-center font-bold text-xs">
              {profileName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-extrabold text-[#D81B60] hidden sm:inline">{profileName}</span>
          </div>
        </div>
      </header>

      {/* ── Main Leaflet Canvas Layout ────────────────────────────────────────── */}
      <main className="flex-1 relative flex overflow-hidden">

        {/* Left Drawer list */}
        <PanelLateral
          isOpen={isPanelOpen}
          onToggle={() => setIsPanelOpen((p) => !p)}
          isLoading={isLoading}
          mode={mode}
          experts={experts}
          selected={selectedId}
          onSelect={(id) => setSelectedId(prev => (prev === id ? null : id))}
          jobs={jobs}
          selectedJobId={selectedJobId}
          onSelectJob={(id) => setSelectedJobId(prev => (prev === id ? null : id))}
        />

        {/* Map Layer */}
        <div className="relative flex-1 h-full">

          {/* Floating filters ONLY shown on client mode */}
          {mode === "experts" && (
            <FiltrosUbicacion
              busqueda={busqueda}
              onBusquedaChange={setBusqueda}
              pais={pais}
              onPaisChange={setPais}
              departamento={departamento}
              onDepartamentoChange={setDepartamento}
              ciudad={ciudad}
              onCiudadChange={setCiudad}
              onMiUbicacion={handleMiUbicacion}
            />
          )}

          {/* Floating Live Indicator shown on Jobs mode */}
          {mode === "jobs" && (
            <div className="absolute top-6 left-6 z-40 bg-white/95 backdrop-blur-md px-4.5 py-3 rounded-2xl border border-sky-100 shadow-lg flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">EMPLEOS EN VIVO</span>
                <span className="text-xs font-extrabold text-[#0d1c2e]">Monitoreando ofertas de trabajo...</span>
              </div>
            </div>
          )}

          {/* Interactive Dynamic Leaflet Map Component */}
          <MapaBase
            mode={mode}
            experts={experts}
            selectedId={selectedId}
            onSelectExpert={setSelectedId}
            onVerPerfil={handleVerPerfil}
            userLocation={userLocation}
            mapCenter={mapCenter}
            jobs={jobs}
            selectedJobId={selectedJobId}
            onSelectJob={setSelectedJobId}
            onAcceptJob={handleAcceptJob}
            onDeclineJob={handleDeclineJob}
          />

          {/* Loading status overlay pill */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-xl rounded-full px-5 py-2.5 shadow-lg flex items-center gap-3 border border-white"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-pink-100 border-t-pink-500 rounded-full"
                />
                <span className="text-xs font-bold text-[#0d1c2e]">
                  Escaneando coordenadas de confianza…
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile: list toggle drawer trigger */}
          <div className="lg:hidden absolute top-6 right-6 z-40">
            <button
              onClick={() => setIsPanelOpen((p) => !p)}
              className="w-11 h-11 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#0d1c2e] border border-sky-100 hover:scale-105 transition-all"
            >
              {isPanelOpen ? <X size={18} /> : <LayoutList size={18} />}
            </button>
          </div>
        </div>

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

          {/* Mapa (Active - Pink style matching requested bottom nav layout) */}
          <a 
            href="#" 
            className="flex flex-col items-center justify-center text-[#D81B60] bg-[#FCE4EC]/85 rounded-2xl px-5 py-2 cursor-pointer transition-all border border-[#FCE4EC]/40"
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
            <span className="text-[10px] font-bold mt-1">Mapa</span>
          </a>

          {/* Agenda */}
          <a 
            href="/agenda" 
            className="flex flex-col items-center justify-center text-slate-400 hover:text-[#0d1c2e] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">calendar_today</span>
            <span className="text-[10px] font-semibold mt-1">Agenda</span>
          </a>

          {/* Mensajes */}
          <a 
            href="/chat" 
            className="flex flex-col items-center justify-center text-slate-400 hover:text-[#0d1c2e] transition-colors cursor-pointer relative"
          >
            <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
            <span className="text-[10px] font-semibold mt-1">Mensajes</span>
            <div className="absolute top-0 right-3 w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
          </a>
        </div>
      </nav>

      {/* ── Toast Notifications ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
            className="fixed bottom-28 left-1/2 z-[500] bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-800"
          >
            <Sparkles size={14} className="text-pink-400" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
      `}</style>
    </div>
  );
}
