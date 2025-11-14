import { Link, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Dashboard from "./pages/Dashboard"
import Sites from "./pages/Sites"
import Commands from "./pages/Commands"
import Editor from "./pages/Editor"
import Logs from "./pages/Logs"
import Config from "./pages/Config"
import { auth } from "./firebase"

export default function App() {
  const { role, logout, user } = useAuth()
  const askAdmin = async () => {
    if (!user) return
    const token = await auth.currentUser?.getIdToken()
    await fetch('/api/promote-admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: token }) })
  }
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 240, borderRight: "1px solid #e5e7eb", padding: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Panel Central</div>
        <nav style={{ display: "grid", gap: 8 }}>
          <Link to="/">Dashboard</Link>
          <Link to="/sites">Sitios</Link>
          <Link to="/commands">Comandos</Link>
          <Link to="/editor">Editor</Link>
          <Link to="/logs">Logs</Link>
          <Link to="/config">Config</Link>
        </nav>
        <div style={{ marginTop: 24 }}>Rol: {role ?? "sin rol"}</div>
        {role !== 'admin' && user && <button onClick={askAdmin} style={{ marginTop: 8 }}>Solicitar admin</button>}
        <button onClick={() => logout()} style={{ marginTop: 8 }}>Salir</button>
      </aside>
      <main style={{ flex: 1, padding: 16 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/commands" element={role === "admin" ? <Commands /> : <Navigate to="/" replace />} />
          <Route path="/editor" element={role === "admin" ? <Editor /> : <Navigate to="/" replace />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/config" element={role === "admin" ? <Config /> : <Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
