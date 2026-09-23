import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/lib/auth";

export function useAdmins() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("admin_roles")
      .select("*");

    if (error) {
      console.error("Error fetching admins:", error);
    }

    setAdmins(data || []);
    setLoading(false);
  };

  // Grants a role to an existing Supabase Auth user, by their UUID.
  // The account itself is created in the Supabase Auth dashboard — the
  // browser cannot create auth users without the service_role key.
  const addAdmin = async (id: string, rollNo: string, role: Role) => {
    const { error } = await supabase
      .from("admin_roles")
      .insert({ id, roll_no: rollNo, role });

    if (error) {
      console.error(error);
      return error.message;
    }
    return null;
  };

  const updateRole = async (id: string, role: Role) => {
    const { error } = await supabase
      .from("admin_roles")
      .update({ role })
      .eq("id", id);

    if (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  const deleteAdmin = async (id: string) => {
    const { error } = await supabase.from("admin_roles").delete().eq("id", id);
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
        { event: "*", schema: "public", table: "admin_roles" },
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
    updateRole,
    deleteAdmin,
  };
}
