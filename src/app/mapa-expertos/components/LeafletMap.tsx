"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Minus, 
  X, 
  Check, 
  Loader2, 
  ShieldCheck, 
  Briefcase, 
  FileText, 
  AlertCircle,
  MapPin,
  CheckCircle2,
  MessageSquare
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import MiniCard from "./MiniCard";

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

interface LeafletMapProps {
  // Common Props
  userLocation: { lat: number; lng: number } | null;
  mapCenter?: { lat: number; lng: number } | null;
  
  // Experts mode props (Client)
  experts?: Expert[];
  selectedId?: string | null;
  onSelectExpert?: (id: string | null) => void;
  onVerPerfil?: (id: string) => void;

  // Jobs mode props (Professional)
  mode?: "experts" | "jobs";
  jobs?: JobOffer[];
  selectedJobId?: string | null;
  onSelectJob?: (id: string | null) => void;
  onAcceptJob?: (id: string) => void;
  onDeclineJob?: (id: string) => void;
}

const CATEGORIA_PIN_COLORS: Record<string, string> = {
  Tech: "#0288D1",
  Hogar: "#F57F17",
  Creativo: "#D81B60",
  Eventos: "#2E7D32",
  Salud: "#93000A",
  "Educación": "#50616B",
};

// Component to handle map center changes
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Custom zoom control
function CustomZoomControls() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handleZoom = () => setZoom(map.getZoom());
    map.on("zoomend", handleZoom);
    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map]);

  return (
    <>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            map.zoomIn();
          }}
          className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#5e6f79] hover:text-[#0d1c2e] hover:scale-110 active:scale-95 transition-all border border-white"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            map.zoomOut();
          }}
          className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#5e6f79] hover:text-[#0d1c2e] hover:scale-110 active:scale-95 transition-all border border-white"
        >
          <Minus size={18} />
        </button>
      </div>
      <div className="absolute bottom-4 right-4 z-[400] bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-bold text-[#5e6f79] shadow-sm border border-white pointer-events-none">
        Zoom {zoom}
      </div>
    </>
  );
}

