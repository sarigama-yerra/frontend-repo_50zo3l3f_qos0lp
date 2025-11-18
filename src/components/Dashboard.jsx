import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function useApi() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  return { baseUrl, headers }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { baseUrl, headers } = useApi()
  const [profile, setProfile] = useState(null)
  const [cfg, setCfg] = useState(null)
  const [history, setHistory] = useState([])
  const [inputs, setInputs] = useState({ git_status: '', version: '', description: '', preferred_type: '', scope: '' })
  const [result, setResult] = useState(null)
  const [copy, setCopy] = useState('Copy commit command')
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        const me = await fetch(`${baseUrl}/me`, { headers })
        if (!me.ok) throw new Error('Auth required')
        setProfile(await me.json())
        const c = await fetch(`${baseUrl}/config`, { headers })
        setCfg(await c.json())
        const h = await fetch(`${baseUrl}/history`, { headers })
        setHistory(await h.json())
      } catch (e) {
        console.error(e)
        navigate('/auth')
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl])

  const generate = async () => {
    setError('')
    try {
      const res = await fetch(`${baseUrl}/generate`, { method: 'POST', headers, body: JSON.stringify(inputs) })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed')
      const data = await res.json()
      setResult(data)
      // refresh history
      const h = await fetch(`${baseUrl}/history`, { headers })
      setHistory(await h.json())
    } catch (e) {
      setError(e.message)
    }
  }

  const copyCmd = async () => {
    if (!result) return
    // Use multiple -m flags to preserve body/footer sections
    const sections = String(result.message).split(/\n\n+/)
    const parts = sections.map(s => `-m "${s.replace(/"/g, '\\"')}"`).join(' ')
    const cmd = `git commit ${parts}`
    await navigator.clipboard.writeText(cmd)
    setCopy('Copied!')
    setTimeout(()=>setCopy('Copy commit command'), 1500)
  }

  const updateCfg = async (next) => {
    const res = await fetch(`${baseUrl}/config`, { method: 'PUT', headers, body: JSON.stringify(next) })
    if (res.ok) setCfg({ ...cfg, ...next })
  }

  const deleteItem = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/history/${id}`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('Delete failed')
      const h = await fetch(`${baseUrl}/history`, { headers })
      setHistory(await h.json())
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/60 sticky top-0 backdrop-blur bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/flame-icon.svg" alt="Flames" className="w-7 h-7" />
            <span className="font-semibold">Dashboard</span>
          </div>
          <div className="text-sm text-slate-400">{profile?.email}</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="font-semibold mb-4">Generate Conventional Commit</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-300 mb-1">Git status / summary</label>
                <textarea value={inputs.git_status} onChange={e=>setInputs({...inputs, git_status: e.target.value})} rows={5} className="w-full bg-slate-950 border border-slate-800 rounded p-3 font-mono"></textarea>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Version</label>
                <input value={inputs.version} onChange={e=>setInputs({...inputs, version: e.target.value})} placeholder="1.2.3" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Short description</label>
                <input value={inputs.description} onChange={e=>setInputs({...inputs, description: e.target.value})} placeholder="What are you working on?" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Preferred type</label>
                <input value={inputs.preferred_type} onChange={e=>setInputs({...inputs, preferred_type: e.target.value})} placeholder="feat, fix, chore..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Scope</label>
                <input value={inputs.scope} onChange={e=>setInputs({...inputs, scope: e.target.value})} placeholder="ui, api..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" />
              </div>
            </div>
            {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
            <div className="mt-4 flex gap-3">
              <button onClick={generate} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">Generate</button>
              {result && <>
                <button onClick={copyCmd} className="border border-slate-700 hover:border-slate-500 px-4 py-2 rounded">{copy}</button>
                <button onClick={()=>navigator.clipboard.writeText(result.changelog_line)} className="border border-slate-700 hover:border-slate-500 px-4 py-2 rounded">Copy changelog</button>
              </>}
            </div>

            {result && (
              <div className="mt-6">
                <div className="text-slate-300 mb-1">Commit message</div>
                <pre className="bg-black/40 border border-slate-800 rounded p-4 font-mono whitespace-pre-wrap">{result.message}</pre>
                {typeof result.usage_left === 'number' && (
                  <div className="text-slate-400 text-sm mt-2">Generations left this month: {result.usage_left}</div>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-3">History</h3>
            <p className="text-slate-400 text-sm mb-4">You can delete any entry. If you prefer not to store history, simply ignore this section.</p>
            <div className="space-y-3">
              {history.map(h => (
                <div key={h.id} className="border border-slate-800 rounded p-3">
                  <div className="text-emerald-400 font-mono text-sm whitespace-pre-wrap">{h.message}</div>
                  <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                    <div>{h.created_at ? new Date(h.created_at).toLocaleString() : ''}</div>
                    <button onClick={()=>deleteItem(h.id)} className="text-red-400">Delete</button>
                  </div>
                </div>
              ))}
              {history.length === 0 && <div className="text-slate-400 text-sm">No entries yet.</div>}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-3">Preferences</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-slate-300 mb-1">Favorite types (comma-separated)</div>
                <input value={(cfg?.favorite_types||[]).join(', ')} onChange={e=>updateCfg({ favorite_types: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" />
              </div>
              <div>
                <div className="text-sm text-slate-300 mb-1">Favorite scopes (comma-separated)</div>
                <input value={(cfg?.favorite_scopes||[]).join(', ')} onChange={e=>updateCfg({ favorite_scopes: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" />
              </div>
              <div>
                <div className="text-sm text-slate-300 mb-1">Footer template</div>
                <input value={cfg?.footer_template || ''} onChange={e=>updateCfg({ footer_template: e.target.value || null })} placeholder="Refs: {ticket}" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-3">Tips</h3>
            <ul className="list-disc list-inside text-slate-400 text-sm space-y-2">
              <li>Use Conventional Commits to automate releases and changelogs.</li>
              <li>Free plan has monthly limits. Upgrade for more.</li>
              <li>You can integrate enforcement via a commit-msg hook or CI.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  )
}
