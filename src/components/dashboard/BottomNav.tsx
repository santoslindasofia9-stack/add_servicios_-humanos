"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: "home", label: "Inicio", href: "/home-cliente" },
  { icon: "search", label: "Buscar", href: "/resultados" },
  { icon: "shopping_bag", label: "Pedidos", href: "/pedidos" },
  { icon: "chat_bubble", label: "Mensajes", href: "/mensajes" },
  { icon: "person", label: "Perfil", href: "/perfil" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-sky-50 shadow-[0_-10px_40px_rgba(224,242,254,0.4)] h-[76px] px-2 flex justify-around items-center z-[500]">
      {navItems.map((item) => {
        // Simple active check
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

        return (
          <div
            key={item.label}
            onClick={() => window.location.href = item.href}
            className="flex flex-col items-center justify-center min-w-[64px] h-full gap-1 group relative cursor-pointer"
          >
            {/* Icon Pill Container */}
            <div
              className={`px-4 py-1 rounded-full transition-all duration-300 flex items-center justify-center ${
                isActive ? "bg-[#FCE4EC] text-[#D81B60]" : "bg-transparent text-[#5e6f79] group-hover:text-[#0d1c2e]"
              }`}
            >
              <span 
                className="material-symbols-outlined transition-all duration-300" 
                style={{ 
                  fontSize: "24px",
                  fontVariationSettings: isActive ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300"
                }}
              >
                {item.icon}
              </span>
            </div>
            
            {/* Label */}
            <span
              className={`text-[10px] font-bold transition-all duration-300 ${
                isActive ? "text-[#D81B60]" : "text-[#5e6f79] group-hover:text-[#0d1c2e]"
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
