import type { Handler } from "@netlify/functions"
import { firestore } from "./firebaseAdmin"

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
    const { id } = JSON.parse(event.body)
    if (!id) return { statusCode: 400, headers, body: "bad request" }
    await firestore.collection("commands").doc(id).set({ executed: true }, { merge: true })
    return { statusCode: 200, headers, body: "ok" }
  } catch (e: any) {
    return { statusCode: 500, headers, body: e.message }
  }
}
