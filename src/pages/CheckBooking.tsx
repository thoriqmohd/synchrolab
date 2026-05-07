import { useState } from "react";
import { CheckCircle2, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";

type BookingResult = {
  ref: string;
  status: string;
  course: string;
  date: string;
  amount: string;
  customer: string;
};

const CheckBooking = () => {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<null | BookingResult>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setResult({
      ref: ref || "SYL-2025-00001",
      status: "Berjaya",
      course: "Microsoft Excel Lanjutan untuk Profesional",
      date: "15-16 Mei 2025",
      amount: "RM 850.00",
      customer: "Pelanggan SynchroLab",
    });
  };

  const downloadReceipt = () => {
    if (!result) return;
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString("ms-MY");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("RESIT RASMI", 105, 25, { align: "center" });

    doc.setFontSize(12);
    doc.text("SynchroLab.my", 105, 33, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Synchronetwork Sdn. Bhd. (1194790-K)", 105, 39, { align: "center" });
    doc.text("79A, Jalan Nova U5/N, Subang Bestari Sek. U5, 40150 Shah Alam, Selangor", 105, 44, { align: "center" });

    doc.setDrawColor(180);
    doc.line(20, 50, 190, 50);

    doc.setFontSize(11);
    doc.text(`No. Rujukan: ${result.ref}`, 20, 60);
    doc.text(`Tarikh Resit: ${today}`, 20, 67);
    doc.text(`Pelanggan: ${result.customer}`, 20, 74);
    doc.text(`Status Bayaran: ${result.status}`, 20, 81);

    doc.setFont("helvetica", "bold");
    doc.text("Butiran Tempahan", 20, 95);
    doc.setFont("helvetica", "normal");

    doc.text(`Kursus:`, 20, 105);
    doc.text(result.course, 60, 105);
    doc.text(`Tarikh Kursus:`, 20, 112);
    doc.text(result.date, 60, 112);

    doc.line(20, 125, 190, 125);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Jumlah Dibayar:", 20, 135);
    doc.text(result.amount, 190, 135, { align: "right" });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Terima kasih kerana menggunakan SynchroLab.my", 105, 280, { align: "center" });

    doc.save(`Resit-${result.ref}.pdf`);
  };

  const downloadCertificate = () => {
    if (!result) return;
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setDrawColor(30, 64, 100);
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);
    doc.setLineWidth(0.5);
    doc.rect(15, 15, 267, 180);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(30, 64, 100);
    doc.text("SIJIL PENYERTAAN", 148.5, 45, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text("Adalah dengan ini disahkan bahawa", 148.5, 70, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(20);
    doc.text(result.customer, 148.5, 88, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text("telah berjaya menyertai dan menamatkan kursus", 148.5, 105, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 64, 100);
    doc.text(result.course, 148.5, 122, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(`pada ${result.date}`, 148.5, 135, { align: "center" });

    doc.setDrawColor(150);
    doc.line(50, 170, 110, 170);
    doc.line(187, 170, 247, 170);
    doc.setFontSize(10);
    doc.text("Pengarah Latihan", 80, 178, { align: "center" });
    doc.text("SynchroLab.my", 217, 178, { align: "center" });

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`No. Sijil: ${result.ref}`, 148.5, 192, { align: "center" });

    doc.save(`Sijil-${result.ref}.pdf`);
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
