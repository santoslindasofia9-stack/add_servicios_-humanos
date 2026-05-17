'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2, User, Receipt, Star } from 'lucide-react';
import Image from 'next/image';

export default function ConfirmacionPagoFinalPage() {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [rated, setRated] = useState<boolean>(false);
  const [expertName, setExpertName] = useState<string>('Expert Professional');

  useEffect(() => {
    const savedName = localStorage.getItem("currentExpertName");
    if (savedName) setExpertName(savedName);
  }, []);

  const handleRating = (stars: number) => {
    setRating(stars);
    setRated(true);
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
          className="relative w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-[0_40px_80px_rgba(224,242,254,0.6)] border border-white/50 flex flex-col items-center text-center overflow-hidden"
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
          <div className="relative mb-8 flex items-center justify-center">
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0d1c2e] tracking-tight mb-4">¡Pago enviado!</h1>
          <p className="text-slate-500 text-base md:text-lg max-w-md leading-relaxed">
            El profesional ha recibido sus fondos. Tu transacción se ha completado con éxito y de forma segura.
          </p>

          {/* Details Section */}
          <div className="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl text-left border border-slate-100/50 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-sky-50 rounded-full flex items-center justify-center shrink-0">
                <User size={20} className="text-sky-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Profesional</p>
                <p className="font-extrabold text-[#0d1c2e] text-sm md:text-base">{expertName}</p>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl text-left border border-slate-100/50 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-pink-50 rounded-full flex items-center justify-center shrink-0">
                <Receipt size={20} className="text-pink-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Referencia</p>
                <p className="font-extrabold text-[#0d1c2e] text-sm md:text-base">#MP-8829-XQ</p>
              </div>
            </div>
          </div>

          {/* Star Rating Section */}
          <div className="mt-10 pt-8 border-t border-slate-100 w-full">
            {!rated ? (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#0d1c2e] uppercase tracking-wider">Califica tu experiencia con el profesional</h3>
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
                        size={28}
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
                className="bg-green-50/50 border border-green-100 rounded-2xl p-4 text-center text-green-800 text-sm font-semibold"
              >
                🎉 ¡Gracias por tu calificación de {rating} estrellas! Tu opinión ayuda a la comunidad.
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => router.push('/home-cliente')}
              className="bg-[#fce4ec] text-[#880e4f] hover:bg-[#fbd1de] font-bold px-8 py-4 rounded-full transition-all active:scale-95 shadow-sm text-sm"
            >
              Volver al Inicio
            </button>
            <button 
              onClick={() => router.push('/seguimiento-proyecto')}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-8 py-4 rounded-full border border-slate-200 transition-all active:scale-95 text-sm"
            >
              Seguimiento de Proyecto
            </button>
          </div>
        </motion.div>

        {/* Supportive Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-100/80 shadow-sm relative h-48 bg-slate-200"
        >
          <Image
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200"
            alt="Success backdrop"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent flex items-end p-6">
            <div className="text-white text-left">
              <h4 className="font-extrabold text-lg">Tu proyecto ha finalizado</h4>
              <p className="text-white/80 text-xs font-medium">Todos los hitos completados con Garantía Trust.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
