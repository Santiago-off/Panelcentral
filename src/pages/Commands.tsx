import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection as coll, onSnapshot } from "firebase/firestore"

export default function Commands() {
  const [sites, setSites] = useState<any[]>([])
  const [siteId, setSiteId] = useState<string>("")
  const [commandType, setCommandType] = useState("refresh")
  const [payload, setPayload] = useState("")

  useEffect(() => {
    const unsub = onSnapshot(coll(db, "sites"), s => {
      const list: any[] = []
      s.forEach(d => list.push({ id: d.id, ...(d.data() as any) }))
      setSites(list)
    })
    return () => unsub()
  }, [])

  const send = async (targetAll: boolean) => {
    const target = targetAll ? null : (sites.find(s=>s.id===siteId)?.domain || null)
    const body = { siteId: target, commandType, payload: payload ? JSON.parse(payload) : {}, executed: false, createdAt: serverTimestamp() }
    await addDoc(collection(db, "commands"), body)
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <select value={siteId} onChange={e => setSiteId(e.target.value)}>
        <option value="">Todos</option>
        {sites.map(s => (
          <option key={s.id} value={s.id}>{s.domain}</option>
        ))}
      </select>
      <select value={commandType} onChange={e => setCommandType(e.target.value)}>
        <option value="refresh">Refrescar</option>
        <option value="styles">Cambiar estilos</option>
        <option value="popup">Mostrar popup</option>
        <option value="text">Alterar textos</option>
        <option value="darkmode">Activar modo oscuro</option>
        <option value="inject">Inyectar</option>
      </select>
      <textarea placeholder="Payload JSON" value={payload} onChange={e => setPayload(e.target.value)} rows={6} />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => send(false)}>Enviar</button>
        <button onClick={() => send(true)}>Enviar a todos</button>
      </div>
    </div>
  )
}
