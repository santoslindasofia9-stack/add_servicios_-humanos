"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Star, MapPin, Bell, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/dashboard/BottomNav";

// Mock data para profesionales destacados
const MOCK_PROS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    category: "Diseño de Interiores",
    rating: 4.9,
    reviews: 124,
    price: "$45/hr",
    image: "/sarah-jenkins.png",
    location: "Downtown, 2.4 km",
  },
  {
    id: 2,
    name: "David Chen",
    category: "Programación Fullstack",
    rating: 4.8,
    reviews: 89,
    price: "$60/hr",
    image: "/david-chen.png",
    location: "North Bay, 1.8 km",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    category: "Tutorías de Inglés",
    rating: 5.0,
    reviews: 56,
    price: "$25/hr",
    image: "/elena-rodriguez.png",
    location: "Artist District, 0.5 km",
  },
];

const CATEGORIES = [
  { name: "Diseño", icon: "brush", color: "bg-[#FCE4EC]", textColor: "text-[#D81B60]" },
  { name: "Programación", icon: "terminal", color: "bg-[#E0F2FE]", textColor: "text-[#0288D1]" },
  { name: "Plomería", icon: "build", color: "bg-[#FFFDD0]", textColor: "text-[#F57F17]" },
  { name: "Tutorías", icon: "school", color: "bg-[#E8F5E9]", textColor: "text-[#2E7D32]" },
];

export default function ClientDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Usuario");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push("/auth/login");
        return;
      }

      // Obtener nombre del metadata de Supabase
      const name = user.user_metadata?.full_name || user.user_metadata?.first_name || user.email?.split('@')[0] || "Usuario";
      setUserName(name);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f8f9ff]">
        <div className="w-12 h-12 border-4 border-[#0d1c2e]/10 border-t-[#0d1c2e] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#f8f9ff] font-plus-jakarta pb-24 md:pb-8">
      {/* Background aesthetic blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#E0F2FE]/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[60%] bg-[#FCE4EC]/30 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 h-20 px-6 md:px-12 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-white/60 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0d1c2e] rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-xl">hub</span>
          </div>
          <h1 className="text-xl font-bold text-[#0d1c2e] tracking-tight hidden sm:block">TrustMarket</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold text-[#5e6f79] uppercase tracking-widest opacity-60">Bienvenido</p>
            <p className="text-sm font-extrabold text-[#0d1c2e]">Hola, {userName}</p>
          </div>
          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md transition-transform group-hover:scale-105">
              <Image 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" 
                alt="Profile" 
                width={44} 
                height={44}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-12">
        {/* Hero Section */}
        <section className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0d1c2e] tracking-tight leading-tight">
              ¿Qué profesional <br className="sm:hidden" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5e6f79] to-[#0d1c2e]">necesitas hoy?</span>
            </h2>

            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-[#0d1c2e]/5 rounded-full blur-xl group-hover:bg-[#0d1c2e]/10 transition-all duration-500" />
              <div className="relative flex items-center bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-2">
                <div className="pl-4 text-[#5e6f79]">
                  <Search size={22} />
                </div>
                <input 
                  type="text" 
                  placeholder="Busca plomeros, diseñadores, tutores..." 
                  className="w-full bg-transparent border-none focus:ring-0 px-4 text-[#0d1c2e] font-medium placeholder:text-[#5e6f79]/50"
                />
                <button className="bg-[#0d1c2e] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-black transition-colors shadow-lg">
                  Buscar
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Categories Section */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-lg font-extrabold text-[#0d1c2e]">Categorías Populares</h3>
            <button className="text-xs font-bold text-[#5e6f79] uppercase tracking-widest hover:text-[#0d1c2e] transition-colors">Ver todas</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${cat.color} rounded-[28px] p-6 flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md transition-all border border-white/50`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm`}>
                  <span className={`material-symbols-outlined text-2xl ${cat.textColor}`}>
                    {cat.icon}
                  </span>
                </div>
                <span className={`text-sm font-bold ${cat.textColor}`}>{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Feed */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-extrabold text-[#0d1c2e]">Profesionales destacados</h3>
              <p className="text-sm text-[#5e6f79] font-medium opacity-70">Expertos verificados cerca de tu ubicación</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_PROS.map((pro) => (
              <motion.div
                key={pro.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-[32px] p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-[#0d1c2e]/5 hover:border-[#0d1c2e]/10 transition-all"
              >
                <div className="relative aspect-square rounded-[24px] overflow-hidden mb-6">
                  <Image 
                    src={pro.image.startsWith('/') ? `https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400` : pro.image} 
                    alt={pro.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-[#0d1c2e]">{pro.rating}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-extrabold text-[#0d1c2e]">{pro.name}</h4>
                    <p className="text-sm font-bold text-[#5e6f79] opacity-60 uppercase tracking-wider">{pro.category}</p>
                  </div>

                  <div className="flex items-center justify-between py-4 border-y border-[#0d1c2e]/5">
                    <div className="flex items-center gap-2 text-[#5e6f79]">
                      <MapPin size={16} />
                      <span className="text-xs font-medium">{pro.location}</span>
                    </div>
                    <span className="text-lg font-black text-[#0d1c2e]">{pro.price}</span>
                  </div>

                  <button className="w-full py-4 bg-[#f8f9ff] group-hover:bg-[#0d1c2e] text-[#0d1c2e] group-hover:text-white font-bold rounded-2xl transition-all duration-300">
                    Ver Perfil
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
