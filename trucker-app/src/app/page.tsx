export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Trucker App</h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            This is your starter home screen. Edit{" "}
            <code className="rounded bg-zinc-900/5 px-1 py-0.5 text-sm dark:bg-white/10">
              src/app/page.tsx
            </code>{" "}
            to build your dispatch + driving workflow.
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-zinc-950">
            <h2 className="text-lg font-medium">Loads</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Create, assign, and track loads.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-zinc-950">
            <h2 className="text-lg font-medium">Trips</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Route + stops, ETA, and delivery status.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-zinc-950">
            <h2 className="text-lg font-medium">Hours (HOS)</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Track on-duty, driving, and breaks.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-zinc-950">
            <h2 className="text-lg font-medium">Messages</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Simple chat between dispatcher and driver.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
