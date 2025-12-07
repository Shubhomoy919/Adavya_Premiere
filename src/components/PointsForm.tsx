import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";

interface PointsFormProps {
  onSubmit: (rollNo: string, points: number) => Promise<void>;
}

export function PointsForm({ onSubmit }: PointsFormProps) {
  const [rollNo, setRollNo] = useState("");
  const [points, setPoints] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNo.trim() || !points) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rollNo.trim().toUpperCase(), parseInt(points, 10));
      setRollNo("");
      setPoints("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-vintage rounded-sm border-2 border-border p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <div className="w-1 h-5 sm:h-6 bg-gold rounded-full" />
        <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground">Add Points</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rollNo" className="font-body text-sm text-muted-foreground">
              Roll Number *
            </Label>
            <Input
              id="rollNo"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              required
              className="uppercase text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="points" className="font-body text-sm text-muted-foreground">
              Points *
            </Label>
            <Input
              id="points"
              type="number"
              inputMode="numeric"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
              min={0}
              max={10}
              className="text-base"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="vintage"
          size="lg"
          className="w-full"
          disabled={isSubmitting || !rollNo.trim() || !points}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus />
              Add Points
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
