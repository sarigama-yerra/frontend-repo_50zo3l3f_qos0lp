import { useState } from 'react'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${baseUrl}/auth/${mode === 'login' ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'login' ? { email, password } : { email, password, name }),
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed')
      const data = await res.json()
      localStorage.setItem('token', data.token)
      onAuth && onAuth(data.user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-2">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="text-slate-400 mb-6">Use email and password to continue.</p>
        <form onSubmit={submit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm text-slate-300 mb-1">Name</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" />
            </div>
          )}
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button className="w-full bg-blue-600 hover:bg-blue-500 rounded py-2">{mode === 'login' ? 'Login' : 'Sign up'}</button>
        </form>
        <div className="text-sm text-slate-400 mt-4">
          {mode === 'login' ? (
            <>New here? <button className="text-blue-400" onClick={()=>setMode('signup')}>Create an account</button></>
          ) : (
            <>Have an account? <button className="text-blue-400" onClick={()=>setMode('login')}>Log in</button></>
          )}
        </div>
      </div>
    </div>
  )
}
