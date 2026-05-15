"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LayoutList, Map, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import FiltrosUbicacion from "./components/FiltrosUbicacion";
import MapaBase from "./components/MapaBase";
import PanelLateral from "./components/PanelLateral";

// ─── Types ───────────────────────────────────────────────────────────────────
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
}

// ─── Fallback data (shown when Supabase has no rows) ─────────────────────────
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
    lat: 6.2518,
    lng: -75.5636,
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
    lat: 6.255,
    lng: -75.575,
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
    lat: 6.248,
    lng: -75.569,
  },
  {
    id: "e4",
    nombre_completo: "Michael Torres",
    titulo_profesional: "Organizador de Eventos Premium",
    categoria: "Eventos",
    calificacion: 4.7,
    distancia_km: 3.1,
    tarifa: "$70/hr",
    foto_perfil: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    lat: 6.243,
    lng: -75.58,
  },
  {
    id: "e5",
    nombre_completo: "Ana Gómez",
    titulo_profesional: "Psicóloga Clínica & Coach",
    categoria: "Salud",
    calificacion: 4.95,
    distancia_km: 1.2,
    tarifa: "$60/hr",
    foto_perfil: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    lat: 6.258,
    lng: -75.561,
  },
  {
    id: "e6",
    nombre_completo: "Carlos Mendoza",
    titulo_profesional: "Tutor Matemáticas & Física",
    categoria: "Educación",
    calificacion: 4.6,
    distancia_km: 4.0,
    tarifa: "$40/hr",
    foto_perfil: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    lat: 6.242,
    lng: -75.571,
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MapaExpertos() {
  const router = useRouter();

  // State
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);

  // Filter state
  const [busqueda, setBusqueda] = useState("");
  const [pais, setPais] = useState("Colombia");
  const [departamento, setDepartamento] = useState("Antioquia");
  const [ciudad, setCiudad] = useState("Medellín");

  // Toast for location
  const [toast, setToast] = useState<string | null>(null);

  // ── Fetch from Supabase ──────────────────────────────────────────────────
  const fetchExperts = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("perfiles_profesionales")
        .select("id, nombre_completo, titulo_profesional, categoria, calificacion, distancia_km, foto_perfil, lat, lng, tarifa");

      if (ciudad) query = query.ilike("ciudad", `%${ciudad}%`);
      else if (departamento) query = query.ilike("departamento", `%${departamento}%`);
      else if (pais) query = query.ilike("pais", `%${pais}%`);

      if (busqueda.trim()) {
        query = query.or(
          `nombre_completo.ilike.%${busqueda}%,titulo_profesional.ilike.%${busqueda}%,categoria.ilike.%${busqueda}%`
        );
      }

      const { data, error } = await query.limit(20);

      if (error || !data || data.length === 0) {
        // Filter fallback data locally
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
  }, [busqueda, pais, departamento, ciudad]);

  // Fetch on mount & filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExperts();
    }, 300); // debounce
    return () => clearTimeout(timer);
  }, [fetchExperts]);

  // ── Geolocation ──────────────────────────────────────────────────────────
  const handleMiUbicacion = useCallback(() => {
    if (!navigator.geolocation) {
      showToast("Tu navegador no soporta geolocalización.");
      return;
    }
    showToast("Obteniendo tu ubicación...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationGranted(true);
        showToast("✓ Mapa centrado en tu ubicación");
      },
      () => {
        setLocationGranted(false);
        showToast("No se pudo obtener tu ubicación.");
      }
    );
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleVerPerfil = (id: string) => {
    router.push(`/profesional/${id}`);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#f0f4f8] font-sans">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <header className="z-50 flex items-center justify-between w-full px-4 lg:px-6 py-3 bg-white/90 backdrop-blur-md border-b border-gray-100 flex-shrink-0"
        style={{ boxShadow: "0 1px 12px rgba(13,28,46,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#5e6f79] hover:text-[#0d1c2e] transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0d1c2e] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🗺️</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-[#0d1c2e] leading-tight">Mapa de Expertos</h1>
              <p className="text-[10px] text-[#5e6f79] font-medium leading-tight hidden sm:block">
                {isLoading ? "Buscando..." : `${experts.length} profesionales en ${ciudad || departamento || pais || "tu área"}`}
              </p>
            </div>
          </div>
        </div>

        {/* Toggle panel (desktop) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPanelOpen((p) => !p)}
            className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
              isPanelOpen
                ? "bg-[#0d1c2e] text-white border-[#0d1c2e]"
                : "bg-white text-[#0d1c2e] border-gray-200 hover:border-gray-300"
            }`}
          >
            <LayoutList size={16} />
            <span>{isPanelOpen ? "Ocultar lista" : "Ver lista"}</span>
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#E0F2FE] border-2 border-white shadow-sm">
            <div className="w-full h-full flex items-center justify-center text-[#0d1c2e] font-bold text-sm">
              U
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout ─────────────────────────────────────────────────────── */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* Side Panel */}
        <PanelLateral
          experts={experts}
          selected={selectedId}
          onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
          isOpen={isPanelOpen}
          onToggle={() => setIsPanelOpen((p) => !p)}
          isLoading={isLoading}
        />

        {/* Map Area */}
        <div className="relative flex-1 h-full">
          {/* Floating Filters */}
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

          {/* Map */}
          <MapaBase
            experts={experts}
            selectedId={selectedId}
            onSelectExpert={setSelectedId}
            onVerPerfil={handleVerPerfil}
            userLocation={userLocation}
          />

          {/* Loading Overlay */}
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
                  className="w-4 h-4 border-2 border-[#E0F2FE] border-t-[#0288D1] rounded-full"
                />
                <span className="text-sm font-semibold text-[#0d1c2e]">Buscando expertos...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile: floating panel toggle */}
          <div className="lg:hidden absolute top-32 right-4 z-40">
            <button
              onClick={() => setIsPanelOpen((p) => !p)}
              className="w-11 h-11 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#0d1c2e] border border-white hover:scale-105 transition-all"
            >
              {isPanelOpen ? <X size={18} /> : <LayoutList size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile side panel as overlay bottom sheet */}
        <AnimatePresence>
          {isPanelOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="lg:hidden absolute inset-x-0 bottom-0 z-40 bg-white/98 backdrop-blur-xl rounded-t-[28px] shadow-2xl max-h-[55%] overflow-hidden flex flex-col border-t border-gray-100"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-[#0d1c2e]">Expertos Cercanos</h2>
                  <p className="text-xs text-[#5e6f79] font-medium">{experts.length} encontrados</p>
                </div>
                <button onClick={() => setIsPanelOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <X size={16} className="text-[#5e6f79]" />
                </button>
              </div>

              {/* List */}
              <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
                {experts.map((expert) => (
                  <button
                    key={expert.id}
                    onClick={() => {
                      setSelectedId(expert.id);
                      setIsPanelOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                      selectedId === expert.id
                        ? "bg-[#E0F2FE]/40 border-[#E0F2FE]"
                        : "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#E0F2FE] flex-shrink-0">
                      {expert.foto_perfil ? (
                        <img src={expert.foto_perfil} alt={expert.nombre_completo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-[#0d1c2e]">
                          {expert.nombre_completo.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0d1c2e] line-clamp-1">{expert.nombre_completo}</p>
                      <p className="text-xs text-[#5e6f79] line-clamp-1">{expert.titulo_profesional}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-xs font-bold">{expert.calificacion}</span>
                        {expert.tarifa && <span className="text-xs text-[#0288D1] font-bold ml-2">{expert.tarifa}</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Toast Notification ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-[100] bg-[#0d1c2e] text-white px-5 py-3 rounded-full shadow-xl text-sm font-semibold"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
