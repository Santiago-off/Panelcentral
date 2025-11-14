import { doc, getDoc, setDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase"

export default function Config() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [coreVersion, setCoreVersion] = useState("v1")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const run = async () => {
      const snap = await getDoc(doc(db, "globalConfig", "default"))
      const d = snap.exists() ? snap.data() : null
      setMaintenanceMode(Boolean(d?.maintenanceMode))
      setDarkMode(Boolean(d?.darkMode))
      setCoreVersion(d?.coreVersion || "v1")
      setLoaded(true)
    }
    run()
  }, [])

  const save = async () => {
    await setDoc(doc(db, "globalConfig", "default"), { maintenanceMode, darkMode, coreVersion }, { merge: true })
  }

  if (!loaded) return null
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label><input type="checkbox" checked={maintenanceMode} onChange={e => setMaintenanceMode(e.target.checked)} /> Modo mantenimiento</label>
      <label><input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} /> Modo oscuro</label>
      <input value={coreVersion} onChange={e => setCoreVersion(e.target.value)} />
      <button onClick={save}>Guardar</button>
    </div>
  )
}
