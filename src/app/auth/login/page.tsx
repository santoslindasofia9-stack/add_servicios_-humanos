"use client";

import { useState, Suspense, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Briefcase, Eye, EyeOff, Check, Phone, ArrowLeft, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as "login" | "register") || "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [role, setRole] = useState<"client" | "pro">("client");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update mode if query param changes
  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "register" || m === "login") {
      setMode(m);
    }
  }, [searchParams]);

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulamos un pequeño retraso de carga para que se vea natural
      await new Promise(resolve => setTimeout(resolve, 800));

      if (mode === "register") {
        // PROTOTYPE LOGIC: Guardar en localStorage
        const users = JSON.parse(localStorage.getItem('trustmarket_users') || '[]');
        
        // Verificar si el correo ya existe
        if (users.find((u: any) => u.email === formData.email)) {
          throw new Error("Este correo electrónico ya está registrado.");
        }

        const newUser = {
          email: formData.email,
          password: formData.password,
          username: formData.username,
          phone: formData.phone,
          role: role,
        };

        users.push(newUser);
        localStorage.setItem('trustmarket_users', JSON.stringify(users));
        localStorage.setItem('trustmarket_current_user', JSON.stringify(newUser));

        // Auto-login after registration
        if (role === "client") {
          router.push("/home-cliente");
        } else {
          router.push("/dashboard-pro");
        }
      } else {
        // Login mode
        const users = JSON.parse(localStorage.getItem('trustmarket_users') || '[]');
        let user = users.find((u: any) => u.email === formData.email && u.password === formData.password);

        if (!user) {
          // PROTOTYPE PERMISSIVE MODE: Para facilitar las pruebas, si el usuario no existe, 
          // lo creamos y lo dejamos pasar directamente.
          user = {
            email: formData.email,
            password: formData.password,
            username: formData.email.split('@')[0],
            phone: "",
            role: role
          };
          users.push(user);
          localStorage.setItem('trustmarket_users', JSON.stringify(users));
        }

        // Guardamos explícitamente el usuario que acaba de iniciar sesión
        localStorage.setItem('trustmarket_current_user', JSON.stringify(user));

        // Redirección exitosa basada en el rol
        if (user.role === "client") {
          router.push("/home-cliente");
        } else {
          router.push("/dashboard-pro");
        }
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-white font-plus-jakarta overflow-hidden">
      {/* Background Blobs (Visible only on Mobile) */}
      <div className="absolute inset-0 z-0 lg:hidden overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-full h-full bg-[#E0F2FE]/40 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-full h-full bg-[#FCE4EC]/40 rounded-full blur-[100px] animate-blob [animation-delay:4s]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side: Aspirational Image (Desktop Only) */}
        <div className="hidden lg:flex w-1/2 p-8 items-center justify-center bg-gray-50">
          <div className="relative w-full h-full max-h-[800px] rounded-[48px] overflow-hidden shadow-2xl group">
            <Image
              src="/login-aspirational.png"
              alt="TrustMarket Professionals"
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-1000"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {/* Overlay Info */}
            <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-[32px] text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-white/30 flex items-center justify-center text-[10px] font-bold">
                      <User size={14} />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center text-[10px] font-bold text-[#0d1c2e]">
                    +50k
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-extrabold mb-1">Más de 50,000 profesionales verificados</h2>
              <p className="text-white/80 text-sm font-medium">Construyendo el futuro del trabajo freelance en Latinoamérica.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Back to Login if in Register mode */}
            {mode === "register" && (
              <button 
                onClick={() => setMode("login")}
                className="flex items-center gap-2 text-sm font-bold text-[#5e6f79] hover:text-[#0d1c2e] transition-colors mb-4"
              >
                <ArrowLeft size={16} />
                Volver al inicio de sesión
              </button>
            )}

            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#0d1c2e] tracking-tight">
                {mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
              </h1>
              <p className="text-[#5e6f79] font-medium">
                {mode === "login" ? "Accede a tu cuenta para continuar" : "Únete a la mayor red de servicios de confianza"}
              </p>
            </div>

            {/* Role Selector */}
            <div className="bg-gray-100/50 p-1 rounded-[24px] flex relative">
              <motion.div 
                className="absolute top-1 bottom-1 bg-[#E0F2FE] rounded-[20px] shadow-sm"
                initial={false}
                animate={{
                  x: role === "client" ? 0 : "100%",
                  left: role === "client" ? "4px" : "-4px",
                  width: "calc(50% - 0px)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                onClick={() => setRole("client")}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors duration-300 ${role === "client" ? "text-[#0d1c2e]" : "text-[#5e6f79]"}`}
              >
                <User size={18} />
                Soy Cliente
              </button>
              <button
                onClick={() => setRole("pro")}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors duration-300 ${role === "pro" ? "text-[#0d1c2e]" : "text-[#5e6f79]"}`}
              >
                <Briefcase size={18} />
                Soy Profesional
              </button>
            </div>

            {/* Form Container with Animation */}
            <AnimatePresence mode="wait">
              <motion.form 
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleAuth} 
                className="space-y-6"
              >
                <div className="space-y-4">
                  {/* Success Message */}
                  {success && (
                    <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-2xl">
                      <p className="text-sm font-medium text-green-800">{success}</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl">
                      <p className="text-sm font-medium text-red-800">
                        {error.includes("Email not confirmed") 
                          ? "Por favor, verifica tu correo electrónico antes de iniciar sesión. (O desactiva la confirmación de correos en Supabase)"
                          : error.includes("Invalid login credentials")
                          ? "El correo o la contraseña son incorrectos."
                          : error}
                      </p>
                    </div>
                  )}

                  {/* Register Specific Fields */}
                  {mode === "register" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#0d1c2e] ml-1">Nombre de Usuario</label>
                        <div className="relative group">
                          <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0d1c2e] transition-colors" size={20} />
                          <input
                            type="text"
                            required
                            placeholder="Tu nombre o apodo"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30 transition-all text-[#0d1c2e] font-medium"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#0d1c2e] ml-1">Teléfono</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0d1c2e] transition-colors" size={20} />
                          <input
                            type="tel"
                            required
                            placeholder="+51 987 654 321"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30 transition-all text-[#0d1c2e] font-medium"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Common Fields */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#0d1c2e] ml-1">Correo Electrónico</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0d1c2e] transition-colors" size={20} />
                      <input
                        type="email"
                        required
                        placeholder="ejemplo@correo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30 transition-all text-[#0d1c2e] font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-sm font-bold text-[#0d1c2e]">Contraseña</label>
                      {mode === "login" && (
                        <button type="button" className="text-xs font-bold text-[#5e6f79] hover:text-[#0d1c2e] transition-colors">¿Olvidaste tu clave?</button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0d1c2e] transition-colors" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30 transition-all text-[#0d1c2e] font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0d1c2e] transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {mode === "login" && (
                  <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-5 h-5 border-2 border-gray-200 rounded-md peer-checked:bg-[#FCE4EC] peer-checked:border-[#FCE4EC] transition-all" />
                      <Check className="absolute text-[#0d1c2e] opacity-0 peer-checked:opacity-100 transition-opacity" size={14} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-bold text-[#5e6f79] group-hover:text-[#0d1c2e] transition-colors">Recuérdame</span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#FCE4EC] hover:bg-[#fbd1de] text-[#0d1c2e] font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (mode === "login" ? "Iniciando sesión..." : "Creando cuenta...") : (mode === "login" ? "Iniciar Sesión" : "Registrarme")}
                </button>
              </motion.form>
            </AnimatePresence>

            {/* Footer / Toggle Mode */}
            <p className="text-center text-sm font-medium text-[#5e6f79]">
              {mode === "login" ? (
                <>
                  ¿No tienes una cuenta?{" "}
                  <button onClick={() => setMode("register")} className="font-bold text-[#0d1c2e] hover:underline transition-all">
                    Regístrate gratis
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tienes una cuenta?{" "}
                  <button onClick={() => setMode("login")} className="font-bold text-[#0d1c2e] hover:underline transition-all">
                    Inicia sesión
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-[#FCE4EC] border-t-[#0d1c2e] rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
