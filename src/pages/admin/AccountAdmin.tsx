import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AccountAdmin() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserId(u.user.id);
      setEmail(u.user.email ?? "");
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", u.user.id)
        .maybeSingle();
      setFullName(p?.full_name ?? "");
      setPhone(p?.phone ?? "");
      setLoading(false);
    })();
  }, []);

  const saveProfile = async () => {
    if (!userId) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, full_name: fullName, phone }, { onConflict: "id" });
    setSavingProfile(false);
    if (error) toast.error("Gagal", { description: error.message });
    else toast.success("Profil dikemas kini");
  };

  const changePassword = async () => {
    if (pwd.length < 6) {
      toast.error("Kata laluan minima 6 aksara");
      return;
    }
    if (pwd !== pwd2) {
      toast.error("Kata laluan tidak sama");
      return;
    }
    setSavingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setSavingPwd(false);
    if (error) toast.error("Gagal", { description: error.message });
    else {
      toast.success("Kata laluan ditukar");
      setPwd(""); setPwd2("");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Akaun Saya</h1>
        <p className="text-sm text-muted-foreground">Kemas kini profil dan kata laluan akaun anda.</p>
      </div>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Profil</h2>
        <div>
          <Label>Emel</Label>
          <Input value={email} disabled />
          <p className="mt-1 text-xs text-muted-foreground">Emel tidak boleh ditukar di sini.</p>
        </div>
        <div>
          <Label>Nama penuh</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <Label>Telefon</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <Button variant="accent" onClick={saveProfile} disabled={savingProfile}>
          {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
          Simpan Profil
        </Button>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Tukar Kata Laluan</h2>
        <div>
          <Label>Kata laluan baru</Label>
          <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
        </div>
        <div>
          <Label>Sahkan kata laluan</Label>
          <Input type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} />
        </div>
        <Button variant="accent" onClick={changePassword} disabled={savingPwd}>
          {savingPwd && <Loader2 className="h-4 w-4 animate-spin" />}
          Tukar Kata Laluan
        </Button>
      </section>
    </div>
  );
}
