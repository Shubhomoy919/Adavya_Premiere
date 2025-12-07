import { Trophy } from "lucide-react";

export function Header() {
  return (
    <header className="border-b-2 border-border bg-card/80 backdrop-blur-sm shadow-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-gold" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Adavya Retroverse
            </h1>
            <Trophy className="h-8 w-8 text-gold" />
          </div>
          <p className="font-body text-muted-foreground text-lg italic">
            Freshers Event Point Tracker
          </p>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mt-2" />
        </div>
      </div>
    </header>
  );
}
