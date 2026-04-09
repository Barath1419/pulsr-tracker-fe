"use client";

import { useEffect, useState } from "react";

function formatTime(date: Date): string {
  return [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function useCurrentTime() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  const [date, setDate] = useState(() => formatDate(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(formatTime(now));
      setDate(formatDate(now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { time, date };
}
