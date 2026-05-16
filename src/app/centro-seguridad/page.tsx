'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  ChevronRight, 
  MessageCircle, 
  ArrowLeft,
  Bell,
  Send,
  AlertCircle,
  X,
  Plus,
  ShieldCheck,
  LifeBuoy
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SecurityCenterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Perfil del usuario
  const [userName, setUserName] = useState<string>("Usuario");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Usuario");
    setUserAvatar(localStorage.getItem("userAvatar"));
  }, []);

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [evidences, setEvidences] = useState<{id: string, name: string, type: string}[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidences(prev => [
        ...prev, 
        { id: Math.random().toString(36).substr(2, 9), name: file.name, type: file.type }
      ]);
    }
  };

  const removeEvidence = (id: string) => {
    setEvidences(prev => prev.filter(e => e.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      router.push('/seguimiento-proyecto');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-20 relative">
      {/* Navbar Minimalista */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/seguimiento-proyecto')}>
              <ArrowLeft className="text-slate-400 hover:text-slate-900 transition-colors" size={24} />
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/home-cliente')}>
              <div className="w-10 h-10 bg-[#0d1c2e] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">hub</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#0d1c2e] tracking-tight">Tool Link</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative p-2">
              <Bell size={24} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <p className="text-sm font-bold text-slate-900 hidden sm:block">{userName}</p>
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-slate-100 bg-slate-100">
                {userAvatar ? (
                  <Image src={userAvatar || ''} alt="Avatar" fill className="object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-slate-500 text-sm uppercase">{userName.charAt(0)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 pt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Columna Izquierda: Formulario de Disputa */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-xs font-bold uppercase tracking-wider">
                <ShieldAlert size={14} />
                Centro de Seguridad
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Reportar un problema o disputa
              </h1>
              <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
                ¿Algo no salió como esperabas? Estamos aquí para ayudarte. Por favor, describe la situación y adjunta las pruebas necesarias para que nuestro equipo pueda intervenir.
              </p>
            </div>

            <motion.form 
              onSubmit={handleSubmit}
              className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] space-y-8"
            >
              {/* Selección de Motivo */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 ml-1">Motivo del reporte</label>
                <select 
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-sky-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="incumplimiento">Incumplimiento de plazos</option>
                  <option value="calidad">Baja calidad del trabajo</option>
                  <option value="comunicacion">Falta de comunicación del profesional</option>
                  <option value="otro">Otro motivo</option>
                </select>
              </div>

              {/* Descripción Detallada */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 ml-1">Describe lo ocurrido</label>
                <textarea 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Por favor, sé lo más específico posible..."
                  rows={5}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-sky-500 transition-all resize-none"
                />
              </div>

              {/* Adjuntar Evidencias */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 ml-1">Adjuntar Evidencias</label>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Máx. 5 archivos</span>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <AnimatePresence>
                    {evidences.map((file) => (
                      <motion.div 
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-slate-50 p-3 pr-10 rounded-xl border border-slate-100 flex items-center gap-3 relative group"
                      >
                        <div className="text-sky-500">
                          {file.type.includes('image') ? <ImageIcon size={18} /> : <FileText size={18} />}
                        </div>
                        <span className="text-xs font-bold text-slate-700 max-w-[120px] truncate">{file.name}</span>
                        <button 
                          type="button"
                          onClick={() => removeEvidence(file.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-sky-300 hover:text-sky-500 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitted}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ShieldAlert size={20} />
                  {isSubmitted ? 'Reporte Enviado' : 'Enviar Denuncia a Revisión'}
                </button>
              </div>
            </motion.form>
          </div>

          {/* Columna Derecha: Tips y Garantía */}
          <div className="lg:w-[350px] space-y-6">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Tu seguridad es prioridad</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Recuerda que tus fondos están protegidos por nuestro sistema de **Escrow**. El dinero no se liberará hasta que la disputa se resuelva.
              </p>
              <ul className="space-y-4">
                {[
                  "Nuestro equipo revisará el caso en menos de 24h.",
                  "Mantén toda la comunicación dentro de Tool Link.",
                  "Adjunta capturas claras de los acuerdos previos."
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                    <span className="text-xs text-slate-600 font-medium leading-normal">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-4 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <LifeBuoy size={160} />
              </div>
              <h4 className="text-lg font-bold relative z-10">¿Problema urgente?</h4>
              <p className="text-slate-400 text-sm relative z-10">Nuestro soporte técnico VIP está listo para hablar contigo ahora mismo.</p>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-sm transition-all border border-white/10 relative z-10"
              >
                Abrir Chat en Vivo
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Widget de Chat en la Esquina */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[350px] bg-white rounded-[32px] shadow-2xl border border-slate-100 z-[100] overflow-hidden"
          >
            <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center font-black">TL</div>
                <div>
                  <p className="font-bold text-sm leading-none">Soporte Tool Link</p>
                  <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mt-1">En línea ahora</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="h-[300px] bg-slate-50 p-6 overflow-y-auto space-y-4 flex flex-col justify-end">
              <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm text-sm text-slate-700 max-w-[85%] border border-slate-100">
                ¡Hola! Soy Alex del equipo de seguridad. ¿En qué puedo ayudarte hoy?
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Escribe tu mensaje..."
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 pr-12 text-sm font-medium focus:ring-2 focus:ring-sky-500"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante para abrir chat si está cerrado */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Notificación de Éxito */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[200]"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <p className="font-bold text-sm">Tu reporte ha sido enviado. Estamos redirigiéndote...</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
