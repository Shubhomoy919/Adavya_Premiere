import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, type Role } from "@/lib/auth";

interface ProtectedRouteProps {
  /** Roles permitted to see this route. */
  allow: Role[];
  children: ReactNode;
}

/*
  Route guard. The pages still run their own redirects, so this is a second
  layer rather than a replacement: it stops a volunteer who types
  /manage-admins directly from ever mounting the page.

  Real enforcement is in the RLS policies — a volunteer who bypasses this
  still cannot read admin_roles or delete a player.
*/
export function ProtectedRoute({ allow, children }: ProtectedRouteProps) {
  const { session, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-aura">
        <div className="reel-spinner" />
        <p className="font-display text-xs uppercase tracking-[0.3em] text-gold/70">
          Adavya Premiere
        </p>
      </div>
    );
  }

  // Not signed in, or signed in with no row in admin_roles.
  if (!session || !role) {
    return <Navigate to="/login" replace />;
  }

  // Signed in, but not for this page — send them where they can work.
  if (!allow.includes(role)) {
    return <Navigate to="/points" replace />;
  }

  return <>{children}</>;
}
