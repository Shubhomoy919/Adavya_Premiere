import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
      <div className="h-screen flex items-center justify-center bg-[#f3e4c6]">
        <Loader2 className="h-8 w-8 animate-spin text-[#3b2f2f]" />
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#f3e4c6]">
      <Card className="w-[350px] bg-[#fff7ea] border border-[#d1c0a3] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
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
          <Button className="w-full bg-[#3b2f2f] text-white hover:bg-[#2f2424]" onClick={handleLogin} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => (window.location.href = "/leaderboard")}
        >
          View Leaderboard
        </Button>
      </Card>
    </div>
  );
}
