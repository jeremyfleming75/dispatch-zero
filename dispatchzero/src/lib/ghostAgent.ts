export const GHOST_TARGET_RATE_PER_MILE = 2.5;

export type GhostMessage = {
  id: string;
  at: number; // epoch ms
  from: "ghost" | "broker";
  text: string;
};

export type GhostLoad = {
  id: string;
  broker: string;
  route: string;
  type: string;
  miles: number;
  offer: number; // current offer (gross)
  status: string;
  targetRatePerMile: number;
  counterOffer?: number;
  messages: GhostMessage[];
  createdAt: number;
  phase: "found" | "negotiating" | "meets_target";
};

const ROUTES = [
  { route: "Chicago → Dallas", miles: 967 },
  { route: "Gary → Laredo", miles: 1350 },
  { route: "Columbus → Atlanta", miles: 565 },
  { route: "St. Louis → Nashville", miles: 309 },
  { route: "Detroit → Kansas City", miles: 780 },
  { route: "Indianapolis → Houston", miles: 1090 },
  { route: "Milwaukee → Memphis", miles: 728 },
  { route: "Minneapolis → Denver", miles: 915 },
];

const BROKERS = [
  "TQL (Mike)",
  "C.H. Robinson",
  "DAT One (Board)",
  "JB Hunt 360",
  "XPO Logistics",
  "Echo Global",
  "RXO (Broker Desk)",
];

const EQUIPMENT = ["Dry Van", "Reefer", "Power Only", "Flatbed"] as const;

function roundTo(value: number, increment: number) {
  return Math.round(value / increment) * increment;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pick<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function ratePerMile(offer: number, miles: number) {
  if (!miles) return 0;
  return offer / miles;
}

export function computeCounterOffer(miles: number, targetRatePerMile: number) {
  // Dispatchers typically counter in clean increments.
  const desired = miles * targetRatePerMile;
  return roundTo(desired, 25);
}

export function createGhostFoundLoad(): GhostLoad {
  const { route, miles } = pick(ROUTES);
  const broker = pick(BROKERS);
  const type = pick(EQUIPMENT);

  // Generate an opening offer near the target, sometimes under.
  const target = GHOST_TARGET_RATE_PER_MILE;
  const targetGross = miles * target;
  const variance = (Math.random() - 0.55) * 0.35; // slightly biased under
  const offer = roundTo(targetGross * (1 + variance), 25);

  const rpm = ratePerMile(offer, miles);
  const meets = rpm >= target;
  const createdAt = Date.now();

  const load: GhostLoad = {
    id: newId("load"),
    broker,
    route,
    type,
    miles,
    offer,
    status: meets ? "Meets target" : "Negotiating…",
    targetRatePerMile: target,
    counterOffer: meets ? undefined : computeCounterOffer(miles, target),
    messages: [],
    createdAt,
    phase: meets ? "meets_target" : "negotiating",
  };

  const opener: GhostMessage = {
    id: newId("msg"),
    at: createdAt,
    from: "broker",
    text: `Rate request: $${offer.toLocaleString()} on ${miles} mi (${rpm.toFixed(
      2
    )}/mi).`,
  };

  const ghostReply: GhostMessage | null = meets
    ? {
        id: newId("msg"),
        at: createdAt + 300,
        from: "ghost",
        text: `That's workable. Holding at $${offer.toLocaleString()} (≥ $${target.toFixed(
          2
        )}/mi).`,
      }
    : {
        id: newId("msg"),
        at: createdAt + 300,
        from: "ghost",
        text: `Too light. Need $${load.counterOffer!.toLocaleString()} to hit $${target.toFixed(
          2
        )}/mi. Can you do it?`,
      };

  load.messages = ghostReply ? [opener, ghostReply] : [opener];
  return load;
}

export function stepGhostNegotiation(load: GhostLoad): GhostLoad {
  if (load.phase !== "negotiating") return load;

  const now = Date.now();
  const target = load.targetRatePerMile;
  const counter = load.counterOffer ?? computeCounterOffer(load.miles, target);

  // Broker response: sometimes accepts counter, sometimes bumps offer.
  const acceptChance = clamp(0.22 + (ratePerMile(load.offer, load.miles) - target) * 0.6, 0.12, 0.55);
  const accepts = Math.random() < acceptChance;

  if (accepts) {
    const acceptedOffer = Math.max(load.offer, counter);
    return {
      ...load,
      offer: acceptedOffer,
      status: "Counter accepted",
      phase: "meets_target",
      messages: load.messages.concat({
        id: newId("msg"),
        at: now,
        from: "broker",
        text: `Ok — approved at $${acceptedOffer.toLocaleString()}. Send it.`,
      }),
    };
  }

  // Otherwise broker nudges upward a bit.
  const bump = roundTo(load.miles * (0.05 + Math.random() * 0.15), 25); // +$0.05–$0.20/mi
  const nextOffer = load.offer + bump;
  const nextRpm = ratePerMile(nextOffer, load.miles);

  const brokerMsg: GhostMessage = {
    id: newId("msg"),
    at: now,
    from: "broker",
    text: `Best I can do is $${nextOffer.toLocaleString()} (${nextRpm.toFixed(
      2
    )}/mi).`,
  };

  // Ghost re-counters if still under target.
  if (nextRpm < target) {
    const ghostMsg: GhostMessage = {
      id: newId("msg"),
      at: now + 250,
      from: "ghost",
      text: `Still short. I can cover it today at $${counter.toLocaleString()}.`,
    };

    return {
      ...load,
      offer: nextOffer,
      counterOffer: counter,
      status: "Countering…",
      messages: load.messages.concat([brokerMsg, ghostMsg]),
    };
  }

  return {
    ...load,
    offer: nextOffer,
    status: "Meets target",
    phase: "meets_target",
    messages: load.messages.concat({
      id: newId("msg"),
      at: now,
      from: "broker",
      text: `Alright — $${nextOffer.toLocaleString()} works.`,
    }),
  };
}

