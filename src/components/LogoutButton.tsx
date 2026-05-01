import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function LogoutButton() {
  const { logout } = useAuth();
  
  return (
    <Button
      onClick={logout}
      className="bg-[#3b2f2f] text-white hover:bg-[#2f2424]"
    >
      Logout
    </Button>
  );
}
