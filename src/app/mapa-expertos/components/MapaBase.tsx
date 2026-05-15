"use client";

import { useState, useRef, useCallback } from "react";
import { Plus, Minus, Navigation } from "lucide-react";
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

interface MapaBaseProps {
  experts: Expert[];
  selectedId: string | null;
  onSelectExpert: (id: string | null) => void;
  onVerPerfil: (id: string) => void;
  userLocation: { lat: number; lng: number } | null;
}

const CATEGORIA_PIN_COLORS: Record<string, string> = {
  Tech: "#0288D1",
  Hogar: "#F57F17",
  Creativo: "#D81B60",
  Eventos: "#2E7D32",
  Salud: "#93000A",
  "Educación": "#50616B",
};

// Grid positions for pins on the mock map (percentage-based for responsiveness)
const PIN_POSITIONS = [
  { top: "28%", left: "22%" },
  { top: "45%", left: "38%" },
  { top: "35%", left: "58%" },
  { top: "55%", left: "68%" },
  { top: "20%", left: "72%" },
  { top: "62%", left: "30%" },
  { top: "42%", left: "80%" },
  { top: "70%", left: "52%" },
];

// Mini-card popup placement (shifts to avoid overflow)
function getCardPosition(pinTop: string, pinLeft: string) {
  const topPct = parseFloat(pinTop);
  const leftPct = parseFloat(pinLeft);

  const top = topPct > 55 ? `${topPct - 42}%` : `${topPct + 4}%`;
  const left = leftPct > 65 ? `${leftPct - 45}%` : `${leftPct}%`;

  return { top, left };
}

