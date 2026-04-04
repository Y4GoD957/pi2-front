import { useState } from 'react'

import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'

function App() {
  const [view, setView] = useState<'login' | 'register'>('login')

  if (view === 'register') {
    return <RegisterPage onBackToLogin={() => setView('login')} />
  }

  return <LoginPage onCreateAccount={() => setView('register')} />
}

export default App
