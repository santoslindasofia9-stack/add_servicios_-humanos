import { supabase } from "@/lib/supabase";
import ChatInterface from "@/components/chat/ChatInterface";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

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
  },
  {
    id: "f7",
    nombre_completo: "Valeria Gómez",
    foto_perfil: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "f8",
    nombre_completo: "Andrés Silva",
    foto_perfil: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "f9",
    nombre_completo: "Lucía Ortiz",
    foto_perfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "f10",
    nombre_completo: "Roberto Sánchez",
    foto_perfil: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "f11",
    nombre_completo: "Carolina Ruiz",
    foto_perfil: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "f12",
    nombre_completo: "Diego Castro",
    foto_perfil: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
  }
];

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const expertId = resolvedParams.id;

  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Fetch expert data
  const { data: expertData } = await supabase
    .from("perfiles_profesionales")
    .select("*")
    .eq("id", expertId)
    .single();

  // Find fallback if not in DB
  const fallbackExpert = FALLBACK_EXPERTS.find(e => e.id === expertId) || FALLBACK_EXPERTS[0];
  const expert = expertData || fallbackExpert;

  if (!expert) {
    notFound();
  }

  return (
    <ChatInterface 
      negotiationId={`neg_${expertId}`} // In a real app, this would be a real negotiation UUID
      expertData={expert}
      currentUser={user || { id: 'temp_user_id', email: 'guest@example.com' }}
    />
  );
}
