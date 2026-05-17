"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Gracefully redirect to the primary expert conversation (Elena Rodríguez - f1)
    router.replace("/chat/f1");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4 text-center p-6">
        {/* Premium Spinner */}
        <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
        <h3 className="font-bold text-base text-[#0d1c2e] mt-2">Cargando Chat Seguro...</h3>
        <p className="text-xs text-[#5e6f79] font-medium max-w-xs">
          Estamos conectándote con tu sala de negociación encriptada. Un momento por favor.
        </p>
      </div>
    </div>
  );
}
