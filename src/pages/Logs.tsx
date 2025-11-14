import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase"

export default function Logs() {
  const [sites, setSites] = useState<any[]>([])
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "sites"), s => {
      const list: any[] = []
      s.forEach(d => list.push({ id: d.id, ...(d.data() as any) }))
      setSites(list)
    })
    return () => unsub()
  }, [])
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {sites.map(s => (
        <div key={s.id}>
          <div style={{ fontWeight: 600 }}>{s.domain}</div>
          <div>Errores</div>
          <ul>
            {(s.errors || []).slice(-10).reverse().map((e: any, i: number) => (
              <li key={i}>{typeof e === "string" ? e : JSON.stringify(e)}</li>
            ))}
          </ul>
          <div>Logs</div>
          <ul>
            {(s.logs || []).slice(-10).reverse().map((e: any, i: number) => (
              <li key={i}>{typeof e === "string" ? e : JSON.stringify(e)}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
