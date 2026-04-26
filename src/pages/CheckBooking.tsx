import { useState } from "react";
import { CheckCircle2, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CheckBooking = () => {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<null | { ref: string; status: string; course: string; date: string; amount: string }>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: dummy result
    setResult({
      ref: ref || "SYL-2025-00001",
      status: "Berjaya",
      course: "Microsoft Excel Lanjutan untuk Profesional",
      date: "15-16 Mei 2025",
      amount: "RM 850.00",
    });
  };

  return (
    <>
      <section className="bg-gradient-hero py-16">
        <div className="container max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <FileSearch className="h-6 w-6 text-accent" />
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-white">Semak Status Tempahan</h1>
          <p className="mt-3 text-white/80">
            Masukkan nombor rujukan atau e-mel anda untuk semak status tempahan, muat turun resit dan sijil.
          </p>
        </div>
      </section>

      <section className="container max-w-2xl py-14">
        <form onSubmit={handleCheck} className="rounded-2xl border border-border bg-card p-8 shadow-soft">
          <Label htmlFor="ref">Nombor rujukan atau e-mel</Label>
          <Input id="ref" placeholder="SYL-2025-00001 atau nama@email.com" value={ref} onChange={(e) => setRef(e.target.value)} className="mt-2" required />
          <Button type="submit" variant="accent" size="lg" className="mt-5 w-full">Semak Tempahan</Button>
        </form>

        {result && (
          <div className="mt-6 rounded-2xl border border-success/30 bg-success/5 p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" />
              <div className="flex-1">
                <p className="font-display text-lg font-bold text-foreground">Tempahan dijumpai</p>
                <p className="text-xs text-muted-foreground">Rujukan: {result.ref}</p>

                <dl className="mt-4 grid gap-2 text-sm">
                  <div className="flex justify-between border-b border-border/50 py-1.5"><dt className="text-muted-foreground">Status bayaran</dt><dd className="font-semibold text-success">{result.status}</dd></div>
                  <div className="flex justify-between border-b border-border/50 py-1.5"><dt className="text-muted-foreground">Kursus</dt><dd className="font-medium text-foreground text-right">{result.course}</dd></div>
                  <div className="flex justify-between border-b border-border/50 py-1.5"><dt className="text-muted-foreground">Tarikh</dt><dd className="font-medium text-foreground">{result.date}</dd></div>
                  <div className="flex justify-between py-1.5"><dt className="text-muted-foreground">Jumlah dibayar</dt><dd className="font-display text-lg font-bold text-primary">{result.amount}</dd></div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button size="sm" variant="accent">Muat Turun Resit (PDF)</Button>
                  <Button size="sm" variant="outline">Muat Turun Sijil</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default CheckBooking;
