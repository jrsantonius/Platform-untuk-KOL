"use client";

import { useEffect } from "react";

export default function SchedulerInit() {
  useEffect(() => {
    fetch("/api/init").catch(console.error);
  }, []);
  return null;
}
