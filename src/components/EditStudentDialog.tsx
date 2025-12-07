import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import type { Student } from "@/hooks/useStudents";

interface EditStudentDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, rollNo: string, name: string, points: number) => Promise<void>;
}

export function EditStudentDialog({
  student,
  open,
  onOpenChange,
  onSave,
}: EditStudentDialogProps) {
  const [rollNo, setRollNo] = useState(student?.roll_no || "");
  const [name, setName] = useState(student?.name || "");
  const [points, setPoints] = useState(student?.points?.toString() || "0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when student changes
  if (student && rollNo !== student.roll_no) {
    setRollNo(student.roll_no);
    setName(student.name || "");
    setPoints(student.points.toString());
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !rollNo.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(student.id, rollNo.trim().toUpperCase(), name.trim(), parseInt(points, 10));
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-2 border-border shadow-elegant mx-4 sm:mx-auto max-w-[calc(100vw-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg sm:text-xl">Edit Student</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="edit-rollNo" className="font-body text-xs sm:text-sm text-muted-foreground">
              Roll Number
            </Label>
            <Input
              id="edit-rollNo"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              required
              className="uppercase text-base"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="edit-name" className="font-body text-xs sm:text-sm text-muted-foreground">
              Name (Optional)
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="edit-points" className="font-body text-xs sm:text-sm text-muted-foreground">
              Total Points
            </Label>
            <Input
              id="edit-points"
              type="number"
              inputMode="numeric"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
              className="text-base"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="vintage"
              disabled={isSubmitting || !rollNo.trim()}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
