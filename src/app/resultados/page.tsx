import { supabase } from "@/lib/supabase";
import ProfessionalCard from "@/components/resultados/ProfessionalCard";
import Link from "next/link";
import BottomNav from "@/components/dashboard/BottomNav";

export const dynamic = 'force-dynamic';

const FALLBACK_EXPERTS = [
  {
    id: "f1",
    nombre_completo: "Elena Rodríguez",
    titulo_profesional: "Especialista en diseño de interiores con enfoque en minimalismo nórdico y espacios zen.",
    categoria: "Hogar",
    calificacion: 5,
    tarifa: 85,
    foto_perfil: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgK5hjCuI3RxK41W5sivfJ4cy_aRTeGuYkRGCYKKI_lvVVln6_bvWJRZ9aDA3Cgp5XWoZzc4NOZlP-r1En7FnpOLkUJfaOPa_l_SpVIwtYpP9FSEcMzZB-Xac3MgJ55QCyrP379jAudQUlkkTfGFcQj1oLPjQ0FoHa2lljHSpYZKaNTZZ2qNmVV1KTZtNmGT3tkhJfOeqouIKu5r1JLs5r0X2pkPgNCSCJ0ZplO9hgxOPajxv8LzrnYcQvn__PtywfZFnQghiRKA"
  },
  {
    id: "f2",
    nombre_completo: "Julián Martínez",
    titulo_profesional: "Consultor de branding estratégico para marcas emergentes que buscan impacto visual.",
    categoria: "Creativo",
    calificacion: 5,
    tarifa: 120,
    foto_perfil: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8vieSJHSh8s4srhDRVc07JvNR_6zKQG2yfTNVG6xwWQaKG98OqscybPMITeYo7M7qaqYTcQqig3KcF_ZRiBRNW70bj8dQKlzQbVSJoa6PRzDLMVK32ZPlJ87tX9txfSPpZXG45CU6HAzkkBES1VESCWpOmw75y37nufVPw8cSSSJ9uahncyE58b1e2wMqe6ji-p3fnxClhkk-d_edC_R4zoJ-AxyS6yfR8Iqyg7hfTx3YXPngatGK6H7VUEdTuCxmT2NDc2Zr8w"
  },
  {
    id: "f3",
    nombre_completo: "Sofía López",
    titulo_profesional: "Redactora creativa y especialista en storytelling emocional para catálogos de lujo.",
    categoria: "Creativo",
    calificacion: 5,
    tarifa: 55,
    foto_perfil: "https://lh3.googleusercontent.com/aida-public/AB6AXuDq0ejKLQFaVq97cNcPankNdRGVIPMbmgSgVdufsS6wVPhWYLg-Tq3ApMsb7FeJy3T6qDZj21jIcDiA9W6x6Ggxf--TJm6Oof8TSccU7UEgftmLDhZooog8wF57B8fHK9BBEvChk8HFSsyRBUY16iFshpvEmZg_pqgDXnkVdxoDX9SDxVkkAVOQLWmp8SWB_U0p9auM9cA9TFglVEv9xkhkgIKpz5f7KmJwCdUV2Dl3BKnVKOabEcGTwE-oxd0a-88I_9ThwH0wbQ"
  },
  {
    id: "f4",
    nombre_completo: "Carlos Torres",
    titulo_profesional: "Desarrollador web full-stack enfocado en experiencias interactivas fluidas y seguras.",
    categoria: "Tech",
    calificacion: 5,
    tarifa: 150,
    foto_perfil: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgxZQxgPl_aiCor61A6P7KfK47nBEH3_EH9EzKbcx84FJi-tLSMIog6akIcD1OWsQ6JEfMOqsbJ8lMLYPbK-sdPPBvEXSj5CHfCkWR2QLby-tMYtu0zCzpxqb2_ru_BQ_6Y-MnTPtT5H9_BnkpkxjQlpH4-IWGCQmXSMW76HthZUqhHeAaDXDCNcWpe6vHmOUrWAhBP4MkdKEag_GMkhqpWbECXx1Ibs1UPYpOdEuak5pv6FvbB4ExyY3kkOfg1OB5lo6FKzE2jg"
  },
  {
    id: "f5",
    nombre_completo: "Marta Valls",
    titulo_profesional: "Estratega de marketing digital enfocada en ROI y crecimiento orgánico sostenible.",
    categoria: "Negocios",
    calificacion: 5,
    tarifa: 95,
    foto_perfil: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtczwaCBZDrakoJIvPXavRcfa_YWopKVV-7E7HQr1nuY1tk4Idv_KTZUmHIGTzsIPind-7xfjHamETjNysRRKAQ2ThKrJDlj6a5FhixgOXvC1i6jrRwwX-ysP3e7a9-yOoxp5NBSo4JPs_XDtNyLYRMUdnZsBicPKX-pX_Iv_hg37hGYdoAeMGNiLdo1f6Ed-T0_Ydjpy_b6DDORFaWAIhHLSdMQcDWLI9UOcZw-UVdUucDKpWNB6PVOvoF76-4pbY0nZ0NpBlTQ"
  },
  {
    id: "f6",
    nombre_completo: "David García",
    titulo_profesional: "Fotógrafo de producto con amplia experiencia en e-commerce y catálogos editoriales.",
    categoria: "Creativo",
    calificacion: 5,
    tarifa: 200,
    foto_perfil: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8PciBPx8J_AUKCIHBcXBGUlgRG_SmQklphaaOPBS7Io20uuJq9Yqq-LmnM5BE-jHMcSyCpPIvnICQJWKKlKTgI19ULZNR0yb5Zy2WjUz8C9GFMo8ovXVyg3r11ofkBuX3rfH-4GmDWyNrDpT_y2GPaEybrpRNVbFfVCdj5jBUsHDOQlJ4dx1n1IFo4WvjuYtSZiPl6qsw4viIzPKZwxMjTn_4NAFIUWX18Dnqf0EOhnKuC7df6IwgwyT-oAmPAOQZwqp9EHv3YQ"
  },
  {
    id: "f7",
    nombre_completo: "Valeria Gómez",
    titulo_profesional: "Especialista en UX/UI enfocada en aplicaciones móviles y usabilidad.",
    categoria: "Tech",
    calificacion: 4.9,
    tarifa: 110,
    foto_perfil: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "f8",
    nombre_completo: "Andrés Silva",
    titulo_profesional: "Asesor financiero para startups y pequeñas empresas.",
    categoria: "Negocios",
    calificacion: 4.8,
    tarifa: 135,
    foto_perfil: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "f9",
    nombre_completo: "Lucía Ortiz",
    titulo_profesional: "Organizadora de espacios y consultora de Marie Kondo.",
    categoria: "Hogar",
    calificacion: 5,
    tarifa: 75,
    foto_perfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "f10",
    nombre_completo: "Roberto Sánchez",
    titulo_profesional: "Técnico Electricista certificado, instalaciones y domótica.",
    categoria: "Hogar",
    calificacion: 4.7,
    tarifa: 45,
    foto_perfil: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "f11",
    nombre_completo: "Carolina Ruiz",
    titulo_profesional: "Ilustradora digital y creadora de personajes para videojuegos.",
    categoria: "Creativo",
    calificacion: 4.9,
    tarifa: 90,
    foto_perfil: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "f12",
    nombre_completo: "Diego Castro",
    titulo_profesional: "Desarrollador Backend Senior experto en Node y Python.",
    categoria: "Tech",
    calificacion: 5,
    tarifa: 160,
    foto_perfil: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
  }
];

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
  let displayedExperts = (experts && experts.length > 0) ? experts : FALLBACK_EXPERTS;
  
  // If fallback is used, simulate filtering for demo purposes
  if (displayedExperts === FALLBACK_EXPERTS) {
    if (query) {
      displayedExperts = displayedExperts.filter(e => 
        e.nombre_completo.toLowerCase().includes(query.toLowerCase()) || 
        e.titulo_profesional.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (categoria) {
      displayedExperts = displayedExperts.filter(e => 
        e.categoria.toLowerCase() === categoria.toLowerCase()
      );
    }
  }

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
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
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

        {/* The read-only search bar was removed per user request */}
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
          
          {/* Controles de Filtrado removidos por petición del usuario */}
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
              <span className="material-symbols-outlined text-[32px]">search</span>
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
