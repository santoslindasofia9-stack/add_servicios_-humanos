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
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/dashboard/BottomNav";

const CATEGORIES = [
  { id: "Tech", name: "Tech", icon: Monitor, color: "bg-blue-50", text: "text-blue-600" },
  { id: "Hogar", name: "Hogar", icon: HomeIcon, color: "bg-orange-50", text: "text-orange-600" },
  { id: "Creativo", name: "Creativo", icon: Palette, color: "bg-pink-50", text: "text-pink-600" },
  { id: "Eventos", name: "Eventos", icon: Calendar, color: "bg-purple-50", text: "text-purple-600" },
  { id: "Salud", name: "Salud", icon: Heart, color: "bg-red-50", text: "text-red-600" },
  { id: "Educación", name: "Educación", icon: BookOpen, color: "bg-green-50", text: "text-green-600" },
];

const ADS = [
  { 
    id: 1, 
    title: "Herramientas Pro para tu Taller", 
    company: "HomeCenter", 
    image: "https://images.unsplash.com/photo-1581147036324-c10842426ab1?auto=format&fit=crop&q=80&w=800",
    link: "#"
  },
  { 
    id: 2, 
    title: "Materiales de Construcción 20% off", 
    company: "BuildIt", 
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800",
    link: "#"
  }
];

