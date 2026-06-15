"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  const eventDate = new Date("2026-10-13T09:00:00").getTime();

  const calculate = () => {
    const now = new Date().getTime();
    const diff = eventDate - now;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTime(calculate()); // run once after mount

    const timer = setInterval(() => {
      setTime(calculate());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-3 text-center">
      {Object.entries(time).map(([label, value]) => (
        <div key={label}>
          <p className="text-2xl font-bold text-[#E5553C]">{value}</p>
          <p className="text-xs text-gray-500 uppercase">{label}</p>
        </div>
      ))}
    </div>
  );
}