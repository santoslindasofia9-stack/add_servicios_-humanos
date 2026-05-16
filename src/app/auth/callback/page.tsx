"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const [status, setStatus] = useState("Completando inicio de sesión...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase procesa automáticamente el código OAuth de la URL
        // Solo necesitamos esperar a que la sesión esté lista
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          // Sesión establecida exitosamente
          const pendingRole = localStorage.getItem("pendingRole") || "client";
          const displayName =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "Usuario";

          localStorage.setItem("userRole", pendingRole);
          localStorage.setItem("userName", displayName);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.removeItem("pendingRole");

          setStatus("¡Sesión iniciada! Redirigiendo...");
          const target = pendingRole === "client" ? "/home-cliente" : "/dashboard-pro";
          window.location.href = target;
        } else {
          // Si no hay sesión aún, escuchar el evento de auth
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
              const pendingRole = localStorage.getItem("pendingRole") || "client";
              const displayName =
                session.user.user_metadata?.full_name ||
                session.user.user_metadata?.name ||
                session.user.email?.split("@")[0] ||
                "Usuario";

              localStorage.setItem("userRole", pendingRole);
              localStorage.setItem("userName", displayName);
              localStorage.setItem("isLoggedIn", "true");
              localStorage.removeItem("pendingRole");

              subscription.unsubscribe();
              const target = pendingRole === "client" ? "/home-cliente" : "/dashboard-pro";
              window.location.href = target;
            }
          });

          // Timeout de seguridad: si en 5s no hay sesión, ir al login
          setTimeout(() => {
            subscription.unsubscribe();
            window.location.href = "/auth/login";
          }, 5000);
        }
      } catch (err) {
        console.error("Callback error:", err);
        window.location.href = "/auth/login";
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white font-plus-jakarta">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#FCE4EC]" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#0d1c2e] animate-spin" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-[#0d1c2e]">{status}</h2>
          <p className="text-sm text-[#5e6f79]">Por favor espera un momento...</p>
        </div>
      </div>
    </div>
  );
}
