import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Shield, ShieldOff, Eye, Pencil, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type AdminUser = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  full_name: string | null;
  phone: string | null;
  roles: string[];
  bookings_count: number;
  bookings_total: number;
};

type BookingRow = {
  id: string;
  ref_no: string;
  type: string;
  total_amount: number;
  payment_status: string;
  booking_status: string;
  created_at: string;
  courses: { title: string } | null;
  rooms: { name: string } | null;
};

const UsersAdmin = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null));
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("admin-list-users");
      if (error) throw error;
      return (data?.users ?? []) as AdminUser[];
    },
  });

  const { data: userBookings } = useQuery({
    queryKey: ["admin", "user-bookings", selected?.id],
    enabled: !!selected,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, ref_no, type, total_amount, payment_status, booking_status, created_at, courses(title), rooms(name)")
        .eq("user_id", selected!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as BookingRow[];
    },
  });

  const setRole = async (user_id: string, action: "promote" | "demote") => {
    const { data, error } = await supabase.functions.invoke("admin-set-role", {
      body: { user_id, action },
    });
    if (error || data?.error) {
      toast.error("Gagal", { description: data?.error ?? error?.message });
      return;
    }
    toast.success(action === "promote" ? "Dijadikan admin" : "Role admin dikeluarkan");
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
    if (selected?.id === user_id) {
      setSelected({
        ...selected,
        roles: action === "promote" ? [...selected.roles, "admin"] : selected.roles.filter((r) => r !== "admin"),
      });
    }
  };

  const filtered = data?.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.full_name?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Pengurusan User</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Semua akaun berdaftar termasuk peserta kursus & admin.
          </p>
        </div>
        <Input
          placeholder="Cari nama / emel / telefon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {(error as Error).message}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Daftar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Emel</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Tempahan</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-32">Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Memuatkan...
                </TableCell>
              </TableRow>
            )}
            {filtered?.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Tiada user ditemui.
                </TableCell>
              </TableRow>
            )}
            {filtered?.map((u) => {
              const isAdmin = u.roles.includes("admin");
              const isSelf = u.id === currentUserId;
              return (
                <TableRow key={u.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(u.created_at), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">{u.full_name ?? "—"}</TableCell>
                  <TableCell className="text-sm">{u.email}</TableCell>
                  <TableCell className="text-sm">{u.phone ?? "—"}</TableCell>
                  <TableCell className="text-sm">
                    {u.bookings_count > 0 ? (
                      <span>
                        {u.bookings_count} • RM {u.bookings_total.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={isAdmin ? "default" : "outline"}>
                      {isAdmin ? "Admin" : "User"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(u)} title="Lihat">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditing(u)} title="Edit profil & kata laluan">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {isAdmin ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isSelf}
                          onClick={() => setRole(u.id, "demote")}
                          title={isSelf ? "Tidak boleh keluarkan role sendiri" : "Buang role admin"}
                        >
                          <ShieldOff className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRole(u.id, "promote")}
                          title="Jadikan admin"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.full_name ?? selected.email}</DialogTitle>
                <DialogDescription>
                  Daftar pada {format(new Date(selected.created_at), "dd MMM yyyy, HH:mm")}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <Detail label="Emel" value={selected.email ?? "—"} />
                <Detail label="Telefon" value={selected.phone ?? "—"} />
                <Detail
                  label="Emel disahkan"
                  value={selected.email_confirmed_at ? format(new Date(selected.email_confirmed_at), "dd MMM yyyy") : "Belum"}
                />
                <Detail
                  label="Log masuk terakhir"
                  value={selected.last_sign_in_at ? format(new Date(selected.last_sign_in_at), "dd MMM yyyy, HH:mm") : "—"}
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Sejarah Tempahan
                </p>
                {userBookings && userBookings.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {userBookings.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 text-sm"
                      >
                        <div>
                          <p className="font-medium">
                            {b.courses?.title ?? b.rooms?.name ?? "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {b.ref_no} • {format(new Date(b.created_at), "dd MMM yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">RM {Number(b.total_amount).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{b.payment_status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">Tiada tempahan.</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {editing && (
        <EditUserDialog
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={() => qc.invalidateQueries({ queryKey: ["admin", "users"] })}
        />
      )}
    </div>
  );
};

function EditUserDialog({ user, onClose, onSaved }: { user: AdminUser; onClose: () => void; onSaved: () => void }) {
  const [fullName, setFullName] = useState(user.full_name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload: Record<string, unknown> = {
      user_id: user.id,
      full_name: fullName,
      phone,
    };
    if (email && email !== user.email) payload.email = email;
    if (password) payload.password = password;
    const { data, error } = await supabase.functions.invoke("admin-update-user", { body: payload });
    setSaving(false);
    if (error || data?.error) {
      toast.error("Gagal", { description: data?.error ?? error?.message });
      return;
    }
    toast.success("Disimpan");
    onSaved();
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>Kemas kini profil, emel atau set kata laluan baru.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label>Nama penuh</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <Label>Telefon</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <Label>Emel</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Kata laluan baru (kosongkan jika tidak mahu tukar)</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 aksara" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button variant="accent" onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm text-foreground">{value}</p>
  </div>
);

export default UsersAdmin;
