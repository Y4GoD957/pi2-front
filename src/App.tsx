import { useAuth } from '@/features/auth/hooks/useAuth'
import { AppRouter } from '@/app/router/router'

function App() {
  const { isAuthReady, isAuthenticated } = useAuth()

  if (!isAuthReady) {
    return null
  }

  return <AppRouter auth={{ isAuthenticated }} />
}

export default App