const FALLBACK_PROS = [
  {
    id: "f1",
    nombre_completo: "Carlos Mendoza",
    titulo_profesional: "Especialista en Tech",
    categoria: "Tech",
    distancia_km: 2.5,
    calificacion: 4.9,
    foto_perfil: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "f2",
    nombre_completo: "Ana Rivas",
    titulo_profesional: "Diseñadora de Interiores",
    categoria: "Hogar",
    distancia_km: 4.1,
    calificacion: 5.0,
    foto_perfil: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "f3",
    nombre_completo: "Luis Torres",
    titulo_profesional: "Fotógrafo de Eventos",
    categoria: "Eventos",
    distancia_km: 1.2,
    calificacion: 4.8,
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
        // Enfoque Prototipo Permisivo: No redirigir al login si falla la sesión, 
        // simplemente cargar como "Invitado" para permitir la demostración de la UI.
        setUserName("Usuario Invitado");
      }

      // 2. Fetch Professionals
      try {
        const { data, error } = await supabase
          .from('perfiles_profesionales')
          .select('*');
        
        if (error || !data || data.length === 0) {
          // Use fallback data if table is empty or fails (for UI demonstration purposes)
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
  }, [router]);

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
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] font-sans pb-24 selection:bg-blue-100">
      
      {/* 1. Navbar */}
      <header className="sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/home-cliente')}>
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Monitor className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tight">Tool Link</span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button className="text-sm font-semibold text-blue-600">Inicio</button>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Explorar</button>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Guardados</button>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Mensajes</button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border border-white"></span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center cursor-pointer">
            {userAvatar ? (
              <Image src={userAvatar} alt={userName} width={40} height={40} className="object-cover" />
            ) : (
              <span className="text-gray-600 font-bold text-sm uppercase">{userName.charAt(0)}</span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        
        {/* 2. Hero Section */}
        <section className="mb-14 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 tracking-tight"
          >
            Ayuda experta para tu <br className="hidden sm:block" />
            <span className="text-blue-600">próximo gran proyecto</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="flex items-center bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-2 pl-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <Search className="text-gray-400 w-6 h-6 mr-3" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca por nombre o servicio..." 
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 text-lg placeholder:text-gray-400"
              />
              <button className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-blue-700 transition-colors ml-2">
                Buscar
              </button>
            </div>
          </motion.div>
        </section>

        {/* 3. Categories Filter */}
        <section className="mb-16">
          <div className="flex overflow-x-auto pb-4 gap-4 md:justify-center hide-scrollbar">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? null : cat.id)}
                  className={`flex flex-col items-center gap-3 min-w-[90px] p-4 rounded-3xl transition-all duration-300 ${
                    isActive ? 'bg-white shadow-md border-gray-200 scale-105' : 'bg-transparent hover:bg-white/50 border-transparent hover:scale-105'
                  } border`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : cat.color + ' ' + cat.text}`}>
                    <Icon strokeWidth={2.5} size={24} />
                  </div>
                  <span className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Featured Section (Dual Banner) */}
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Ads Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 aspect-[2/1] sm:aspect-[21/9] lg:aspect-[16/9] group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAdIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image 
                  src={ADS[currentAdIndex].image} 
                  alt={ADS[currentAdIndex].title} 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent p-8 flex flex-col justify-center">
                  <span className="text-white/80 font-bold text-sm tracking-wider uppercase mb-2">
                    {ADS[currentAdIndex].company}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 max-w-sm leading-tight">
                    {ADS[currentAdIndex].title}
                  </h3>
                  <div>
                    <button className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors shadow-lg">
                      Visitar Empresa
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Ad Indicators */}
            <div className="absolute bottom-4 right-6 flex gap-2">
              {ADS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentAdIndex ? 'bg-white w-6' : 'bg-white/50'}`} />
              ))}
            </div>
          </div>

          {/* Right: Trust Card */}
          <div className="rounded-3xl bg-[#F0F7FF] border border-blue-100 p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-200/40 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-200/40 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                <ShieldCheck className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-blue-950 mb-4">Verificado y Seguro</h3>
              <p className="text-blue-800/80 text-lg leading-relaxed mb-6 max-w-md">
                Cada profesional es validado rigurosamente para asegurar la más alta calidad y seguridad en tus proyectos.
              </p>
              <button className="text-blue-600 font-bold flex items-center hover:text-blue-700 transition-colors group">
                Saber más sobre la verificación
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* 5. Professionals "Near you" */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">
              {activeCategory ? `Profesionales en ${activeCategory}` : "Profesionales cerca de ti"}
            </h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Ver todos</button>
          </div>

          {filteredProfessionals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfessionals.map((pro) => (
                <div key={pro.id} className="bg-white rounded-[2rem] p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all flex flex-col cursor-pointer group">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-5 bg-gray-100">
                    <Image 
                      src={pro.foto_perfil || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"} 
                      alt={pro.nombre_completo || "Profesional"} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-gray-900">{pro.calificacion || "5.0"}</span>
                    </div>
                  </div>
                  
                  <div className="px-2 flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 line-clamp-1">{pro.nombre_completo}</h4>
                        <p className="text-gray-500 text-sm font-medium line-clamp-1">{pro.titulo_profesional}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm mb-6 mt-3">
                      <MapPin size={16} className="mr-1.5" />
                      A {pro.distancia_km || "2.5"} km de distancia
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/profesional/${pro.id}`);
                    }}
                    className="w-full bg-gray-50 text-gray-900 py-3.5 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-colors border border-gray-100 hover:border-transparent"
                  >
                    Reservar Servicio
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No se encontraron profesionales</h3>
              <p className="text-gray-500">Intenta buscar con otros términos o cambia la categoría.</p>
              <button 
                onClick={() => { setSearchTerm(""); setActiveCategory(null); }}
                className="mt-6 text-blue-600 font-semibold"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </section>

      </main>

      {/* 6. Map Footer */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div 
          className="rounded-3xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden bg-[#FAF9F6] border border-gray-200"
          style={{
            backgroundImage: "radial-gradient(#E5E7EB 2px, transparent 2px)",
            backgroundSize: "24px 24px"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent"></div>
          <div className="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white max-w-lg w-full">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              <MapPin size={24} />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Explora con la vista de mapa</h3>
            <p className="text-gray-500 mb-8">
              Encuentra a los mejores profesionales en tu zona de manera interactiva.
            </p>
            <button className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-black transition-colors w-full sm:w-auto">
              Abrir Mapa Interactivo
            </button>
          </div>
        </div>
      </section>

      <BottomNav />

      {/* Global Styles specific to this page for hide-scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

