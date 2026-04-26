import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Emel tidak sah").max(255),
  password: z.string().min(6, "Password sekurang-kurangnya 6 aksara").max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    const { email, password } = parsed.data;
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Berjaya log masuk");
        navigate("/admin", { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Akaun dicipta", { description: "Sila log masuk." });
        setMode("login");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Ralat tidak diketahui");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elegant">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Kembali ke laman utama
        </Link>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-foreground">
          {mode === "login" ? "Log Masuk Admin" : "Daftar Akaun"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login"
            ? "Akses panel pengurusan Synchrolab."
            : "Cipta akaun baru untuk akses panel."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Emel</Label>
            <Input id="email" name="email" type="email" required className="mt-1.5" autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1.5"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            <LogIn className="h-4 w-4" />
            {submitting ? "Memproses..." : mode === "login" ? "Log Masuk" : "Daftar"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "Belum ada akaun? Daftar" : "Sudah ada akaun? Log masuk"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
