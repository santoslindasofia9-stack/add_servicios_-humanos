"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Plus, Minus } from "lucide-react";
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

interface LeafletMapProps {
  experts: Expert[];
  selectedId: string | null;
  onSelectExpert: (id: string | null) => void;
  onVerPerfil: (id: string) => void;
  userLocation: { lat: number; lng: number } | null;
  mapCenter?: { lat: number; lng: number } | null;
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
  experts,
  selectedId,
  onSelectExpert,
  onVerPerfil,
  userLocation,
  mapCenter,
}: LeafletMapProps) {
  // Center defaults to mapCenter, then user location, then first expert's location, then Bucaramanga
  const centerLat = mapCenter?.lat || userLocation?.lat || (experts[0]?.lat ?? 7.1193);
  const centerLng = mapCenter?.lng || userLocation?.lng || (experts[0]?.lng ?? -73.1227);

  const selectedExpert = experts.find((e) => e.id === selectedId);

  // Custom Icon generation function
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

  // User location icon
  const userIcon = L.divIcon({
    className: 'custom-leaflet-user-icon',
    html: `
      <div class="relative w-5 h-5">
        <div class="absolute inset-0 rounded-full bg-[#0288D1]/30 animate-ping" style="transform: scale(2);"></div>
        <div class="relative w-5 h-5 rounded-full bg-[#0288D1] border-4 border-white shadow-lg"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <div className="relative flex-1 h-full w-full z-0" onClick={() => onSelectExpert(null)}>
      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={13} 
        zoomControl={false}
        className="w-full h-full"
      >
        <MapUpdater center={[centerLat, centerLng]} zoom={13} />
        
        {/* Beautiful map tiles (CartoDB Positron for a light, clean look similar to reference) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <CustomZoomControls />

        {experts.map((expert) => {
          if (!expert.lat || !expert.lng) return null;
          const isSelected = expert.id === selectedId;
          
          return (
            <Marker
              key={expert.id}
              position={[expert.lat, expert.lng]}
              icon={createCustomIcon(expert, isSelected)}
              eventHandlers={{
                click: () => onSelectExpert(isSelected ? null : expert.id),
              }}
            >
              {/* Native popup disabled in favor of our custom MiniCard overlay below, 
                  but we keep the marker clickable */}
            </Marker>
          );
        })}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        )}
      </MapContainer>

      {/* ── Mini Card Popup (Overlay over the map) ── */}
      {/* We center it absolute and shift it slightly up so it looks like it's pointing to the center */}
      <AnimatePresence>
        {selectedExpert && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] z-[400] pointer-events-auto hidden lg:block">
             <MiniCard
              expert={selectedExpert}
              onClose={() => onSelectExpert(null)}
              onVerPerfil={onVerPerfil}
              position={{ top: "0", left: "0" }} // Relative to the div above
            />
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Selected Card */}
      <AnimatePresence>
        {selectedExpert && (
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
    </div>
  );
}
