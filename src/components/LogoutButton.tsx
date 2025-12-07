import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

export default function LogoutButton() {
  return (
    <Button
      onClick={logout}
      className="bg-[#3b2f2f] text-white hover:bg-[#2f2424]"
    >
      Logout
    </Button>
  );
}
