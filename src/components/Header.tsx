import { Clapperboard } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export function Header() {
  return (
    <header className="relative top-0 z-50 border-b border-gold/25 bg-velvet/85 backdrop-blur-md shadow-premiere spotlight">
      <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-8">

        {/* Logout button - top right */}
        <div className="absolute right-3 top-3 sm:right-6 sm:top-6">
          <LogoutButton />
        </div>

        <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
          <span className="badge-vip mb-1 sm:mb-2">Now Showing</span>

          <div className="flex items-center gap-2 sm:gap-4">
            <Clapperboard className="h-5 w-5 sm:h-8 sm:w-8 text-gold" />
            <h1 className="font-display text-xl sm:text-3xl md:text-5xl font-bold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-foil">
              Adavya Premiere
            </h1>
            <Clapperboard className="h-5 w-5 sm:h-8 sm:w-8 text-gold" />
          </div>

          <p className="font-body text-xs sm:text-base uppercase tracking-[0.3em] text-muted-foreground">
            Freshers Event Point Tracker
          </p>

          <div className="gold-divider mt-2 w-32 sm:w-56" />
        </div>
      </div>

      {/* Red carpet rolled out beneath the marquee */}
      <div className="red-carpet h-2 sm:h-3 w-full" />
    </header>
  );
}
