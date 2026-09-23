import { useState, useEffect } from "react";
import { useAdmins } from "@/hooks/useAdmins";
import { useAuth, type Role } from "@/lib/auth";
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
import { Loader2, Trash2, Info, ShieldCheck, Plus, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ManageAdmins() {
  const { role, session, loading: authLoading } = useAuth();
  const { admins, loading, addAdmin, updateRole, deleteAdmin } = useAdmins();
  const { toast } = useToast();

  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // "Grant role" form
  const [newId, setNewId] = useState("");
  const [newRollNo, setNewRollNo] = useState("");
  const [newRole, setNewRole] = useState<Role>("volunteer");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!session) {
        window.location.href = "/login";
      } else if (role !== "main") {
        window.location.href = "/points";
      }
    }
  }, [session, role, authLoading]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newRollNo.trim()) return;

    setIsAdding(true);
    const errorMessage = await addAdmin(newId.trim(), newRollNo.trim().toUpperCase(), newRole);
    setIsAdding(false);

    if (errorMessage) {
      toast({ title: "Error granting role", description: errorMessage, variant: "destructive" });
      return;
    }

    setNewId("");
    setNewRollNo("");
    setNewRole("volunteer");
    toast({ title: `Role granted`, description: `${newRollNo.toUpperCase()} is now a ${newRole}.` });
  };

  const handleRoleChange = async (id: string, nextRole: Role) => {
    const ok = await updateRole(id, nextRole);
    toast(
      ok
        ? { title: "Role updated" }
        : { title: "Error updating role", variant: "destructive" },
    );
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    setIsDeleting(true);

    const ok = await deleteAdmin(selectedAdmin.id);

    setIsDeleting(false);
    setSelectedAdmin(null);

    if (!ok) {
      toast({ title: "Error removing admin role", variant: "destructive" });
    } else {
      toast({ title: "Admin role removed successfully" });
    }
  };

  if (authLoading || role !== "main") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-aura">
        <div className="reel-spinner" />
        <p className="font-display text-xs uppercase tracking-[0.3em] text-gold/70">
          Adavya Premiere
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Logout Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className="font-display text-xs uppercase tracking-[0.25em] text-gold/70">
          Adavya Premiere
        </span>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => (window.location.href = "/points")}
            variant="elegant"
            size="sm"
            className="uppercase tracking-[0.15em]"
          >
            <Plus className="h-4 w-4" />
            Add Points
          </Button>
          <LogoutButton />
        </div>
      </div>

      <div className="card-premiere rounded-md animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 p-4 sm:p-6 border-b border-gold/20">
          <ShieldCheck className="h-5 w-5 shrink-0 text-gold" />
          <h2 className="font-display text-lg sm:text-xl font-semibold uppercase tracking-[0.12em] text-ivory">
            Manage Admins
          </h2>
          <span className="ml-auto font-body text-xs sm:text-sm text-muted-foreground">
            {admins.length} {admins.length === 1 ? "account" : "accounts"}
          </span>
        </div>

        {/* Add Admin Instructions */}
        <div className="p-4 sm:p-6 border-b border-gold/20 bg-onyx/40 flex items-start gap-3">
          <Info className="h-5 w-5 text-gold mt-0.5 shrink-0" />
          <p className="font-body text-sm text-muted-foreground">
            <strong className="text-ivory">Note:</strong> Create the account in the Supabase Auth Dashboard first, then paste its UUID below to grant a role. A <strong className="text-ivory">volunteer</strong> can add points but cannot open this page or remove players.
          </p>
        </div>

        {/* Grant a role to an existing auth user */}
        <form onSubmit={handleAdd} className="p-4 sm:p-6 border-b border-gold/20 space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <UserPlus className="h-5 w-5 shrink-0 text-gold" />
            <h3 className="font-display text-sm sm:text-base font-semibold uppercase tracking-[0.12em] text-ivory">
              Grant Role
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-id" className="font-display text-xs uppercase tracking-[0.15em] text-gold/80">
                Auth User UUID *
              </Label>
              <Input
                id="new-id"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                required
                className="font-mono text-sm"
                placeholder="00000000-0000-0000-0000-000000000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-roll-no" className="font-display text-xs uppercase tracking-[0.15em] text-gold/80">
                Roll Number *
              </Label>
              <Input
                id="new-roll-no"
                value={newRollNo}
                onChange={(e) => setNewRollNo(e.target.value)}
                required
                className="font-body text-base"
                placeholder="2026BCS0001"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-display text-xs uppercase tracking-[0.15em] text-gold/80">
                Role
              </Label>
              <Select value={newRole} onValueChange={(value) => setNewRole(value as Role)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            variant="vintage"
            className="w-full sm:w-auto uppercase tracking-[0.15em]"
            disabled={isAdding || !newId.trim() || !newRollNo.trim()}
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Granting...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Grant Role
              </>
            )}
          </Button>
        </form>

        {/* Loading */}
        {loading && (
          <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
            <div className="reel-spinner" />
            <p className="font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Loading admins...
            </p>
          </div>
        )}

        {/* No admins */}
        {!loading && admins.length === 0 && (
          <div className="p-8 sm:p-12 text-center">
            <p className="font-body text-muted-foreground text-base sm:text-lg">
              No accounts found in the admin_roles table.
            </p>
          </div>
        )}

        {/* Admin List */}
        {!loading && admins.length > 0 && (
          <>
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-gold/10">
              {admins.map((adm) => (
                <div
                  key={adm.id}
                  className="p-4 flex items-center gap-3 hover:bg-carpet/15 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-foreground truncate">
                      {adm.roll_no || adm.id.substring(0, 8) + '...'}
                    </p>
                    {adm.role === "main" ? (
                      <p className="font-display text-xs uppercase tracking-[0.15em] text-gold/70">
                        {adm.role}
                      </p>
                    ) : (
                      <Select
                        value={adm.role}
                        onValueChange={(value) => handleRoleChange(adm.id, value as Role)}
                      >
                        <SelectTrigger className="mt-1 h-9 w-36 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="volunteer">Volunteer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Delete button only for normal admins */}
                  {adm.role !== "main" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedAdmin(adm)}
                      className="h-9 w-9 hover:bg-destructive/15 hover:text-destructive"
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
                  <TableRow className="hover:bg-transparent">
                    <TableHead>
                      Identifier (Roll No / ID)
                    </TableHead>
                    <TableHead className="text-center">
                      Role
                    </TableHead>
                    <TableHead className="w-24 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {admins.map((adm) => (
                    <TableRow key={adm.id}>
                      <TableCell className="font-body font-semibold text-foreground">
                        {adm.roll_no || adm.id}
                      </TableCell>

                      <TableCell className="text-center">
                        {adm.role === "main" ? (
                          <span className="font-display uppercase tracking-[0.12em] text-gold/80">
                            {adm.role}
                          </span>
                        ) : (
                          <Select
                            value={adm.role}
                            onValueChange={(value) => handleRoleChange(adm.id, value as Role)}
                          >
                            <SelectTrigger className="mx-auto h-9 w-40 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="volunteer">Volunteer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>

                      <TableCell>
                        {adm.role === "main" ? (
                          <span className="block text-center font-body text-xs italic text-muted-foreground">
                            Main Admin
                          </span>
                        ) : (
                          <div className="flex justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedAdmin(adm)}
                              className="h-8 w-8 hover:bg-destructive/15 hover:text-destructive"
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display uppercase tracking-[0.12em] text-ivory">
              Remove Admin Role?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              Are you sure you want to remove the admin role for{" "}
              <strong className="text-gold">{selectedAdmin?.roll_no || selectedAdmin?.id}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="font-display">Cancel</AlertDialogCancel>

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
