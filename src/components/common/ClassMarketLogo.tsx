"use client";

import Image from "next/image";
import Link from "next/link";

interface ClassMarketLogoProps {
  className?: string;
  showSlogan?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function ClassMarketLogo({
  className = "",
  showSlogan = true,
  size = "md",
  href = "/home-cliente",
}: ClassMarketLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10 md:w-11 md:h-11",
    lg: "w-16 h-16 md:w-20 md:h-20",
  };

  const titleSizes = {
    sm: "text-base font-bold",
    md: "text-lg md:text-xl font-extrabold",
    lg: "text-2xl md:text-3xl font-extrabold",
  };

  const sloganSizes = {
    sm: "text-[9px]",
    md: "text-[10px] md:text-[11px]",
    lg: "text-xs md:text-sm",
  };

  const content = (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Official ClassMarket Graphic Shield / Icon */}
      <div className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden bg-[#0b2545] p-0.5 border-2 border-[#c4a47c]/30 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center shrink-0`}>
        <Image
          src="/classmarket-logo.png"
          alt="ClassMarket Logo"
          width={80}
          height={80}
          className="w-full h-full object-cover rounded-xl"
          priority
        />
      </div>

      <div className="flex flex-col text-left leading-tight">
        <span className={`tracking-tight text-[#0A192F] ${titleSizes[size]}`}>
          Class<span className="text-[#C5A880]">Market</span>
        </span>
        {showSlogan && (
          <span className={`text-[#C5A880] font-semibold italic tracking-wide ${sloganSizes[size]}`}>
            Educación e Intercambio Real
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="inline-block">{content}</Link>;
  }

  return content;
}
