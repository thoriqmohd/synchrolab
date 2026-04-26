import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, Enums } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Row = Tables<"venue_listings">;
type Status = Enums<"request_status">;

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "new", label: "Baru" },
  { value: "in_review", label: "Dalam Semakan" },
  { value: "contacted", label: "Telah Dihubungi" },
  { value: "closed", label: "Selesai" },
];

const VenueListingsAdmin = () => {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Row | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "venue_listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("venue_listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Row[];
    },
  });

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("venue_listings").update({ status }).eq("id", id);
    if (error) return toast.error("Gagal kemas kini", { description: error.message });
    toast.success("Status dikemas kini");
    qc.invalidateQueries({ queryKey: ["admin", "venue_listings"] });
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Senarai Tempat</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Permohonan pemilik tempat untuk menyenaraikan ruang latihan mereka.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarikh</TableHead>
              <TableHead>Tempat</TableHead>
              <TableHead>Pemilik</TableHead>
              <TableHead>Kapasiti</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Memuatkan...
                </TableCell>
              </TableRow>
            )}
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Tiada permohonan.
                </TableCell>
              </TableRow>
            )}
            {data?.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(r.created_at), "dd MMM yyyy")}
                </TableCell>
                <TableCell className="font-medium">{r.venue_name}</TableCell>
                <TableCell>{r.owner_name}</TableCell>
                <TableCell>{r.capacity ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {STATUS_OPTIONS.find((s) => s.value === r.status)?.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.venue_name}</DialogTitle>
                <DialogDescription>
                  Diterima {format(new Date(selected.created_at), "dd MMM yyyy, HH:mm")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <Detail label="Pemilik" value={selected.owner_name} />
                <Detail label="Emel" value={selected.email} />
                <Detail label="Telefon" value={selected.phone} />
                <Detail label="Kapasiti" value={selected.capacity?.toString() ?? "—"} />
                <Detail label="Kadar Cadangan" value={selected.suggested_rate ? `RM ${selected.suggested_rate}` : "—"} />
                <Detail label="Alamat" value={selected.address} />
              </div>
              {selected.facilities && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Kemudahan
                  </p>
                  <p className="mt-1 whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-sm">
                    {selected.facilities}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                <p className="text-sm">Kemas kini status</p>
                <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v as Status)}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm text-foreground">{value}</p>
  </div>
);

export default VenueListingsAdmin;
