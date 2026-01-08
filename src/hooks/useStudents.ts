import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Student {
  id: string;
  roll_no: string;
  points: number;
  game_stats: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("points", { ascending: false });

      if (error) throw error;

      // Parse game_stats from JSON if necessary, though Supabase client usually handles it
      const parsedData = (data || []).map(student => ({
        ...student,
        game_stats: (student.game_stats as Record<string, number>) || {}
      }));

      setStudents(parsedData);
    } catch (error: any) {
      toast({
        title: "Error fetching students",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStudentByRollNo = async (rollNo: string) => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("roll_no", rollNo)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return {
          ...data,
          game_stats: (data.game_stats as Record<string, number>) || {}
        } as Student;
      }
      return null;
    } catch (error: any) {
      console.error("Error fetching student:", error);
      return null; // Return null on error to handle gracefully in UI
    }
  };

  const addStudent = async (rollNo: string, gameKey: string, score: number) => {
    try {
      const existing = await getStudentByRollNo(rollNo);

      if (existing) {
        const currentStats = existing.game_stats || {};
        const newGameCount = (currentStats[gameKey] || 0) + 1;

        const updatedStats = {
          ...currentStats,
          [gameKey]: newGameCount
        };

        const { error } = await supabase
          .from("students")
          .update({
            points: existing.points + score,
            game_stats: updatedStats
          })
          .eq("id", existing.id);

        if (error) throw error;

        toast({
          title: "Score Updated",
          description: `Added ${score} points to ${rollNo}. Play count: ${newGameCount}`,
        });
      } else {
        const initialStats = {
          [gameKey]: 1
        };

        const { error } = await supabase
          .from("students")
          .insert({
            roll_no: rollNo,
            points: score,
            game_stats: initialStats
          });

        if (error) throw error;

        toast({
          title: "Student Added",
          description: `${rollNo} added with score ${score}. Play count: 1`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStudent = async (id: string, rollNo: string, points: number) => {
    try {
      const { error } = await supabase
        .from("students")
        .update({ roll_no: rollNo, points })
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Student Updated",
        description: `Successfully updated ${rollNo}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating student",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Student Deleted",
        description: "Successfully removed from the list",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting student",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchStudents();

    // Set up realtime subscription
    const channel = supabase
      .channel("students-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "students",
        },
        () => {
          fetchStudents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents,
    getStudentByRollNo,
  };
}
