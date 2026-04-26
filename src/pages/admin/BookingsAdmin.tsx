import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type BookingRow = {
  id: string;
  ref_no: string;
  type: "course" | "room";
  customer_name: string;
  email: string;
  phone: string;
  num_pax: number;
  total_amount: number;
  payment_status: "unpaid" | "paid" | "refunded";
  booking_status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  courses: { title: string } | null;
  rooms: { name: string } | null;
};

const BookingsAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, courses(title), rooms(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as BookingRow[];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Tempahan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Senarai tempahan kursus & sewa bilik.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarikh</TableHead>
              <TableHead>No. Rujukan</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Pax</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Bayaran</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">Memuatkan...</TableCell>
              </TableRow>
            )}
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">Tiada tempahan.</TableCell>
              </TableRow>
            )}
            {data?.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(b.created_at), "dd MMM yyyy")}</TableCell>
                <TableCell className="font-mono text-xs">{b.ref_no}</TableCell>
                <TableCell><Badge variant="outline">{b.type === "course" ? "Kursus" : "Bilik"}</Badge></TableCell>
                <TableCell>
                  <div className="font-medium">{b.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{b.email}</div>
                </TableCell>
                <TableCell className="text-sm">{b.courses?.title ?? b.rooms?.name ?? "—"}</TableCell>
                <TableCell>{b.num_pax}</TableCell>
                <TableCell className="font-medium">RM {Number(b.total_amount).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={b.payment_status === "paid" ? "default" : "secondary"}>
                    {b.payment_status === "paid" ? "Dibayar" : b.payment_status === "refunded" ? "Dipulang" : "Belum Bayar"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={b.booking_status === "confirmed" ? "default" : b.booking_status === "cancelled" ? "outline" : "secondary"}>
                    {b.booking_status === "confirmed" ? "Disahkan" : b.booking_status === "cancelled" ? "Dibatal" : "Menunggu"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BookingsAdmin;
