"use client";

import React from "react";
import * as Lucide from "lucide-react";

interface HealthStatusCardProps {
  name: string;
  status: "healthy" | "warning" | "error";
  message: string;
  details: string;
  iconName: string;
}

export default function HealthStatusCard({
  name,
  status,
  message,
  details,
  iconName,
}: HealthStatusCardProps) {
  // Dynamically resolve lucide icons
  const IconComponent = (Lucide as any)[iconName] || Lucide.HelpCircle;

  const statusConfigs = {
    healthy: {
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      badge: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
      pulse: "bg-emerald-500",
      iconBg: "bg-emerald-50 text-emerald-600",
      shadow: "hover:shadow-emerald-500/5",
    },
    warning: {
      border: "border-amber-500/20 hover:border-amber-500/40",
      badge: "bg-amber-500/10 text-amber-700 border-amber-500/20",
      pulse: "bg-amber-500",
      iconBg: "bg-amber-50 text-amber-600",
      shadow: "hover:shadow-amber-500/5",
    },
    error: {
      border: "border-rose-500/20 hover:border-rose-500/40",
      badge: "bg-rose-500/10 text-rose-700 border-rose-500/20",
      pulse: "bg-rose-500",
      iconBg: "bg-rose-50 text-rose-600",
      shadow: "hover:shadow-rose-500/5",
    },
  };

  const current = statusConfigs[status] || statusConfigs.healthy;

  return (
    <div
      className={`bg-white border ${current.border} rounded-2xl p-5 hover:shadow-md ${current.shadow} transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-full`}
    >
      {/* Decorative Glow */}
      <div
        className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-current opacity-[0.02] group-hover:scale-125 transition-transform duration-500`}
      ></div>

      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl ${current.iconBg} flex items-center justify-center shrink-0`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary tracking-tight font-sans">
              {name}
            </h4>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider mt-1.5 ${current.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${current.pulse} animate-pulse`}></span>
              {message}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-primary/5">
        <p className="text-xs text-charcoal/70 font-semibold leading-relaxed">
          {details}
        </p>
      </div>
    </div>
  );
}
