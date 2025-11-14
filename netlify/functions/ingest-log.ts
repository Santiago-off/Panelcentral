import type { Handler } from "@netlify/functions"
import { firestore, FieldValue } from "./firebaseAdmin"

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' }, body: 'ok' }
    }
    if (!event.body) return { statusCode: 400, body: "no body" }
    const { domain, type, data } = JSON.parse(event.body)
    if (!domain || !type) return { statusCode: 400, body: "bad request" }
    const origin = event.headers.origin || ''
    try {
      const host = new URL(origin).hostname
      if (host !== domain) return { statusCode: 403, body: "forbidden" }
    } catch {}
    const q = await firestore.collection("sites").where("domain", "==", domain).limit(1).get()
    if (q.empty) return { statusCode: 404, body: "site not found" }
    const ref = q.docs[0].ref
    const field = type === "error" ? "errors" : "logs"
    await ref.update({ [field]: FieldValue.arrayUnion({ ts: Date.now(), data }) })
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': origin || '*' }, body: "ok" }
  } catch (e: any) {
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: e.message }
  }
}
