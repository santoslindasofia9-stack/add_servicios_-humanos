'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Download, 
  Gavel, 
  Lock, 
  Wallet, 
  CalendarDays, 
  Package, 
  PenTool,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ContractConfirmationPage = () => {
  const router = useRouter();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0d1c2e] pb-32 md:pb-40 font-sans">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#dce9ff]/50">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center w-full px-4 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-[#e6eeff] transition-colors cursor-pointer text-[#50616b]"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-[#0d1c2e]">Marketplace</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#f4dce4] text-[#716066] px-3 py-1.5 rounded-full text-[10px] md:text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
              <BadgeCheck size={14} className="text-[#6b5a60]" />
              <span className="hidden sm:inline">Verified by AI</span>
              <span className="sm:hidden">AI Verified</span>
            </div>
            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-[#d5e3fc]/20 overflow-hidden">
               <Image 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" 
                alt="User profile" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 pt-8 md:pt-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 md:space-y-12"
        >
          {/* Hero Section */}
          <motion.section 
            variants={itemVariants}
            className="ethereal-gradient rounded-3xl p-6 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-16 relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl -mr-32 -mt-32 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e0f2fe]/30 blur-3xl -ml-24 -mb-24 rounded-full"></div>
            
            <div className="flex-1 space-y-4 md:space-y-6 relative z-10 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 bg-white/60 backdrop-blur-sm rounded-full text-[#50616b] font-bold text-[10px] md:text-xs tracking-wider uppercase">
                SMART CONTRACT V2.1
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold text-[#0d1c2e] tracking-tight leading-[1.1]">
                Confirmación de Contrato
              </h2>
              <p className="text-lg md:text-xl text-[#43474b] max-w-xl mx-auto md:mx-0 leading-relaxed">
                Nuestra Inteligencia Artificial ha redactado y verificado los términos legales para garantizar una transacción segura y transparente.
              </p>
            </div>

            <div className="relative w-48 h-48 md:w-80 md:h-80 flex-shrink-0">
              <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <Image 
                  src="/images/smart_contract_crystals.png"
                  alt="Smart Contract Crystal Structure"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.section>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Price Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-[2rem] p-8 border border-[#dce9ff]/50 flex flex-col justify-between hover:shadow-xl transition-all duration-300 shadow-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#e0f2fe]/40 flex items-center justify-center mb-6 text-[#50616b]">
                  <Wallet size={28} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#0d1c2e] mb-2">Inversión Total</h3>
                <p className="text-[#43474b] text-base mb-6">Monto acordado para el cumplimiento del servicio.</p>
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-[#50616b] tracking-tighter">
                $2,450.00 <span className="text-sm font-semibold text-[#73787b] tracking-normal">USD</span>
              </div>
            </motion.div>

            {/* Deadline Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-[2rem] p-8 border border-[#dce9ff]/50 flex flex-col justify-between hover:shadow-xl transition-all duration-300 shadow-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f4dce4]/40 flex items-center justify-center mb-6 text-[#6b5a60]">
                  <CalendarDays size={28} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#0d1c2e] mb-2">Fecha de Entrega</h3>
                <p className="text-[#43474b] text-base mb-6">Plazo máximo estipulado por el algoritmo.</p>
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-[#6b5a60] tracking-tighter">
                14 <span className="text-sm font-semibold text-[#73787b] tracking-normal">Días Hábiles</span>
              </div>
            </motion.div>

            {/* Deliverables Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-[2rem] p-8 border border-[#dce9ff]/50 hover:shadow-xl transition-all duration-300 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#e6eeff] flex items-center justify-center mb-6 text-[#43474b]">
                <Package size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#0d1c2e] mb-4">Entregables</h3>
              <ul className="space-y-4">
                {[
                  'Documentación Técnica',
                  'Activos Digitales Finales',
                  'Código Fuente Protegido'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-[#43474b] font-medium">
                    <div className="text-[#50616b] bg-[#e0f2fe] rounded-full p-0.5">
                      <CheckCircle2 size={18} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Payment Structure Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-[2rem] p-6 md:p-10 border border-[#dce9ff]/50 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#FCE4EC]/60 flex items-center justify-center text-[#880e4f]">
                <Wallet size={26} />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#0d1c2e]">Estructura de Pago</h3>
                <p className="text-[#43474b] text-sm mt-0.5">Según lo acordado entre cliente y profesional</p>
              </div>
            </div>

            {/* Total agreed amount */}
            <div className="bg-gradient-to-br from-[#e0f2fe]/60 to-[#fce4ec]/40 rounded-2xl p-5 md:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#dce9ff]/60">
              <div>
                <p className="text-[10px] font-black text-[#50616b] uppercase tracking-widest mb-1">Costo Total Acordado</p>
                <p className="text-4xl md:text-5xl font-extrabold text-[#0d1c2e] tracking-tight">
                  $2,450.00 <span className="text-base font-semibold text-[#73787b] tracking-normal">USD</span>
                </p>
              </div>
              <div className="bg-white/80 rounded-xl px-4 py-2.5 border border-[#dce9ff]/50 text-center shadow-sm">
                <p className="text-[10px] font-black text-[#50616b] uppercase tracking-widest">Modalidad</p>
                <p className="text-sm font-bold text-[#0d1c2e] mt-0.5">Pago en 2 partes</p>
              </div>
            </div>

            {/* Two-step payment cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Step 1 */}
              <div className="relative bg-[#e0f2fe]/30 rounded-2xl p-5 border border-[#b7c9d5]/40 overflow-hidden">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#50616b] flex items-center justify-center text-white text-xs font-black shadow-sm">1</div>
                <p className="text-[10px] font-black text-[#50616b] uppercase tracking-widest mb-2">Al iniciar el contrato</p>
                <p className="text-3xl font-extrabold text-[#50616b] tracking-tight">
                  $1,225.00 <span className="text-sm font-semibold text-[#73787b]">USD</span>
                </p>
                <p className="text-xs text-[#43474b] font-medium mt-2 leading-relaxed">
                  Se cobra la primera mitad al momento de firmar. Estos fondos quedan retenidos en garantía (escrow) hasta la entrega.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[#50616b]">
                  <Lock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Retenido en garantía</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative bg-[#fce4ec]/30 rounded-2xl p-5 border border-[#d7c1c8]/40 overflow-hidden">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#6b5a60] flex items-center justify-center text-white text-xs font-black shadow-sm">2</div>
                <p className="text-[10px] font-black text-[#6b5a60] uppercase tracking-widest mb-2">Al entregar el servicio</p>
                <p className="text-3xl font-extrabold text-[#6b5a60] tracking-tight">
                  $1,225.00 <span className="text-sm font-semibold text-[#73787b]">USD</span>
                </p>
                <p className="text-xs text-[#43474b] font-medium mt-2 leading-relaxed">
                  La segunda mitad se libera al profesional únicamente cuando el cliente confirma que el trabajo fue entregado satisfactoriamente.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[#6b5a60]">
                  <CheckCircle2 size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Liberado al confirmar entrega</span>
                </div>
              </div>
            </div>

            {/* Info banner */}
            <div className="bg-[#fffbeb] border border-[#fde68a]/60 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#fde68a]/60 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-base">🔒</span>
              </div>
              <p className="text-sm text-[#78350f] leading-relaxed font-medium">
                <strong>¿Por qué pagos en dos partes?</strong> Este sistema protege tanto al cliente como al profesional. El cliente sabe que no perderá su dinero si el trabajo no se entrega, y el profesional recibe un anticipo seguro antes de comenzar.
              </p>
            </div>
          </motion.div>

          {/* Compliance Clauses */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-[2.5rem] p-6 md:p-12 border border-[#dce9ff]/50 mb-12 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div className="space-y-1">
                <h3 className="text-2xl md:text-4xl font-bold text-[#0d1c2e]">Cláusulas de Cumplimiento</h3>
                <p className="text-[#43474b]">Revisa los términos de protección automática</p>
              </div>
              <button className="w-full md:w-auto px-6 py-3 bg-[#e0f2fe] hover:bg-[#dce9ff] text-[#50616b] rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-sm">
                <Download size={18} /> Descargar PDF
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
              <div className="space-y-6 md:space-y-8">
                <div className="p-6 md:p-8 bg-[#e0f2fe]/30 rounded-2xl border border-[#e0f2fe]/50 hover:border-[#50616b]/20 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#50616b]/10 flex items-center justify-center text-[#50616b]">
                      <Gavel size={20} />
                    </div>
                    <h4 className="font-bold text-lg text-[#0d1c2e]">Arbitraje Automático</h4>
                  </div>
                  <p className="text-base text-[#43474b] leading-relaxed">
                    En caso de disputa, el contrato entrará en una fase de mediación digital procesada por nodos de confianza, asegurando imparcialidad absoluta y rapidez en la resolución.
                  </p>
                </div>

                <div className="p-6 md:p-8 bg-[#e0f2fe]/30 rounded-2xl border border-[#e0f2fe]/50 hover:border-[#6b5a60]/20 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#6b5a60]/10 flex items-center justify-center text-[#6b5a60]">
                      <Lock size={20} />
                    </div>
                    <h4 className="font-bold text-lg text-[#0d1c2e]">Depósito en Garantía</h4>
                  </div>
                  <p className="text-base text-[#43474b] leading-relaxed">
                    Los fondos serán retenidos en un "Escrow Account" inteligente y solo se liberarán tras la validación mutua de los entregables mediante tokens de aceptación.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl h-[300px] md:h-auto min-h-[400px] group shadow-lg">
                <Image 
                  src="/images/minimal_office_laptop.png"
                  alt="Minimalist Office"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c2e]/80 via-[#0d1c2e]/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                  <p className="text-white text-xl md:text-2xl font-medium italic leading-snug">
                    "La seguridad jurídica del futuro, ejecutada hoy por inteligencia artificial."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-2xl border-t border-[#dce9ff]/50 z-[100] shadow-2xl">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-4 md:py-6">
          {/* Mobile Layout */}
          <div className="flex md:hidden flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f4dce4] flex items-center justify-center text-[#716066]">
                <PenTool size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[#73787b] font-bold uppercase tracking-widest">Estado</p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6b5a60] animate-pulse"></span>
                  <p className="text-[#0d1c2e] font-bold text-sm">Pendiente de Firma Digital</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => router.back()}
                className="flex-1 px-4 py-4 text-[#43474b] font-bold text-sm bg-[#e6eeff]/50 rounded-full active:scale-95 transition-transform"
              >
                Revisar
              </button>
              <button 
                onClick={() => router.push('/seguimiento-proyecto')}
                className="flex-[2] px-4 py-4 bg-[#6b5a60] text-white font-bold rounded-full shadow-lg shadow-[#6b5a60]/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                Firmar Contrato <PenTool size={18} />
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-[#f4dce4] flex items-center justify-center text-[#716066] ring-8 ring-[#f4dce4]/20">
                <PenTool size={28} />
              </div>
              <div>
                <p className="text-xs text-[#73787b] font-bold uppercase tracking-widest mb-1">Estado Actual del Contrato</p>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6b5a60] animate-pulse"></span>
                  <p className="text-[#0d1c2e] font-bold text-xl">Pendiente de Firma Digital</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => router.back()}
                className="px-8 py-4 text-[#43474b] font-bold hover:bg-[#e6eeff] rounded-full transition-all"
              >
                Revisar Términos
              </button>
              <button 
                onClick={() => router.push('/seguimiento-proyecto')}
                className="px-14 py-5 bg-[#57534e] hover:bg-[#44403c] text-white font-bold rounded-full shadow-2xl shadow-[#57534e]/30 flex items-center gap-3 transform hover:-translate-y-1 transition-all text-lg"
              >
                Firmar Contrato Digitalmente
                <PenTool size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ethereal-gradient {
          background: linear-gradient(135deg, #e0f2fe 0%, #fce4ec 100%);
        }
      `}</style>
    </div>
  );
};

export default ContractConfirmationPage;
