"use client";

import { useEffect, useState } from "react";

/** Event start in Africa/Nairobi (UTC+3). */
const EVENT_START_MS = new Date("2026-10-13T09:00:00+03:00").getTime();

function calculate() {
  const diff = EVENT_START_MS - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    ended: false,
  };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

/**
 * @param {"hero" | "card" | "banner"} [variant]
 */
export default function Countdown({ variant = "card" }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(calculate());
    const timer = setInterval(() => setTime(calculate()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <div
        className={
          variant === "banner"
            ? "h-10"
            : "h-20 animate-pulse rounded-xl bg-orange-50"
        }
        aria-hidden
      />
    );
  }

  if (time.ended) {
    return (
      <p
        className={
          variant === "banner"
            ? "text-center text-sm font-semibold text-white"
            : "text-center text-base font-semibold text-[#E5553C]"
        }
      >
        The forum is underway
      </p>
    );
  }

  const units = [
    { key: "days", label: "Days", value: time.days },
    { key: "hours", label: "Hours", value: time.hours },
    { key: "minutes", label: "Mins", value: time.minutes },
    { key: "seconds", label: "Secs", value: time.seconds },
  ];

  if (variant === "banner") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-white">
        <span className="text-xs sm:text-sm font-medium uppercase tracking-wide text-white/90">
          Event starts in
        </span>
        <div className="flex items-center gap-2 sm:gap-3">
          {units.map((unit, i) => (
            <span key={unit.key} className="flex items-baseline gap-1">
              {i > 0 && (
                <span className="text-white/50 font-bold mr-1" aria-hidden>
                  :
                </span>
              )}
              <span className="tabular-nums text-base sm:text-lg font-bold leading-none">
                {unit.key === "days" ? unit.value : pad(unit.value)}
              </span>
              <span className="text-[10px] sm:text-xs uppercase text-white/80">
                {unit.label}
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className="w-full max-w-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#E5553C]">
          Countdown to ACF Mombasa 2026
        </p>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {units.map((unit) => (
            <div
              key={unit.key}
              className="rounded-xl border border-orange-100 bg-[#FFECEA] px-2 py-3 sm:py-4 text-center shadow-sm"
            >
              <p className="tabular-nums text-2xl sm:text-3xl xl:text-4xl font-extrabold text-[#E5553C] leading-none">
                {unit.key === "days" ? unit.value : pad(unit.value)}
              </p>
              <p className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-600">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
      {units.map((unit) => (
        <div
          key={unit.key}
          className="rounded-lg bg-[#FFECEA] px-2 py-3"
        >
          <p className="tabular-nums text-xl sm:text-2xl font-bold text-[#E5553C] leading-none">
            {unit.key === "days" ? unit.value : pad(unit.value)}
          </p>
          <p className="mt-1.5 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}
