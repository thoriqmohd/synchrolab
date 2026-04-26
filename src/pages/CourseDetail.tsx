import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Award, CalendarDays, CheckCircle2, Clock, GraduationCap, Users } from "lucide-react";
import { courses } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CourseDetail = () => {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="container py-32 text-center">
        <h1 className="font-display text-2xl font-bold">Kursus tidak dijumpai</h1>
        <Button asChild className="mt-6"><Link to="/kursus">Kembali ke senarai</Link></Button>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-hero py-16">
        <div className="container">
          <Link to="/kursus" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Kembali ke senarai kursus
          </Link>
          <Badge className="mt-6 bg-accent text-accent-foreground hover:bg-accent">{course.category}</Badge>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">{course.shortDesc}</p>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/85">
            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> {course.duration}</span>
            <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> {course.facilitator}</span>
            <span className="inline-flex items-center gap-2"><Award className="h-4 w-4 text-accent" /> Sijil disediakan</span>
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Silibus & Kandungan</h2>
              <ul className="mt-4 space-y-3">
                {course.syllabus.map((s) => (
                  <li key={s} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-foreground/85">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold">Kelayakan Peserta</h3>
                <p className="mt-2 text-sm text-muted-foreground">{course.prerequisites}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold">Sijil yang Diterima</h3>
                <p className="mt-2 text-sm text-muted-foreground">{course.certificate}</p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Slot Tarikh Tersedia</h2>
              <div className="mt-4 grid gap-3">
                {course.slots.map((s) => (
                  <div key={s.date} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft">
                        <CalendarDays className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{s.date}</p>
                        <p className="text-xs text-muted-foreground">{s.time} • {s.seats > 0 ? `${s.seats} tempat tinggal` : "Penuh"}</p>
                      </div>
                    </div>
                    <Button size="sm" variant={s.seats > 0 ? "accent" : "outline"} disabled={s.seats === 0}>
                      {s.seats > 0 ? "Pilih Slot" : "Penuh"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar booking card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Yuran kursus</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-primary">
                RM{course.price.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground"> /peserta</span>
              </p>
              {course.groupPrice && (
                <p className="mt-1 text-sm text-success">
                  RM{course.groupPrice.toLocaleString()}/pax untuk kumpulan 5+ peserta
                </p>
              )}

              <Button variant="accent" size="lg" className="mt-6 w-full">
                <GraduationCap className="h-4 w-4" /> Daftar Sekarang
              </Button>
              <Button variant="outline" size="lg" className="mt-2 w-full">
                Tanya Pertanyaan
              </Button>

              <ul className="mt-6 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Bayaran selamat (FPX, kad)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Resit & invoice automatik</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> HRD Corp claimable</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default CourseDetail;
