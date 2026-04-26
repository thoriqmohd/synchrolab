import { useState } from "react";
import { Banknote, CheckCircle2, MapPin, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const benefits = [
  { icon: Sparkles, title: "Jangkau ribuan pengguna", desc: "Tempat anda dipaparkan kepada pelajar, korporat & event organizer di seluruh Malaysia." },
  { icon: Banknote, title: "Pendapatan tambahan", desc: "Kami uruskan tempahan, bayaran dan resit — anda fokus pada operasi tempat." },
  { icon: MapPin, title: "Semua jenis ruang", desc: "Bilik latihan, lab IT, auditorium, ruang seminar, co-working — semua dialu-alukan." },
];

const ListVenue = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Permohonan diterima!", {
        description: "Pasukan kami akan menyemak dan menghubungi anda tidak lama lagi.",
      });
    }, 800);
  };

  return (
    <>
      <section className="bg-gradient-hero py-16">
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent/90">Untuk Pemilik Tempat</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-extrabold text-white md:text-5xl">
            Senaraikan tempat latihan anda
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Ada bilik latihan, lab IT atau auditorium yang kosong? Senaraikan dengan Synchrolab dan jana pendapatan tambahan dengan menyewa kepada pengguna kami.
          </p>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_480px]">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Kenapa senarai dengan kami?</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {benefits.map((b) => (
                  <div key={b.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
                      <b.icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-bold text-foreground">{b.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-soft p-6">
              <h3 className="font-display text-lg font-bold text-foreground">Proses Senarai</h3>
              <ol className="mt-4 space-y-3 text-sm text-foreground/80">
                {[
                  "Hantar maklumat tempat anda menerusi borang.",
                  "Pasukan kami semak & lawat tapak (jika perlu).",
                  "Tandatangan perjanjian rakan kongsi & kadar komisen.",
                  "Tempat anda 'live' di platform — terima tempahan terus.",
                ].map((s, i) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
              <h3 className="font-display text-xl font-bold text-foreground">Borang Senarai Tempat</h3>
              <p className="mt-1 text-sm text-muted-foreground">Kongsi maklumat tempat latihan anda.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="venue">Nama Tempat *</Label>
                  <Input id="venue" required className="mt-1.5" placeholder="Contoh: Lab Latihan IT XYZ" />
                </div>
                <div>
                  <Label htmlFor="owner">Nama Pemilik / PIC *</Label>
                  <Input id="owner" required className="mt-1.5" placeholder="Nama anda" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Emel *</Label>
                    <Input id="email" type="email" required className="mt-1.5" placeholder="anda@syarikat.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">No. Telefon *</Label>
                    <Input id="phone" type="tel" required className="mt-1.5" placeholder="012-3456789" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Alamat Penuh *</Label>
                  <Input id="address" required className="mt-1.5" placeholder="Bandar, Negeri, Poskod" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="capacity">Kapasiti (orang)</Label>
                    <Input id="capacity" type="number" min={1} className="mt-1.5" placeholder="20" />
                  </div>
                  <div>
                    <Label htmlFor="rate">Kadar Cadangan (RM/hari)</Label>
                    <Input id="rate" type="number" min={0} className="mt-1.5" placeholder="800" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="facilities">Kemudahan</Label>
                  <Textarea id="facilities" className="mt-1.5" rows={3} placeholder="Contoh: WiFi, projektor, 20 unit komputer, penghawa dingin..." />
                </div>
              </div>

              <Button type="submit" variant="accent" size="lg" className="mt-6 w-full" disabled={submitting}>
                <Send className="h-4 w-4" />
                {submitting ? "Menghantar..." : "Hantar Permohonan"}
              </Button>

              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Tiada caj untuk senarai. Komisen hanya dikenakan bila ada tempahan.
              </p>
            </form>
          </aside>
        </div>
      </section>
    </>
  );
};

export default ListVenue;
