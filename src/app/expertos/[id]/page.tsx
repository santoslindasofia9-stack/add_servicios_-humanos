import { supabase } from "@/lib/supabase";
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
    id: "e9",
    nombre_completo: "Carolina Ruiz",
    titulo_profesional: "Desarrolladora Web",
    categoria: "Tech",
    calificacion: 5.0,
    tarifa: 80,
    foto_perfil: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200",
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
  },
  {
    id: "e1",
    nombre_completo: "Laura Vásquez",
    titulo_profesional: "Diseñadora de Moda",
    categoria: "Creativo",
    calificacion: 4.9,
    tarifa: 50,
    foto_perfil: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "e2",
    nombre_completo: "Roberto Sánchez",
    titulo_profesional: "Técnico Electricista",
    categoria: "Hogar",
    calificacion: 4.7,
    tarifa: 30,
    foto_perfil: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  }
];

export default async function ExpertProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const expertId = resolvedParams.id;

  // 1. Fetch from Supabase
  const { data: expertData, error } = await supabase
    .from("perfiles_profesionales")
    .select("*")
    .eq("id", expertId)
    .single();

  // Find fallback matching the ID or use the first one if not found
  const fallbackExpert = FALLBACK_EXPERTS.find(e => e.id === expertId) || FALLBACK_EXPERTS[0];

  // If we can't find them in DB, use fallback data for demo purposes
  const expert = expertData || fallbackExpert;

  return (
    <div className="min-h-screen bg-[#f8f9ff] font-sans pb-24 text-[#0d1c2e]">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-sky-50 flex justify-center items-center w-full h-16 px-4 md:px-8">
        <div className="max-w-[1280px] w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/resultados"
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#5e6f79] hover:text-[#0d1c2e] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0d1c2e] rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg leading-none">hub</span>
              </div>
              <h1 className="text-xl font-bold text-[#0d1c2e] tracking-tight">Tool Link</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 hidden md:flex">
             <button className="flex items-center justify-center p-2 text-[#5e6f79] hover:bg-[#eff4ff] rounded-full">
               <span className="material-symbols-outlined">search</span>
             </button>
             <div className="w-10 h-10 rounded-full border-2 border-[#e0f2fe] bg-gray-200 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="User" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-[32px] pt-24 pb-32 space-y-[32px]">
        
        {/* Profile Header Section */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-[32px] p-[24px] md:p-12 bg-white/70 backdrop-blur-xl border border-sky-50 rounded-[24px] shadow-[0_20px_40px_rgba(224,242,254,0.4)]">
          <div className="relative flex-shrink-0">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-[6px] border-[#e0f2fe] overflow-hidden shadow-xl">
              <img 
                src={expert.foto_perfil} 
                alt={expert.nombre_completo} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute bottom-4 right-4 bg-[#f472b6] text-white p-2.5 rounded-full shadow-lg flex items-center justify-center border-4 border-white">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h2 className="text-[32px] md:text-[40px] font-bold text-[#0d1c2e] leading-tight tracking-tight">
                  {expert.nombre_completo}
                </h2>
                <span className="inline-flex px-3 py-1 bg-[#fef2f2] text-[#be185d] text-[12px] font-bold tracking-wider rounded-full w-fit mx-auto md:mx-0 uppercase border border-pink-100">
                  GOLD MEMBER
                </span>
              </div>
              <p className="text-[16px] md:text-[18px] text-[#5e6f79] max-w-2xl leading-relaxed">
                {expert.titulo_profesional}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
              <div className="flex items-center gap-2 text-[#5e6f79]">
                <span className="material-symbols-outlined text-[#38bdf8]">location_on</span>
                <span className="text-[16px]">Barcelona, ES</span>
              </div>
              <div className="flex items-center gap-2 text-[#5e6f79]">
                <span className="material-symbols-outlined text-[#f472b6]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-[16px] font-bold text-[#0d1c2e]">{expert.calificacion}</span>
                <span className="text-[16px] opacity-60">(128 Reviews)</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center md:justify-start">
              <button className="px-10 py-4 bg-[#fce4ec] text-[#880e4f] font-bold rounded-full hover:scale-[1.05] active:scale-95 transition-all duration-300 shadow-sm border border-pink-100">
                Seguir Profesional
              </button>
              <Link 
                href={`/chat/${expert.id}`}
                className="px-10 py-4 bg-[#e0f2fe] text-[#0369a1] font-bold rounded-full hover:bg-[#d1e9ff] hover:scale-[1.05] active:scale-95 transition-all duration-300 shadow-sm border border-sky-100 text-center"
              >
                Enviar Mensaje
              </Link>
            </div>
          </div>
        </section>

        {/* Bio & Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-[32px]">
          <div className="lg:col-span-2 space-y-6 p-[24px] md:p-10 bg-white/70 backdrop-blur-xl border border-sky-50 rounded-[24px] shadow-[0_20px_40px_rgba(224,242,254,0.4)]">
            <h3 className="text-[24px] font-semibold text-[#0d1c2e] flex items-center gap-3">
              <span className="material-symbols-outlined text-[#38bdf8]">auto_awesome</span>
              Biografía Profesional
            </h3>
            <div className="text-[16px] text-[#5e6f79] space-y-4 leading-relaxed">
              <p>Con más de 10 años de experiencia en minimalismo de alta gama, me especializo en crear identidades visuales que comunican paz, seguridad y calidad premium. Mi enfoque se basa en la "Confianza Etérea", asegurando que cada detalle sirva a un propósito al construir una conexión serena entre las marcas y sus audiencias.</p>
              <p>He colaborado con líderes globales en los sectores del bienestar, la arquitectura y boutiques de lujo, aportando una estética enfocada y suave a ecosistemas digitales complejos.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-[32px]">
            <div className="p-[24px] md:p-8 bg-[#e0f2fe]/30 rounded-[24px] border border-sky-100 flex flex-col justify-center items-center text-center">
              <span className="text-[40px] font-bold text-[#50616b]">98%</span>
              <span className="text-[12px] font-bold tracking-wider text-[#5e6f79] mt-1 uppercase">Tasa de Éxito</span>
            </div>
            <div className="p-[24px] md:p-8 bg-[#f4dce4]/30 rounded-[24px] border border-pink-100 flex flex-col justify-center items-center text-center">
              <span className="text-[40px] font-bold text-[#6b5a60]">24h</span>
              <span className="text-[12px] font-bold tracking-wider text-[#716066] mt-1 uppercase">Tiempo de Resp.</span>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="space-y-[32px] pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h3 className="text-[32px] font-semibold text-[#0d1c2e]">Portafolio</h3>
              <p className="text-[16px] text-[#5e6f79]">Una selección de trabajos recientes que reflejan Minimalismo Suave.</p>
            </div>
            <button className="flex items-center gap-2 text-[#38bdf8] font-bold hover:gap-3 transition-all duration-300">
              Ver galería <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
            {/* Portfolio Item 1 */}
            <div className="group relative overflow-hidden rounded-[24px] shadow-[0_20px_40px_rgba(224,242,254,0.4)] bg-white transition-transform duration-500 hover:-translate-y-2">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUkElGt0NxvD9BR8AcD0ffRoU68KTleJoIWAikW5MwXrrMCLCY2Dnv8YUeUxU614e8QIVnQXiwg07cHq3KQQvVZQqrFQFWWLQPwDouzqYn8nVdacPa6OIdFT43oueWJKGCF0w1Styha1jY5-63oA1Tzk687t9Hu6Pf8u6bpYpfIv545eof2kXrVE4Vx9KWVq1ps0vDAtQA-34dvzPyouy_zzVpPh7gMLU1rBV0jeXqS0ZL_psYiN0XKBPl_YTBV_DUduTK6mvMZw" 
                  alt="Interior Project" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-white font-bold text-[24px]">Serenity Lounge</span>
                <span className="text-white/80 text-[16px]">Visualización Arquitectónica</span>
              </div>
            </div>
            
            {/* Portfolio Item 2 */}
            <div className="group relative overflow-hidden rounded-[24px] shadow-[0_20px_40px_rgba(224,242,254,0.4)] bg-white transition-transform duration-500 hover:-translate-y-2">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3UHr9BkD1YMOzLLziprwckdjDIifcOR4K61T_ZcxDeNVGX-Mtho2x4-FWxwJ99HUwVXGARDlHJDLQISzYrioS_fkm9wcOiqXBrwvxmL5OVEJigEl6oqUogorB28NGs9iXB6dMO9JWbzRpYp8BOLa_RI5LDSlJXGDgq38J4F4aNrGInvwPh8GiWaMzTCKb8Ozgb8q98X8kLwpbakGc7kmqdUOhEyFTLsLxRbQxvyQHU6BlQDaoIhuZyUW91SiHWAWwMZimaxJ2VQ" 
                  alt="Branding Piece" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-white font-bold text-[24px]">Ethereal Motion</span>
                <span className="text-white/80 text-[16px]">Identidad de Marca</span>
              </div>
            </div>
            
            {/* Portfolio Item 3 */}
            <div className="group relative overflow-hidden rounded-[24px] shadow-[0_20px_40px_rgba(224,242,254,0.4)] bg-white transition-transform duration-500 hover:-translate-y-2 md:col-span-2 lg:col-span-1">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtvnhQ23IvE930TsIJ9buPQClYwMz-iJW5pFyc0PgwCsfq6HPo5kos_D5LIqTaCYWfFOFVxcZmCGKhfwNBlgoZzIn31KuK2NUT7T7nD4SQYvPZgS41nYHCZFnV5XHqhCc7hj1wQXldYH2uvbv50Svo3wY32k3v723pmm_jeN-p2bbSqc7oEVN-mRy-Q6Yx94t5txpStbq-wALbYebghCbXUnTA8DQPsFEFkd73PHQTgRuHwIVCZFzp9nS9rVDtGWTI4_RjY9vRmw" 
                  alt="Product Design" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-white font-bold text-[24px]">Pure Ritual</span>
                <span className="text-white/80 text-[16px]">Diseño de Empaque</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-16 h-16 bg-[#E0F2FE] text-[#0288D1] rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 z-[60]">
        <span className="material-symbols-outlined text-[32px]">chat</span>
      </button>

      {/* Global Bottom Nav for Mobile */}
      <BottomNav />
    </div>
  );
}
