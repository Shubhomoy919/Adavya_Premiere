import { Header } from "@/components/Header";
import { PointsForm } from "@/components/PointsForm";
import { PointsTable } from "@/components/PointsTable";
import { useStudents } from "@/hooks/useStudents";

const Index = () => {
  const { students, loading, addStudent, updateStudent, deleteStudent } = useStudents();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden max-w-full">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8 flex-1 w-full max-w-full overflow-x-hidden">
        <PointsForm onSubmit={addStudent} />
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
