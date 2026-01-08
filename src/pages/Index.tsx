import { Header } from "@/components/Header";
import { PointsForm } from "@/components/PointsForm";
import { PointsTable } from "@/components/PointsTable";
import { useStudents } from "@/hooks/useStudents";
import { requireAuth, getAdmin } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Protect this page (both admin + main admin allowed)
  requireAuth();

  const admin = getAdmin(); // get logged-in admin
  const { students, loading, addStudent, updateStudent, deleteStudent, getStudentByRollNo } = useStudents();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden max-w-full">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8 flex-1 w-full max-w-full overflow-x-hidden">

        {/* Only show this if user is MAIN ADMIN */}
        {admin?.role === "main" && (
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => (window.location.href = "/manage-admins")}
              className="bg-[#3b2f2f] text-white hover:bg-[#2f2424]"
            >
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

      <footer className="border-t border-border py-4 sm:py-6 mt-auto w-full max-w-full">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <p className="font-body text-xs sm:text-sm text-muted-foreground">
            © 2025 Adavya Retroverse • Freshers Event
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
