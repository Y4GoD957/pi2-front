import { useAuth } from '@/features/auth/hooks/useAuth'

import { ProfilePage } from './ProfilePage'

export function ProfilePageRoute() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return <ProfilePage user={user} />
}
