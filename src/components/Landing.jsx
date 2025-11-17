import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/60 sticky top-0 backdrop-blur bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/flame-icon.svg" alt="Flames" className="w-7 h-7" />
            <span className="font-semibold">Conventional Commit Assistant</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#how" className="text-slate-300 hover:text-white">How it works</a>
            <a href="https://conventionalcommits.org" target="_blank" className="text-slate-300 hover:text-white">Why CC?</a>
            <Link to="/auth" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">Try for free</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Generate perfect Conventional Commit messages</h1>
            <p className="text-slate-300 mb-6">Paste your git status, add a short description and version, and get a clean commit message that follows the spec. Copy the commit command in one click.</p>
            <div className="flex gap-3">
              <Link to="/auth" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded">Get started free</Link>
              <a href="#how" className="px-5 py-3 rounded border border-slate-700 hover:border-slate-500">See how it works</a>
            </div>
            <p className="text-slate-400 text-sm mt-4">We don’t store your code or git status unless you choose to save history.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono text-sm">
            <div className="text-slate-400">$ git status</div>
            <pre className="whitespace-pre-wrap text-slate-200">modified: src/components/Button.tsx{"\n"}new file: src/utils/format.ts{"
"}deleted: src/legacy/old.js</pre>
            <div className="mt-4 p-4 bg-black/40 rounded-lg border border-slate-800">
              <div className="text-slate-400 mb-1">Generated:</div>
              <div className="text-emerald-400">feat(ui): add format util and refactor button</div>
            </div>
          </div>
        </section>

        <section id="how" className="border-t border-slate-800/60">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-semibold mb-8">How it works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-300 flex items-center justify-center mb-3">1</div>
                <h3 className="font-semibold mb-2">Paste git status</h3>
                <p className="text-slate-400">Drop in the output or summarize what changed.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-300 flex items-center justify-center mb-3">2</div>
                <h3 className="font-semibold mb-2">Add details</h3>
                <p className="text-slate-400">Enter version and a short task description.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-300 flex items-center justify-center mb-3">3</div>
                <h3 className="font-semibold mb-2">Generate</h3>
                <p className="text-slate-400">Get a Conventional Commit message and changelog line.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-slate-400">
          <p>Privacy: Inputs are not stored by default. You can opt-in to save history and delete it anytime.</p>
        </div>
      </footer>
    </div>
  )
}