export default function LeafletMap({
  experts = [],
  selectedId = null,
  onSelectExpert = () => {},
  onVerPerfil = () => {},
  userLocation,
  mapCenter,
  mode = "experts",
  jobs = [],
  selectedJobId = null,
  onSelectJob = () => {},
  onAcceptJob = () => {},
  onDeclineJob = () => {},
}: LeafletMapProps) {
  const router = useRouter();
  
  // Accept animation local states
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [acceptSuccessId, setAcceptSuccessId] = useState<string | null>(null);

  // Center coordinates calculation
  const centerLat = mapCenter?.lat || userLocation?.lat || (mode === "jobs" && jobs[0]?.lat) || (experts[0]?.lat ?? 7.1193);
  const centerLng = mapCenter?.lng || userLocation?.lng || (mode === "jobs" && jobs[0]?.lng) || (experts[0]?.lng ?? -73.1227);

  const selectedExpert = experts.find((e) => e.id === selectedId);
  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  // Custom Icon generation function for experts
  const createCustomIcon = (expert: Expert, isSelected: boolean) => {
    const pinColor = CATEGORIA_PIN_COLORS[expert.categoria] || "#50616B";
    const initial = expert.nombre_completo.charAt(0);
    
    const html = `
      <div class="relative group cursor-pointer transition-transform duration-300 ${isSelected ? 'scale-110' : 'hover:scale-105'}" style="outline: none;">
        <div class="w-11 h-11 rounded-full border-4 shadow-lg overflow-hidden flex items-center justify-center bg-white ${isSelected ? 'ring-4 ring-white shadow-xl' : ''}" style="border-color: white; background-color: ${isSelected ? pinColor : '#fff'}">
          ${expert.foto_perfil 
            ? `<img src="${expert.foto_perfil}" class="w-full h-full object-cover" />` 
            : `<span class="font-bold text-sm" style="color: ${isSelected ? '#fff' : pinColor}">${initial}</span>`
          }
        </div>
        <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-white" style="background-color: ${isSelected ? pinColor : '#fff'}; z-index: -1;"></div>
        <div class="absolute -top-1 -right-1 bg-white rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-sm border border-gray-100" style="min-width: 32px">
          <span class="text-yellow-400 text-[9px]">★</span>
          <span class="text-[9px] font-bold text-[#0d1c2e]">${expert.calificacion}</span>
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-leaflet-icon',
      html,
      iconSize: [44, 44],
      iconAnchor: [22, 50],
      popupAnchor: [0, -50],
    });
  };

  // Custom Icon for Job Offers (Pink/rose gradient with a suitcase)
  const createJobIcon = (job: JobOffer, isSelected: boolean) => {
    const html = `
      <div class="relative group cursor-pointer transition-transform duration-300 ${isSelected ? 'scale-115' : 'hover:scale-105'}" style="outline: none;">
        <div class="w-11 h-11 rounded-full border-4 shadow-lg overflow-hidden flex items-center justify-center bg-gradient-to-tr from-pink-500 to-rose-400 border-white text-white ${isSelected ? 'ring-4 ring-pink-200' : ''}">
          <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">work</span>
        </div>
        <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-white bg-rose-400" style="z-index: -1;"></div>
        <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#0d1c2e] text-white rounded-full px-2 py-0.5 shadow-md border border-[#0d1c2e]" style="white-space: nowrap;">
          <span class="text-[9px] font-extrabold">${job.pago}</span>
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-leaflet-job-icon',
      html,
      iconSize: [44, 44],
      iconAnchor: [22, 50],
      popupAnchor: [0, -50],
    });
  };

  // User location icon
  const userIcon = L.divIcon({
    className: 'custom-leaflet-user-icon',
    html: `
      <div class="relative w-5 h-5">
        <div class="absolute inset-0 rounded-full bg-[#0288D1]/30 animate-ping" style="transform: scale(2.5);"></div>
        <div class="relative w-5 h-5 rounded-full bg-[#0288D1] border-4 border-white shadow-lg"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const handleLocalAcceptJob = (jobId: string) => {
    setAcceptingId(jobId);
    // Simulate smart contract generation on blockchain
    setTimeout(() => {
      setAcceptingId(null);
      setAcceptSuccessId(jobId);
      // Store escrow data for the Agenda escrow notification
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        const escrowData = {
          amount: parseFloat(job.pago) || 0,
          client: job.cliente_nombre
        };
        localStorage.setItem("pendingEscrow", JSON.stringify(escrowData));
      }
      setTimeout(() => {
        setAcceptSuccessId(null);
        onAcceptJob(jobId);
        // Navigate to agenda to show the escrow deposit notification
        router.push("/agenda");
      }, 2000);
    }, 2500);
  };

  return (
    <div 
      className="relative flex-1 h-full w-full z-0" 
      onClick={() => {
        if (mode === "experts") onSelectExpert(null);
        else onSelectJob(null);
      }}
    >
      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={14} 
        zoomControl={false}
        className="w-full h-full"
      >
        <MapUpdater center={[centerLat, centerLng]} zoom={14} />
        
        {/* Voyager Maps Tile Layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <CustomZoomControls />

        {/* Render Experts Markers if in experts mode */}
        {mode === "experts" && experts.map((expert) => {
          if (!expert.lat || !expert.lng) return null;
          const isSelected = expert.id === selectedId;
          
          return (
            <Marker
              key={expert.id}
              position={[expert.lat, expert.lng]}
              icon={createCustomIcon(expert, isSelected)}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  onSelectExpert(isSelected ? null : expert.id);
                },
              }}
            />
          );
        })}

        {/* Render Jobs Markers if in jobs mode */}
        {mode === "jobs" && jobs.map((job) => {
          if (job.status !== "available") return null;
          const isSelected = job.id === selectedJobId;
          
          return (
            <Marker
              key={job.id}
              position={[job.lat, job.lng]}
              icon={createJobIcon(job, isSelected)}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  onSelectJob(isSelected ? null : job.id);
                },
              }}
            />
          );
        })}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        )}
      </MapContainer>

      {/* ── Desktop Mini Card Popup (Overlay over map) ── */}
      <AnimatePresence>
        {mode === "experts" && selectedExpert && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] z-[400] pointer-events-auto hidden lg:block">
             <MiniCard
              expert={selectedExpert}
              onClose={() => onSelectExpert(null)}
              onVerPerfil={onVerPerfil}
              position={{ top: "0", left: "0" }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── Mobile Selected Expert Card ── */}
      <AnimatePresence>
        {mode === "experts" && selectedExpert && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden absolute bottom-28 left-4 right-4 z-[400] bg-white/98 backdrop-blur-xl rounded-[20px] shadow-2xl border border-white p-4 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#E0F2FE] flex-shrink-0">
              {selectedExpert.foto_perfil ? (
                <img src={selectedExpert.foto_perfil} alt={selectedExpert.nombre_completo} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#0d1c2e] font-bold text-xl">
                  {selectedExpert.nombre_completo.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#D81B60] uppercase tracking-wide">{selectedExpert.categoria}</p>
              <h3 className="font-bold text-[#0d1c2e] leading-tight line-clamp-1">{selectedExpert.nombre_completo}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs font-bold">{selectedExpert.calificacion}</span>
                {selectedExpert.tarifa && <span className="text-xs text-[#0288D1] font-bold ml-2">{selectedExpert.tarifa}</span>}
              </div>
            </div>
            <button
              onClick={() => onVerPerfil(selectedExpert.id)}
              className="px-4 py-2.5 bg-[#0d1c2e] text-white font-bold rounded-full text-sm hover:bg-[#1a2e44] transition-colors"
            >
              Ver
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Unified Floating Job Details Card (Desktop & Mobile) ── */}
      <AnimatePresence>
        {mode === "jobs" && selectedJob && (
          <motion.div
            initial={{ y: 150, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 150, opacity: 0, x: "-50%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-md z-[400] bg-white/98 backdrop-blur-xl rounded-[28px] border border-sky-100 shadow-[0_20px_60px_rgba(13,28,46,0.18)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {acceptingId === selectedJob.id ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
                <Loader2 size={44} className="animate-spin text-pink-500 mb-4" />
                <h4 className="text-base font-extrabold text-[#0d1c2e]">Firmando Contrato en la Blockchain</h4>
                <p className="text-xs text-slate-400 font-semibold mt-1.5 max-w-xs">
                  Generando billetera multifirma e inicializando custodia inteligente de TrustPay (Garantía Escrow).
                </p>
              </div>
            ) : acceptSuccessId === selectedJob.id ? (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-fadeIn">
                <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mb-4 text-emerald-500 animate-bounce">
                  <CheckCircle2 size={36} className="fill-emerald-50" />
                </div>
                <h4 className="text-base font-extrabold text-emerald-700">¡Contrato Activado con Éxito!</h4>
                <p className="text-xs text-slate-500 font-semibold mt-1 mb-4">El trabajo ha sido añadido a tu Agenda.</p>
                <button
                  onClick={() => router.push(`/chat/${selectedJob.id}`)}
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-pink-100 flex items-center gap-1.5 justify-center"
                >
                  <MessageSquare size={14} />
                  Chat de Negociación
                </button>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold shadow-sm">
                      {selectedJob.cliente_nombre.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CLIENTE</span>
                      <h4 className="text-sm font-bold text-[#0d1c2e]">{selectedJob.cliente_nombre}</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-amber-400 text-xs">★</span>
                        <span className="text-[10px] font-bold text-slate-600">{selectedJob.cliente_calificacion} / 5.0</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onSelectJob(null)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Job Title & Distance */}
                <div className="mb-4">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-base font-black text-[#0d1c2e] leading-snug">{selectedJob.titulo_trabajo}</h3>
                    <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-sky-100/50 flex-shrink-0 flex items-center gap-1">
                      <MapPin size={10} /> {selectedJob.distancia_km} km
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-2 leading-relaxed">
                    {selectedJob.descripcion}
                  </p>
                </div>

                {/* Job Terms Box */}
                <div className="bg-[#fcf8f2] border border-amber-100 rounded-2xl p-3.5 mb-5 flex gap-2.5 items-start">
                  <ShieldCheck size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest block mb-0.5">TÉRMINOS Y GARANTÍA</span>
                    <p className="text-[11px] text-amber-700 font-bold leading-relaxed">{selectedJob.terminos}</p>
                  </div>
                </div>

                {/* Footer and Actions */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">PRESUPUESTO</span>
                    <span className="text-lg font-black text-emerald-600">{selectedJob.pago} USD</span>
                  </div>

                  <div className="flex gap-2 flex-1 justify-end">
                    <button 
                      onClick={() => router.push(`/chat/${selectedJob.id}`)}
                      className="p-2.5 bg-pink-50 hover:bg-pink-100 text-[#D81B60] font-bold rounded-xl text-xs transition-colors flex items-center justify-center shadow-sm"
                      title="Mensaje para negociar presupuesto"
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button 
                      onClick={() => onDeclineJob(selectedJob.id)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] font-bold rounded-xl text-xs transition-colors"
                    >
                      Rechazar
                    </button>
                    <button 
                      onClick={() => handleLocalAcceptJob(selectedJob.id)}
                      className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-pink-100 flex items-center gap-1"
                    >
                      <Briefcase size={12} />
                      Aceptar Trabajo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
