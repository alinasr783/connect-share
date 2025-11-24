// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4"

type SendBody = {
  userIds?: string[]
  payload?: { title?: string; body?: string; icon?: string; url?: string }
}

async function sendToFcm(token: string, payload: NonNullable<SendBody["payload"]>) {
  const serverKey = Deno.env.get("FCM_SERVER_KEY")
  if (!serverKey) throw new Error("FCM_SERVER_KEY missing")
  const res = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${serverKey}`,
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title: payload.title ?? "",
        body: payload.body ?? "",
        icon: payload.icon ?? "/vite.svg",
      },
      data: { url: payload.url ?? "/" },
      priority: "high",
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`FCM error ${res.status}: ${text}`)
  }
  return await res.json().catch(() => ({}))
}

serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 })

    const { userIds = [], payload = {} } = (await req.json().catch(() => ({}))) as SendBody
    if (!Array.isArray(userIds) || userIds.length === 0)
      return new Response(JSON.stringify({ error: "userIds required" }), { status: 400 })

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    const { data, error } = await supabase
      .from("users")
      .select("userId, fullName, fcmToken")
      .in("userId", userIds)

    if (error) throw new Error(error.message)

    const targets = (data || []).filter((u: any) => !!u.fcmToken)
    const results: any[] = []
    const errors: { userId: string; error: string }[] = []

    for (const u of targets) {
      try {
        const res = await sendToFcm(u.fcmToken, payload)
        results.push({ userId: u.userId, res })
      } catch (e) {
        errors.push({ userId: u.userId, error: (e as Error).message })
      }
    }

    return new Response(
      JSON.stringify({ success: true, requested: userIds.length, sent: results.length, errors }),
      { headers: { "Content-Type": "application/json" }, status: 200 },
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
})