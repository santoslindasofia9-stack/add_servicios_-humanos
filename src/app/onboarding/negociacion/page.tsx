"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OnboardingNegociacion() {
  const router = useRouter();

  const handleStart = () => {
    // Redirigir directamente al inicio de sesión (Login)
    window.location.href = "/auth/login";
  };

  return (
    <main className="relative h-screen min-h-[600px] w-full overflow-hidden flex flex-col bg-gradient-to-br from-[#fffef5] via-[#fffbf7] to-[#fdf8f0] font-plus-jakarta px-6 py-8">
      {/* Background aesthetic blobs (Continuidad Estética) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[110%] h-[110%] bg-[#E0F2FE]/50 rounded-full blur-[140px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[120%] h-[120%] bg-[#FCE4EC]/50 rounded-full blur-[140px] animate-blob [animation-delay:4s]" />
        <div className="absolute top-[20%] right-[-10%] w-[80%] h-[80%] bg-[#FFFDD0]/40 rounded-full blur-[100px] animate-blob [animation-delay:8s]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center w-full max-w-md mx-auto">
        
        {/* Contenedor Visual Superior: Glassmorphism Expert Card */}
        <div className="relative w-full max-w-[320px] mb-10 group">
          <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-6 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 hover:scale-[1.02]">
            
            {/* Header: Alex M. Experto */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                <Image
                  src="/alex-experto.png"
                  alt="Alex M. Experto"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-[#0d1c2e]">Alex M.</h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#E0F2FE] rounded-full">
                  <span className="material-symbols-outlined text-[12px] text-[#0d1c2e]">verified</span>
                  <span className="text-[10px] font-bold text-[#0d1c2e] uppercase tracking-wider">Experto Certificado</span>
                </div>
              </div>
            </div>

            {/* Auction Info & Chat Button */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-4 py-3 bg-white/50 rounded-2xl border border-white/40">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#5e6f79]">Subasta Activa</span>
                </div>
                <span className="text-sm font-extrabold text-[#0d1c2e]">$450.00</span>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-[#0d1c2e] text-white py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-black transition-colors">
                <span className="material-symbols-outlined text-lg">lock</span>
                <span>Chat Encriptado</span>
              </button>
            </div>
          </div>

          {/* Floating UI Elements */}
          <div className="absolute -top-4 -right-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white flex items-center gap-2 animate-float-slow">
            <span className="material-symbols-outlined text-pink-400 text-lg">security</span>
            <span className="text-[10px] font-bold text-[#0d1c2e]">100% Seguro</span>
          </div>
        </div>

        {/* Text Section */}
        <div className="space-y-4 px-2 mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0d1c2e] leading-tight tracking-tight">
            Negocia con <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5e6f79] to-[#0d1c2e]">Confianza Total</span>
          </h1>
          <p className="text-[15px] md:text-base text-[#5e6f79] font-medium leading-relaxed max-w-[300px] mx-auto opacity-80">
            Tu privacidad es nuestra prioridad. Implementamos Encriptación de Punto a Punto para acuerdos 100% seguros.
          </p>
        </div>

        {/* Technical Details: Security Filters */}
        <div className="flex items-center gap-3 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 mb-8">
          <span className="material-symbols-outlined text-blue-400 text-lg">filter_alt</span>
          <span className="text-[11px] font-bold text-[#0d1c2e] uppercase tracking-widest">Filtros de Seguridad Inteligentes</span>
        </div>

        {/* Progress Indicator (2 dots for 2 onboarding screens) */}
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0d1c2e]/10" />
          <div className="w-5 h-1.5 rounded-full bg-[#FCE4EC] border border-[#fcd7e5] shadow-sm" />
        </div>
      </div>

      {/* Actions Section */}
      <div className="relative z-10 w-full max-w-xs mx-auto flex flex-col items-center gap-6 pb-2">
        {/* Botón Comenzar */}
        <button
          onClick={handleStart}
          className="group relative w-full bg-[#FCE4EC] hover:bg-[#fbd1de] text-[#0d1c2e] font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2.5 overflow-hidden"
        >
          <span className="relative z-10 text-base">Comenzar</span>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        </button>
      </div>
    </main>
  );
}
