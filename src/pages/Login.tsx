import { useState } from "react"
import type { FormEvent } from "react"
import { useAuth } from "../context/AuthContext"
import { auth, db } from "../firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await login(email, password)
      const u = auth.currentUser
      if (u) {
        const ref = doc(db, "users", u.uid)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          await setDoc(ref, { uid: u.uid, email: u.email, role: "editor" })
        }
      }
      navigate("/", { replace: true })
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <form onSubmit={submit} style={{ width: 320, display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 18 }}>Acceder</div>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button>Entrar</button>
      </form>
    </div>
  )
}
