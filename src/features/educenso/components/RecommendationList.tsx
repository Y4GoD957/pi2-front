import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PublicPolicyRecommendation } from '@/types/educenso'

interface RecommendationListProps {
  recommendations: PublicPolicyRecommendation[]
}

const emphasisClassNames: Record<
  PublicPolicyRecommendation['emphasis'],
  string
> = {
  education: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  socioeconomic: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  intersectoral: 'border-amber-200 bg-amber-50 text-amber-900',
}

export function RecommendationList({
  recommendations,
}: RecommendationListProps) {
  return (
    <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Recomendacoes iniciais</CardTitle>
        <p className="text-sm text-slate-600">
          Heuristicas isoladas para apoiar a leitura de politica publica.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => (
          <article
            key={recommendation.id}
            className={`rounded-2xl border p-4 ${emphasisClassNames[recommendation.emphasis]}`}
          >
            <h3 className="text-base font-semibold">{recommendation.title}</h3>
            <p className="mt-2 text-sm leading-6">{recommendation.summary}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] opacity-75">
              {recommendation.rationale}
            </p>
          </article>
        ))}
      </CardContent>
    </Card>
  )
}
