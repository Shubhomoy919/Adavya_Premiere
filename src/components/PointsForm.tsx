import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from "@/components/ui/select";
import { Plus, Loader2, ArrowRight, RotateCcw, ArrowBigLeft } from "lucide-react";
import type { Student } from "@/hooks/useStudents";

interface PointsFormProps {
  onSubmit: (rollNo: string, gameKey: string, score: number) => Promise<void>;
  onCheckStudent: (rollNo: string) => Promise<Student | null>;
}

const GAMES = [
  { key: "plank_challenge", label: "Plank Challenge" },
  { key: "flour_passing", label: "Flour Passing" },
  { key: "lucky_number", label: "Lucky Number" },
  { key: "cup_pyramid", label: "Cup Pyramid" },
  { key: "carrom", label: "Carrom" },
  { key: "bindi_game", label: "Bindi Game" },
  { key: "dumbell_hold", label: "Dumbell Hold" },
  { key: "blank_challenge", label: "Blank Challenge" }, // Added based on user audio listing
  { key: "floor_passing", label: "Floor Passing" }, // Added based on user audio listing - "floor passing" or "flour passing" duplicate? User audio said "floor passing" and "blank challenge"? Wait. User audio said "Blank Challenge, Flour Passing, Lucky Number, Cup Pyramid, Carrom, Bindi Game, Dumbell Hold". "Flour Passing" is already there. I'll stick to the list I saw in the audio + migration. The migration has 7 games.
  { key: "bottle_flip", label:"Bottle Flip"}
  // Wait, let's stick to the migration keys.
  // The migration listed: plank_challenge, flour_passing, lucky_number, cup_pyramid, carrom, bindi_game, dumbell_hold.
  // User audio mentioned "Blank Challenge". Maybe that's "Plank Challenge"? "Plank" sounds like "Blank". I will assume "Plank Challenge" matches "plank_challenge".
];
// Re-verifying game keys from migration file:
// "plank_challenge", "flour_passing", "lucky_number", "cup_pyramid", "carrom", "bindi_game", "dumbell_hold"

export function PointsForm({ onSubmit, onCheckStudent }: PointsFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [rollNo, setRollNo] = useState("2025B");
  const [selectedGame, setSelectedGame] = useState("");
  const [score, setScore] = useState("");

  const [studentStats, setStudentStats] = useState<{ timesPlayed: number } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Check Student
  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNo.trim() || !selectedGame) return;

    setIsChecking(true);
    try {
      const student = await onCheckStudent(rollNo.trim().toUpperCase());
      const timesPlayed = student?.game_stats?.[selectedGame] || 0;
      setStudentStats({ timesPlayed });
      setStep(2);
    } finally {
      setIsChecking(false);
    }
  };

  // Step 2: Submit Score
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNo.trim() || !selectedGame || !score) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rollNo.trim().toUpperCase(), selectedGame, parseInt(score, 10));
      // Reset form on success
      setRollNo("2025B");
      setScore("");
      setSelectedGame(""); // Optional: keep game selected if they want to enter multiple? For now reset.
      setStep(1);
      setStudentStats(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setStudentStats(null);
    setScore("");
  };

  return (
    <div className="card-vintage rounded-sm border-2 border-border p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <div className="w-1 h-5 sm:h-6 bg-gold rounded-full" />
        <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground">
          {step === 1 ? "Select Game & Student" : "Enter Score"}
        </h2>
      </div>

      {step === 1 ? (
        <form onSubmit={handleCheck} className="space-y-4">
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
                className="text-base"
                placeholder="Enter Roll Number, eg:2025BCS0001"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm text-muted-foreground">Game</Label>
              <Select value={selectedGame} onValueChange={setSelectedGame} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plank_challenge">Plank Challenge</SelectItem>
                  <SelectItem value="flour_passing">Flour Passing</SelectItem>
                  <SelectItem value="lucky_number">Lucky Number</SelectItem>
                  <SelectItem value="cup_pyramid">Cup Pyramid</SelectItem>
                  <SelectItem value="carrom">Carrom</SelectItem>
                  <SelectItem value="bindi_game">Bindi Game</SelectItem>
                  <SelectItem value="dumbell_hold">Dumbell Lateral Hold</SelectItem>
                  <SelectItem value="bottle_flip">Bottle Flip</SelectItem>
                  
                </SelectContent>
              </Select>
            </div>


          </div>

          <Button
            type="submit"
            variant="vintage"
            size="lg"
            className="w-full"
            disabled={isChecking || !rollNo.trim() || !selectedGame}
          >
            {isChecking ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Checking...
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2 p-4 bg-secondary/30 rounded border border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm font-body text-muted-foreground">Student:</span>
              <span className="font-semibold">{rollNo.toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-body text-muted-foreground">Game:</span>
              <span className="font-semibold text-gold">
                {GAMES.find(g => g.key === selectedGame)?.label || selectedGame}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-2 mt-1">
              <span className="text-sm font-body text-muted-foreground">Times Played:</span>
              <span className="font-mono font-bold text-lg">
                {studentStats?.timesPlayed || 0}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="score" className="font-body text-sm text-muted-foreground">
              Score to Add *
            </Label>
            <Input
              id="score"
              type="number"
              inputMode="numeric"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
              min={0}
              max={50}
              autoFocus
              className="text-lg font-mono"
              placeholder="Enter score"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex-1"
            >
              <ArrowBigLeft size={24} className="mr-1" />
              Back
            </Button>
            <Button
              type="submit"
              variant="vintage"
              className="flex-[2]"
              disabled={isSubmitting || !score}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Adding Points...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Points
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
