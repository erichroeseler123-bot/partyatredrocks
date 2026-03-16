"use client";

import { useEffect, useState } from "react";

const TIMEZONE = "America/Denver";

function getTimeLabel() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());
}

export function GuideLocalTime() {
  const [timeLabel, setTimeLabel] = useState(getTimeLabel);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLabel(getTimeLabel());
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  return <span>{timeLabel}</span>;
}

