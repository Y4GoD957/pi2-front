import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import logo from '@/assets/logo.png'
import { appPaths } from '@/app/routes/paths'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCircle2,
  X,
} from 'lucide-react'

const navigationItems = [
  {
    label: 'Visao geral',
    to: appPaths.app,
    icon: LayoutDashboard,
    activeOptions: {
      exact: true,
    },
  },
  {
    label: 'Usuario',
    to: appPaths.user,
    icon: UserCircle2,
  },
]

export function AppShell() {
  const { logout, user } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#eef6ff_100%)] text-slate-950">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="size-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="hidden rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 lg:inline-flex"
              onClick={() => setIsSidebarCollapsed((current) => !current)}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="size-5" />
              ) : (
                <ChevronLeft className="size-5" />
              )}
              <span className="sr-only">Alternar sidebar</span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-24 items-center justify-center rounded-2xl bg-white px-3 shadow-sm ring-1 ring-cyan-200">
                <img
                  src={logo}
                  alt="EduCenso"
                  className="h-8 w-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold tracking-[0.18em] text-cyan-900">
                  EDUCENSO
                </p>
                <p className="text-xs text-slate-500">
                  Plataforma analitica educacional
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={appPaths.user}
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
              activeProps={{
                className:
                  'border-cyan-200 bg-cyan-50 text-cyan-900',
              }}
              inactiveProps={{
                className:
                  'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950',
              }}
            >
              <UserCircle2 className="size-4" />
              <span className="hidden sm:inline">Usuario</span>
            </Link>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950"
              onClick={async () => {
                await logout()
                await navigate({ to: appPaths.login })
              }}
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden">
          <aside className="absolute left-4 top-24 h-[calc(100vh-7rem)] w-72 rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
            <div className="flex h-full flex-col p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-[0.18em] text-cyan-300">
                    EDUCENSO
                  </p>
                  <p className="mt-1 text-xs text-slate-300">Navegacao</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-white hover:bg-white/10 hover:text-white"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <X className="size-5" />
                  <span className="sr-only">Fechar menu</span>
                </Button>
              </div>

              <nav className="mt-8 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      activeOptions={item.activeOptions}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition"
                      activeProps={{
                        className:
                          'bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-300/30',
                      }}
                      inactiveProps={{
                        className: 'text-slate-200 hover:bg-white/5',
                      }}
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="mt-1 text-xs text-slate-300">{user.email}</p>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 pb-6 pt-24 sm:px-6 lg:px-8">
        <aside
          className={cn(
            'fixed bottom-4 left-4 top-24 z-30 hidden w-72 overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] transition-all duration-300 ease-out lg:block',
            isSidebarCollapsed
              ? 'pointer-events-none -translate-x-[calc(100%+1rem)] opacity-0'
              : 'translate-x-0 opacity-100',
          )}
        >
          <div className="flex h-full flex-col p-4">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-4 transition-all duration-300 ease-out">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 transition-opacity duration-200">
                Navegacao
              </p>
            </div>

            <nav className="mt-6 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={item.activeOptions}
                    title={item.label}
                    className="group flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm transition-all duration-300 ease-out"
                    activeProps={{
                      className:
                        'bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-300/30',
                    }}
                    inactiveProps={{
                      className: 'text-slate-200 hover:bg-white/5',
                    }}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="whitespace-nowrap transition-all duration-200 ease-out">
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 ease-out">
              <div className="overflow-hidden transition-all duration-200 ease-out">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="mt-1 text-xs text-slate-300">{user.email}</p>
              </div>
            </div>
          </div>
        </aside>

        <section
          className="space-y-6 py-1"
        >
          <Outlet />
        </section>
      </div>
    </main>
  )
}
