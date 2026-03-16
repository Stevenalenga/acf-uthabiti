"use client";

import { useEffect, useState } from "react";

export default function StatCounter({ end, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = end / (duration / 20);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 20);

    return () => clearInterval(counter);
  }, [end]);

  return (
    <div className="text-center">
      <p className="text-3xl font-extrabold text-[#E5553C]">{count}+</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}