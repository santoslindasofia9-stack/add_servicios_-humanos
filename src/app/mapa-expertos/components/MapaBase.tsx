"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamically import the real Leaflet map with SSR disabled
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#eef2f7]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-[#E0F2FE] border-t-[#0288D1] rounded-full"
      />
    </div>
  ),
});

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

interface MapaBaseProps {
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

export default function MapaBase(props: MapaBaseProps) {
  return (
    <div className="relative flex-1 h-full overflow-hidden bg-[#eef2f7] z-0">
      <LeafletMap {...props} />
    </div>
  );
}
