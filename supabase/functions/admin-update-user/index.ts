import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing authorization" }, 401);
    }

    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json({ error: "Forbidden" }, 403);

    const body = await req.json();
    const { user_id, full_name, phone, email, password } = body as {
      user_id?: string;
      full_name?: string | null;
      phone?: string | null;
      email?: string;
      password?: string;
    };

    if (!user_id) return json({ error: "Missing user_id" }, 400);

    // Update profile (full_name, phone)
    if (full_name !== undefined || phone !== undefined) {
      const updates: Record<string, unknown> = {};
      if (full_name !== undefined) updates.full_name = full_name;
      if (phone !== undefined) updates.phone = phone;
      const { error: pErr } = await admin
        .from("profiles")
        .upsert({ id: user_id, ...updates }, { onConflict: "id" });
      if (pErr) throw pErr;
    }

    // Update auth (email/password)
    const authUpdates: Record<string, unknown> = {};
    if (email && typeof email === "string") {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 255) {
        return json({ error: "Emel tidak sah" }, 400);
      }
      authUpdates.email = email;
    }
    if (password && typeof password === "string") {
      if (password.length < 6 || password.length > 72) {
        return json({ error: "Kata laluan minima 6 aksara" }, 400);
      }
      authUpdates.password = password;
    }
    if (Object.keys(authUpdates).length > 0) {
      const { error: aErr } = await admin.auth.admin.updateUserById(user_id, authUpdates);
      if (aErr) throw aErr;
    }

    return json({ ok: true });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }

  function json(b: unknown, status = 200) {
    return new Response(JSON.stringify(b), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
