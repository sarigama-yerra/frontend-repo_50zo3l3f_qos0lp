import { Routes, Route, useNavigate } from 'react-router-dom'
import Landing from './components/Landing'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

function App() {
  const navigate = useNavigate()
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth onAuth={()=>navigate('/app')} />} />
      <Route path="/app" element={<Dashboard />} />
    </Routes>
  )
}

export default App
