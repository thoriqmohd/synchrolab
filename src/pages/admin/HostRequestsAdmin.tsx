import { useEffect, useState } from "react";
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

type Row = Tables<"host_course_requests">;
type Status = Enums<"request_status">;

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "new", label: "Baru" },
  { value: "in_review", label: "Dalam Semakan" },
  { value: "contacted", label: "Telah Dihubungi" },
  { value: "closed", label: "Selesai" },
];

const statusVariant: Record<Status, "default" | "secondary" | "outline"> = {
  new: "default",
  in_review: "secondary",
  contacted: "secondary",
  closed: "outline",
};

const HostRequestsAdmin = () => {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Row | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "host_course_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("host_course_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Row[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("admin-host-requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "host_course_requests" },
        () => qc.invalidateQueries({ queryKey: ["admin", "host_course_requests"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase
      .from("host_course_requests")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Gagal kemas kini", { description: error.message });
      return;
    }
    toast.success("Status dikemas kini");
    qc.invalidateQueries({ queryKey: ["admin", "host_course_requests"] });
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Permohonan Anjur Kursus
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Semua permohonan organisasi yang ingin mengadakan kursus di tempat mereka.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarikh</TableHead>
              <TableHead>Syarikat</TableHead>
              <TableHead>PIC</TableHead>
              <TableHead>Topik</TableHead>
              <TableHead>Peserta</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20"></TableHead>
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
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Tiada permohonan setakat ini.
                </TableCell>
              </TableRow>
            )}
            {data?.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(r.created_at), "dd MMM yyyy")}
                </TableCell>
                <TableCell className="font-medium">{r.company}</TableCell>
                <TableCell>{r.contact_name}</TableCell>
                <TableCell className="text-sm">{r.topic ?? "—"}</TableCell>
                <TableCell className="text-sm">{r.num_participants ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[r.status]}>
                    {STATUS_OPTIONS.find((s) => s.value === r.status)?.label ?? r.status}
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
                <DialogTitle>{selected.company}</DialogTitle>
                <DialogDescription>
                  Diterima pada {format(new Date(selected.created_at), "dd MMM yyyy, HH:mm")}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <Detail label="Nama PIC" value={selected.contact_name} />
                <Detail label="Emel" value={selected.email} />
                <Detail label="Telefon" value={selected.phone} />
                <Detail label="Lokasi" value={selected.location ?? "—"} />
                <Detail label="Topik Kursus" value={selected.topic ?? "—"} />
                <Detail
                  label="Jumlah Peserta"
                  value={selected.num_participants?.toString() ?? "—"}
                />
              </div>

              {selected.notes && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Keperluan Tambahan
                  </p>
                  <p className="mt-1 whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-sm">
                    {selected.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </p>
                  <p className="mt-1 text-sm">Kemas kini status permohonan ini.</p>
                </div>
                <Select
                  value={selected.status}
                  onValueChange={(v) => updateStatus(selected.id, v as Status)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
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

export default HostRequestsAdmin;
