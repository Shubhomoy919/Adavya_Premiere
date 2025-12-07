import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Medal, Trophy, Award, Loader2 } from "lucide-react";
import type { Student } from "@/hooks/useStudents";
import { EditStudentDialog } from "./EditStudentDialog";

interface PointsTableProps {
  students: Student[];
  loading: boolean;
  onUpdate: (id: string, rollNo: string, name: string, points: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function getRankIcon(index: number) {
  if (index === 0) return <Trophy className="h-5 w-5 text-gold" />;
  if (index === 1) return <Medal className="h-5 w-5 text-muted-foreground" />;
  if (index === 2) return <Award className="h-5 w-5 text-amber-700" />;
  return <span className="text-muted-foreground font-body">{index + 1}</span>;
}

export function PointsTable({ students, loading, onUpdate, onDelete }: PointsTableProps) {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await onDelete(deletingStudent.id);
      setDeletingStudent(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="card-vintage rounded-sm border-2 border-border p-12 animate-fade-in">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <p className="font-body text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card-vintage rounded-sm border-2 border-border overflow-hidden animate-slide-up">
        <div className="flex items-center gap-2 p-6 border-b border-border">
          <div className="w-1 h-6 bg-burgundy rounded-full" />
          <h2 className="font-display text-xl font-semibold text-foreground">
            Leaderboard
          </h2>
          <span className="ml-auto font-body text-sm text-muted-foreground">
            {students.length} {students.length === 1 ? "student" : "students"}
          </span>
        </div>

        {students.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-body text-muted-foreground text-lg">
              No students yet. Add some points to get started!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-16 font-display text-xs uppercase tracking-wider text-muted-foreground">
                    Rank
                  </TableHead>
                  <TableHead className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                    Roll No
                  </TableHead>
                  <TableHead className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="text-right font-display text-xs uppercase tracking-wider text-muted-foreground">
                    Points
                  </TableHead>
                  <TableHead className="w-24 text-center font-display text-xs uppercase tracking-wider text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow
                    key={student.id}
                    className="border-border hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell className="text-center">{getRankIcon(index)}</TableCell>
                    <TableCell className="font-body font-semibold text-foreground">
                      {student.roll_no}
                    </TableCell>
                    <TableCell className="font-body text-muted-foreground">
                      {student.name || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-display font-bold text-lg text-gold">
                        {student.points}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingStudent(student)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingStudent(student)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <EditStudentDialog
        student={editingStudent}
        open={!!editingStudent}
        onOpenChange={(open) => !open && setEditingStudent(null)}
        onSave={onUpdate}
      />

      <AlertDialog open={!!deletingStudent} onOpenChange={(open) => !open && setDeletingStudent(null)}>
        <AlertDialogContent className="bg-card border-2 border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete Student?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              Are you sure you want to remove{" "}
              <strong>{deletingStudent?.roll_no}</strong> from the leaderboard?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
