import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Utama" },
  { to: "/kursus", label: "Kursus" },
  { to: "/anjur-kursus", label: "Anjur Kursus" },
  { to: "/sewa-bilik", label: "Sewa Bilik" },
  { to: "/senarai-tempat", label: "Senarai Tempat" },
  { to: "/semak-tempahan", label: "Semak Tempahan" },
  { to: "/hubungi", label: "Hubungi" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-accent shadow-glow">
            <span className="font-display text-lg font-bold text-accent-foreground">S</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold text-primary">Synchrolab</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">.my</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-base",
                  active ? "text-accent" : "text-foreground/70 hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="accent" size="sm">
            <Link to="/kursus">Daftar Sekarang</Link>
          </Button>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-background md:hidden">
          <nav className="container flex flex-col py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild variant="accent" className="mt-2">
              <Link to="/kursus" onClick={() => setOpen(false)}>Daftar Sekarang</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
