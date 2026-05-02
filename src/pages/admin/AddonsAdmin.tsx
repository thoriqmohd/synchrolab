import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type Addon = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sort_order: number;
  is_active: boolean;
};

const empty: Omit<Addon, "id"> = {
  name: "",
  description: "",
  price: 0,
  sort_order: 0,
  is_active: true,
};

export default function AddonsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Addon | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: addons = [], isLoading } = useQuery({
    queryKey: ["admin-addons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room_addons")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Addon[];
    },
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("room_addons").delete().eq("id", deleteId);
    if (error) toast.error("Gagal padam", { description: error.message });
    else {
      toast.success("Add-on dipadam");
      qc.invalidateQueries({ queryKey: ["admin-addons"] });
      qc.invalidateQueries({ queryKey: ["room-addons"] });
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Keperluan Khas (Add-ons Bilik)</h1>
          <p className="text-sm text-muted-foreground">
            Senarai keperluan tambahan yang dipaparkan di borang sewa bilik. Harga akan ditambah ke jumlah tempahan.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} variant="accent">
          <Plus className="h-4 w-4" /> Tambah Add-on
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Susunan</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Penerangan</TableHead>
                <TableHead>Harga (RM)</TableHead>
                <TableHead>Aktif</TableHead>
                <TableHead className="text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addons.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="text-muted-foreground">{a.sort_order}</TableCell>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="max-w-md text-sm text-muted-foreground">{a.description || "—"}</TableCell>
                  <TableCell>RM{Number(a.price).toLocaleString()}</TableCell>
                  <TableCell>{a.is_active ? "✅" : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(a)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(a.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {addons.length === 0 && (
                <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">Belum ada add-on.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {(creating || editing) && (
        <AddonForm
          initial={editing ?? { ...empty, id: "" }}
          isNew={creating}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin-addons"] });
            qc.invalidateQueries({ queryKey: ["room-addons"] });
          }}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Padam add-on?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak boleh diundur.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Padam</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AddonForm({ initial, isNew, onClose, onSaved }: { initial: Addon; isNew: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Addon>(initial);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name) {
      toast.error("Sila isi nama add-on");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description || null,
      price: form.price,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };
    const { error } = isNew
      ? await supabase.from("room_addons").insert(payload)
      : await supabase.from("room_addons").update(payload).eq("id", form.id);
    setSaving(false);
    if (error) {
      toast.error("Gagal menyimpan", { description: error.message });
      return;
    }
    toast.success(isNew ? "Add-on dicipta" : "Add-on dikemas kini");
    onSaved();
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isNew ? "Tambah Add-on" : "Edit Add-on"}</DialogTitle>
          <DialogDescription>Add-on akan dipaparkan di borang sewa bilik dengan harga.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <Label>Nama *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="cth: Jamuan minum (per pax)" />
          </div>
          <div>
            <Label>Penerangan</Label>
            <Textarea rows={2} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Harga (RM) *</Label>
              <Input type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Susunan</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Aktif (paparkan di borang)
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button variant="accent" onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isNew ? "Cipta" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
