"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  Upload,
  Award,
  FileText,
  Check,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Camera,
  Shield,
  Loader2,
  ChevronRight,
  Info,
  Calendar,
  DollarSign,
  AlertTriangle,
  BadgeAlert,
  Sparkles,
  Search,
  Eye,
  Menu
} from "lucide-react";

// Curated Unsplash Professional Headshots for instant use
const PRESET_AVATARS = [
  { id: "avatar1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256", label: "Sofía" },
  { id: "avatar2", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256", label: "Carlos" },
  { id: "avatar3", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256", label: "Elena" },
  { id: "avatar4", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256", label: "Mateo" }
];

const SUGGESTED_CHIPS = [
  "Más de 5 años de experiencia en el sector.",
  "Atención al detalle y puntualidad garantizada.",
  "Especializado en proyectos residenciales y corporativos.",
  "Comprometido con la excelencia y satisfacción total."
];

// Expanded Specialties: Added 16 new ones (total 23 options)
const PROFESSIONS_LIST = [
  "Desarrollo de Software & Web",
  "Diseño UX/UI & Dirección de Arte",
  "Electricidad & Redes Eléctricas",
  "Plomería, Calefacción & Gasfitería",
  "Arquitectura & Diseño de Interiores",
  "Consultor de Finanzas & Legal",
  "Soporte Técnico de TI",
  "Marketing Digital & SEO Specialist",
  "Redactor de Contenido & Copywriter",
  "Community Manager & Redes Sociales",
  "Profesor Particular & Tutor Académico",
  "Fotógrafo & Videógrafo Profesional",
  "Traductor & Intérprete Bilingüe",
  "Entrenador Personal & Coach de Bienestar",
  "Diseñador de Modas & Asesor de Imagen",
  "Asistente Virtual & Administración",
  "Psicólogo & Terapeuta Online",
  "Nutricionista & Dietista Certificado",
  "Jardinero & Paisajista Residencial",
  "Técnico de Aire Acondicionado & Refrigeración",
  "Pintor & Decorador de Interiores",
  "Carpintero & Ebanista Profesional",
  "Otro (Escribir especialidad personalizada)"
];

// Vulgar / Inappropriate words policy filter
const BANNED_WORDS = [
  "pendejo", "pendeja", "mierda", "cabron", "cabrona", "puta", "puto", "hijo de puta", 
  "marica", "maricon", "culero", "culera", "pingo", "verga", "ass", "bitch", "bastardo", 
  "chupa", "gonorrea", "hp", "idiota", "estupido", "estupida", "pene", "vagina", "anal",
  "cbron", "putita", "mrd", "asshole", "fuck"
];

interface Certificate {
  id: string;
  titulo: string;
  institucion: string;
  fileName: string;
  uploading: boolean;
  progress: number;
}

export default function VerificacionPro() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditStep, setAuditStep] = useState(0);

  // File inputs references for direct preview click triggers
  const cvInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [nombre, setNombre] = useState("");
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0].url);
  const [especialidad, setEspecialidad] = useState("Desarrollo de Software & Web");
  const [customEspecialidad, setCustomEspecialidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [experiencia, setExperiencia] = useState("3");
  const [tarifa, setTarifa] = useState("35");
  const [ubicacion, setUbicacion] = useState("Medellín, Colombia");
  
  // Security checks states
  const [nombreError, setNombreError] = useState<string | null>(null);
  const [descripcionError, setDescripcionError] = useState<string | null>(null);
  const [customEspecialidadError, setCustomEspecialidadError] = useState<string | null>(null);
  const [ubicacionError, setUbicacionError] = useState<string | null>(null);

  // File upload simulation states
  const [cvFile, setCvFile] = useState<string | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvProgress, setCvProgress] = useState(0);

  const [idFile, setIdFile] = useState<string | null>(null);
  const [idUploading, setIdUploading] = useState(false);
  const [idProgress, setIdProgress] = useState(0);

  const [certificados, setCertificados] = useState<Certificate[]>([
    { id: "1", titulo: "Certificado Profesional Cloud", institucion: "Google Tech", fileName: "google_cloud_cert.pdf", uploading: false, progress: 100 }
  ]);
  const [newCertTitle, setNewCertTitle] = useState("");
  const [newCertInst, setNewCertInst] = useState("");
  
  // Terms and Conduct Agreement
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeConduct, setAgreeConduct] = useState(false);

  // Sync user name from local storage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setNombre(savedName);
    }
  }, []);

  // Content security policy checker
  const hasInappropriateWords = (text: string): boolean => {
    const cleanText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return BANNED_WORDS.some(word => {
      const regex = new RegExp(`\\b${word}\\b|${word}`, "i");
      return regex.test(cleanText);
    });
  };

  // Real-time validation checks
  useEffect(() => {
    if (nombre.trim() && hasInappropriateWords(nombre)) {
      setNombreError("Política de Seguridad: Se ha detectado un término inapropiado. Por favor, utiliza tu nombre real.");
    } else {
      setNombreError(null);
    }
  }, [nombre]);

  useEffect(() => {
    if (descripcion.trim() && hasInappropriateWords(descripcion)) {
      setDescripcionError("Política de Seguridad: Tu biografía contiene términos no aptos para un perfil profesional.");
    } else {
      setDescripcionError(null);
    }
  }, [descripcion]);

  useEffect(() => {
    if (customEspecialidad.trim() && hasInappropriateWords(customEspecialidad)) {
      setCustomEspecialidadError("Política de Seguridad: El término de tu profesión personalizada no está permitido.");
    } else {
      setCustomEspecialidadError(null);
    }
  }, [customEspecialidad]);

  useEffect(() => {
    if (ubicacion.trim() && hasInappropriateWords(ubicacion)) {
      setUbicacionError("Política de Seguridad: Término inapropiado detectado en la ubicación.");
    } else {
      setUbicacionError(null);
    }
  }, [ubicacion]);

  // Combined customized specialty
  const displayedEspecialidad = especialidad === "Otro (Escribir especialidad personalizada)"
    ? (customEspecialidad || "Especialidad Personalizada")
    : especialidad;

  // Description suggestion handler
  const addChipToDescription = (chip: string) => {
    if (descripcion.includes(chip)) return;
    setDescripcion(prev => prev ? `${prev} ${chip}` : chip);
  };

  // Simulated CV uploader
  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCvUploading(true);
      setCvProgress(10);
      
      const interval = setInterval(() => {
        setCvProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setCvUploading(false);
            setCvFile(file.name);
            return 100;
          }
          return prev + 25;
        });
      }, 300);
    }
  };

  // Simulated ID Card Uploader
  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdUploading(true);
      setIdProgress(15);
      
      const interval = setInterval(() => {
        setIdProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIdUploading(false);
            setIdFile(file.name);
            return 100;
          }
          return prev + 20;
        });
      }, 250);
    }
  };

  // Add new certificate
  const handleAddCertificate = () => {
    if (!newCertTitle || !newCertInst) return;
    
    const newId = Date.now().toString();
    const newCert: Certificate = {
      id: newId,
      titulo: newCertTitle,
      institucion: newCertInst,
      fileName: `cert_${newCertTitle.toLowerCase().replace(/\s+/g, "_")}.pdf`,
      uploading: true,
      progress: 0
    };

    setCertificados(prev => [...prev, newCert]);
    setNewCertTitle("");
    setNewCertInst("");

    // Simulate certificate upload
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setCertificados(prev => 
        prev.map(c => c.id === newId ? { ...c, progress: currentProgress } : c)
      );

      if (currentProgress >= 100) {
        clearInterval(interval);
        setCertificados(prev => 
          prev.map(c => c.id === newId ? { ...c, uploading: false } : c)
        );
      }
    }, 200);
  };

  const removeCertificate = (id: string) => {
    setCertificados(prev => prev.filter(c => c.id !== id));
  };

  // Simulate AI Verification Engine
  const startAuditSimulation = () => {
    setLoading(true);
    setAuditStep(0);
    setAuditLogs([]);

    const steps = [
      "Iniciando auditoría biométrica de identidad...",
      "Analizando cédula oficial / documento de identidad...",
      "✓ Identidad física verificada con éxito.",
      "Validando archivos adjuntos de Currículum Vitae...",
      "Analizando títulos académicos y certificaciones con IA...",
      "✓ Firma digital e institución emisora validadas.",
      "Comprobando antecedentes y antecedentes comerciales...",
      "✓ Filtro de reputación TrustMarket: Excelente reputación.",
      "Creando perfil profesional encriptado...",
      "¡Felicidades! Verificación de Nivel Premium Aprobada."
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setAuditLogs(prev => [...prev, steps[current]]);
        setAuditStep(current + 1);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Guardar estado verificado en localStorage
          localStorage.setItem("isProVerified", "true");
          localStorage.setItem("proSpecialty", displayedEspecialidad);
          localStorage.setItem("proAvatar", avatar);
          localStorage.setItem("proDescription", descripcion);
          localStorage.setItem("proTarifa", tarifa);
          localStorage.setItem("proExperiencia", experiencia);
          localStorage.setItem("proLocation", ubicacion);
          localStorage.setItem("proCertificadosCount", certificados.length.toString());

          // Redireccionar al editor de servicios profesional recién creado
          window.location.href = "/perfil-y-editor-de-servicios-2";
        }, 1500);
      }
    }, 600);
  };

  // Check if step 1 has any validation error to block progress
  const hasStep1Errors = !!(nombreError || descripcionError || customEspecialidadError || ubicacionError || !nombre.trim() || !descripcion.trim() || !ubicacion.trim() || (especialidad === "Otro (Escribir especialidad personalizada)" && !customEspecialidad.trim()));

  return (
    <main className="relative min-h-screen w-full bg-[#f8f9ff] font-plus-jakarta overflow-hidden pb-12">
      {/* Aesthetic blur blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-[#E0F2FE]/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[80%] h-[80%] bg-[#FCE4EC]/30 rounded-full blur-[120px]" />
      </div>

      {/* Decorative Header */}
      <header className="relative z-10 w-full bg-white/70 backdrop-blur-md border-b border-sky-50 py-4 px-6 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500 font-bold shadow-sm">T</span>
            <div className="text-xl font-bold text-[#0d1c2e] tracking-tight">
              TrustMarket <span className="text-sky-500 text-sm font-semibold">Pro</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold bg-[#E0F2FE] text-sky-800 px-3.5 py-1.5 rounded-full border border-sky-200">
              <Shield size={14} className="text-sky-600 animate-pulse" />
              PORTAL DE VERIFICACIÓN SEGURO
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Real-time Live Preview Card (Sticky UX) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-6 shadow-2xl relative overflow-hidden group">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100/30 rounded-bl-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-50/40 rounded-tr-[80px] -z-10" />

            {/* Header Badge */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Verificación en Proceso</span>
              </div>
              <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Vista Previa de Cliente
              </div>
            </div>

            {/* Main Profile Portrait & Stats */}
            <div className="flex items-center gap-5 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md relative bg-slate-100">
                  {avatar ? (
                    <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={32} />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-sky-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <Shield size={13} className="fill-white" />
                </div>
              </div>
              
              <div className="space-y-1 flex-1">
                <h3 className={`text-xl font-bold leading-none transition-colors ${nombreError ? "text-red-500" : "text-[#0d1c2e]"}`}>
                  {nombreError ? "Nombre Inapropiado" : (nombre || "Tu nombre aquí")}
                </h3>
                <p className={`text-sm font-semibold transition-colors ${customEspecialidadError ? "text-red-500" : "text-sky-600"}`}>
                  {customEspecialidadError ? "Especialidad Inapropiada" : displayedEspecialidad}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 flex-wrap">
                  <div className="flex items-center text-amber-400">
                    {"★".repeat(5)}
                  </div>
                  <span>5.0 (0 Reseñas)</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className={`font-bold transition-colors ${ubicacionError ? "text-red-500" : "text-slate-600"}`}>
                    📍 {ubicacionError ? "Ubicación no apta" : (ubicacion || "Ubicación")}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Details Chips */}
            <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Calendar size={14} className="text-sky-500" />
                <div>
                  <span className="block font-bold text-[#0d1c2e]">{experiencia} años</span>
                  <span className="text-[10px] text-slate-400">Experiencia</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <DollarSign size={14} className="text-emerald-500" />
                <div>
                  <span className="block font-bold text-[#0d1c2e]">${tarifa}/hr</span>
                  <span className="text-[10px] text-slate-400">Tarifa Estimada</span>
                </div>
              </div>
            </div>

            {/* Bio Description Preview */}
            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sobre Mí</h4>
              <p className={`text-sm font-medium leading-relaxed italic bg-white/50 p-3 rounded-2xl border min-h-[60px] transition-colors ${descripcionError ? "text-red-500 bg-red-50/30 border-red-100" : "text-[#5e6f79] border-slate-50"}`}>
                {descripcionError ? `"${descripcionError}"` : (descripcion || '"Escribe algo sobre tu trayectoria profesional y lo que ofreces a tus clientes en el formulario de la derecha..."')}
              </p>
            </div>

            {/* Document Badges (Dynamic Clickable Uploaders) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Documentación Verificada</h4>
                <span className="text-[9px] font-bold text-sky-500 animate-pulse">¡Haz clic para subir rápido!</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {/* 1. Clickable CV Badge */}
                <button
                  type="button"
                  onClick={() => cvInputRef.current?.click()}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer hover:scale-105 active:scale-95 group focus:outline-none ${
                    cvFile 
                      ? "bg-emerald-50/70 border-emerald-300 text-emerald-800 hover:bg-emerald-100/70" 
                      : "bg-slate-50 border-slate-100 text-slate-400 hover:border-pink-200 hover:bg-pink-50/30"
                  }`}
                >
                  <FileText size={16} className={`transition-transform group-hover:scale-110 ${cvFile ? "text-emerald-600" : "text-slate-400"}`} />
                  <span className="text-[9px] font-bold mt-1">Hoja de Vida</span>
                  <span className="text-[8px] font-semibold mt-0.5">{cvFile ? "✓ Cargado" : "Clic para Subir"}</span>
                </button>

                {/* 2. Clickable ID Badge */}
                <button
                  type="button"
                  onClick={() => idInputRef.current?.click()}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer hover:scale-105 active:scale-95 group focus:outline-none ${
                    idFile 
                      ? "bg-emerald-50/70 border-emerald-300 text-emerald-800 hover:bg-emerald-100/70" 
                      : "bg-slate-50 border-slate-100 text-slate-400 hover:border-sky-200 hover:bg-sky-50/30"
                  }`}
                >
                  <Shield size={16} className={`transition-transform group-hover:scale-110 ${idFile ? "text-emerald-600" : "text-slate-400"}`} />
                  <span className="text-[9px] font-bold mt-1">Identidad Oficial</span>
                  <span className="text-[8px] font-semibold mt-0.5">{idFile ? "✓ Escaneado" : "Clic para Subir"}</span>
                </button>

                {/* 3. Certificates Badge */}
                <div className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${certificados.length > 0 ? "bg-emerald-50/50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-100 text-slate-400"}`}>
                  <Award size={16} className={certificados.length > 0 ? "text-emerald-600" : "text-slate-400"} />
                  <span className="text-[9px] font-bold mt-1">Certificados</span>
                  <span className="text-[8px] font-semibold mt-0.5">{certificados.length > 0 ? `${certificados.length} Aprobados` : "Ninguno"}</span>
                </div>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwaTROmFJR9GGXIjG2VxPjXBHF5zXN8Ghac9u3EWxNqvxjoNUc5cSPBnDwOM-DwLDNqphT4nkrjlD4rX6zcQo3FLIO8IXU_Hd6uUORYhP2lbwKoLy4jCBdcVgElfB8QMNaGTXzLxU5RhGkJQ8x7_sOJ8rlyxV4OK-vcf_8-K48oHvZWOGZ0nVBHI_dZrcGCqibjc-5uo8687D8hYqizWcAKxHZHHGS8EaIZCFnYRIPxK9SMpBxSZci_i0GXeuD2F_Gt6z6QjY7fA" width={24} height={24} alt="Shield badge" className="rounded-full" />
                <span className="text-[10px] font-extrabold text-[#0d1c2e]">TrustMarket Escrow Partner</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">ID: TMP-2026-9041</span>
            </div>
          </div>

          {/* Secure compliance info card */}
          <div className="bg-[#E0F2FE]/50 border border-[#b7c9d5]/30 rounded-2xl p-4 flex gap-3 text-xs text-sky-950 font-medium">
            <Info className="text-sky-600 shrink-0 mt-0.5" size={16} />
            <p>
              Toda la información y documentación ingresada está protegida bajo cifrado militar de punto a punto y sólo será utilizada con fines de validación técnica de antecedentes profesionales.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Wizard Form */}
        <div className="lg:col-span-7 bg-white rounded-[32px] border border-slate-100 p-8 shadow-xl">
          
          {/* Steps Breadcrumb Progress Bar */}
          <div className="flex justify-between items-center mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-pink-300 -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />

            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => s < step && setStep(s)}
                disabled={s >= step || (s > 1 && hasStep1Errors)}
                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  step === s
                    ? "bg-[#FCE4EC] border-[#fcd7e5] text-[#0d1c2e] scale-110 shadow-md"
                    : s < step
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {s < step ? <Check size={16} strokeWidth={3} /> : s}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <span className="text-xs font-bold text-pink-500 tracking-widest uppercase">Paso {step} de 3</span>
            <h2 className="text-2xl font-extrabold text-[#0d1c2e] mt-1">
              {step === 1 && "Información de Perfil Público"}
              {step === 2 && "Documentación y Credenciales"}
              {step === 3 && "Revisión Final y Auditoría de Seguridad"}
            </h2>
            <p className="text-sm text-[#5e6f79] font-medium mt-1">
              {step === 1 && "Define cómo te verán los clientes en la plataforma. Destaca tus habilidades."}
              {step === 2 && "Sube documentos de respaldo para obtener tu insignia dorada de verificación."}
              {step === 3 && "Revisa tu información y pon en marcha la verificación inteligente TrustMarket."}
            </p>
          </div>

          <hr className="border-slate-100 my-6" />

          {/* Form Step Contents */}
          <div className="min-h-[380px]">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: BASIC PROFESSIONAL INFO */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Name field with real-time Security Policy Badges */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-[#0d1c2e]">Nombre Completo del Profesional</label>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Shield size={10} className="text-sky-500" />
                        Seguridad Activa
                      </span>
                    </div>

                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${nombreError ? "text-red-500 animate-bounce" : "text-slate-400"}`} size={18} />
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ingresa tu nombre completo"
                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-all font-medium text-[#0d1c2e] ${
                          nombreError 
                            ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100/50 text-red-700 bg-red-50/10" 
                            : "border-slate-100 focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30"
                        }`}
                      />
                    </div>

                    {/* Animated validation alert message */}
                    <AnimatePresence>
                      {nombreError && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex gap-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl items-start"
                        >
                          <AlertTriangle className="shrink-0 mt-0.5 text-red-500" size={14} />
                          <span>{nombreError}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile Picture / Quick Presets Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-[#0d1c2e] block">Foto de Perfil Profesional</label>
                    <p className="text-xs text-slate-500">Sube tu foto formal o elige uno de nuestros retratos preestablecidos de alta calidad:</p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Upload Button Mock */}
                      <label className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#FCE4EC] flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50 hover:bg-pink-50/20">
                        <Camera size={20} className="text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-500 mt-1">Subir Foto</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) setAvatar(event.target.result as string);
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }} />
                      </label>

                      {/* Preset Portait Grid */}
                      <div className="flex gap-2.5">
                        {PRESET_AVATARS.map((av) => (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setAvatar(av.url)}
                            className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all relative ${
                              avatar === av.url ? "border-[#FCE4EC] scale-110 shadow-md ring-4 ring-pink-100" : "border-slate-100 hover:border-slate-200"
                            }`}
                          >
                            <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                            {avatar === av.url && (
                              <div className="absolute inset-0 bg-[#0d1c2e]/10 flex items-center justify-center">
                                <Check size={16} className="text-white fill-[#0d1c2e]" strokeWidth={4} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Profession Selection (Dynamic + Custom Write-In Option) */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#0d1c2e]">Especialidad Profesional</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                          value={especialidad}
                          onChange={(e) => setEspecialidad(e.target.value)}
                          className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30 transition-all font-semibold text-[#0d1c2e] appearance-none cursor-pointer"
                        >
                          {PROFESSIONS_LIST.map((prof, idx) => (
                            <option key={idx} value={prof}>{prof}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Custom Profession Write-In Field with Framer Motion */}
                    <AnimatePresence>
                      {especialidad === "Otro (Escribir especialidad personalizada)" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <label className="text-xs font-bold text-slate-500 ml-1">Escribe tu profesión personalizada</label>
                          <input
                            type="text"
                            value={customEspecialidad}
                            onChange={(e) => setCustomEspecialidad(e.target.value)}
                            placeholder="Ej. Entrenador de Caninos, Chef a Domicilio, Jardinero Paisajista..."
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-all font-medium text-[#0d1c2e] ${
                              customEspecialidadError
                                ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100/50 text-red-700 bg-red-50/10"
                                : "border-slate-100 focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30"
                            }`}
                          />
                          {customEspecialidadError && (
                            <div className="flex gap-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-xl items-center">
                              <AlertTriangle className="shrink-0 text-red-500" size={14} />
                              <span>{customEspecialidadError}</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Experience & Rate Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#0d1c2e]">Años de Experiencia</label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={experiencia}
                        onChange={(e) => setExperiencia(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30 transition-all font-medium text-[#0d1c2e]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#0d1c2e]">Tarifa por Hora (USD)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          min="5"
                          max="999"
                          value={tarifa}
                          onChange={(e) => setTarifa(e.target.value)}
                          className="w-full pl-8 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30 transition-all font-medium text-[#0d1c2e]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Location Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#0d1c2e]">Ubicación del Profesional</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">📍</span>
                      <input
                        type="text"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        placeholder="Ej. Medellín, Colombia o Remoto"
                        className={`w-full pl-10 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-all font-medium text-[#0d1c2e] ${
                          ubicacionError
                            ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100/50 text-red-700 bg-red-50/10"
                            : "border-slate-100 focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30"
                        }`}
                      />
                    </div>
                    {ubicacionError && (
                      <div className="flex gap-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-xl items-center">
                        <AlertTriangle className="shrink-0 text-red-500" size={14} />
                        <span>{ubicacionError}</span>
                      </div>
                    )}
                  </div>

                  {/* Biography Area */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-[#0d1c2e]">Breve descripción sobre en qué trabajas</label>
                    <textarea
                      rows={4}
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Ej. Ofrezco servicios avanzados de diseño y desarrollo web. Especializado en Next.js, con enfoque en velocidad y diseño premium..."
                      className={`w-full p-4 bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-all font-medium text-[#0d1c2e] text-sm leading-relaxed ${
                        descripcionError
                          ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100/50 text-red-700 bg-red-50/10"
                          : "border-slate-100 focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30"
                      }`}
                    />
                    
                    {descripcionError && (
                      <div className="flex gap-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-xl items-center">
                        <AlertTriangle className="shrink-0 text-red-500" size={14} />
                        <span>{descripcionError}</span>
                      </div>
                    )}

                    {/* Suggestion helper chips */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Sugerencias rápidas para tu bio:</span>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTED_CHIPS.map((chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => addChipToDescription(chip)}
                            className="text-xs font-semibold bg-sky-50 text-sky-800 hover:bg-[#FCE4EC] hover:text-[#0d1c2e] border border-sky-100 px-3 py-1.5 rounded-xl transition-all"
                          >
                            + {chip.slice(0, 30)}...
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: CREDENTIALS & FILE UPLOADS */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* CV Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#0d1c2e] block">Carga de Currículum Vitae / Hoja de Vida</label>
                    <p className="text-xs text-slate-500">Adjunta tu hoja de vida profesional para verificar tu historial y experiencia laboral.</p>
                    
                    <div className="relative border-2 border-dashed border-slate-200 hover:border-[#FCE4EC] rounded-2xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center transition-all">
                      <input 
                        ref={cvInputRef}
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleCvUpload}
                      />
                      
                      {cvUploading ? (
                        <div className="space-y-3 w-full max-w-[200px]">
                          <Loader2 className="mx-auto text-pink-400 animate-spin" size={32} />
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#FCE4EC] h-full transition-all duration-300" style={{ width: `${cvProgress}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-500">Cargando {cvProgress}%</span>
                        </div>
                      ) : cvFile ? (
                        <div className="space-y-2 relative z-10">
                          <CheckCircle2 className="mx-auto text-emerald-500" size={36} />
                          <p className="text-sm font-bold text-[#0d1c2e]">{cvFile}</p>
                          <button 
                            type="button"
                            onClick={() => setCvFile(null)} 
                            className="text-xs font-bold text-red-500 hover:underline"
                          >
                            Eliminar y cambiar archivo
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="mx-auto text-slate-400" size={36} />
                          <p className="text-sm font-bold text-[#0d1c2e]">Arrastra tu Hoja de Vida aquí</p>
                          <p className="text-xs text-slate-400">PDF, Word o DOCX hasta 15MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ID Verification Scanner Mock */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#0d1c2e] block">Verificación de Identidad Oficial (Cédula/DNI/Pasaporte)</label>
                    <p className="text-xs text-slate-500">Requerido por seguridad y para activar las garantías de cobro en TrustMarket.</p>
                    
                    <div className="relative border-2 border-dashed border-slate-200 hover:border-sky-300 rounded-2xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center transition-all overflow-hidden">
                      <input 
                        ref={idInputRef}
                        type="file" 
                        accept="image/*,.pdf" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleIdUpload}
                      />

                      {idUploading ? (
                        <div className="space-y-3 w-full max-w-[200px]">
                          <Loader2 className="mx-auto text-sky-500 animate-spin" size={32} />
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#E0F2FE] h-full transition-all duration-300" style={{ width: `${idProgress}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-500">Escaneando {idProgress}%</span>
                        </div>
                      ) : idFile ? (
                        <div className="space-y-2 relative z-10">
                          <Shield className="mx-auto text-emerald-500 fill-emerald-100" size={36} />
                          <p className="text-sm font-bold text-[#0d1c2e]">Identidad Oficial Capturada</p>
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">✓ Encriptado Seguro AES-256</span>
                          <p className="text-xs text-slate-400 mt-1">{idFile}</p>
                          <button 
                            type="button"
                            onClick={() => setIdFile(null)} 
                            className="text-xs font-bold text-red-500 hover:underline block mx-auto"
                          >
                            Eliminar y escanear de nuevo
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Camera className="mx-auto text-slate-400" size={36} />
                          <p className="text-sm font-bold text-[#0d1c2e]">Escanear o Subir Identidad Oficial</p>
                          <p className="text-xs text-slate-400">Captura frontal de tu documento (JPG, PNG o PDF)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Certificates Dynamic List */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-[#0d1c2e]">Certificados y Títulos Adicionales</label>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {certificados.length} Cargado(s)
                      </span>
                    </div>

                    {/* New Certificate input card */}
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Agregar Nuevo Certificado</p>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Nombre del Certificado (ej. Scrum Master)"
                          value={newCertTitle}
                          onChange={(e) => setNewCertTitle(e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#0d1c2e] focus:outline-none focus:border-[#FCE4EC]"
                        />
                        <input
                          type="text"
                          placeholder="Institución Emisora (ej. Scrum Alliance)"
                          value={newCertInst}
                          onChange={(e) => setNewCertInst(e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#0d1c2e] focus:outline-none focus:border-[#FCE4EC]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCertificate}
                        disabled={!newCertTitle || !newCertInst}
                        className="w-full flex items-center justify-center gap-1 py-2 bg-[#FCE4EC] hover:bg-[#fbd1de] text-[#0d1c2e] font-bold text-xs rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Plus size={14} />
                        Cargar Certificado con Validation
                      </button>
                    </div>

                    {/* Uploaded Certificate Items list */}
                    <div className="space-y-2">
                      {certificados.map((cert) => (
                        <div key={cert.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <Award className="text-amber-500" size={24} />
                            <div>
                              <p className="text-xs font-bold text-[#0d1c2e]">{cert.titulo}</p>
                              <p className="text-[10px] font-semibold text-slate-400">{cert.institucion} • {cert.fileName}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {cert.uploading ? (
                              <div className="flex items-center gap-1.5">
                                <Loader2 className="text-pink-400 animate-spin" size={14} />
                                <span className="text-[10px] font-bold text-slate-400">{cert.progress}%</span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Check size={10} strokeWidth={3} /> Valido
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeCertificate(cert.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: DYNAMIC AI RUNTIME AUDIT */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-[#0d1c2e]">Resumen Técnico de Admisión</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                      <div>
                        <span className="block text-slate-400 text-[10px] uppercase">Nombre Comercial</span>
                        <span className="text-[#0d1c2e] font-bold">{nombre}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 text-[10px] uppercase">Especialidad Principal</span>
                        <span className="text-[#0d1c2e] font-bold text-sky-600">{displayedEspecialidad}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 text-[10px] uppercase">Años de Práctica</span>
                        <span className="text-[#0d1c2e] font-bold">{experiencia} Años</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 text-[10px] uppercase">Documentación Adjunta</span>
                        <span className="text-emerald-600 font-bold">
                          {cvFile ? "Hoja de Vida" : ""} {idFile ? " DNI / ID" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ethics & Guarantee checkboxes */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded-md border-slate-200 text-sky-500 focus:ring-sky-100 transition-all cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-[#0d1c2e] group-hover:text-sky-600 transition-colors block">
                          Acepto el Código de Conducta de TrustMarket
                        </span>
                        <span className="text-slate-400 font-semibold block mt-0.5">
                          Me comprometo a ofrecer cotizaciones justas, comunicación clara y cumplir puntualmente con los entregables de contrato acordados.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={agreeConduct}
                        onChange={(e) => setAgreeConduct(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded-md border-slate-200 text-sky-500 focus:ring-sky-100 transition-all cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-[#0d1c2e] group-hover:text-sky-600 transition-colors block">
                          Autorizo la verificación de antecedentes profesionales
                        </span>
                        <span className="text-slate-400 font-semibold block mt-0.5">
                          Entiendo que la insignia de confianza se otorga posterior a la validación técnica digital de los documentos cargados.
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Auditing Engine Simulator Overlay */}
                  {loading && (
                    <div className="bg-black/95 text-green-400 font-mono text-xs p-4 rounded-2xl shadow-xl min-h-[160px] border border-green-500/20 relative overflow-hidden space-y-2">
                      <div className="absolute top-2 right-4 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                        <span className="text-[10px] font-bold tracking-wider text-green-500">AUDITORÍA ACTIVA</span>
                      </div>
                      
                      {auditLogs.map((log, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-center gap-1.5 ${log.startsWith("✓") ? "text-emerald-400 font-bold" : "text-green-400/80"}`}
                        >
                          {log.startsWith("✓") ? "" : "> "}
                          {log}
                        </motion.div>
                      ))}

                      {auditStep < 10 && (
                        <div className="flex items-center gap-2 mt-4 text-green-300">
                          <Loader2 size={14} className="animate-spin text-green-400" />
                          <span>Procesando hash criptográfico de seguridad...</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <hr className="border-slate-100 my-6" />

          {/* Navigation Action Footer */}
          <div className="flex justify-between items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                disabled={loading}
                className="flex items-center gap-2 text-sm font-bold text-[#5e6f79] hover:text-[#0d1c2e] transition-colors disabled:opacity-40"
              >
                <ArrowLeft size={16} />
                Atrás
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev + 1)}
                disabled={step === 1 && hasStep1Errors}
                className="group bg-[#0d1c2e] hover:bg-[#1a2c3a] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed"
              >
                Siguiente Paso
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                type="button"
                onClick={startAuditSimulation}
                disabled={loading || !agreeTerms || !agreeConduct || !cvFile || !idFile}
                className="group bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-95 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Realizando Verificación...</span>
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    <span>Iniciar Verificación y Guardar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
