import { useState } from "react";
import { Building2, CheckCircle2, GraduationCap, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const hostSchema = z.object({
  company: z.string().trim().min(2, "Nama syarikat terlalu pendek").max(200),
  contact_name: z.string().trim().min(2, "Nama PIC terlalu pendek").max(200),
  email: z.string().trim().email("Emel tidak sah").max(255),
  phone: z.string().trim().min(6, "No. telefon tidak sah").max(30),
  topic: z.string().trim().max(300).optional().or(z.literal("")),
  num_participants: z.number().int().positive().max(10000).optional(),
  location: z.string().trim().max(300).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

const benefits = [
  { icon: GraduationCap, title: "Trainer bertauliah", desc: "Pasukan trainer kami akan datang ke premis anda dengan bahan & peralatan lengkap." },
  { icon: Users, title: "Reka kursus tertutup", desc: "Silibus disesuaikan mengikut keperluan & tahap kemahiran pasukan anda." },
  { icon: Building2, title: "HRD Corp claimable", desc: "Sebahagian besar kursus boleh dituntut menerusi geran HRD Corp." },
];

const HostCourse = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const participantsRaw = (fd.get("participants") as string)?.trim();

    const payload = {
      company: (fd.get("company") as string) ?? "",
      contact_name: (fd.get("name") as string) ?? "",
      email: (fd.get("email") as string) ?? "",
      phone: (fd.get("phone") as string) ?? "",
      topic: ((fd.get("topic") as string) ?? "").trim() || undefined,
      num_participants: participantsRaw ? Number(participantsRaw) : undefined,
      location: ((fd.get("location") as string) ?? "").trim() || undefined,
      notes: ((fd.get("notes") as string) ?? "").trim() || undefined,
    };

    const parsed = hostSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error("Sila semak borang", { description: parsed.error.issues[0].message });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("host_course_requests").insert({
      company: parsed.data.company,
      contact_name: parsed.data.contact_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      topic: parsed.data.topic || null,
      num_participants: parsed.data.num_participants ?? null,
      location: parsed.data.location || null,
      notes: parsed.data.notes || null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Gagal menghantar", { description: error.message });
      return;
    }

    form.reset();
    toast.success("Permohonan dihantar!", {
      description: "Pasukan kami akan menghubungi anda dalam masa 1-2 hari bekerja.",
    });
  };

  return (
    <>
      <section className="bg-gradient-hero py-16">
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent/90">Untuk Organisasi</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-extrabold text-white md:text-5xl">
            Anjur kursus IT di tempat anda
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Mahu adakan latihan in-house untuk pasukan anda? Kami akan datang ke pejabat, kilang atau premis anda dengan trainer & bahan kursus yang disesuaikan.
          </p>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_480px]">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Kenapa anjur kursus dengan Synchrolab?</h2>
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
              <h3 className="font-display text-lg font-bold text-foreground">Bagaimana ia berjalan?</h3>
              <ol className="mt-4 space-y-3 text-sm text-foreground/80">
                {[
                  "Hantar borang minat dengan keperluan latihan anda.",
                  "Pasukan kami hubungi untuk perbincangan & cadangan silibus.",
                  "Sahkan tarikh, lokasi dan jumlah peserta.",
                  "Trainer datang ke premis anda — peserta terima sijil selepas tamat.",
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
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-6 shadow-elegant"
            >
              <h3 className="font-display text-xl font-bold text-foreground">Borang Minat Anjur Kursus</h3>
              <p className="mt-1 text-sm text-muted-foreground">Isi maklumat di bawah, kami akan hubungi anda.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="company">Nama Syarikat / Organisasi *</Label>
                  <Input id="company" name="company" required className="mt-1.5" placeholder="Contoh: ABC Sdn Bhd" />
                </div>
                <div>
                  <Label htmlFor="name">Nama Penuh PIC *</Label>
                  <Input id="name" name="name" required className="mt-1.5" placeholder="Nama anda" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Emel *</Label>
                    <Input id="email" name="email" type="email" required className="mt-1.5" placeholder="anda@syarikat.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">No. Telefon *</Label>
                    <Input id="phone" name="phone" type="tel" required className="mt-1.5" placeholder="012-3456789" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="topic">Topik Kursus</Label>
                    <Input id="topic" name="topic" className="mt-1.5" placeholder="Contoh: Excel Lanjutan" />
                  </div>
                  <div>
                    <Label htmlFor="participants">Jumlah Peserta</Label>
                    <Input id="participants" name="participants" type="number" min={1} className="mt-1.5" placeholder="20" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Lokasi Latihan</Label>
                  <Input id="location" name="location" className="mt-1.5" placeholder="Bandar / Negeri" />
                </div>
                <div>
                  <Label htmlFor="notes">Keperluan Tambahan</Label>
                  <Textarea id="notes" name="notes" className="mt-1.5" rows={3} placeholder="Tarikh dicadangkan, objektif latihan, dll." />
                </div>
              </div>

              <Button type="submit" variant="accent" size="lg" className="mt-6 w-full" disabled={submitting}>
                <Send className="h-4 w-4" />
                {submitting ? "Menghantar..." : "Hantar Permohonan"}
              </Button>

              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Maklumat anda selamat dan tidak dikongsi.
              </p>
            </form>
          </aside>
        </div>
      </section>
    </>
  );
};

export default HostCourse;
