"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/dashboard/BottomNav";

const MOCK_PROS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    category: "Diseño de Interiores",
    rating: 4.9,
    price: "$45/hr",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
    location: "Downtown, 2.4 km",
  },
  {
    id: 2,
    name: "David Chen",
    category: "Programación Fullstack",
    rating: 4.8,
    price: "$60/hr",
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400",
    location: "North Bay, 1.8 km",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    category: "Tutorías de Inglés",
    rating: 5.0,
    price: "$25/hr",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    location: "Artist District, 0.5 km",
  },
];

const CATEGORIES = [
  { name: "Diseño", icon: "brush", color: "bg-[#FCE4EC]", textColor: "text-[#D81B60]" },
  { name: "Programación", icon: "terminal", color: "bg-[#E0F2FE]", textColor: "text-[#0288D1]" },
  { name: "Plomería", icon: "build", color: "bg-[#FFFDD0]", textColor: "text-[#F57F17]" },
  { name: "Tutorías", icon: "school", color: "bg-[#E8F5E9]", textColor: "text-[#2E7D32]" },
];

export default function HomeCliente() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Usuario");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        // Permitimos ver el diseño para pruebas, pero en prod redirigiría
        // router.push("/auth/login");
        setLoading(false);
        return;
      }

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
    <main className="relative min-h-screen bg-[#f8f9ff] font-plus-jakarta pb-24">
      {/* Background aesthetic blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#E0F2FE]/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[60%] bg-[#FCE4EC]/30 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 h-20 px-6 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-white/60 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0d1c2e] rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-xl">hub</span>
          </div>
          <h1 className="text-xl font-bold text-[#0d1c2e] tracking-tight">TrustMarket</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold text-[#5e6f79] uppercase tracking-widest opacity-60">Bienvenido</p>
            <p className="text-sm font-extrabold text-[#0d1c2e]">Hola, {userName}</p>
          </div>
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md">
            <Image 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" 
              alt="Profile" 
              width={44} 
              height={44}
              className="object-cover"
            />
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Search Hero */}
        <section className="mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold text-[#0d1c2e] mb-8 leading-tight"
          >
            ¿Qué profesional <br className="sm:hidden" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5e6f79] to-[#0d1c2e]">necesitas hoy?</span>
          </motion.h2>

          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-lg border border-white p-2">
              <div className="pl-4 text-[#5e6f79]">
                <Search size={22} />
              </div>
              <input 
                type="text" 
                placeholder="Busca servicios o expertos..." 
                className="w-full bg-transparent border-none focus:ring-0 px-4 text-[#0d1c2e] font-medium"
              />
              <button className="bg-[#0d1c2e] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-black transition-all">
                Buscar
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <h3 className="text-lg font-extrabold text-[#0d1c2e] mb-8">Categorías Principales</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat.name}
                whileHover={{ scale: 1.05 }}
                className={`${cat.color} rounded-[32px] p-6 flex flex-col items-center gap-3 cursor-pointer border border-white/50 shadow-sm`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
                  <span className={`material-symbols-outlined text-2xl ${cat.textColor}`}>{cat.icon}</span>
                </div>
                <span className={`text-sm font-bold ${cat.textColor}`}>{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Professionals Feed */}
        <section>
          <h3 className="text-2xl font-extrabold text-[#0d1c2e] mb-8">Profesionales destacados para ti</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_PROS.map((pro) => (
              <motion.div
                key={pro.id}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[32px] p-5 shadow-sm border border-[#0d1c2e]/5 transition-all"
              >
                <div className="relative aspect-square rounded-[24px] overflow-hidden mb-5">
                  <Image src={pro.image} alt={pro.name} fill className="object-cover" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star size={14} className="fill-yellow-400 text-yellow-400 border-none" />
                    <span className="text-xs font-bold text-[#0d1c2e]">{pro.rating}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-extrabold text-[#0d1c2e]">{pro.name}</h4>
                    <p className="text-sm font-bold text-[#5e6f79] opacity-60 uppercase tracking-wider">{pro.category}</p>
                  </div>
                  <div className="flex items-center justify-between py-4 border-y border-[#0d1c2e]/5">
                    <div className="flex items-center gap-1 text-[#5e6f79]">
                      <MapPin size={14} />
                      <span className="text-[11px] font-medium">{pro.location}</span>
                    </div>
                    <span className="text-lg font-black text-[#0d1c2e]">{pro.price}</span>
                  </div>
                  <button className="w-full py-4 bg-[#0d1c2e] text-white font-bold rounded-2xl shadow-lg hover:bg-black transition-all">
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
