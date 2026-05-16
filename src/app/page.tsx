"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  // Simulación de carga y verificación de sesión
  useEffect(() => {
    // Verificar si ya hay una sesión activa real para saltar el splash
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const savedRole = localStorage.getItem("userRole");

    if (isLoggedIn && savedRole) {
      const target = savedRole === "client" ? "/home-cliente" : "/dashboard-pro";
      router.replace(target);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [router]);

  const handleContinue = () => {
    window.location.href = "/onboarding";
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#fffef5] font-plus-jakarta p-6">
      {/* Background Waves (Total Coverage) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Wave Layer 1: Celeste (Large coverage) */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[#E0F2FE]/40 rounded-[45%] animate-wave" />
        
        {/* Wave Layer 2: Rosita (Large coverage) */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[130%] h-[130%] bg-[#FCE4EC]/40 rounded-[43%] animate-wave [animation-delay:5s]" />
        
        {/* Wave Layer 3: Beige (Middle fill) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[#FFFDD0]/30 rounded-[40%] animate-wave [animation-delay:10s]" />

        {/* Wave Layer 4: Celeste (Bottom Left accent) */}
        <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#E0F2FE]/30 rounded-[48%] animate-wave [animation-delay:2s]" />
        
        {/* Wave Layer 5: Rosita (Top Right accent) */}
        <div className="absolute top-[-20%] right-[-20%] w-[90%] h-[90%] bg-[#FCE4EC]/30 rounded-[42%] animate-wave [animation-delay:7s]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-2xl px-4">
        
        {/* Logo Container (Adjusted for better fit) */}
        <div className="relative mb-8 group">
          {/* Ambient Glow */}
          <div className="absolute inset-0 ethereal-gradient blur-3xl opacity-20 rounded-full scale-150 animate-soft-pulse" />
          
          {/* Frame with black border and rounded corners */}
          <div className="relative w-44 h-44 md:w-56 md:h-56 bg-white border-[3px] border-black rounded-[48px] overflow-hidden shadow-2xl flex items-center justify-center transform transition-transform group-hover:scale-105 duration-1000">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 shimmer-effect opacity-10" />
            
            <div className="relative w-full h-full p-2">
              <Image
                src="/logo-v3.png"
                alt="TrustMarket Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 176px, 224px"
                priority
              />
            </div>
          </div>
        </div>

        {/* Branding Text */}
        <div className="space-y-4 mb-12">
          <h1 className="text-3xl md:text-[48px] font-extrabold text-[#0d1c2e] tracking-tighter leading-tight">
            Marketplace de Confianza
          </h1>
          <p className="text-body-lg md:text-xl text-[#5e6f79] font-medium opacity-80 max-w-md mx-auto">
            Conectando talento, construyendo confianza.
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="w-full max-w-[280px] flex flex-col items-center mb-12">
          <div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden mb-8">
            <div 
              className="h-full ethereal-gradient shimmer-effect transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Action Button: Rosita */}
          <button
            onClick={handleContinue}
            className="group relative w-full sm:w-64 bg-[#FCE4EC] hover:bg-[#fbd1de] text-[#0d1c2e] font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 active:scale-95 cursor-pointer flex items-center justify-center gap-3"
          >
            <span className="relative z-10 text-lg">Continuar</span>
            <span className="material-symbols-outlined relative z-10 text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          </button>
        </div>

        {/* Security Footer */}
        <div className="flex items-center gap-3 opacity-40 transition-opacity hover:opacity-60">
          <span className="material-symbols-outlined text-base">lock</span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#0d1c2e]">End-to-End Encryption</span>
        </div>
      </div>

    </main>
  );
}
