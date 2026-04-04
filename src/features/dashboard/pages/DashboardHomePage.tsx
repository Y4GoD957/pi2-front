import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardHomePage() {
  return (
    <>
      <header className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Base inicial
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Painel principal do EduCenso
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Esta e a estrutura base apos o login. A partir daqui voce pode
          conectar dashboards, comparativos regionais, matriz Likert e
          relatorios salvos.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="border-white/70 bg-white/75 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Dashboards</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Area reservada para indicadores educacionais e socioeconomicos por
            localidade e ano.
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/75 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Comparativos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Espaco para comparacao entre municipios, estados e recortes
            temporais.
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/75 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Relatorios</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Bloco inicial para listar relatorios salvos pelo usuario.
          </CardContent>
        </Card>
      </div>
    </>
  )
}
