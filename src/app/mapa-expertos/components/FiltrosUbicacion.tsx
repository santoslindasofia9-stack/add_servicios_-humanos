"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PAISES = ["Colombia", "México", "Argentina", "Chile", "Perú"];
const DEPARTAMENTOS: Record<string, string[]> = {
  Colombia: ["Antioquia", "Cundinamarca", "Valle del Cauca", "Atlántico", "Bolívar"],
  México: ["Ciudad de México", "Jalisco", "Nuevo León", "Puebla", "Yucatán"],
  Argentina: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán"],
  Chile: ["Región Metropolitana", "Biobío", "Valparaíso", "Araucanía", "Coquimbo"],
  Perú: ["Lima", "Arequipa", "La Libertad", "Cusco", "Piura"],
};
const CIUDADES: Record<string, string[]> = {
  Antioquia: ["Medellín", "Bello", "Envigado", "Itagüí", "Rionegro"],
  Cundinamarca: ["Bogotá", "Soacha", "Chía", "Zipaquirá", "Facatativá"],
  "Valle del Cauca": ["Cali", "Buenaventura", "Palmira", "Tuluá", "Buga"],
  Atlántico: ["Barranquilla", "Soledad", "Malambo", "Sabanagrande"],
  Bolívar: ["Cartagena", "Magangué", "Turbaco", "Arjona"],
  "Ciudad de México": ["CDMX Centro", "Coyoacán", "Xochimilco", "Tlalpan"],
  Jalisco: ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá"],
  "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Ñuñoa"],
  Lima: ["Miraflores", "San Isidro", "Barranco", "Surco", "Lince"],
};

interface FiltrosProps {
  busqueda: string;
  onBusquedaChange: (val: string) => void;
  pais: string;
  onPaisChange: (val: string) => void;
  departamento: string;
  onDepartamentoChange: (val: string) => void;
  ciudad: string;
  onCiudadChange: (val: string) => void;
  onMiUbicacion: () => void;
}

export default function FiltrosUbicacion({
  busqueda,
  onBusquedaChange,
  pais,
  onPaisChange,
  departamento,
  onDepartamentoChange,
  ciudad,
  onCiudadChange,
  onMiUbicacion,
}: FiltrosProps) {
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const departamentosDisponibles = pais ? DEPARTAMENTOS[pais] || [] : [];
  const ciudadesDisponibles = departamento ? CIUDADES[departamento] || [] : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenSelect(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const Selector = ({
    id,
    label,
    value,
    options,
    onChange,
    disabled,
  }: {
    id: string;
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
    disabled?: boolean;
  }) => (
    <div className="relative">
      <button
        onClick={() => !disabled && setOpenSelect(openSelect === id ? null : id)}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all border whitespace-nowrap ${
          value
            ? "bg-[#0d1c2e] text-white border-[#0d1c2e] shadow-md"
            : disabled
            ? "bg-white/60 text-[#5e6f79]/40 border-gray-200 cursor-not-allowed"
            : "bg-white/90 text-[#0d1c2e] border-gray-200 hover:border-[#E0F2FE] hover:shadow-sm backdrop-blur-sm"
        }`}
      >
        <span>{value || label}</span>
        {value ? (
          <X
            size={14}
            className="ml-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setOpenSelect(null);
            }}
          />
        ) : (
          <ChevronDown
            size={14}
            className={`transition-transform ${openSelect === id ? "rotate-180" : ""}`}
          />
        )}
      </button>

      <AnimatePresence>
        {openSelect === id && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 min-w-[200px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white z-[999] overflow-hidden"
            style={{ boxShadow: "0 8px 32px rgba(13,28,46,0.12)" }}
          >
            {options.length > 0 ? (
              <div className="max-h-52 overflow-y-auto py-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onChange(opt);
                      setOpenSelect(null);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#E0F2FE]/50 ${
                      value === opt ? "text-[#0288D1] font-bold bg-[#E0F2FE]/30" : "text-[#0d1c2e]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <p className="px-4 py-3 text-sm text-[#5e6f79]">Sin opciones disponibles</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 flex flex-col gap-3"
    >
      {/* Search Bar */}
      <div className="bg-white/95 backdrop-blur-xl rounded-full shadow-xl border border-white flex items-center px-5 py-3 gap-3"
        style={{ boxShadow: "0 8px 32px rgba(13,28,46,0.12)" }}
      >
        <Search size={20} className="text-[#5e6f79] flex-shrink-0" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Busca expertos por nombre, especialidad o servicio..."
          className="flex-1 bg-transparent border-none outline-none text-[#0d1c2e] font-medium text-sm placeholder:text-[#5e6f79]/60"
        />
        {busqueda && (
          <button onClick={() => onBusquedaChange("")} className="text-[#5e6f79] hover:text-[#0d1c2e]">
            <X size={16} />
          </button>
        )}
        <div className="w-px h-5 bg-gray-200" />
        <button className="flex items-center gap-2 text-[#5e6f79] hover:text-[#0d1c2e] transition-colors">
          <SlidersHorizontal size={18} />
          <span className="text-sm font-semibold hidden sm:block">Filtros</span>
        </button>
      </div>

      {/* Location Pill Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Selector
          id="pais"
          label="🌎 País"
          value={pais}
          options={PAISES}
          onChange={(v) => {
            onPaisChange(v);
            onDepartamentoChange("");
            onCiudadChange("");
          }}
        />
        <Selector
          id="departamento"
          label="📍 Departamento"
          value={departamento}
          options={departamentosDisponibles}
          onChange={(v) => {
            onDepartamentoChange(v);
            onCiudadChange("");
          }}
          disabled={!pais}
        />
        <Selector
          id="ciudad"
          label="🏙️ Ciudad"
          value={ciudad}
          options={ciudadesDisponibles}
          onChange={onCiudadChange}
          disabled={!departamento}
        />

        {/* Separator */}
        <div className="hidden sm:block w-px h-8 bg-gray-300/60 mx-1" />

        {/* Mi Ubicación Button */}
        <button
          onClick={onMiUbicacion}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#E0F2FE] text-[#0288D1] font-semibold text-sm hover:bg-[#b8e4fb] transition-all border border-[#E0F2FE] hover:shadow-md whitespace-nowrap"
        >
          <MapPin size={14} />
          <span>Mi ubicación</span>
        </button>
      </div>
    </div>
  );
}
