import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Clapperboard, Trophy } from "lucide-react";

export default function Login() {
  const { toast } = useToast();
  const { role, session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟢 AUTO-REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    if (!authLoading && session && role) {
      window.location.href = role === "main" ? "/manage-admins" : "/points";
    }
  }, [session, role, authLoading]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Invalid credentials",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Role fetching and redirection are handled by the AuthProvider and the useEffect above.
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-aura">
        <div className="reel-spinner" />
        <p className="font-display text-xs uppercase tracking-[0.3em] text-gold/70">
          Adavya Premiere
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-10 vignette">
      {/* Marquee */}
      <div className="flex flex-col items-center gap-2 text-center animate-fade-in">
        <Clapperboard className="h-8 w-8 text-gold" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-[0.18em] text-foil">
          Adavya Premiere
        </h1>
        <p className="font-body text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Freshers Event Point Tracker
        </p>
        <div className="gold-divider mt-1 w-40" />
      </div>

      <div className="curtain-reveal w-full max-w-[396px] rounded-md p-2">
        <Card className="w-full animate-premiere">
          <CardHeader className="items-center gap-2 pb-3">
            <span className="badge-vip">Staff Entrance</span>
            <CardTitle className="auth-title text-center text-2xl uppercase tracking-[0.15em]">
              Admin Login
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="w-full uppercase tracking-[0.15em]"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="gold-divider" />

            <Button
              variant="outline"
              className="w-full uppercase tracking-[0.12em]"
              onClick={() => (window.location.href = "/leaderboard")}
            >
              <Trophy className="h-4 w-4" />
              View Leaderboard
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="font-display text-[0.65rem] uppercase tracking-[0.25em] text-gold/50">
        © 2026 Adavya Premiere
      </p>
    </div>
  );
}
