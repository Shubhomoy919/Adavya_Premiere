import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdmins() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("admins")
      .select("*");

    if (error) {
      console.error("Error fetching admins:", error);
    }

    setAdmins(data || []);
    setLoading(false);
  };

  const addAdmin = async (rollno: string) => {
    const { error } = await supabase.from("admins").insert({
      rollno,
      password: "retroverse123",
      role: "admin",
    });

    if (error) {
      console.error(error);
      return false;
    }

    return true;
  };

  const deleteAdmin = async (id: string) => {
    const { error } = await supabase.from("admins").delete().eq("id", id);
    if (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  // Realtime listener for admin changes
  useEffect(() => {
    fetchAdmins();

    const channel = supabase
      .channel("admins-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "admins" },
        () => fetchAdmins()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    admins,
    loading,
    addAdmin,
    deleteAdmin,
  };
}
