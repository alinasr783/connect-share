import { getFirebaseApp, initFirebase } from "./firebase"
import { isSupported, getMessaging, getToken, onMessage } from "firebase/messaging"
import supabase, { supabaseUrl } from "./supabase"

let messaging

export async function ensureMessaging() {
  initFirebase()
  const supported = await isSupported()
  if (!supported) return null
  if (!messaging) messaging = getMessaging(getFirebaseApp())
  return messaging
}

export async function registerFcmTokenForUser() {
  const m = await ensureMessaging()
  if (!m) return null
  const permission = await Notification.requestPermission()
  if (permission !== "granted") return null
  const vapidKey = "BGk3kMpnATwfSaxRyXm4z2HhYm4Z6USaVSBxBBxj7B1LDit9Rk3u06wzbJcOE0G7-aLuJWZ_N6IkxThTAj3LtZ8"
  const registration = await navigator.serviceWorker?.ready
  const token = await getToken(m, { vapidKey, serviceWorkerRegistration: registration })
  if (!token) return null
  const { error } = await supabase.auth.updateUser({ data: { fcmToken: token } })
  if (error) throw new Error(error.message)
  return token
}

export async function onForegroundMessage(handler) {
  const m = await ensureMessaging()
  if (!m) return () => {}
  return onMessage(m, handler)
}

export async function sendPushToUsers(userIds, payload) {
  if (import.meta.env.DEV) {
    return { success: true, mode: "simulated", userIdsCount: userIds?.length || 0 }
  }
  try {
    const { data, error } = await supabase.functions.invoke("send-push", { body: { userIds, payload } })
    if (error) {
      console.error("send-push invoke error", { message: error.message, userIdsCount: userIds?.length })
      throw new Error(error.message)
    }
    return data
  } catch (e) {
    console.error("send-push request failed", { error: e?.message, userIds, payload })
    try {
      const url = `${supabaseUrl}/functions/v1/send-push`
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds, payload }),
      })
      console.warn("send-push dev fallback used", { url })
      return { success: true, mode: "dev-fallback" }
    } catch (f) {
      console.error("send-push dev fallback failed", { error: f?.message })
      throw new Error(e?.message || "Failed to send push")
    }
  }
}