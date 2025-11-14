import { onSnapshot, query, collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db, auth } from "../firebase"

export default function Sites() {
  const [sites, setSites] = useState<any[]>([])
  const [domain, setDomain] = useState("")
  useEffect(() => {
    const q = query(collection(db, "sites"))
    const unsub = onSnapshot(q, s => {
      const list: any[] = []
      s.forEach(d => list.push({ id: d.id, ...(d.data() as any) }))
      setSites(list)
    })
    return () => unsub()
  }, [])
  const createSite = async () => {
    if (!domain) return
    const token = await auth.currentUser?.getIdToken(true)
    const res = await fetch('/api/create-site', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: token, domain }) })
    if (!res.ok) throw new Error(await res.text())
    setDomain("")
  }
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Dominio" value={domain} onChange={e => setDomain(e.target.value)} />
        <button onClick={createSite}>Crear</button>
      </div>
      <ul>
        {sites.map(s => (
          <li key={s.id}>{s.domain}</li>
        ))}
      </ul>
    </div>
  )
}
