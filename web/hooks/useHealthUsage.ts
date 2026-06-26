import { useState, useEffect, useCallback, useRef } from "react";
import { HealthUsageData } from "@/lib/healthService";

export function useHealthUsage() {
  const [data, setData] = useState<HealthUsageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [secondsToRefresh, setSecondsToRefresh] = useState<number>(300);

  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await fetch("/api/admin/sanity-usage");
      if (!res.ok) {
        throw new Error(`Failed to fetch: HTTP ${res.status}`);
      }
      const json = await res.json();
      if (json.success === false) {
        throw new Error(json.error || "Failed to load metrics");
      }
      setData(json);
    } catch (err: any) {
      console.error("[useHealthUsage ERROR]", err);
      setError(err.message || "Failed to retrieve project status. Sanity Management Token or API may be offline.");
    } finally {
      setLoading(false);
      setSecondsToRefresh(300); // Reset timer
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle countdown interval
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setSecondsToRefresh((prev) => {
        if (prev <= 1) {
          fetchData(); // Trigger background refresh
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    secondsToRefresh,
  };
}
