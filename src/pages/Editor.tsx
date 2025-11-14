import { doc, getDoc, setDoc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { db } from "../firebase"

export default function Editor() {
  const [html, setHtml] = useState("")
  const [css, setCss] = useState("")
  const [js, setJs] = useState("")
  const [loaded, setLoaded] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const run = async () => {
      const snap = await getDoc(doc(db, "globalConfig", "default"))
      const d = snap.exists() ? snap.data() : null
      setHtml((d?.defaultHTMLInjections || []).join("\n"))
      setCss((d?.defaultCSSInjections || []).join("\n"))
      setJs((d?.defaultJSInjections || []).join("\n"))
      setLoaded(true)
    }
    run()
  }, [])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const docEl = iframe.contentDocument
    if (!docEl) return
    docEl.open()
    docEl.write(`<!doctype html><html><head><style>${css}</style></head><body>${html}</body></html>`)
    docEl.close()
    try {
      const s = docEl.createElement('script')
      s.textContent = js
      docEl.body.appendChild(s)
    } catch (e) { void e }
  }, [previewKey])

  const save = async () => {
    await setDoc(doc(db, "globalConfig", "default"), {
      defaultHTMLInjections: html.split("\n").filter(Boolean),
      defaultCSSInjections: css.split("\n").filter(Boolean),
      defaultJSInjections: js.split("\n").filter(Boolean)
    }, { merge: true })
  }

  if (!loaded) return null
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontWeight: 600 }}>HTML</div>
      <textarea rows={6} value={html} onChange={e => setHtml(e.target.value)} />
      <div style={{ fontWeight: 600 }}>CSS</div>
      <textarea rows={6} value={css} onChange={e => setCss(e.target.value)} />
      <div style={{ fontWeight: 600 }}>JS</div>
      <textarea rows={6} value={js} onChange={e => setJs(e.target.value)} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setPreviewKey(x => x + 1)}>Vista previa</button>
        <button onClick={save}>Guardar</button>
      </div>
      <div style={{ border: '1px solid #e5e7eb', height: 300 }}>
        <iframe key={previewKey} ref={iframeRef} title="preview" style={{ width: '100%', height: '100%', border: '0' }} />
      </div>
    </div>
  )
}
