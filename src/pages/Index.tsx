import { Header } from "@/components/Header";
import { PointsForm } from "@/components/PointsForm";
import { PointsTable } from "@/components/PointsTable";
import { useStudents } from "@/hooks/useStudents";

const Index = () => {
  const { students, loading, addStudent, updateStudent, deleteStudent } = useStudents();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <PointsForm onSubmit={addStudent} />
        <PointsTable
          students={students}
          loading={loading}
          onUpdate={updateStudent}
          onDelete={deleteStudent}
        />
      </main>

      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-body text-sm text-muted-foreground">
            © 2024 Adavya Retroverse • Freshers Event
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
