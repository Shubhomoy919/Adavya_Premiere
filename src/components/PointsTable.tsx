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
import { Pencil, Trash2, Loader2, Film } from "lucide-react";
import type { Student } from "@/hooks/useStudents";
import { useAuth } from "@/lib/auth";
import { EditStudentDialog } from "./EditStudentDialog";

interface PointsTableProps {
  students: Student[];
  loading: boolean;
  onUpdate: (id: string, rollNo: string, points: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

/* Gold / silver / bronze billing for the top three names on the poster */
const rankStyles = [
  "border-gold/70 bg-gold/15 text-gold-light",
  "border-silver/50 bg-silver/10 text-silver",
  "border-carpet-bright/60 bg-carpet/20 text-carpet-bright",
];

function rankClass(index: number) {
  return rankStyles[index] ?? "border-gold/15 bg-onyx/40 text-muted-foreground";
}

/* A negative total means penalties outweigh points earned - show it in the
   destructive red so it reads as a deduction, not a data-entry slip. */
function pointsClass(points: number) {
  return points < 0 ? "text-destructive" : "text-gold";
}

export function PointsTable({ students, loading, onUpdate, onDelete }: PointsTableProps) {
  // Removing a player is admin-only, matching the students_delete_admin RLS
  // policy — volunteers never see a button the database would refuse.
  const { role } = useAuth();
  const canDelete = role === "main" || role === "admin";

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
      <div className="card-premiere rounded-md p-8 sm:p-12 animate-fade-in">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="reel-spinner" />
          <p className="font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Loading students...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card-premiere rounded-md overflow-hidden animate-slide-up">
        <div className="flex items-center gap-2 sm:gap-3 p-4 sm:p-6 border-b border-gold/20">
          <Film className="h-5 w-5 shrink-0 text-gold" />
          <h2 className="font-display text-lg sm:text-xl font-semibold uppercase tracking-[0.12em] text-ivory">
            Leaderboard
          </h2>
          <span className="ml-auto font-body text-xs sm:text-sm text-muted-foreground">
            {students.length} {students.length === 1 ? "student" : "students"}
          </span>
        </div>

        {students.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <p className="font-body text-muted-foreground text-base sm:text-lg">
              No students yet. Add some points to get started!
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-gold/10">
              {students.map((student, index) => (
                <div
                  key={student.id}
                  className="p-4 flex items-center gap-3 hover:bg-carpet/15 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border font-display text-xs font-bold ${rankClass(index)}`}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-foreground truncate">
                      {student.roll_no}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className={`font-display font-bold text-xl ${pointsClass(student.points)}`}>
                      {student.points}
                    </span>
                  </div>
                  {canDelete && (
                    <div className="flex-shrink-0 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingStudent(student)}
                        className="h-9 w-9"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingStudent(student)}
                        className="h-9 w-9 hover:bg-destructive/15 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-16 text-center">
                      Rank
                    </TableHead>
                    <TableHead className="text-center">
                      Roll No
                    </TableHead>
                    <TableHead className="text-center">
                      Points
                    </TableHead>
                    {canDelete && (
                      <TableHead className="w-24 text-center">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border font-display text-xs font-bold ${rankClass(index)}`}
                        >
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-body font-semibold text-foreground">
                        {student.roll_no}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-display font-bold text-lg ${pointsClass(student.points)}`}>
                          {student.points}
                        </span>
                      </TableCell>
                      {canDelete && (
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            {/* <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingStudent(student)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              {<Pencil className="h-4 w-4" />}
                            </Button> */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingStudent(student)}
                              className="h-8 w-8 hover:bg-destructive/15 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      {/* <EditStudentDialog
        student={editingStudent}
        open={!!editingStudent}
        onOpenChange={(open) => !open && setEditingStudent(null)}
        onSave={onUpdate}
      /> */}

      <AlertDialog open={!!deletingStudent} onOpenChange={(open) => !open && setDeletingStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display uppercase tracking-[0.12em] text-ivory">
              Delete Student?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              Are you sure you want to remove{" "}
              <strong className="text-gold">{deletingStudent?.roll_no}</strong> from the leaderboard?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-display">Cancel</AlertDialogCancel>
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
