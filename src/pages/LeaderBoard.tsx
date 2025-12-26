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
import { Loader2 } from "lucide-react";

interface Student {
  id: string;
  roll_no: string;
  points: number;
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
    <div className="min-h-screen bg-[#f3e4c6] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto card-vintage border-2 border-border rounded-sm overflow-hidden">
        <div className="flex items-center gap-2 p-4 sm:p-6 border-b border-border">
          <div className="w-1 h-5 sm:h-6 bg-burgundy rounded-full" />
          <h1 className="font-display text-lg sm:text-xl font-semibold">
            Leaderboard
          </h1>
          <span className="ml-auto text-xs sm:text-sm text-muted-foreground">
            {students.length} students
          </span>
        </div>

        {loading ? (
          <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
            <p className="font-body text-muted-foreground">
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
              <TableRow className="border-border">
                <TableHead className="w-16 text-center">Rank</TableHead>
                <TableHead className="text-center">Roll No</TableHead>
                <TableHead className="text-center">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s, i) => (
                <TableRow key={s.id} className="border-border">
                  <TableCell className="text-center text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-center font-body font-semibold">
                    {s.roll_no}
                  </TableCell>
                  <TableCell className="text-center font-display font-bold text-lg text-gold">
                    {s.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
