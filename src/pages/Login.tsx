import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAdmin } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { toast } = useToast();
  const [rollno, setRollno] = useState("");
  const [password, setPassword] = useState("");

  // 🟢 AUTO-REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const admin = getAdmin();
    if (admin) {
      window.location.href =
        admin.role === "main" ? "/manage-admins" : "/points";
    }
  }, []);

  const handleLogin = async () => {
    if (!rollno || !password) {
      toast({
        title: "Missing fields",
        description: "Enter both roll number and password.",
        variant: "destructive",
      });
      return;
    }

    const { data } = await supabase
      .from("admins")
      .select("*")
      .eq("rollno", rollno)
      .single();

    if (!data || password !== data.password) {
      toast({
        title: "Invalid credentials",
        description: "Roll number or password incorrect.",
        variant: "destructive",
      });
      return;
    }

    // 🟢 STORE SESSION FOREVER UNTIL LOGOUT
    localStorage.setItem("admin", JSON.stringify(data));

    window.location.href =
      data.role === "main" ? "/manage-admins" : "/points";
  };

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
            placeholder="Roll Number"
            value={rollno}
            onChange={(e) => setRollno(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
