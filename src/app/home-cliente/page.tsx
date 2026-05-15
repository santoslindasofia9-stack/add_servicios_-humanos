"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Search, 
  Bell, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Monitor, 
  Home as HomeIcon, 
  Palette, 
  Calendar, 
  Heart, 
  BookOpen,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/dashboard/BottomNav";

const CATEGORIES = [
  { id: "Tech", name: "Tech", icon: Monitor, color: "bg-[#E0F2FE]", textColor: "text-[#0288D1]" },
  { id: "Hogar", name: "Hogar", icon: HomeIcon, color: "bg-[#FFFDD0]", textColor: "text-[#F57F17]" },
  { id: "Creativo", name: "Creativo", icon: Palette, color: "bg-[#FCE4EC]", textColor: "text-[#D81B60]" },
  { id: "Eventos", name: "Eventos", icon: Calendar, color: "bg-[#E8F5E9]", textColor: "text-[#2E7D32]" },
  { id: "Salud", name: "Salud", icon: Heart, color: "bg-[#F4DCE4]", textColor: "text-[#93000A]" },
  { id: "Educación", name: "Educación", icon: BookOpen, color: "bg-[#E6EEFF]", textColor: "text-[#50616B]" },
];

const ADS = [
  { 
    id: 1, 
    title: "Descubre los Profesionales Mejor Valorados", 
    company: "Destacado de la Semana", 
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000", // Profesional office
    link: "#"
  },
  { 
    id: 2, 
    title: "Servicios Premium para el Hogar", 
    company: "Nueva Categoría", 
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1000", // Home service
    link: "#"
  }
];

const FALLBACK_PROS = [
  {
    id: "f1",
    nombre_completo: "Sarah Jenkins",
    titulo_profesional: "Diseñadora de Interiores",
    categoria: "Hogar",
    distancia_km: 2.4,
    calificacion: 4.9,
    foto_perfil: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "f2",
    nombre_completo: "David Chen",
    titulo_profesional: "Consultor Tech",
    categoria: "Tech",
    distancia_km: 1.8,
    calificacion: 4.8,
    foto_perfil: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "f3",
    nombre_completo: "Elena Rodriguez",
    titulo_profesional: "Directora Creativa",
    categoria: "Creativo",
    distancia_km: 0.5,
    calificacion: 5.0,
    foto_perfil: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "f4",
    nombre_completo: "Michael Scott",
    titulo_profesional: "Organizador de Eventos",
    categoria: "Eventos",
    distancia_km: 3.1,
    calificacion: 4.7,
    foto_perfil: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
  },
];

