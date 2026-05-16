'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Link as LucideLink, 
  Info, 
  ChevronRight, 
  MoreVertical, 
  Building2, 
  HelpCircle, 
  MessageCircle, 
  ArrowLeft, 
  Bell
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface EvidenceFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'link';
  time: string;
  url?: string;
  thumbnail?: string;
}

export default function EvidenceCenterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Perfil del usuario (sincronizado)
  const [userName, setUserName] = useState<string>("Usuario");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Usuario");
    setUserAvatar(localStorage.getItem("userAvatar"));
  }, []);

  const [files, setFiles] = useState<EvidenceFile[]>([
    {
      id: '1',
      name: 'entrega_final_v1.pdf',
      size: '2.4 MB',
      type: 'pdf',
      time: 'Hace 5 min'
    },
    {
      id: '2',
      name: 'screenshot_resultado.png',
      size: '1.1 MB',
      type: 'image',
      time: 'Hace 10 min',
      thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: '3',
      name: 'Repositorio de Código',
      size: 'github.com/proyecto/main',
      type: 'link',
      time: 'Hace 1 hora'
    }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFile: EvidenceFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type.includes('image') ? 'image' : 'pdf',
        time: 'Recién subido',
        thumbnail: file.type.includes('image') ? URL.createObjectURL(file) : undefined
      };
      setFiles(prev => [newFile, ...prev]);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { from: 'user', text: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: 'agent', text: '¡Gracias por tu mensaje! Nuestro equipo técnico lo revisará en breve.' }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-20">
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

      <main className="max-w-[1400px] mx-auto px-6 pt-8 space-y-8">
        {/* Título de Sección */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Centro de Evidencias</h1>
          
          {/* Banner Informativo Superior */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Info size={20} />
            </div>
            <p className="text-blue-800 text-sm font-medium leading-relaxed">
              Tus evidencias garantizan la liberación de fondos. Sube capturas de pantalla, documentos o enlaces del progreso finalizado para que el cliente pueda validar tu trabajo.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna Izquierda: Zona de Carga y Archivos */}
          <div className="lg:w-[65%] space-y-8">
            
            {/* Zona de Carga (Drag & Drop) */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-[32px] p-12 border-2 border-dashed border-sky-200 flex flex-col items-center justify-center text-center space-y-6 shadow-sm hover:border-sky-300 transition-colors"
            >
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 cursor-pointer hover:scale-110 transition-transform shadow-sm"
              >
                <Upload size={32} />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-slate-900">Arrastra y suelta tus archivos aquí</p>
                <p className="text-sm text-slate-400 font-medium">JPG, PNG, PDF, ZIP (Máx. 25MB)</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-[#FCE4EC] hover:bg-[#fbd1de] text-[#880e4f] font-bold rounded-full transition-all shadow-sm active:scale-95"
              >
                Seleccionar Archivos
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </motion.div>

            {/* Sección de Archivos Subidos */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">Archivos subidos</h2>
                  <span className="bg-sky-100 text-sky-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {files.length} ARCHIVOS
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {files.map((file) => (
                    <motion.div 
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow"
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                        file.type === 'pdf' ? 'bg-red-50 text-red-500' : 
                        file.type === 'image' ? 'bg-sky-50 text-sky-500' : 'bg-slate-50 text-slate-500'
                      }`}>
                        {file.type === 'pdf' && <FileText size={24} />}
                        {file.type === 'image' && (
                          file.thumbnail ? (
                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                              <Image src={file.thumbnail || ''} alt={file.name} fill className="object-cover" />
                            </div>
                          ) : <ImageIcon size={24} />
                        )}
                        {file.type === 'link' && <LucideLink size={24} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400 font-medium">{file.size}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-400 font-medium">{file.time}</span>
                        </div>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Resumen y Soporte Técnico */}
          <div className="lg:w-[35%] space-y-6">
            
            {/* Tarjeta de Resumen del Proyecto */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-100 space-y-8"
            >
              <h2 className="text-xl font-bold text-slate-900">Resumen del Proyecto</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-500">Contrato</span>
                  <span className="text-sm font-bold text-slate-900">#CTR-89231</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-500">Presupuesto</span>
                  <span className="text-sm font-bold text-slate-900">$4,500.00 USD</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-500">Hito</span>
                  <span className="text-sm font-bold text-sky-600">Entrega Final</span>
                </div>
              </div>

              {/* Caja de Información del Cliente */}
              <div className="bg-blue-50/50 rounded-2xl p-4 flex items-center gap-4 border border-blue-50">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm">
                  <Building2 size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">CLIENTE</p>
                  <p className="text-sm font-bold text-slate-900">Studio Arq. Minimal</p>
                </div>
              </div>

              <button className="w-full py-4 bg-[#FCE4EC] hover:bg-[#fbd1de] text-[#880e4f] font-bold rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                Enviar para Revisión
              </button>
            </motion.div>

            {/* Tarjeta de Ayuda Flotante */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50/30 rounded-[32px] p-8 border border-blue-50 space-y-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                <HelpCircle size={120} />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
                  <HelpCircle size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">¿Necesitas ayuda?</h3>
              </div>
              
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Si tienes problemas para subir tus archivos, contacta a nuestro equipo de soporte técnico disponible 24/7.
              </p>

              <button
                onClick={() => router.push('/centro-seguridad')}
                className="flex items-center gap-3 text-sky-600 font-bold text-sm hover:gap-4 transition-all"
              >
                <MessageCircle size={20} />
                <span>Ir a Soporte y Seguridad</span>
              </button>
            </motion.div>

          </div>
        </div>
      </main>

      {/* Botón flotante de soporte → navega al Centro de Seguridad */}
      <button
        onClick={() => router.push('/centro-seguridad')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
      >
        <MessageCircle size={24} />
      </button>

    </div>
  );
}
