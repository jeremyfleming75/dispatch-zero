"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  ChevronRight,
  Compass,
  Fuel,
  Gauge,
  MapPinned,
  Moon,
  Radio,
  Satellite,
  ShieldCheck,
  Signal,
  Sparkles,
  Truck,
  Wifi,
} from "lucide-react";
import type { ReactNode } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Panel({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("dz-panel rounded-2xl p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon ? (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-[var(--dz-accent)] ring-1 ring-white/10">
              {icon}
            </span>
          ) : null}
          <div className="text-sm font-semibold tracking-wide">{title}</div>
        </div>
        <div className="text-xs dz-text-muted font-mono">LIVE</div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
      <span className="text-[var(--dz-accent)]">{icon}</span>
      <span className="text-xs dz-text-muted">{label}</span>
      <span className="text-xs font-semibold text-[var(--dz-fg)]">{value}</span>
    </div>
  );
}

function Progress({
  value,
  tone = "accent",
}: {
  value: number;
  tone?: "accent" | "warn" | "danger";
}) {
  const cl =
    tone === "warn"
      ? "bg-[var(--dz-warn)]"
      : tone === "danger"
        ? "bg-[var(--dz-danger)]"
        : "bg-[var(--dz-accent)]";
  return (
    <div className="h-2 w-full rounded-full bg-white/5 ring-1 ring-white/10">
      <div
        className={cn("h-2 rounded-full", cl)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

const nav = [
  { label: "Dashboard", icon: <Gauge className="h-4 w-4" /> },
  { label: "Loads", icon: <Truck className="h-4 w-4" /> },
  { label: "Route", icon: <Compass className="h-4 w-4" /> },
  { label: "Comms", icon: <Radio className="h-4 w-4" /> },
  { label: "Safety", icon: <ShieldCheck className="h-4 w-4" /> },
];

export function CockpitDashboard() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[540px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),rgba(34,211,238,0.00)_55%)] blur-2xl" />
        <div className="absolute -bottom-44 right-[-10%] h-[520px] w-[760px] rounded-full bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.18),rgba(96,165,250,0.00)_55%)] blur-2xl" />
        <div className="dz-grid absolute inset-0 opacity-70" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-6 sm:px-6">
        {/* Top status strip */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="dz-panel flex items-center justify-between rounded-2xl px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_0_24px_rgba(34,211,238,0.14)]">
              <Sparkles className="h-5 w-5 text-[var(--dz-accent)]" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide">
                DispatchZero
              </div>
              <div className="text-xs dz-text-muted font-mono">
                Cockpit • {time}
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <StatPill icon={<Signal className="h-4 w-4" />} label="Cell" value="5G" />
            <StatPill icon={<Wifi className="h-4 w-4" />} label="Wi‑Fi" value="ON" />
            <StatPill
              icon={<BatteryCharging className="h-4 w-4" />}
              label="Power"
              value="92%"
            />
            <StatPill
              icon={<Satellite className="h-4 w-4" />}
              label="GPS"
              value="LOCK"
            />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">
            <Moon className="h-4 w-4 text-[var(--dz-accent)]" />
            <span className="text-xs font-medium">Dark cockpit</span>
          </div>
        </motion.header>

        {/* Main layout */}
        <div className="mt-6 grid flex-1 grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
          {/* Left nav */}
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            className="dz-panel rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs dz-text-muted font-mono">SYSTEM</div>
              <div className="text-xs font-semibold text-[var(--dz-accent)]">
                READY
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {nav.map((item, idx) => {
                const active = idx === 0;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={cn(
                      "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition",
                      active
                        ? "bg-white/8 ring-1 ring-white/14 shadow-[0_0_0_1px_rgba(34,211,238,0.14),0_0_30px_rgba(34,211,238,0.10)]"
                        : "hover:bg-white/6 ring-1 ring-transparent hover:ring-white/10"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 transition",
                          active
                            ? "bg-[rgba(34,211,238,0.12)] ring-[rgba(34,211,238,0.20)] text-[var(--dz-accent)]"
                            : "bg-white/5 ring-white/10 text-[var(--dz-muted)] group-hover:text-[var(--dz-fg)]"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className={cn("text-sm", active ? "font-semibold" : "")}>
                        {item.label}
                      </span>
                    </span>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition",
                        active
                          ? "text-[var(--dz-accent)]"
                          : "text-white/25 group-hover:text-white/45"
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Safety monitor</div>
                <Activity className="h-4 w-4 text-[var(--dz-accent)]" />
              </div>
              <div className="mt-2 text-xs dz-text-muted">
                No critical alerts. Driver status nominal.
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-[var(--dz-accent)] shadow-[0_0_20px_rgba(34,211,238,0.35)]" />
                <span className="text-xs font-mono dz-text-muted">HEARTBEAT OK</span>
              </div>
            </div>
          </motion.aside>

          {/* Dashboard panels */}
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
            className="grid grid-cols-1 gap-5 lg:grid-cols-2"
          >
            <Panel
              title="Active load"
              icon={<Truck className="h-5 w-5" />}
              className="lg:col-span-2"
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
                  <div className="text-xs dz-text-muted">Load ID</div>
                  <div className="mt-1 font-mono text-sm">DZ-04821</div>
                  <div className="mt-3 text-xs dz-text-muted">Status</div>
                  <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-[rgba(34,211,238,0.10)] px-3 py-1 text-xs font-semibold text-[var(--dz-accent)] ring-1 ring-[rgba(34,211,238,0.18)]">
                    En route
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--dz-accent)]" />
                  </div>
                </div>

                <div className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
                  <div className="text-xs dz-text-muted">Route</div>
                  <div className="mt-1 text-sm font-semibold">
                    Amarillo, TX → Denver, CO
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs dz-text-muted">
                    <MapPinned className="h-4 w-4 text-[var(--dz-accent-2)]" />
                    I‑25 North • Clear
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs dz-text-muted">
                      <span>Progress</span>
                      <span className="font-mono">62%</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={62} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
                  <div className="text-xs dz-text-muted">ETA</div>
                  <div className="mt-1 text-2xl font-semibold">03:18</div>
                  <div className="mt-2 text-xs dz-text-muted">
                    Arrival window: 18:40–19:10
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <AlertTriangle className="h-4 w-4 text-[var(--dz-warn)]" />
                    <span className="dz-text-muted">
                      Wind advisory near Pueblo.
                    </span>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Fuel & range" icon={<Fuel className="h-5 w-5" />}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs dz-text-muted">Fuel level</div>
                    <div className="mt-1 text-lg font-semibold">41%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs dz-text-muted">Range</div>
                    <div className="mt-1 font-mono text-sm">312 mi</div>
                  </div>
                </div>
                <Progress value={41} tone="warn" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/4 p-3 ring-1 ring-white/10">
                    <div className="text-xs dz-text-muted">Avg MPG</div>
                    <div className="mt-1 font-mono text-sm">7.4</div>
                  </div>
                  <div className="rounded-xl bg-white/4 p-3 ring-1 ring-white/10">
                    <div className="text-xs dz-text-muted">Next stop</div>
                    <div className="mt-1 text-sm font-semibold">Colorado Springs</div>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Comms" icon={<Radio className="h-5 w-5" />}>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-white/4 p-3 ring-1 ring-white/10">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                      <Satellite className="h-4 w-4 text-[var(--dz-accent)]" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">Dispatcher link</div>
                      <div className="text-xs dz-text-muted font-mono">
                        LAT 38.83 • LON -104.82
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[var(--dz-accent)]">
                    SECURE
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/4 p-3 ring-1 ring-white/10">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                      <Signal className="h-4 w-4 text-[var(--dz-accent-2)]" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">Network</div>
                      <div className="text-xs dz-text-muted">5G • 18ms RTT</div>
                    </div>
                  </div>
                  <div className="text-xs dz-text-muted font-mono">UP</div>
                </div>
              </div>
            </Panel>

            <Panel title="Navigation" icon={<Compass className="h-5 w-5" />}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs dz-text-muted">Heading</div>
                    <div className="mt-1 text-lg font-semibold">NNE</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs dz-text-muted">Speed</div>
                    <div className="mt-1 font-mono text-sm">64 mph</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Next maneuver</div>
                    <div className="text-xs dz-text-muted font-mono">4.6 mi</div>
                  </div>
                  <div className="mt-2 text-xs dz-text-muted">
                    Keep left to stay on I‑25 N (toward Castle Rock)
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/4 p-3 ring-1 ring-white/10">
                    <div className="text-xs dz-text-muted">Traffic</div>
                    <div className="mt-1 text-sm font-semibold">Light</div>
                  </div>
                  <div className="rounded-xl bg-white/4 p-3 ring-1 ring-white/10">
                    <div className="text-xs dz-text-muted">Weather</div>
                    <div className="mt-1 text-sm font-semibold">Clear</div>
                  </div>
                </div>
              </div>
            </Panel>
          </motion.main>
        </div>
      </div>
    </div>
  );
}

