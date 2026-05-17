'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2, User, Receipt, Star, Download, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function ConfirmacionPagoFinalPage() {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [rated, setRated] = useState<boolean>(false);
  const [showRatingSection, setShowRatingSection] = useState<boolean>(false);
  const [expertName, setExpertName] = useState<string>('Expert Professional');

  useEffect(() => {
    const savedName = localStorage.getItem("currentExpertName");
    if (savedName) setExpertName(savedName);
  }, []);

  const handleRating = (stars: number) => {
    setRating(stars);
    setRated(true);
    setTimeout(() => {
      setShowRatingSection(false);
    }, 1800);
  };

  const downloadReceiptPDF = () => {
    const docContent = `%PDF-1.4
%âãÏÓ
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [ 3 0 R ] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [ 0 0 595 842 ] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 320 >>
stream
BT
/F1 20 Tf
50 750 Td
(TRUSTMARKET - RECIBO DE PAGO FINAL) Tj
/F1 12 Tf
0 -40 Td
(Referencia de Pago: #MP-8829-XQ) Tj
0 -20 Td
(Estado: EXITOSO) Tj
0 -20 Td
(Monto Liberado: $2,250.00 USD) Tj
0 -20 Td
(Profesional Beneficiario: Expert Professional) Tj
0 -20 Td
(Servicio: Diseno de Identidad Visual Premium) Tj
0 -20 Td
(Fecha de Pago: 24 de Mayo, 2026) Tj
0 -30 Td
(Este documento es un comprobante de transaccion emitida de forma segura por TrustMarket.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000068 00000 n 
0000000130 00000 n 
0000000257 00000 n 
0000000329 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
700
%%EOF`;

    const blob = new Blob([docContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Recibo_Pago_Final_TrustMarket.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="fixed -bottom-20 -right-20 w-80 h-80 bg-pink-100/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="fixed -top-20 -left-20 w-64 h-64 bg-sky-100/30 rounded-full blur-[60px] pointer-events-none" />

      <main className="w-full max-w-[1280px] flex flex-col items-center justify-center z-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="relative w-full max-w-md bg-white/75 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_80px_rgba(224,242,254,0.6)] border border-white/50 flex flex-col items-center text-center overflow-hidden"
        >
          {/* Confetti Graphics */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-10 left-10 w-4 h-4 bg-pink-300 rounded-full opacity-60"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-pink-300 rounded-lg rotate-12 opacity-50"></div>
            <div className="absolute bottom-20 left-1/4 w-5 h-2 bg-pink-300 rounded-full -rotate-45 opacity-40"></div>
            <div className="absolute top-1/2 right-10 w-2 h-6 bg-pink-300 rounded-full rotate-45 opacity-30"></div>
            <div className="absolute bottom-10 right-1/3 w-4 h-4 bg-pink-300 rounded-full opacity-50"></div>
          </div>

          {/* Success Icon Container */}
          <div className="relative mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-sky-400 rounded-full blur-2xl opacity-20"></div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 12 }}
              className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-sky-100"
            >
              <CheckCircle2 size={48} className="text-sky-400" />
            </motion.div>
          </div>

          {/* Content */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0d1c2e] tracking-tight mb-3">¡Pago enviado!</h1>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            El profesional ha recibido sus fondos. Tu transacción se ha completado con éxito y de forma segura.
          </p>

          {/* Details Section (Stacked Vertically exactly as screen.png) */}
          <div className="mt-8 w-full flex flex-col gap-3">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl text-left border border-slate-100/50 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-sky-50 rounded-full flex items-center justify-center shrink-0">
                <User size={18} className="text-sky-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Profesional</p>
                <p className="font-extrabold text-[#0d1c2e] text-sm">{expertName}</p>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl text-left border border-slate-100/50 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-pink-50 rounded-full flex items-center justify-center shrink-0">
                <Receipt size={18} className="text-pink-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Referencia</p>
                <p className="font-extrabold text-[#0d1c2e] text-sm">#MP-8829-XQ</p>
              </div>
            </div>
          </div>

          {/* Dynamic Interactive Rating Panel */}
          <AnimatePresence>
            {showRatingSection && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 pt-6 border-t border-slate-100 w-full overflow-hidden"
              >
                {!rated ? (
                  <div className="space-y-4 py-2">
                    <h3 className="text-xs font-extrabold text-[#0d1c2e] uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500 animate-pulse" />
                      Califica tu experiencia
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          onMouseEnter={() => setHoverRating(stars)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => handleRating(stars)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star
                            size={24}
                            className={`transition-colors duration-200 ${
                              stars <= (hoverRating || rating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50/50 border border-green-100 rounded-2xl p-4 text-center text-green-800 text-xs font-semibold"
                  >
                    🎉 ¡Gracias por tu calificación de {rating} estrellas!
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons (Stacked Vertically exactly as screen.png) */}
          <div className="mt-8 flex flex-col gap-3 w-full justify-center">
            {/* Descargar Recibo */}
            <button
              onClick={downloadReceiptPDF}
              className="w-full bg-[#fce4ec] text-[#880e4f] hover:bg-[#fbd1de] font-bold py-4 rounded-full transition-all active:scale-95 shadow-sm text-sm flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Descargar Recibo
            </button>
            
            {/* Calificar */}
            <button 
              onClick={() => {
                if (rated) return;
                setShowRatingSection(!showRatingSection);
              }}
              className={`w-full font-bold py-4 rounded-full border transition-all active:scale-95 text-sm flex items-center justify-center gap-2 ${
                rated 
                  ? 'bg-green-50 text-green-700 border-green-200 cursor-default' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Star size={16} className={rated ? 'fill-green-600 text-green-600' : ''} />
              {rated ? `Calificado (${rating}★)` : 'Calificar'}
            </button>

            {/* Volver a Home */}
            <button
              onClick={() => {
                localStorage.setItem("userRole", "client");
                window.location.href = '/home-cliente';
              }}
              className="w-full text-center text-slate-400 hover:text-slate-600 transition-colors font-bold text-xs py-2 uppercase tracking-widest mt-2"
            >
              Volver a Home
            </button>
          </div>
        </motion.div>

        {/* Supportive Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 w-full max-w-md overflow-hidden rounded-3xl border border-slate-100/80 shadow-sm relative h-40 bg-slate-200"
        >
          <Image
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200"
            alt="Success backdrop"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent flex items-end p-5">
            <div className="text-white text-left">
              <h4 className="font-extrabold text-base">Tu proyecto ha finalizado</h4>
              <p className="text-white/80 text-[10px] font-medium">Todos los hitos completados con Garantía Trust.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
