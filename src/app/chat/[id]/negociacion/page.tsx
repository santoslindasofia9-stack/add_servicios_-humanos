'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NegotiationView from '@/components/chat/NegotiationView';
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
  },
  {
    id: "f4",
    nombre_completo: "Carlos Torres",
    foto_perfil: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "f5",
    nombre_completo: "Marta Valls",
    foto_perfil: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "f6",
    nombre_completo: "David García",
    foto_perfil: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
  }
];

export default function NegotiationPage() {
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

  if (!expert) return null;

  return (
    <NegotiationView 
      expertData={expert} 
      negotiationId={`neg_${id}`}
    />
  );
}
