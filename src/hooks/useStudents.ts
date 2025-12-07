import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Student {
  id: string;
  roll_no: string;
  name: string | null;
  points: number;
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
      setStudents(data || []);
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

  const addStudent = async (rollNo: string, name: string, points: number) => {
    try {
      // Check if student exists
      const { data: existing } = await supabase
        .from("students")
        .select("id, points")
        .eq("roll_no", rollNo)
        .maybeSingle();

      if (existing) {
        // Update existing student's points
        const { error } = await supabase
          .from("students")
          .update({ 
            points: existing.points + points,
            name: name || undefined 
          })
          .eq("id", existing.id);

        if (error) throw error;
        toast({
          title: "Points Updated",
          description: `Added ${points} points to ${rollNo}`,
        });
      } else {
        // Create new student
        const { error } = await supabase
          .from("students")
          .insert({ roll_no: rollNo, name: name || null, points });

        if (error) throw error;
        toast({
          title: "Student Added",
          description: `${rollNo} added with ${points} points`,
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

  const updateStudent = async (id: string, rollNo: string, name: string, points: number) => {
    try {
      const { error } = await supabase
        .from("students")
        .update({ roll_no: rollNo, name: name || null, points })
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
      .channel("students-changes")
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
  };
}
