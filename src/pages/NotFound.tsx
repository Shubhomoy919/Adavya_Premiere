import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Clapperboard } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 vignette">
      <div className="card-premiere animate-premiere max-w-md rounded-md px-8 py-12 text-center">
        <Clapperboard className="mx-auto mb-4 h-10 w-10 text-gold" />

        <h1 className="mb-2 font-display text-6xl font-bold tracking-[0.1em] text-foil">404</h1>

        <div className="gold-divider mx-auto my-5 w-32" />

        <p className="mb-6 font-body text-lg text-muted-foreground">Oops! Page not found</p>

        <a
          href="/"
          className="font-display text-xs uppercase tracking-[0.2em] text-gold underline-offset-8 transition-colors hover:text-gold-light hover:underline"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
