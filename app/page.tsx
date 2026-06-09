import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-lg text-white shadow-sm">
            🎯
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Sporty Target
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Schedule your sport practices
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6">
        <Dashboard />
      </main>
    </div>
  );
}
