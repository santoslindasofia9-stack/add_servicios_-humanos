'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdvancedNegotiationView from '@/components/chat/AdvancedNegotiationView';
import { supabase } from '@/lib/supabase';

const FALLBACK_EXPERTS = [
  {
    id: "f1",
    nombre_completo: "Elena Rodríguez",
    foto_perfil: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "f2",
    nombre_completo: "Julián Martínez",
    foto_perfil: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "f3",
    nombre_completo: "Sofía López",
    foto_perfil: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400"
  }
];

export default function ContraofertaPage() {
  const params = useParams();
  const id = params.id as string;
  const [expert, setExpert] = useState<any>(null);

  useEffect(() => {
    async function fetchExpert() {
      const { data, error } = await supabase
        .from('perfiles_profesionales')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setExpert(data);
      } else {
        const fallback = FALLBACK_EXPERTS.find(e => e.id === id) || FALLBACK_EXPERTS[0];
        setExpert(fallback);
      }
    }
    
    if (id) fetchExpert();
  }, [id]);

  if (!expert) return (
    <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full"></div>
        <div className="h-4 w-32 bg-gray-100 rounded"></div>
      </div>
    </div>
  );

  return (
    <AdvancedNegotiationView 
      expertData={expert} 
    />
  );
}
