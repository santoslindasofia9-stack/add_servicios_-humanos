'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  HelpCircle, 
  MoreVertical, 
  PlusCircle, 
  Smile, 
  Send, 
  Download, 
  FileText,
  Calendar,
  ShieldCheck,
  Check,
  CheckCheck,
  Home,
  Inbox,
  ShoppingBag,
  User
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  sender_id: string;
  text: string;
  created_at: string;
  is_expert: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

interface ChatInterfaceProps {
  negotiationId: string;
  expertData: any;
  currentUser: any;
}

export default function ChatInterface({ negotiationId, expertData, currentUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [offer, setOffer] = useState({
    amount: 1250.00,
    description: 'Propuesta por el experto basada en soporte post-entrega de 2 semanas.',
    duration: '4 semanas',
    status: 'pending'
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter for phone numbers and emails
  const filterContactInfo = (text: string) => {
    const phoneRegex = /(\+?\d{1,4}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/g;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    
    let filtered = text;
    if (phoneRegex.test(text) || emailRegex.test(text)) {
      filtered = text.replace(phoneRegex, '[NÚMERO BLOQUEADO POR SEGURIDAD]');
      filtered = filtered.replace(emailRegex, '[CORREO BLOQUEADO POR SEGURIDAD]');
    }
    return filtered;
  };

  useEffect(() => {
    // Initial messages (mock or fetch)
    const initialMessages: Message[] = [
      {
        id: '1',
        sender_id: 'expert_id',
        text: 'Hola, he revisado los detalles de tu proyecto. El alcance parece claro, pero me gustaría ajustar la propuesta inicial para incluir el soporte post-entrega de 2 semanas.',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        is_expert: true
      },
      {
        id: '2',
        sender_id: currentUser?.id,
        text: 'Perfecto, el soporte adicional es muy importante para nosotros. ¿Cómo afectaría eso al presupuesto final que habíamos discutido?',
        created_at: new Date(Date.now() - 3000000).toISOString(),
        is_expert: false
      },
      {
        id: '3',
        sender_id: 'expert_id',
        text: 'He actualizado la oferta formal con un incremento del 15% para cubrir esas horas adicionales. Puedes ver los detalles en el desglose adjunto.',
        created_at: new Date(Date.now() - 2400000).toISOString(),
        is_expert: true,
        attachment: {
          name: 'Propuesta_Actualizada.pdf',
          size: '2.4 MB',
          type: 'PDF'
        }
      }
    ];
    setMessages(initialMessages);

    // Supabase Realtime Subscription
    const channel = supabase
      .channel(`chat:${negotiationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'mensajes_chat',
        filter: `id_negociacion=eq.${negotiationId}`
      }, (payload) => {
        const newMessage = payload.new as any;
        setMessages((prev) => [...prev, {
          id: newMessage.id,
          sender_id: newMessage.id_emisor,
          text: newMessage.texto,
          created_at: newMessage.created_at,
          is_expert: newMessage.id_emisor !== currentUser?.id
        }]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [negotiationId, currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const filteredText = filterContactInfo(inputText);
    
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender_id: currentUser?.id,
      text: filteredText,
      created_at: new Date().toISOString(),
      is_expert: false
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // In a real scenario, we would insert into Supabase
    /*
    await supabase.from('mensajes_chat').insert({
      id_negociacion: negotiationId,
      id_emisor: currentUser?.id,
      texto: filteredText
    });
    */
  };

  const handleAcceptProposal = async () => {
    setOffer({ ...offer, status: 'accepted' });
    // Update Supabase
    /*
    await supabase.from('negociaciones')
      .update({ estado_propuesta: 'aceptada' })
      .eq('id', negotiationId);
    */
    alert('¡Propuesta aceptada! Redirigiendo a la pasarela de pago Escrow...');
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8f9ff] overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-sky-50 px-4 md:px-8 py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <Link href="/home-cliente" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#5e6f79]" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={expertData.foto_perfil} 
                alt={expertData.nombre_completo} 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-[#0d1c2e] font-bold text-lg leading-tight">{expertData.nombre_completo}</h1>
              <p className="text-[12px] text-[#5e6f79] font-medium flex items-center gap-1">
                Expert Professional <span className="w-1 h-1 bg-gray-300 rounded-full"></span> Online
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden md:flex items-center gap-2 px-4 py-2 text-[#5e6f79] hover:bg-sky-50 rounded-full transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Ayuda</span>
          </button>
          <button className="p-2 text-[#5e6f79] hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Chat Column (70%) */}
        <div className="flex-1 lg:w-[70%] flex flex-col relative">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scroll-smooth"
          >
            {/* Date Separator */}
            <div className="flex justify-center">
              <span className="bg-[#eff4ff] px-4 py-1 rounded-full text-[10px] font-bold tracking-widest text-[#5e6f79] uppercase">
                Hoy
              </span>
            </div>

            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${msg.is_expert ? '' : 'ml-auto flex-row-reverse'}`}
                >
                  {msg.is_expert && (
                    <img 
                      src={expertData.foto_perfil} 
                      className="w-8 h-8 rounded-full self-end mb-1 shrink-0 shadow-sm"
                    />
                  )}
                  <div className={`relative p-4 shadow-sm ${
                    msg.is_expert 
                      ? 'bg-[#e0f2fe] text-[#0d1c2e] rounded-2xl rounded-bl-none' 
                      : 'bg-white border border-[#fce4ec]/50 text-[#0d1c2e] rounded-2xl rounded-br-none'
                  }`}>
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                    
                    {msg.attachment && (
                      <div className="mt-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl flex items-center gap-3 border border-white/40 hover:bg-white/80 transition-all cursor-pointer group shadow-sm">
                        <div className="w-10 h-10 bg-[#e0f2fe] rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-[#0369a1]" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="text-[13px] font-bold group-hover:text-[#0369a1] transition-colors">{msg.attachment.name}</span>
                          <span className="text-[11px] text-[#5e6f79]">{msg.attachment.size} • {msg.attachment.type}</span>
                        </div>
                        <Download className="w-5 h-5 text-[#5e6f79] group-hover:text-[#0369a1] transition-colors" />
                      </div>
                    )}

                    <div className={`flex items-center gap-1 mt-2 ${msg.is_expert ? '' : 'justify-end'}`}>
                      <span className="text-[10px] opacity-60 font-medium">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!msg.is_expert && (
                        <CheckCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-sky-50 p-4 md:p-6 pb-24 md:pb-8">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <button className="text-[#5e6f79] hover:text-[#0369a1] transition-colors p-2">
                <PlusCircle className="w-6 h-6" />
              </button>
              <div className="flex-1 relative">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="w-full bg-[#f8f9ff] border border-[#e0f2fe] rounded-full px-6 py-3.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#e0f2fe] transition-all"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5e6f79] hover:text-[#0369a1] transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={handleSendMessage}
                className="bg-[#fce4ec] w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-[#880e4f] shadow-lg shadow-pink-100 hover:scale-105 active:scale-95 transition-all shrink-0"
              >
                <Send className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>

          {/* Floating Bottom Nav (Integrated) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[60]">
             <div className="bg-white/90 backdrop-blur-xl border border-sky-100 rounded-full px-8 py-3 shadow-2xl flex items-center justify-between">
                <Link href="/home-cliente" className="flex flex-col items-center gap-1 text-[#5e6f79] hover:text-[#0369a1] transition-colors">
                  <Home className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Home</span>
                </Link>
                <div className="flex flex-col items-center gap-1 text-[#880e4f]">
                  <div className="absolute -top-1 right-1/2 translate-x-8 w-2 h-2 bg-pink-500 rounded-full border-2 border-white"></div>
                  <Inbox className="w-5 h-5 fill-pink-50" />
                  <span className="text-[10px] font-bold">Inbox</span>
                </div>
                <button className="flex flex-col items-center gap-1 text-[#5e6f79] hover:text-[#0369a1] transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Pedidos</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-[#5e6f79] hover:text-[#0369a1] transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Perfil</span>
                </button>
             </div>
          </div>
        </div>

        {/* Offer Panel (30%) - Desktop Only */}
        <aside className="hidden lg:block w-[30%] border-l border-sky-50 p-8 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[32px] p-8 shadow-[0_20px_40px_rgba(224,242,254,0.4)] border border-[#e0f2fe]"
          >
            <div className="flex flex-col mb-8">
              <span className="text-[12px] font-bold tracking-[0.2em] text-[#5e6f79] mb-2 uppercase">Oferta Actual</span>
              <span className="text-4xl font-bold text-[#0d1c2e] tracking-tight">
                ${offer.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[14px] text-[#5e6f79] mt-3 leading-relaxed">
                {offer.description}
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleAcceptProposal}
                className="w-full py-4 rounded-full bg-[#fce4ec] text-[#880e4f] font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition-all text-sm border border-pink-100"
              >
                Aceptar Propuesta
              </button>
              <button className="w-full py-4 rounded-full border-2 border-[#e0f2fe] text-[#0369a1] font-bold hover:bg-sky-50 transition-all text-sm">
                Contraofertar
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-sky-50">
              <h4 className="text-[12px] font-bold tracking-[0.2em] text-[#5e6f79] mb-6 uppercase">Detalles del Proyecto</h4>
              <ul className="space-y-5">
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#eff4ff] rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#38bdf8]" />
                  </div>
                  <span className="text-sm font-medium text-[#0d1c2e]">Duración: {offer.duration}</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#eff4ff] rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />
                  </div>
                  <span className="text-sm font-medium text-[#0d1c2e]">Soporte incluido</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </aside>
      </main>
    </div>
  );
}