export default function HomeCliente() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Usuario");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  
  // States for data
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Ads carousel state
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const initData = async () => {
      // 1. Get User
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!userError && user) {
        const name = user.user_metadata?.full_name || 
                     user.user_metadata?.first_name || 
                     user.user_metadata?.username || 
                     user.email?.split('@')[0] || 
                     "Usuario";
        setUserName(name);
        setUserAvatar(user.user_metadata?.avatar_url || null);
      } else {
        // Enfoque Prototipo Permisivo
        const storedName = typeof window !== 'undefined' ? localStorage.getItem("userName") : null;
        setUserName(storedName || "Usuario Invitado");
      }

      // 2. Fetch Professionals
      try {
        const { data, error } = await supabase
          .from('perfiles_profesionales')
          .select('*');
        
        if (error || !data || data.length === 0) {
          setProfessionals(FALLBACK_PROS);
        } else {
          setProfessionals(data);
        }
      } catch (err) {
        setProfessionals(FALLBACK_PROS);
      }

      setLoading(false);
    };

    initData();
  }, []);

  // Carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ADS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Filtering Logic
  const filteredProfessionals = professionals.filter((pro) => {
    const matchesSearch = 
      (pro.nombre_completo || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (pro.titulo_profesional || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory ? pro.categoria === activeCategory : true;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9ff]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#0d1c2e]/10 border-t-[#0d1c2e] rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9ff] font-sans pb-24 selection:bg-[#E0F2FE]">
      
      {/* 1. Header (Identical to layout, using our colors) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e6eeff] h-16 md:h-20 flex items-center">
        <div className="max-w-[1280px] mx-auto w-full px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#5e6f79] p-2">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/home-cliente')}>
              <div className="w-8 h-8 bg-[#0d1c2e] rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">hub</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-[#0d1c2e] tracking-tight">Tool Link</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-[#0d1c2e] font-bold cursor-pointer" onClick={() => router.push('/home-cliente')}>Inicio</a>
            <a className="text-[#5e6f79] hover:text-[#0d1c2e] font-medium transition-colors cursor-pointer">Explorar</a>
            <a className="text-[#5e6f79] hover:text-[#0d1c2e] font-medium transition-colors cursor-pointer">Guardados</a>
            <a className="text-[#5e6f79] hover:text-[#0d1c2e] font-medium transition-colors cursor-pointer">Mensajes</a>
          </nav>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 text-[#5e6f79] hidden md:block hover:text-[#0d1c2e] transition-colors">
              <Bell size={24} />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#e6eeff] cursor-pointer bg-white flex items-center justify-center">
              {userAvatar ? (
                <Image src={userAvatar} alt={userName} width={40} height={40} className="object-cover" />
              ) : (
                <span className="text-[#0d1c2e] font-bold text-sm uppercase">{userName.charAt(0)}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 md:pt-32 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          
          {/* 2. Hero Section */}
          <section className="mb-12 md:mb-16 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-[56px] font-extrabold text-[#0d1c2e] mb-6 max-w-3xl leading-tight tracking-tight">
              Ayuda experta para tu próximo gran proyecto.
            </h2>
            <div className="relative w-full max-w-2xl mx-auto">
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca expertos, servicios o ubicaciones..." 
                className="w-full h-14 md:h-16 pl-14 pr-6 rounded-full border border-gray-200 bg-white shadow-sm focus:ring-4 focus:ring-[#E0F2FE] focus:border-[#0d1c2e] transition-all text-lg font-medium text-[#0d1c2e] placeholder:text-[#5e6f79]/60 outline-none"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5e6f79]" size={24} />
            </div>
          </section>

          {/* 3. Categories (Horizontal scroll) */}
          <section className="mb-12 md:mb-16">
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                    className="flex-none flex flex-col items-center gap-3 cursor-pointer group min-w-[80px]"
                  >
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[20px] flex items-center justify-center transition-all duration-300 ${isActive ? cat.color + ' shadow-md scale-105' : 'bg-white shadow-sm border border-gray-100 group-hover:' + cat.color}`}>
                      <Icon className={`w-8 h-8 ${isActive ? cat.textColor : 'text-[#5e6f79] group-hover:' + cat.textColor}`} />
                    </div>
                    <span className={`text-sm font-bold ${isActive ? '#0d1c2e' : 'text-[#5e6f79]'}`}>
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. Featured Highlights Grid */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Hero Card (2 columns) */}
              <div className="lg:col-span-2 relative aspect-[16/10] md:aspect-[21/9] lg:aspect-auto lg:h-[400px] rounded-[24px] overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentAdIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={ADS[currentAdIndex].image} 
                      alt={ADS[currentAdIndex].title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c2e]/90 via-[#0d1c2e]/30 to-transparent p-6 md:p-10 flex flex-col justify-end">
                      <span className="text-xs font-bold text-[#E0F2FE] mb-2 uppercase tracking-widest">
                        {ADS[currentAdIndex].company}
                      </span>
                      <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-6 max-w-xl leading-tight">
                        {ADS[currentAdIndex].title}
                      </h2>
                      <button className="bg-white text-[#0d1c2e] px-8 py-3.5 rounded-full font-bold w-fit hover:bg-gray-100 transition-colors shadow-lg">
                        Explorar Catálogo
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
                {/* Ad Indicators */}
                <div className="absolute bottom-6 right-8 flex gap-2">
                  {ADS.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentAdIndex ? 'bg-white w-6' : 'bg-white/50'}`} />
                  ))}
                </div>
              </div>

              {/* Secondary Info Card (1 column) */}
              <div className="bg-[#E0F2FE] rounded-[24px] p-8 md:p-10 flex flex-col justify-center items-center text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <ShieldCheck className="text-[#0288D1] w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#0d1c2e] mb-4">Verificado y Seguro</h3>
                <p className="text-[#5e6f79] text-base font-medium mb-6">
                  Cada profesional es validado rigurosamente para asegurar calidad premium en tus proyectos más importantes.
                </p>
                <button className="text-[#0288D1] font-bold hover:underline">
                  Saber más sobre la verificación
                </button>
              </div>
            </div>
          </section>

          {/* 5. Professional Feed */}
          <section className="mb-16">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#0d1c2e] mb-2">
                  {activeCategory ? `Profesionales en ${activeCategory}` : "Profesionales cerca de ti"}
                </h2>
                <p className="text-[#5e6f79] font-medium">Expertos seleccionados disponibles en tu área.</p>
              </div>
              <button className="text-[#0d1c2e] font-bold hover:underline hidden md:block">Ver Todos</button>
            </div>

            {filteredProfessionals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProfessionals.map((pro) => (
                  <div key={pro.id} className="group bg-white rounded-[20px] p-4 border border-gray-100 hover:border-[#E0F2FE] hover:shadow-xl hover:shadow-[#0d1c2e]/5 transition-all duration-300 flex flex-col cursor-pointer" onClick={() => router.push(`/profesional/${pro.id}`)}>
                    <div className="relative aspect-square rounded-[16px] overflow-hidden mb-5 bg-gray-50">
                      <Image 
                        src={pro.foto_perfil || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"} 
                        alt={pro.nombre_completo || "Profesional"} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-[#0d1c2e]">{pro.calificacion || "5.0"}</span>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-[#0d1c2e] line-clamp-1">{pro.nombre_completo}</h4>
                    <p className="text-[#5e6f79] font-medium text-sm mb-3 line-clamp-1">{pro.titulo_profesional}</p>
                    
                    <div className="flex items-center gap-2 text-[#5e6f79] text-sm mb-5 mt-auto">
                      <MapPin size={16} />
                      <span>{pro.distancia_km ? `A ${pro.distancia_km} km` : 'Local'}</span>
                    </div>
                    
                    <button className="w-full py-3 rounded-full bg-[#f8f9ff] text-[#0d1c2e] font-bold group-hover:bg-[#0d1c2e] group-hover:text-white transition-colors border border-gray-100 group-hover:border-transparent">
                      Reservar Servicio
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
                <div className="w-16 h-16 bg-[#f8f9ff] rounded-full flex items-center justify-center mx-auto mb-4 text-[#5e6f79]">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-[#0d1c2e] mb-2">No se encontraron profesionales</h3>
                <p className="text-[#5e6f79]">Intenta buscar con otros términos o cambia la categoría.</p>
                <button 
                  onClick={() => { setSearchTerm(""); setActiveCategory(null); }}
                  className="mt-6 text-[#0d1c2e] font-bold underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
            
            <button className="w-full mt-8 py-4 bg-white border border-gray-200 rounded-full font-bold text-[#0d1c2e] md:hidden">
              Ver Todos los Profesionales
            </button>
          </section>

          {/* 6. Map CTA */}
          <section className="relative rounded-[24px] overflow-hidden h-[300px] md:h-[400px] shadow-sm mb-10">
            <div className="absolute inset-0 bg-[#f8f9ff] flex items-center justify-center">
              <div className="w-full h-full opacity-30" style={{ backgroundImage: "radial-gradient(#0d1c2e 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }}></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-[24px] shadow-xl text-center max-w-xl w-full border border-white">
                <div className="w-16 h-16 bg-[#E0F2FE] rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="text-[#0288D1] w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#0d1c2e] mb-3">Explora con la vista de mapa</h3>
                <p className="text-[#5e6f79] font-medium mb-8">
                  Encuentra los mejores servicios y profesionales directamente en tu vecindario con nuestro mapa interactivo local.
                </p>
                <button className="bg-[#FCE4EC] text-[#0d1c2e] px-10 py-4 rounded-full font-bold hover:bg-[#fbd1de] transition-all shadow-md w-full sm:w-auto">
                  Abrir Mapa Interactivo
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      <BottomNav />

      {/* Global Styles for hiding scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

