"use client";

import React from "react";
import * as Lucide from "lucide-react";

interface UsageMetricCardProps {
  name: string;
  used: number;
  limit: number;
  percentage: number;
  formattedUsed: string;
  formattedLimit: string;
  iconName: string;
}

export default function UsageMetricCard({
  name,
  percentage,
  formattedUsed,
  formattedLimit,
  iconName,
}: UsageMetricCardProps) {
  const IconComponent = (Lucide as any)[iconName] || Lucide.BarChart2;

  // Determine color theme based on percentage
  let theme = {
    progressBg: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    text: "text-emerald-700",
    iconBg: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-500/10 hover:border-emerald-500/30",
    glow: "bg-emerald-500",
  };

  if (percentage >= 95) {
    theme = {
      progressBg: "bg-rose-500",
      badge: "bg-rose-500/10 text-rose-700 border-rose-500/20",
      text: "text-rose-700",
      iconBg: "bg-rose-50 text-rose-600",
      border: "border-rose-500/10 hover:border-rose-500/30",
      glow: "bg-rose-500",
    };
  } else if (percentage >= 80) {
    theme = {
      progressBg: "bg-amber-500",
      badge: "bg-amber-500/10 text-amber-700 border-amber-500/20",
      text: "text-amber-700",
      iconBg: "bg-amber-50 text-amber-600",
      border: "border-amber-500/10 hover:border-amber-500/30",
      glow: "bg-amber-500",
    };
  }

  // Ensure percentage doesn't exceed 100 for visual bar width
  const barWidth = Math.min(percentage, 100);

  return (
    <div
      className={`bg-white border ${theme.border} rounded-2xl p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col justify-between shadow-xs`}
    >
      {/* Decorative Glow */}
      <div
        className={`absolute -right-10 -top-10 w-28 h-28 ${theme.glow} opacity-[0.03] rounded-full blur-xl group-hover:scale-125 transition-transform duration-500`}
      ></div>

      <div>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${theme.iconBg} flex items-center justify-center shrink-0`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-charcoal/60 text-xs font-bold uppercase tracking-wider">
                {name}
              </p>
              <h3 className="text-2xl font-extrabold text-primary mt-1 tracking-tight font-serif">
                {formattedUsed}
              </h3>
            </div>
          </div>

          <span
            className={`text-xs px-2.5 py-0.5 rounded-full border ${theme.badge} font-bold`}
          >
            {percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-cream border border-primary/5 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${theme.progressBg} rounded-full transition-all duration-500`}
              style={{ width: `${barWidth}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-primary/5 text-[11px] font-bold text-charcoal/50">
        <span>LIMIT: {formattedLimit}</span>
        <span className={theme.text}>
          {percentage >= 95 ? "Critical" : percentage >= 80 ? "Approaching Limit" : "Normal"}
        </span>
      </div>
    </div>
  );
}