export default function MapaBase({
  experts,
  selectedId,
  onSelectExpert,
  onVerPerfil,
  userLocation,
}: MapaBaseProps) {
  const [zoom, setZoom] = useState(12);
  const mapRef = useRef<HTMLDivElement>(null);

  const handlePinClick = useCallback(
    (id: string) => {
      onSelectExpert(selectedId === id ? null : id);
    },
    [selectedId, onSelectExpert]
  );

  const selectedExpert = experts.find((e) => e.id === selectedId);
  const selectedPinIndex = selectedId
    ? experts.findIndex((e) => e.id === selectedId) % PIN_POSITIONS.length
    : -1;

  return (
    <div
      ref={mapRef}
      className="relative flex-1 h-full overflow-hidden bg-[#eef2f7]"
      onClick={(e) => {
        // Close mini-card if clicking on the map background
        if ((e.target as HTMLElement).dataset.mapbg) onSelectExpert(null);
      }}
    >
      {/* ── Beautiful Static Map Background ── */}
      <div className="absolute inset-0" data-mapbg="true">
        {/* Base map color */}
        <div className="absolute inset-0 bg-[#f0f4f8]" data-mapbg="true" />

        {/* Water bodies */}
        <div className="absolute rounded-full bg-[#cce8f4]/60"
          style={{ width: "45%", height: "30%", top: "60%", left: "35%", filter: "blur(8px)" }} />
        <div className="absolute rounded-full bg-[#cce8f4]/40"
          style={{ width: "20%", height: "15%", top: "15%", left: "5%", filter: "blur(6px)" }} />

        {/* Parks / green areas */}
        <div className="absolute rounded-2xl bg-[#d4edda]/70"
          style={{ width: "18%", height: "14%", top: "20%", left: "40%", transform: "rotate(-5deg)" }} />
        <div className="absolute rounded-2xl bg-[#d4edda]/50"
          style={{ width: "12%", height: "10%", top: "65%", left: "70%", transform: "rotate(8deg)" }} />

        {/* Major road grid */}
        {/* Horizontal roads */}
        {[15, 30, 45, 60, 75].map((top) => (
          <div key={`h${top}`} className="absolute bg-white/70"
            style={{ top: `${top}%`, left: 0, right: 0, height: "2px" }} />
        ))}
        {/* Vertical roads */}
        {[12, 25, 40, 55, 70, 85].map((left) => (
          <div key={`v${left}`} className="absolute bg-white/70"
            style={{ left: `${left}%`, top: 0, bottom: 0, width: "2px" }} />
        ))}

        {/* Secondary roads — diagonal */}
        <div className="absolute bg-white/40"
          style={{ width: "2px", height: "140%", top: "-20%", left: "33%", transform: "rotate(25deg)", transformOrigin: "top" }} />
        <div className="absolute bg-white/40"
          style={{ width: "2px", height: "140%", top: "-20%", left: "60%", transform: "rotate(-18deg)", transformOrigin: "top" }} />

        {/* City blocks */}
        {[
          { t: "10%", l: "13%", w: "10%", h: "12%" },
          { t: "32%", l: "26%", w: "12%", h: "8%" },
          { t: "48%", l: "56%", w: "11%", h: "10%" },
          { t: "22%", l: "60%", w: "9%", h: "11%" },
          { t: "64%", l: "15%", w: "13%", h: "9%" },
          { t: "52%", l: "42%", w: "8%", h: "7%" },
        ].map((block, i) => (
          <div
            key={i}
            className="absolute rounded-sm bg-white/30 border border-white/50"
            style={{ top: block.t, left: block.l, width: block.w, height: block.h }}
          />
        ))}

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #0d1c2e 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          data-mapbg="true"
        />
      </div>

      {/* ── Expert Pins ── */}
      {experts.map((expert, index) => {
        const pos = PIN_POSITIONS[index % PIN_POSITIONS.length];
        const pinColor = CATEGORIA_PIN_COLORS[expert.categoria] || "#50616B";
        const isSelected = expert.id === selectedId;

        return (
          <motion.div
            key={expert.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.08, type: "spring", stiffness: 260, damping: 20 }}
            style={{ position: "absolute", top: pos.top, left: pos.left, zIndex: isSelected ? 55 : 40 }}
            className="transform -translate-x-1/2 -translate-y-full"
          >
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.92 }}
              animate={isSelected ? { scale: 1.2 } : { scale: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                handlePinClick(expert.id);
              }}
              className="relative group cursor-pointer"
              style={{ outline: "none" }}
            >
              {/* Pin Bubble */}
              <div
                className={`w-11 h-11 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center transition-shadow ${
                  isSelected ? "shadow-xl ring-4 ring-white" : "group-hover:shadow-xl"
                }`}
                style={{ backgroundColor: isSelected ? pinColor : "#fff" }}
              >
                {expert.foto_perfil ? (
                  <img
                    src={expert.foto_perfil}
                    alt={expert.nombre_completo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="font-bold text-sm"
                    style={{ color: isSelected ? "#fff" : pinColor }}
                  >
                    {expert.nombre_completo.charAt(0)}
                  </span>
                )}
              </div>

              {/* Pin tail */}
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-white"
                style={{ backgroundColor: isSelected ? pinColor : "#fff" }}
              />

              {/* Rating badge */}
              <div
                className="absolute -top-1 -right-1 bg-white rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-sm border border-gray-100"
                style={{ minWidth: "32px" }}
              >
                <span className="text-yellow-400 text-[9px]">★</span>
                <span className="text-[9px] font-bold text-[#0d1c2e]">{expert.calificacion}</span>
              </div>
            </motion.button>
          </motion.div>
        );
      })}

      {/* ── User Location Pin ── */}
      {userLocation && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ top: "50%", left: "50%", zIndex: 45 }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-5 rounded-full bg-[#0288D1] border-4 border-white shadow-lg"
          />
          <div className="absolute inset-0 rounded-full bg-[#0288D1]/20 scale-150 animate-ping" />
        </div>
      )}

      {/* ── Mini Card Popup ── */}
      <AnimatePresence>
        {selectedExpert && selectedPinIndex >= 0 && (
          <MiniCard
            expert={selectedExpert}
            onClose={() => onSelectExpert(null)}
            onVerPerfil={onVerPerfil}
            position={getCardPosition(
              PIN_POSITIONS[selectedPinIndex].top,
              PIN_POSITIONS[selectedPinIndex].left
            )}
          />
        )}
      </AnimatePresence>

      {/* ── Map Controls (right side) ── */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(z + 1, 20))}
          className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#5e6f79] hover:text-[#0d1c2e] hover:scale-110 active:scale-95 transition-all border border-white"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 1, 1))}
          className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#5e6f79] hover:text-[#0d1c2e] hover:scale-110 active:scale-95 transition-all border border-white"
        >
          <Minus size={18} />
        </button>
      </div>

      {/* ── Zoom Level indicator ── */}
      <div className="absolute bottom-4 right-4 z-30 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-bold text-[#5e6f79] shadow-sm border border-white">
        Zoom {zoom}
      </div>

      {/* ── Bottom Selected Card (Mobile) ── */}
      <AnimatePresence>
        {selectedExpert && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden absolute bottom-28 left-4 right-4 z-50 bg-white/98 backdrop-blur-xl rounded-[20px] shadow-2xl border border-white p-4 flex items-center gap-4"
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

      {/* ── Scale Bar ── */}
      <div className="absolute bottom-4 left-4 z-30 flex items-end gap-2">
        <div className="flex flex-col items-start">
          <div className="w-24 h-1.5 bg-[#0d1c2e]/30 rounded-full" />
          <span className="text-[9px] text-[#5e6f79] font-medium mt-1">{zoom < 10 ? "10 km" : zoom < 14 ? "2 km" : "500 m"}</span>
        </div>
      </div>
    </div>
  );
}
