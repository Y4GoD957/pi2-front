import { useNavigate } from '@tanstack/react-router'

import { appPaths } from '@/app/routes/paths'
import { PublicPolicyForm } from '@/features/public-policies/components/PublicPolicyForm'
import type { usePublicPolicyForm } from '@/features/public-policies/hooks/usePublicPolicyForm'

type PublicPolicyEditPageProps = ReturnType<typeof usePublicPolicyForm> & {
  policyId: number
}

export function PublicPolicyEditPage({ policyId, ...props }: PublicPolicyEditPageProps) {
  const navigate = useNavigate()

  return (
    <>
      <header className="rounded-[2rem] border border-slate-200/70 bg-white/82 p-6 shadow-sm backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Editar politica publica
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Ajustar estrategia cadastrada
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Atualize o conteudo estruturado mantendo vinculos futuros com indicadores, localidades e relatorios.
        </p>
      </header>

      <PublicPolicyForm
        {...props}
        mode="edit"
        onSubmitSuccess={async (savedPolicyId) => {
          await navigate({
            to: appPaths.publicPolicyDetail,
            params: { policyId: String(savedPolicyId || policyId) },
          })
        }}
      />
    </>
  )
}
