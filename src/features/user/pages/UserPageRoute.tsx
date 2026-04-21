import { AlertError } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { useUserAccount } from '@/features/user/hooks/useUserAccount'

import { UserPage } from './UserPage'

export function UserPageRoute() {
  const { error, isLoading, user } = useUserAccount()

  if (isLoading && !user) {
    return (
      <Card className="border-white/70 bg-white/85 backdrop-blur-sm">
        <CardContent className="p-6 text-sm text-slate-600">
          Carregando dados do usuario...
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return error ? <AlertError message={error} /> : null
  }

  return <UserPage user={user} />
}
