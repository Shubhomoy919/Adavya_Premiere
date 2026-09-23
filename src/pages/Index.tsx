import { Header } from "@/components/Header";
import { PointsForm } from "@/components/PointsForm";
import { PointsTable } from "@/components/PointsTable";
import { useStudents } from "@/hooks/useStudents";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";

const Index = () => {
  const { session, role, loading: authLoading } = useAuth();
  const { students, loading, addStudent, updateStudent, deleteStudent, getStudentByRollNo } = useStudents();

  useEffect(() => {
    if (!authLoading && !session) {
      window.location.href = "/login";
    }
  }, [session, authLoading]);

  if (authLoading || !session) {
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
    <div className="min-h-screen flex flex-col overflow-x-hidden max-w-full">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-5 sm:py-10 space-y-5 sm:space-y-8 flex-1 w-full max-w-full overflow-x-hidden">

        {/* Only show this if user is MAIN ADMIN */}
        {role === "main" && (
          <div className="flex justify-end">
            <Button
              onClick={() => (window.location.href = "/manage-admins")}
              variant="elegant"
              className="uppercase tracking-[0.15em]"
            >
              <ShieldCheck className="h-4 w-4" />
              Manage Admins
            </Button>
          </div>
        )}

        <PointsForm
          onSubmit={addStudent}
          onCheckStudent={getStudentByRollNo}
        />

        <PointsTable
          students={students}
          loading={loading}
          onUpdate={updateStudent}
          onDelete={deleteStudent}
        />
      </main>

      <footer className="film-strip mt-auto w-full max-w-full py-4 sm:py-6">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <p className="font-display text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] text-gold/70">
            © 2026 Adavya Premiere • Freshers Event
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
