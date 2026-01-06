import { MessageSquare, Route, Truck, Wallet } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto w-full max-w-5xl px-6 py-14">
        <header className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              DispatchZero
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Your trucking command center
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Beginner tip: this screen lives in{" "}
              <code className="rounded bg-zinc-900/5 px-1 py-0.5 text-sm dark:bg-white/10">
                src/app/page.tsx
              </code>
              .
            </p>
          </div>

          <div className="hidden rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-700 shadow-sm dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-300 sm:block">
            Next + Tailwind + Lucide
          </div>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            icon={<Truck className="h-5 w-5" />}
            title="Loads"
            subtitle="Create, assign, and track loads."
          />
          <Card
            icon={<Route className="h-5 w-5" />}
            title="Trips"
            subtitle="Stops, ETAs, and delivery status."
          />
          <Card
            icon={<Wallet className="h-5 w-5" />}
            title="Pay"
            subtitle="Miles, rates, and settlements."
          />
          <Card
            icon={<MessageSquare className="h-5 w-5" />}
            title="Messages"
            subtitle="Dispatcher ↔ driver chat."
          />
        </section>
      </main>
    </div>
  );
}

function Card({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
