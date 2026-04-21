import { AlertError } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { useProfiles } from '@/features/user/hooks/useProfiles'
import { useUserAccount } from '@/features/user/hooks/useUserAccount'

import { UserAccountPage } from './UserAccountPage'

export function UserAccountPageRoute() {
  const {
    error: accountError,
    hasLoadedOnce,
    isLoading,
    isSaving,
    save,
    user,
  } = useUserAccount()
  const { error: profilesError, profiles } = useProfiles()

  if (isLoading && !user) {
    return (
      <Card className="border-white/70 bg-white/85 backdrop-blur-sm">
        <CardContent className="p-6 text-sm text-slate-600">
          Carregando dados da conta...
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return <AlertError message={accountError ?? 'Conta indisponivel.'} />
  }

  return (
    <UserAccountPage
      isLoading={isLoading}
      hasLoadedOnce={hasLoadedOnce}
      isSaving={isSaving}
      onSave={save}
      profiles={profiles}
      profilesError={profilesError}
      user={user}
    />
  )
}
