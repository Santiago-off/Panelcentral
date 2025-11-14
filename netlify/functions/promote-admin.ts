import type { Handler } from "@netlify/functions"
import * as admin from "firebase-admin"
import { firestore } from "./firebaseAdmin"

export const handler: Handler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: "no body" }
    const { idToken } = JSON.parse(event.body)
    if (!idToken) return { statusCode: 400, body: "missing token" }
    const decoded = await admin.auth().verifyIdToken(idToken)
    const uid = decoded.uid
    const email = decoded.email || ""
    const allowEmails = (process.env.ADMIN_EMAILS || "").split(/[,\s]+/).filter(Boolean)
    const allowUids = (process.env.ADMIN_UIDS || "").split(/[,\s]+/).filter(Boolean)
    const allowed = (email && allowEmails.includes(email)) || allowUids.includes(uid)
    if (!allowed) return { statusCode: 403, body: "forbidden" }
    await firestore.collection("users").doc(uid).set({ uid, email, role: "admin" }, { merge: true })
    return { statusCode: 200, body: "ok" }
  } catch (e: any) {
    return { statusCode: 500, body: e.message }
  }
}
