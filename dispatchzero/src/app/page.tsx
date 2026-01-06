"use client";

import React, { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Check,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  type GhostLoad,
  GHOST_TARGET_RATE_PER_MILE,
  createGhostFoundLoad,
  ratePerMile,
  stepGhostNegotiation,
} from "@/lib/ghostAgent";

export default function DispatchDashboard() {
  const [earnings, setEarnings] = useState(4250);

  // Mock data for the "Ghost" working in the background
  const [ghostActive, setGhostActive] = useState(true);
  const [negotiations, setNegotiations] = useState<GhostLoad[]>(() => [
    createGhostFoundLoad(),
    createGhostFoundLoad(),
  ]);

  const moneyTrackerLabel = useMemo(() => {
    const d = new Date();
    const day = d.toLocaleDateString(undefined, { weekday: "short" });
    const time = d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day} • ${time}`;
  }, []);

  // Simulate: ghost finds loads + negotiates in the background.
  useEffect(() => {
    if (!ghostActive) return;

    const addInterval = window.setInterval(() => {
      setNegotiations((prev) => {
        const next = [createGhostFoundLoad(), ...prev];
        return next.slice(0, 8);
      });
    }, 6500);

    const negotiateInterval = window.setInterval(() => {
      setNegotiations((prev) => prev.map(stepGhostNegotiation));
    }, 2200);

    return () => {
      window.clearInterval(addInterval);
      window.clearInterval(negotiateInterval);
    };
  }, [ghostActive]);

  const handleAccept = async (load: GhostLoad) => {
    // Save to Firebase FIRST so you don't lose the data.
    try {
      if (!db) {
        alert(
          "Firebase isn't connected yet. Add your keys to .env.local and restart the dev server."
        );
        return;
      }

      await addDoc(collection(db, "accepted_loads"), {
        ...load,
        acceptedAt: serverTimestamp(),
        finalRate: load.offer,
        ratePerMile: ratePerMile(load.offer, load.miles),
      });

      // Only update UI AFTER the write succeeds.
      setEarnings((prev) => prev + load.offer);
      setNegotiations((prev) => prev.filter((n) => n.id !== load.id));
      alert("Saved to Firebase: accepted_loads");
    } catch (e) {
      console.error("Error accepting load: ", e);
      alert("Could not save to Firebase. The load was NOT removed.");
    }
  };

  return (
    <main className="min-h-screen bg-[#070A0F] text-slate-100">
      {/* Cockpit glow + subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_10%,rgba(16,185,129,0.16),transparent_55%),radial-gradient(800px_500px_at_85%_20%,rgba(251,191,36,0.12),transparent_55%),radial-gradient(900px_700px_at_50%_110%,rgba(14,165,233,0.06),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/70" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 md:px-6">
        {/* Money Tracker / Header */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5 shadow-[0_25px_90px_rgba(0,0,0,0.55)] backdrop-blur md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                  <Truck className="h-6 w-6 text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-emerald-400">
                    Night Drive • Ghost Dispatch
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]" />
                    <p className="truncate text-lg font-black text-slate-100 md:text-xl">
                      Hunting: Midwest Lanes
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs uppercase tracking-widest text-slate-500">
                Status • {moneyTrackerLabel}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:min-w-[280px] md:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
                Money Tracker (This Week)
              </p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <p className="font-mono text-4xl font-black leading-none text-emerald-300 drop-shadow-[0_0_18px_rgba(16,185,129,0.28)] md:text-5xl">
                  ${earnings.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-200">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs font-extrabold uppercase tracking-widest">
                    LIVE
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Tip: tap <span className="text-emerald-300">ACCEPT</span> to add
                it.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-bold uppercase tracking-[0.26em] text-slate-500">
                Ghost rules:
              </span>
              <span className="text-emerald-300 font-black">
                ≥ ${GHOST_TARGET_RATE_PER_MILE.toFixed(2)}/mi
              </span>
              <span className="text-slate-500">• auto-counter under target</span>
            </div>

            <button
              type="button"
              onClick={() => setGhostActive((v) => !v)}
              className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 font-black uppercase tracking-widest text-slate-200 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
            >
              {ghostActive ? "Ghost: ON" : "Ghost: OFF"}
            </button>
          </div>
        </div>

        {/* Section header */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <MessageSquare className="h-5 w-5 text-amber-300" />
            Live Negotiations
          </h2>
          <div className="hidden rounded-full border border-slate-800 bg-slate-950/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-400 md:block">
            High-Visibility Mode
          </div>
        </div>

        {/* Negotiations list */}
        <div className="mt-4 grid gap-4">
          <AnimatePresence>
            {negotiations.map((load) => (
              <motion.div
                key={load.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="rounded-3xl border border-slate-800 bg-slate-950/55 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.5)] backdrop-blur"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-black tracking-widest text-amber-300">
                        {load.type}
                      </span>
                      <span className="text-sm text-slate-400">
                        {load.broker}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-emerald-400/90">
                        {load.status}
                      </span>
                    </div>

                    <h3 className="mt-3 truncate text-2xl font-black tracking-tight md:text-3xl">
                      {load.route}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-2">
                      <p className="font-mono text-3xl font-black text-emerald-300 drop-shadow-[0_0_18px_rgba(16,185,129,0.22)] md:text-4xl">
                        ${load.offer.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                        <span className="rounded-full border border-slate-800 bg-black/30 px-3 py-1">
                          {load.miles.toLocaleString()} mi
                        </span>
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                          {ratePerMile(load.offer, load.miles).toFixed(2)}/mi
                        </span>
                        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-amber-200">
                          target {load.targetRatePerMile.toFixed(2)}/mi
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {load.messages.slice(-2).map((m) => (
                        <div
                          key={m.id}
                          className={
                            m.from === "ghost"
                              ? "rounded-2xl border border-emerald-500/15 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                              : "rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-200"
                          }
                        >
                          <span className="mr-2 text-xs font-black uppercase tracking-widest text-slate-500">
                            {m.from === "ghost" ? "Ghost" : "Broker"}
                          </span>
                          {m.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Huge driver-friendly controls */}
                  <div className="grid w-full grid-cols-2 gap-3 md:w-auto md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        setNegotiations((prev) =>
                          prev.filter((n) => n.id !== load.id)
                        )
                      }
                      className="h-20 rounded-2xl border border-slate-700 bg-slate-900/70 text-slate-200 shadow-sm transition-colors hover:border-rose-500/40 hover:bg-rose-900/25 focus:outline-none focus:ring-2 focus:ring-rose-500/60 md:h-[88px] md:w-[170px]"
                      aria-label="Dismiss load"
                    >
                      <span className="flex items-center justify-center gap-3 text-base font-black uppercase tracking-widest">
                        <X className="h-6 w-6 text-rose-400" />
                        PASS
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAccept(load)}
                      className="h-20 rounded-2xl border border-emerald-400/25 bg-emerald-500/90 text-black shadow-[0_0_0_1px_rgba(16,185,129,0.35),0_20px_60px_rgba(16,185,129,0.18)] transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 md:h-[88px] md:w-[220px]"
                    >
                      <span className="flex items-center justify-center gap-3 text-base font-black uppercase tracking-widest">
                        <Check className="h-7 w-7" strokeWidth={4} />
                        ACCEPT
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Security Footer */}
        <div className="mt-10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
          <ShieldCheck className="h-4 w-4" />
          Ghost Mode Encryption Active
        </div>
      </div>
    </main>
  );
}
