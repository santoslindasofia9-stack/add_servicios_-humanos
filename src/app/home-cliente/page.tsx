"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Star } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/dashboard/BottomNav";

const CATEGORIES = [
  { name: "Diseño", icon: "brush", color: "bg-[#FCE4EC]", textColor: "text-[#D81B60]", hoverScale: 1.1 },
  { name: "Programación", icon: "terminal", color: "bg-[#E0F2FE]", textColor: "text-[#0288D1]", hoverScale: 1.1 },
  { name: "Plomería", icon: "build", color: "bg-[#FFFDD0]", textColor: "text-[#F57F17]", hoverScale: 1.1 },
  { name: "Tutorías", icon: "school", color: "bg-[#E8F5E9]", textColor: "text-[#2E7D32]", hoverScale: 1.1 },
];

const FEATURED_PROS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    category: "Diseño de Interiores",
    rating: 4.9,
    price: "$45/hr",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    name: "David Chen",
    category: "Programación Fullstack",
    rating: 4.8,
    price: "$60/hr",
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    category: "Tutorías de Inglés",
    rating: 5.0,
    price: "$25/hr",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
  },
];

export default function HomeCliente() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Usuario");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // PROTOTYPE LOGIC: get from localStorage instead of Supabase
      const user = JSON.parse(localStorage.getItem('trustmarket_current_user') || 'null');

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const name = user.username || user.email?.split('@')[0] || "Usuario";
      
      setUserName(name);
      setUserAvatar(null);
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f8f9ff]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#0d1c2e]/10 border-t-[#0d1c2e] rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9ff] font-plus-jakarta pb-24 overflow-x-hidden">
      {/* Aesthetic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-[#E0F2FE]/40 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[10%] left-[-10%] w-[70%] h-[70%] bg-[#FCE4EC]/30 rounded-full blur-[100px] animate-blob-slow" />
        <div className="absolute top-[40%] left-[20%] w-[50%] h-[50%] bg-[#FFFDD0]/20 rounded-full blur-[110px] animate-blob" />
      </div>

      {/* Header */}
      <header className="relative z-50 w-full px-6 py-5 flex justify-between items-center bg-white/40 backdrop-blur-md sticky top-0 border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#0d1c2e] rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-xl">hub</span>
          </div>
          <span className="text-xl font-bold text-[#0d1c2e] tracking-tight">TrustMarket</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#0d1c2e] font-plus-jakarta">Hola, {userName}</p>
          </div>
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white flex items-center justify-center">
            {userAvatar ? (
              <Image src={userAvatar} alt={userName} width={44} height={44} className="object-cover" />
            ) : (
              <div className="w-full h-full bg-[#0d1c2e] flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-12">
        {/* Hero & Search */}
        <section className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-[#0d1c2e] mb-10 leading-tight"
          >
            ¿Qué profesional <br className="sm:hidden" />
            <span className="text-[#5e6f79]">necesitas hoy?</span>
          </motion.h2>

          <div className="relative max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-white p-1.5 transition-all hover:shadow-md">
              <div className="pl-4 text-[#5e6f79]">
                <Search size={20} className="text-[#0d1c2e]" />
              </div>
              <input 
                type="text" 
                placeholder="Busca servicios o expertos..." 
                className="w-full bg-transparent border-none focus:ring-0 px-4 text-[#0d1c2e] font-medium"
              />
              <button className="bg-[#0d1c2e] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-black transition-all transform active:scale-95">
                Buscar
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-20">
          <h3 className="text-xl font-bold text-[#0d1c2e] mb-8">Categorías Principales</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat.name}
                whileHover={{ scale: cat.hoverScale }}
                whileTap={{ scale: 0.95 }}
                className={`${cat.color} rounded-[32px] p-8 flex flex-col items-center gap-4 cursor-pointer transition-all border border-white/50 shadow-sm`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
                  <span className={`material-symbols-outlined text-3xl ${cat.textColor}`}>{cat.icon}</span>
                </div>
                <span className={`text-base font-bold ${cat.textColor}`}>{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Feed */}
        <section className="pb-16">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-bold text-[#0d1c2e]">Profesionales destacados para ti</h3>
            <button className="text-sm font-bold text-[#5e6f79]">Ver todos</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_PROS.map((pro) => (
              <motion.div
                key={pro.id}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-[#0d1c2e]/5 hover:shadow-xl transition-all group"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-5">
                  <Image src={pro.image} alt={pro.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-[#0d1c2e]">{pro.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-1 mb-6">
                  <h4 className="text-xl font-bold text-[#0d1c2e]">{pro.name}</h4>
                  <p className="text-sm font-bold text-[#5e6f79] opacity-60 uppercase tracking-widest">{pro.category}</p>
                </div>
                
                <div className="flex items-center justify-between pt-5 border-t border-[#0d1c2e]/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#5e6f79] uppercase opacity-60">Precio base</span>
                    <span className="text-xl font-black text-[#0d1c2e]">{pro.price}</span>
                  </div>
                  <button className="bg-[#0d1c2e] text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all">
                    Ver Perfil
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
