"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

interface ProjectStatusCardProps {
  status: "healthy" | "warning" | "error";
  lastUpdated: string;
  secondsToRefresh: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function ProjectStatusCard({
  status,
  lastUpdated,
  secondsToRefresh,
  onRefresh,
  isRefreshing,
}: ProjectStatusCardProps) {
  const config = {
    healthy: {
      color: "text-emerald-600 bg-emerald-50 border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-800/40",
      indicatorColor: "bg-emerald-500",
      icon: CheckCircle2,
      title: "Project Status: Healthy",
      description: "All core integrations and system resource usages are within normal operating ranges.",
      badgeText: "Healthy",
      glowColor: "from-emerald-500/10 to-transparent",
    },
    warning: {
      color: "text-amber-600 bg-amber-50 border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-800/40",
      indicatorColor: "bg-amber-500",
      icon: AlertTriangle,
      title: "Project Status: Warning",
      description: "One or more services are unconfigured or resource usages have crossed the warning threshold (80%).",
      badgeText: "Warning",
      glowColor: "from-amber-500/10 to-transparent",
    },
    error: {
      color: "text-rose-600 bg-rose-50 border-rose-200/60 dark:bg-rose-950/20 dark:border-rose-800/40",
      indicatorColor: "bg-rose-500",
      icon: AlertCircle,
      title: "Project Status: Critical",
      description: "A critical integration is offline or a resource limit has exceeded the maximum quota (95%+).",
      badgeText: "Critical",
      glowColor: "from-rose-500/10 to-transparent",
    },
  };

  const current = config[status] || config.healthy;
  const StatusIcon = current.icon;

  const minutes = Math.floor(secondsToRefresh / 60);
  const seconds = secondsToRefresh % 60;
  const countdownStr = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className={`relative overflow-hidden border rounded-3xl p-6 md:p-8 transition-all duration-300 shadow-sm ${current.color}`}>
      {/* Decorative Glow */}
      <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${current.glowColor} rounded-full blur-3xl opacity-60`}></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0`}>
            <StatusIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-serif font-extrabold tracking-tight">
                {current.title}
              </h2>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/80 shadow-xs border border-current/10">
                <span className={`w-2 h-2 rounded-full ${current.indicatorColor} animate-pulse`}></span>
                {current.badgeText}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium opacity-90 max-w-2xl leading-relaxed">
              {current.description}
            </p>
          </div>
        </div>

        {/* Action and Timing Info */}
        <div className="flex flex-wrap items-center gap-4 shrink-0 border-t border-current/10 md:border-t-0 pt-4 md:pt-0">
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Last Updated</p>
            <p className="text-sm font-extrabold font-mono mt-0.5">{lastUpdated}</p>
          </div>

          <div className="h-8 w-px bg-current/20 hidden sm:block"></div>

          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Auto Refresh In</p>
            <p className="text-sm font-extrabold font-mono mt-0.5">{countdownStr}</p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`cursor-pointer px-5 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 border border-current/15 text-charcoal`}
          >
            <svg
              className={`w-4 h-4 text-primary ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18v3"
              />
            </svg>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
}
