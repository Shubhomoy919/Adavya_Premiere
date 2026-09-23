import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Crown, Clapperboard } from "lucide-react";

interface Student {
  id: string;
  roll_no: string;
  points: number;
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

/* Negative totals render in destructive red - see PointsTable */
function pointsClass(points: number) {
  return points < 0 ? "text-destructive" : "text-gold";
}

export default function LeaderboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from("students")
        .select("id, roll_no, points")
        .order("points", { ascending: false });

      setStudents(data || []);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Marquee header */}
      <header className="relative border-b border-gold/25 bg-velvet/85 backdrop-blur-md shadow-premiere spotlight">
        <div className="container mx-auto flex flex-col items-center gap-2 px-4 py-8 sm:py-12 text-center">
          <span className="badge-vip">Live Leaderboard</span>

          <div className="flex items-center gap-3 sm:gap-4">
            <Clapperboard className="h-6 w-6 sm:h-9 sm:w-9 text-gold" />
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-foil">
              Adavya Premiere
            </h1>
            <Clapperboard className="h-6 w-6 sm:h-9 sm:w-9 text-gold" />
          </div>

          <p className="font-body text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Freshers Event Point Tracker
          </p>

          <div className="gold-divider mt-2 w-40 sm:w-64" />
        </div>

        <div className="red-carpet h-2 sm:h-3 w-full" />
      </header>

      {/* Now-showing ticker */}
      <div className="ticker">
        <div className="ticker__track">
          <span>Now Showing</span>
          <span>Adavya Premiere 2026</span>
          <span>Live Scores</span>
          <span>IIIT Kottayam</span>
          <span>Now Showing</span>
          <span>Adavya Premiere 2026</span>
          <span>Live Scores</span>
          <span>IIIT Kottayam</span>
        </div>
      </div>

      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto card-premiere rounded-md overflow-hidden animate-slide-up">
          <div className="flex items-center gap-2 sm:gap-3 p-4 sm:p-6 border-b border-gold/20">
            <Crown className="h-5 w-5 shrink-0 text-gold" />
            <h2 className="font-display text-lg sm:text-xl font-semibold uppercase tracking-[0.12em] text-ivory">
              Leaderboard
            </h2>
            <span className="ml-auto font-body text-xs sm:text-sm text-muted-foreground">
              {students.length} students
            </span>
          </div>

          {loading ? (
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div className="reel-spinner" />
              <p className="font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Loading leaderboard...
              </p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <p className="font-body text-muted-foreground">
                No students yet.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-20 text-center">Rank</TableHead>
                  <TableHead className="text-center">Roll No</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s, i) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border font-display text-xs font-bold ${rankClass(i)}`}
                      >
                        {i + 1}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-body font-semibold text-foreground">
                      {s.roll_no}
                    </TableCell>
                    <TableCell className={`text-center font-display font-bold text-lg ${pointsClass(s.points)}`}>
                      {s.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <footer className="film-strip w-full py-4 sm:py-6">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <p className="font-display text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] text-gold/70">
            © 2026 Adavya Premiere • Freshers Event
          </p>
        </div>
      </footer>
    </div>
  );
}
