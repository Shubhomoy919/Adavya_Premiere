import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button
      onClick={logout}
      variant="elegant"
      size="sm"
      className="uppercase tracking-[0.15em]"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
