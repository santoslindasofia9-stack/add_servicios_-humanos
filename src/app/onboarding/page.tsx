"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OnboardingPagoProtegido() {
  const router = useRouter();

  const handleNext = () => {
    window.location.href = "/onboarding/negociacion";
  };

  const handleSkip = () => {
    window.location.href = "/auth/login?mode=register";
  };

  return (
    <main className="relative h-screen min-h-[600px] w-full overflow-hidden flex flex-col bg-gradient-to-br from-[#fffef5] via-[#fffbf7] to-[#fdf8f0] font-plus-jakarta px-6 py-8">
      {/* Background aesthetic blobs (Manchas en movimiento lento - Enriquecidas) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Blob Principal Celeste - Superior Derecha */}
        <div className="absolute top-[-20%] right-[-10%] w-[110%] h-[110%] bg-[#E0F2FE]/50 rounded-full blur-[140px] animate-blob" />
        
        {/* Blob Principal Rosa - Inferior Izquierda */}
        <div className="absolute bottom-[-20%] left-[-15%] w-[120%] h-[120%] bg-[#FCE4EC]/50 rounded-full blur-[140px] animate-blob [animation-delay:4s]" />
        
        {/* Blob de Acento Beige - Centro Derecha */}
        <div className="absolute top-[30%] right-[-20%] w-[80%] h-[80%] bg-[#FFFDD0]/40 rounded-full blur-[100px] animate-blob [animation-delay:8s]" />

        {/* Blob de Acento Celeste - Inferior Derecha */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#E0F2FE]/30 rounded-full blur-[100px] animate-blob [animation-delay:12s]" />
      </div>


      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center w-full max-w-md mx-auto">
        
        {/* Imagen Superior: Digital Shield/Safe 3D Style (Reduced size for better fit) */}
        <div className="relative w-full max-w-[200px] md:max-w-[240px] aspect-square mb-8 group">
          <div className="absolute inset-0 border border-white/40 rounded-[48px] rotate-3 scale-105 opacity-30" />
          <div className="relative w-full h-full bg-white/40 backdrop-blur-md border border-white/60 rounded-[44px] overflow-hidden shadow-xl flex items-center justify-center p-6 transition-all duration-700">
            <Image
              src="/shield-onboarding.png"
              alt="Tu Pago está Protegido"
              width={180}
              height={180}
              className="object-contain drop-shadow-lg animate-float-slow"
              priority
            />
          </div>
        </div>

        {/* Text Section (Optimized spacing) */}
        <div className="space-y-3 px-2 mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0d1c2e] leading-tight tracking-tight">
            Tu Pago está <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5e6f79] to-[#0d1c2e]">Protegido</span>
          </h1>
          <p className="text-[15px] md:text-base text-[#5e6f79] font-medium leading-relaxed max-w-[280px] mx-auto opacity-80">
            Usamos tecnología de pago seguro para que tu dinero solo se libere cuando estés satisfecho
          </p>
        </div>

        {/* Progress Indicator (2 dots for 2 onboarding screens) */}
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="w-5 h-1.5 rounded-full bg-[#FCE4EC] border border-[#fcd7e5] shadow-sm" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#0d1c2e]/10" />
        </div>
      </div>

      {/* Actions Section */}
      <div className="relative z-10 w-full max-w-xs mx-auto flex flex-col items-center gap-6 pb-2">
        {/* Botón Siguiente */}
        <button
          onClick={handleNext}
          className="group relative w-full bg-[#FCE4EC] hover:bg-[#fbd1de] text-[#0d1c2e] font-bold py-4 px-8 rounded-[28px] shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2.5 overflow-hidden"
        >
          <span className="relative z-10 text-base">Siguiente</span>
          <span className="material-symbols-outlined relative z-10 text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        </button>

        {/* Botón OMITIR */}
        <button
          onClick={handleSkip}
          className="relative z-20 text-[12px] font-extrabold text-[#0d1c2e]/25 tracking-[0.3em] hover:text-[#0d1c2e]/50 transition-colors uppercase py-4 px-8"
        >
          OMITIR
        </button>
      </div>
    </main>


  );
}
