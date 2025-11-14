import type { Handler } from "@netlify/functions"
import { firestore } from "./firebaseAdmin"

export const handler: Handler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: "no body" }
    const { id } = JSON.parse(event.body)
    if (!id) return { statusCode: 400, body: "bad request" }
    await firestore.collection("commands").doc(id).set({ executed: true }, { merge: true })
    return { statusCode: 200, body: "ok" }
  } catch (e: any) {
    return { statusCode: 500, body: e.message }
  }
}
