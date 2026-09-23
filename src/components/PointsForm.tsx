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
import { Plus, Loader2, ArrowRight, RotateCcw, ArrowBigLeft, Ticket, Clapperboard } from "lucide-react";
import type { Student } from "@/hooks/useStudents";

interface PointsFormProps {
  onSubmit: (rollNo: string, gameKey: string, score: number) => Promise<void>;
  onCheckStudent: (rollNo: string) => Promise<Student | null>;
}

/*
  The eight carnival games. `key` is the JSONB key under students.game_stats
  (play count per game); `label` is what admins see. The rules and scoring of
  each game are recorded here for reference only — the form just captures a
  final score per attempt, so they are not rendered anywhere.

  Keys must match the game_stats default in supabase/migrations.
*/
const GAMES = [
  // Keep the balloon airborne while building and dismantling a cup pyramid.
  // Eliminated if the balloon touches the ground or a cup falls.
  // 1st place = 10 points, 2nd place = 5 points.
  { key: "cup_pyramid", label: "Cup Pyramid Challenge" },

  // Carry 4 straws one at a time, end to end, using only lips and nose, and
  // drop each into the bottle. Fastest to place all 4 wins.
  { key: "straw_bottle", label: "Straw & Bottle Challenge" },

  // Team relay: inflate a balloon inside a cup to lift and carry it, passing
  // the (paired) cups down the line. Fastest team wins.
  { key: "balloon_cup_group", label: "Balloon & Cup - Group Challenge" },

  // Sticky-tip darts at a ringed target; each ring is worth its own points.
  // Highest total score wins.
  { key: "bullseye", label: "Bullseye Challenge" },

  // Tilt the board to guide a marble to the finish without dropping it into a
  // hole or hitting the boundary, within the time limit. Fastest finish wins.
  { key: "marble_maze", label: "Marble Maze Challenge" },

  // Hold a dumbbell straight out for the required time:
  // 2.5 kg for 2 min = 10 points, 5 kg for 1.5 min = 20 points,
  // 7.5 kg for 1 min = 30 points.
  { key: "dumbbell_challenge", label: "Dumbbell Challenge" },

  // Players stand in a circle and sit at random. Any two who sit at the same
  // moment are both eliminated. Last player standing wins.
  { key: "dont_sit_together", label: "Don't Sit Together!" },

  // Two-person team races holding a balloon between their backs; dropping it
  // means restarting from the beginning. First team to finish wins.
  { key: "balloon_race", label: "Balloon Race" },
];

export function PointsForm({ onSubmit, onCheckStudent }: PointsFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [rollNo, setRollNo] = useState("2026B");
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

    // Negative scores are allowed (penalties), so "-" on its own is now a
    // reachable intermediate state — parseInt would yield NaN.
    const parsedScore = parseInt(score, 10);
    if (Number.isNaN(parsedScore)) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rollNo.trim().toUpperCase(), selectedGame, parsedScore);
      // Reset form on success
      setRollNo("2026B");
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
    <div className="card-premiere rounded-md p-4 sm:p-6 animate-premiere">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
        <Clapperboard className="h-5 w-5 shrink-0 text-gold" />
        <h2 className="font-display text-lg sm:text-xl font-semibold uppercase tracking-[0.12em] text-ivory">
          {step === 1 ? "Select Game & Student" : "Enter Score"}
        </h2>
        <span className="badge-vip ml-auto">Take {step} / 2</span>
      </div>

      <div className="gold-divider mb-5 sm:mb-6" />

      {step === 1 ? (
        <form onSubmit={handleCheck} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="rollNo" className="font-display text-xs uppercase tracking-[0.15em] text-gold/80">
                Roll Number *
              </Label>
              <Input
                id="rollNo"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
                className="font-body text-base"
                placeholder="Enter Roll Number, eg:2026BCS0001"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-display text-xs uppercase tracking-[0.15em] text-gold/80">Game</Label>
              <Select value={selectedGame} onValueChange={setSelectedGame} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  {GAMES.map((game) => (
                    <SelectItem key={game.key} value={game.key}>
                      {game.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


          </div>

          <Button
            type="submit"
            variant="vintage"
            size="lg"
            className="w-full uppercase tracking-[0.15em]"
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
          {/* Ticket stub recapping what was selected in step 1 */}
          <div className="flex flex-col gap-3 rounded-sm border border-dashed border-gold/40 bg-onyx/40 p-4">
            <div className="flex items-center gap-2 pb-1">
              <Ticket className="h-4 w-4 text-gold" />
              <span className="font-display text-[0.7rem] uppercase tracking-[0.2em] text-gold/80">
                Admit One
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-body text-muted-foreground">Student:</span>
              <span className="font-display font-semibold text-ivory">{rollNo.toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-body text-muted-foreground">Game:</span>
              <span className="font-display font-semibold text-gold">
                {GAMES.find(g => g.key === selectedGame)?.label || selectedGame}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-dashed border-gold/25 pt-3 mt-1">
              <span className="text-sm font-body text-muted-foreground">Times Played:</span>
              <span className="font-mono font-bold text-lg text-gold-light">
                {studentStats?.timesPlayed || 0}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="score" className="font-display text-xs uppercase tracking-[0.15em] text-gold/80">
              Score to Add *
            </Label>
            <Input
              id="score"
              type="number"
              inputMode="numeric"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
              min={-50}
              max={50}
              autoFocus
              className={`text-lg font-mono tracking-widest ${
                Number(score) < 0 ? "text-destructive" : "text-gold-light"
              }`}
              placeholder="Enter score"
            />
            <p className="font-body text-xs text-muted-foreground">
              Use a negative value for a penalty, e.g. <span className="font-mono text-destructive">-5</span>.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex-1 uppercase tracking-[0.12em]"
            >
              <ArrowBigLeft size={24} className="mr-1" />
              Back
            </Button>
            <Button
              type="submit"
              className="flex-[2] uppercase tracking-[0.12em]"
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
