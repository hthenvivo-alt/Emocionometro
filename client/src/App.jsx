import { useState, useEffect } from 'react'
import UserView from './pages/UserView'
import AdminView from './pages/AdminView'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Ruteo simple
    if (window.location.pathname === '/admin') {
      setIsAdmin(true)
    }
  }, [])

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-50 font-sans">
      {isAdmin ? <AdminView /> : <UserView />}
    </div>
  )
}

export default App
