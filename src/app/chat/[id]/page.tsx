import { supabase } from "@/lib/supabase";
import ChatInterface from "@/components/chat/ChatInterface";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

const FALLBACK_EXPERTS = [
  {
    id: "f1",
    nombre_completo: "Elena Rodríguez",
    foto_perfil: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgK5hjCuI3RxK41W5sivfJ4cy_aRTeGuYkRGCYKKI_lvVVln6_bvWJRZ9aDA3Cgp5XWoZzc4NOZlP-r1En7FnpOLkUJfaOPa_l_SpVIwtYpP9FSEcMzZB-Xac3MgJ55QCyrP379jAudQUlkkTfGFcQj1oLPjQ0FoHa2lljHSpYZKaNTZZ2qNmVV1KTZtNmGT3tkhJfOeqouIKu5r1JLs5r0X2pkPgNCSCJ0ZplO9hgxOPajxv8LzrnYcQvn__PtywfZFnQghiRKA"
  },
  {
    id: "f2",
    nombre_completo: "Julián Martínez",
    foto_perfil: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8vieSJHSh8s4srhDRVc07JvNR_6zKQG2yfTNVG6xwWQaKG98OqscybPMITeYo7M7qaqYTcQqig3KcF_ZRiBRNW70bj8dQKlzQbVSJoa6PRzDLMVK32ZPlJ87tX9txfSPpZXG45CU6HAzkkBES1VESCWpOmw75y37nufVPw8cSSSJ9uahncyE58b1e2wMqe6ji-p3fnxClhkk-d_edC_R4zoJ-AxyS6yfR8Iqyg7hfTx3YXPngatGK6H7VUEdTuCxmT2NDc2Zr8w"
  },
  {
    id: "f3",
    nombre_completo: "Sofía López",
    foto_perfil: "https://lh3.googleusercontent.com/aida-public/AB6AXuDq0ejKLQFaVq97cNcPankNdRGVIPMbmgSgVdufsS6wVPhWYLg-Tq3ApMsb7FeJy3T6qDZj21jIcDiA9W6x6Ggxf--TJm6Oof8TSccU7UEgftmLDhZooog8wF57B8fHK9BBEvChk8HFSsyRBUY16iFshpvEmZg_pqgDXnkVdxoDX9SDxVkkAVOQLWmp8SWB_U0p9auM9cA9TFglVEv9xkhkgIKpz5f7KmJwCdUV2Dl3BKnVKOabEcGTwE-oxd0a-88I_9ThwH0wbQ"
  },
  {
    id: "f4",
    nombre_completo: "Carlos Torres",
    foto_perfil: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgxZQxgPl_aiCor61A6P7KfK47nBEH3_EH9EzKbcx84FJi-tLSMIog6akIcD1OWsQ6JEfMOqsbJ8lMLYPbK-sdPPBvEXSj5CHfCkWR2QLby-tMYtu0zCzpxqb2_ru_BQ_6Y-MnTPtT5H9_BnkpkxjQlpH4-IWGCQmXSMW76HthZUqhHeAaDXDCNcWpe6vHmOUrWAhBP4MkdKEag_GMkhqpWbECXx1Ibs1UPYpOdEuak5pv6FvbB4ExyY3kkOfg1OB5lo6FKzE2jg"
  },
  {
    id: "f5",
    nombre_completo: "Marta Valls",
    foto_perfil: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtczwaCBZDrakoJIvPXavRcfa_YWopKVV-7E7HQr1nuY1tk4Idv_KTZUmHIGTzsIPind-7xfjHamETjNysRRKAQ2ThKrJDlj6a5FhixgOXvC1i6jrRwwX-ysP3e7a9-yOoxp5NBSo4JPs_XDtNyLYRMUdnZsBicPKX-pX_Iv_hg37hGYdoAeMGNiLdo1f6Ed-T0_Ydjpy_b6DDORFaWAIhHLSdMQcDWLI9UOcZw-UVdUucDKpWNB6PVOvoF76-4pbY0nZ0NpBlTQ"
  },
  {
    id: "f6",
    nombre_completo: "David García",
    foto_perfil: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-K8l_Wv8n9_G-Y8i-w-t-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v-x-i-v-v" // Fallback placeholder
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
