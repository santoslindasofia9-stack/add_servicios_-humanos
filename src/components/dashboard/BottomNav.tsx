"use client";

import { Home, MessageSquare, Briefcase, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Inicio", href: "/dashboard/client" },
  { icon: MessageSquare, label: "Mensajes", href: "/dashboard/client/messages" },
  { icon: Briefcase, label: "Mis Contratos", href: "/dashboard/client/contracts" },
  { icon: User, label: "Perfil", href: "/dashboard/client/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-[#0d1c2e]/5 h-20 px-6 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? "text-[#0d1c2e]" : "text-[#5e6f79] opacity-60"
            }`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 bg-[#0d1c2e] rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
