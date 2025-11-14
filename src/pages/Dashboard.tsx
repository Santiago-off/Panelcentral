import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase"

type Site = {
  id: string
  domain: string
  status?: string
  version?: string
  lastSeen?: any
}

export default function Dashboard() {
  const [sites, setSites] = useState<Site[]>([])
  useEffect(() => {
    const q = query(collection(db, "sites"), orderBy("domain"))
    const unsub = onSnapshot(q, s => {
      const list: Site[] = []
      s.forEach(d => list.push({ id: d.id, ...(d.data() as any) }))
      setSites(list)
    })
    return () => unsub()
  }, [])
  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Estado general</div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Dominio</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Estado</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Versión</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Última actividad</th>
          </tr>
        </thead>
        <tbody>
          {sites.map(s => (
            <tr key={s.id}>
              <td style={{ padding: 8 }}>{s.domain}</td>
              <td style={{ padding: 8 }}>{s.status ?? ""}</td>
              <td style={{ padding: 8 }}>{s.version ?? ""}</td>
              <td style={{ padding: 8 }}>{s.lastSeen ? new Date(s.lastSeen.seconds * 1000).toLocaleString() : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
