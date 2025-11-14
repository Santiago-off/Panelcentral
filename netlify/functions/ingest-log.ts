import type { Handler } from "@netlify/functions"
import { firestore, FieldValue } from "./firebaseAdmin"

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    "Access-Control-Allow-Credentials": "true"
  }
  try {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: "" }
    if (!event.body) return { statusCode: 400, headers, body: "no body" }
    const { domain, type, data } = JSON.parse(event.body)
    if (!domain || !type) return { statusCode: 400, headers, body: "bad request" }
    const origin = event.headers.origin || ''
    try {
      const host = new URL(origin).hostname
      if (host !== domain) return { statusCode: 403, headers, body: "forbidden" }
    } catch {}
    const q = await firestore.collection("sites").where("domain", "==", domain).limit(1).get()
    if (q.empty) return { statusCode: 404, headers, body: "site not found" }
    const ref = q.docs[0].ref
    const field = type === "error" ? "errors" : "logs"
    await ref.update({ [field]: FieldValue.arrayUnion({ ts: Date.now(), data }) })
    return { statusCode: 200, headers, body: "ok" }
  } catch (e: any) {
    return { statusCode: 500, headers, body: e.message }
  }
}
