import { Check, Users } from "lucide-react";
import { rooms } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";

const Rooms = () => {
  const [form, setForm] = useState({ room: rooms[0].id, date: "", time: "", duration: "", name: "", email: "", phone: "", notes: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Permohonan tempahan diterima!", {
      description: "Pasukan kami akan menghubungi anda dalam masa 24 jam untuk pengesahan.",
    });
  };

  return (
    <>
      <section className="bg-gradient-hero py-16">
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent/90">Sewa Bilik Latihan</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold text-white md:text-5xl">Ruang latihan moden untuk acara anda</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Daripada workshop kecil hingga seminar berskala besar — pilih bilik yang sesuai dengan keperluan anda.
          </p>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {rooms.map((r) => (
            <div key={r.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-smooth hover:shadow-elegant">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={r.image} alt={r.name} loading="lazy" width={1200} height={800} className="h-full w-full object-cover transition-smooth hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-bold text-foreground">{r.name}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
                    <Users className="h-3 w-3" /> {r.capacity}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>

                <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground/80">
                  {r.facilities.map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-success" /> {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Per jam / hari</p>
                    <p className="font-display text-lg font-bold text-primary">
                      RM{r.hourlyRate} <span className="text-sm font-normal text-muted-foreground">/ RM{r.dailyRate}</span>
                    </p>
                  </div>
                  <Button size="sm" variant="accent" onClick={() => { setForm((f) => ({ ...f, room: r.id })); document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" }); }}>
                    Tempah
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking form */}
      <section id="booking-form" className="bg-gradient-soft py-16">
        <div className="container max-w-3xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Borang Tempahan Bilik</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Semak ketersediaan & tempah</h2>
          </div>

          <form onSubmit={submit} className="mt-10 grid gap-5 rounded-2xl border border-border bg-card p-8 shadow-soft md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Bilik latihan</Label>
              <select required value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                {rooms.map((r) => <option key={r.id} value={r.id}>{r.name} (kapasiti {r.capacity})</option>)}
              </select>
            </div>

            <div>
              <Label>Tarikh</Label>
              <Input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Masa mula</Label>
              <Input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Tempoh (jam)</Label>
              <Input required type="number" min={1} max={12} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Nama penuh</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>E-mel</Label>
              <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Telefon</Label>
              <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" />
            </div>
            <div className="md:col-span-2">
              <Label>Keperluan khas</Label>
              <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1.5" placeholder="Cth: setup teater, perlu mikrofon tambahan, jamuan minum..." />
            </div>
            <Button type="submit" variant="accent" size="lg" className="md:col-span-2">
              Hantar Permohonan Tempahan
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Rooms;
