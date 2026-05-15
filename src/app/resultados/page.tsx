import { supabase } from "@/lib/supabase";
import ProfessionalCard from "@/components/resultados/ProfessionalCard";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal, ArrowUpDown, Search } from "lucide-react";
import BottomNav from "@/components/dashboard/BottomNav";

export const dynamic = 'force-dynamic';

export default async function ResultadosBusqueda({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const categoria = typeof params.categoria === "string" ? params.categoria : "";

  // ── Fetch Supabase ────────────────────────────────────────────────────────
  let dbQuery = supabase
    .from("perfiles_profesionales")
    .select("id, nombre_completo, titulo_profesional, categoria, calificacion, tarifa, foto_perfil");

  if (query) {
    dbQuery = dbQuery.or(`nombre_completo.ilike.%${query}%,titulo_profesional.ilike.%${query}%`);
  }
  
  if (categoria) {
    dbQuery = dbQuery.ilike("categoria", `%${categoria}%`);
  }

  const { data: experts, error } = await dbQuery;

  // Fallback si no hay data o hay error
  const displayedExperts = (experts && experts.length > 0) ? experts : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] font-sans overflow-x-hidden pb-24">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 flex justify-between items-center w-full px-4 lg:px-8 py-3 bg-white/90 backdrop-blur-md border-b border-sky-50 flex-shrink-0"
        style={{ boxShadow: "0 1px 12px rgba(13,28,46,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/home-cliente"
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#5e6f79] hover:text-[#0d1c2e] transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <Link href="/home-cliente" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#0d1c2e] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg leading-none">hub</span>
            </div>
            <h1 className="text-xl font-bold text-[#0d1c2e] tracking-tight hidden sm:block">
              Tool Link
            </h1>
          </Link>
        </div>

        {/* Read-only search bar styling for context */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <div className="bg-[#eff4ff] rounded-full w-full flex items-center px-5 py-2.5 border border-sky-100">
            <Search size={18} className="text-slate-400 mr-3 flex-shrink-0" />
            <div className="text-sm text-[#0d1c2e] font-medium">
              {query ? `Buscando: ${query}` : (categoria ? `Categoría: ${categoria}` : "Todos los expertos")}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="flex-grow container mx-auto max-w-[1280px] px-4 md:px-10 py-8 md:py-14">
        
        {/* Encabezado de Resultados */}
        <div className="mb-8 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[12px] text-[#0288D1] mb-3 block uppercase tracking-[0.2em] font-bold">
              Descubre Expertos
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0d1c2e] leading-tight">
              Resultados de Búsqueda
            </h2>
            <p className="text-lg text-[#5e6f79] mt-4 max-w-lg">
              Hemos seleccionado cuidadosamente a los mejores profesionales que encajan con la visión de tu próximo proyecto.
            </p>
          </div>
          
          {/* Controles de Filtrado */}
          <div className="flex gap-3 self-start md:self-end">
            <button className="px-5 md:px-7 py-3 bg-white border border-sky-50 rounded-full font-bold text-xs text-[#0d1c2e] hover:bg-sky-50 transition-all duration-300 flex items-center gap-2 shadow-sm uppercase tracking-wider">
              <SlidersHorizontal size={18} /> Filtrar
            </button>
            <button className="px-5 md:px-7 py-3 bg-white border border-sky-50 rounded-full font-bold text-xs text-[#0d1c2e] hover:bg-sky-50 transition-all duration-300 flex items-center gap-2 shadow-sm uppercase tracking-wider">
              <ArrowUpDown size={18} /> Ordenar
            </button>
          </div>
        </div>

        {/* Grid de Tarjetas */}
        {displayedExperts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {displayedExperts.map((expert) => (
              <ProfessionalCard
                key={expert.id}
                id={expert.id}
                nombre_completo={expert.nombre_completo}
                titulo_profesional={expert.titulo_profesional}
                calificacion={expert.calificacion}
                reseñas={Math.floor(Math.random() * 200) + 10} // Dummy data for reviews as it's not in DB
                tarifa={expert.tarifa || "$50"}
                foto_perfil={expert.foto_perfil}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
            <div className="w-16 h-16 bg-[#f8f9ff] rounded-full flex items-center justify-center mx-auto mb-4 text-[#5e6f79]">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#0d1c2e] mb-2">No se encontraron profesionales</h3>
            <p className="text-[#5e6f79]">Intenta buscar con otros términos o cambia la categoría.</p>
            <Link 
              href="/home-cliente"
              className="mt-6 inline-block text-[#0288D1] font-bold underline"
            >
              Volver al inicio
            </Link>
          </div>
        )}

        {/* Botón de Carga */}
        {displayedExperts.length > 0 && (
          <div className="mt-16 text-center">
            <button className="px-10 py-4 bg-[#0288D1] text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#0277bd] hover:shadow-lg transition-all duration-300 active:scale-95">
              Cargar más resultados
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
