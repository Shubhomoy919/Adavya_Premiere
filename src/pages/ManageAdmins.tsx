import { useState } from "react";
import { useAdmins } from "@/hooks/useAdmins";
import { requireRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LogoutButton from "@/components/LogoutButton";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ManageAdmins() {
  requireRole("main"); // Only main admin allowed

  const { admins, loading, addAdmin, deleteAdmin } = useAdmins();
  const { toast } = useToast();

  const [rollno, setRollno] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddAdmin = async () => {
    if (!rollno.trim()) {
      toast({
        title: "Missing roll number",
        description: "Enter roll number to add admin.",
        variant: "destructive",
      });
      return;
    }

    const ok = await addAdmin(rollno);
    if (!ok) {
      toast({
        title: "Error",
        description: "Roll number already exists or failed to add.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: `${rollno} added as admin.`,
    });

    setRollno("");
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    setIsDeleting(true);

    const ok = await deleteAdmin(selectedAdmin.id);

    setIsDeleting(false);
    setSelectedAdmin(null);

    if (!ok) {
      toast({ title: "Error removing admin", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f3e4c6] p-4 sm:p-6">

      {/* Logout Button */}
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>

      <div className="card-vintage rounded-sm border-2 border-border animate-slide-up overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-2 p-4 sm:p-6 border-b border-border">
          <div className="w-1 h-5 sm:h-6 bg-burgundy rounded-full" />
          <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground">
            Manage Admins
          </h2>
          <span className="ml-auto font-body text-xs sm:text-sm text-muted-foreground">
            {admins.length} {admins.length === 1 ? "admin" : "admins"}
          </span>
        </div>

        {/* Add Admin */}
        <div className="p-4 sm:p-6 border-b border-border flex gap-2">
          <Input
            placeholder="Enter Roll Number"
            value={rollno}
            onChange={(e) => setRollno(e.target.value)}
            className="bg-[#fffaf3] border-[#d1c0a3]"
          />
          <Button
            className="bg-[#3b2f2f] text-white hover:bg-[#2f2424]"
            onClick={handleAddAdmin}
          >
            Add
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="p-8 sm:p-12 flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-gold mb-4" />
            <p className="font-body text-muted-foreground">Loading admins...</p>
          </div>
        )}

        {/* No admins */}
        {!loading && admins.length === 0 && (
          <div className="p-8 sm:p-12 text-center">
            <p className="font-body text-muted-foreground text-base sm:text-lg">
              No admins yet. Add one to get started!
            </p>
          </div>
        )}

        {/* Admin List */}
        {!loading && admins.length > 0 && (
          <>
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-border">
              {admins.map((adm) => (
                <div
                  key={adm.id}
                  className="p-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-foreground truncate">
                      {adm.rollno}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {adm.role}
                    </p>
                  </div>

                  {/* Delete button only for normal admins */}
                  {adm.role !== "main" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedAdmin(adm)}
                      className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                      Roll No
                    </TableHead>
                    <TableHead className="font-display text-xs uppercase tracking-wider text-muted-foreground text-center">
                      Role
                    </TableHead>
                    <TableHead className="w-24 text-center font-display text-xs uppercase tracking-wider text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {admins.map((adm) => (
                    <TableRow
                      key={adm.id}
                      className="border-border hover:bg-secondary/50 transition-colors"
                    >
                      <TableCell className="font-body font-semibold text-foreground">
                        {adm.rollno}
                      </TableCell>

                      <TableCell className="text-center capitalize">
                        {adm.role}
                      </TableCell>

                      <TableCell>
                        {adm.role === "main" ? (
                          <span className="text-xs italic text-muted-foreground">
                            Main Admin
                          </span>
                        ) : (
                          <div className="flex justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedAdmin(adm)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!selectedAdmin}
        onOpenChange={(open) => !open && setSelectedAdmin(null)}
      >
        <AlertDialogContent className="bg-card border-2 border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Remove Admin?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              Are you sure you want to remove{" "}
              <strong>{selectedAdmin?.rollno}</strong> as an admin?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
