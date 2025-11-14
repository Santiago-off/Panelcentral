import type { Handler } from "@netlify/functions"
import * as admin from "firebase-admin"
import { firestore } from "./firebaseAdmin"

export const handler: Handler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: "no body" }
    const { idToken, domain } = JSON.parse(event.body)
    if (!idToken || !domain) return { statusCode: 400, body: "bad request" }
    if (!/^[a-z0-9.-]+$/.test(domain)) return { statusCode: 400, body: "invalid domain" }
    const decoded = await admin.auth().verifyIdToken(idToken)
    const uid = decoded.uid
    const userDoc = await firestore.collection("users").doc(uid).get()
    const role = userDoc.exists ? (userDoc.data()?.role as string) : null
    if (role !== 'admin') return { statusCode: 403, body: "forbidden" }
    const existing = await firestore.collection("sites").where("domain","==",domain).limit(1).get()
    if (!existing.empty) return { statusCode: 200, body: JSON.stringify({ id: existing.docs[0].id }) }
    const created = await firestore.collection("sites").add({ domain, status: "offline", version: "v1", settings: {}, lastSeen: null, logs: [], errors: [] })
    return { statusCode: 200, body: JSON.stringify({ id: created.id }) }
  } catch (e: any) {
    return { statusCode: 500, body: e.message }
  }
}
