"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Key, Database, Info, WifiOff, Globe, Wifi, Zap, ShieldAlert } from "lucide-react";
import { useHealthUsage } from "@/hooks/useHealthUsage";
import ProjectStatusCard from "@/components/admin/ProjectStatusCard";
import HealthStatusCard from "@/components/admin/HealthStatusCard";
import UsageMetricCard from "@/components/admin/UsageMetricCard";

export default function HealthUsagePage() {
  const { data, vercelData, loading, error, vercelError, refresh, secondsToRefresh } = useHealthUsage();

  // Loading skeletons for premium experience
  const renderSkeletons = () => (
    <div className="space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-32 bg-white border border-primary/5 rounded-3xl w-full"></div>

      {/* Grid Header Skeleton */}
      <div className="space-y-2">
        <div className="h-6 bg-primary/10 rounded-md w-48"></div>
        <div className="h-4 bg-primary/5 rounded-md w-96"></div>
      </div>

      {/* Health Checks Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-36 bg-white border border-primary/5 rounded-2xl w-full"></div>
        ))}
      </div>

      {/* Usage Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-44 bg-white border border-primary/5 rounded-2xl w-full"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-primary transition font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <Link href="/admin">Back to Dashboard</Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary font-serif mt-2">
            Project Health & Usage
          </h1>
          <p className="text-charcoal/60 mt-1 font-medium">
            Monitor connection health status and Sanity Content Lake resource consumption limits.
          </p>
        </div>
      </div>

      {/* Error state: Friendly alert, keeping UI functional */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex gap-3">
            <div className="p-2 rounded-xl bg-white shadow-xs text-rose-600 shrink-0">
              <WifiOff className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-rose-900">
                Connection Degraded
              </h3>
              <p className="text-sm font-semibold opacity-90 mt-1">
                {error}
              </p>
            </div>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="cursor-pointer px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition duration-200 flex items-center gap-2 shrink-0 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Try Reconnecting
          </button>
        </div>
      )}

      {loading && !data ? (
        renderSkeletons()
      ) : data ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Overall Project Status */}
          <ProjectStatusCard
            status={data.overallStatus}
            lastUpdated={data.lastUpdated}
            secondsToRefresh={secondsToRefresh}
            onRefresh={refresh}
            isRefreshing={loading}
          />

          {/* 1. Project Health Status Checkpoints */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-primary font-serif">Project Health</h2>
              <p className="text-xs text-charcoal/60 mt-0.5 font-semibold">
                Connectivity status check for integrated APIs, domains, and messaging relays.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                {
                  name: "Sanity CMS Connection",
                  status: data.health.sanityCms.status,
                  message: data.health.sanityCms.message,
                  details: data.health.sanityCms.details,
                  iconName: "Server",
                },
                {
                  name: "Website Status",
                  status: data.health.website.status,
                  message: data.health.website.message,
                  details: data.health.website.details,
                  iconName: "Globe",
                },
                {
                  name: "Database Connection",
                  status: data.health.database.status,
                  message: data.health.database.message,
                  details: data.health.database.details,
                  iconName: "Database",
                },
                {
                  name: "Email Service Status",
                  status: data.health.emailService.status,
                  message: data.health.emailService.message,
                  details: data.health.emailService.details,
                  iconName: "Mail",
                },
                {
                  name: "WhatsApp Integration",
                  status: data.health.whatsapp.status,
                  message: data.health.whatsapp.message,
                  details: data.health.whatsapp.details,
                  iconName: "MessageSquare",
                },
                {
                  name: "Google Maps API",
                  status: data.health.googleMaps.status,
                  message: data.health.googleMaps.message,
                  details: data.health.googleMaps.details,
                  iconName: "Map",
                },
                {
                  name: "Domain Status",
                  status: data.health.domain.status,
                  message: data.health.domain.message,
                  details: data.health.domain.details,
                  iconName: "Link",
                },
                {
                  name: "SSL Certificate",
                  status: data.health.ssl.status,
                  message: data.health.ssl.message,
                  details: data.health.ssl.details,
                  iconName: "ShieldCheck",
                },
              ]
                .filter((card) => card.message !== "Not Configured")
                .map((card) => (
                  <HealthStatusCard
                    key={card.name}
                    name={card.name}
                    status={card.status}
                    message={card.message}
                    details={card.details}
                    iconName={card.iconName}
                  />
                ))}
            </div>
          </div>

          {/* 2. Sanity Lake Resource Consumption */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-primary font-serif">Sanity Resource Usage</h2>
              <p className="text-xs text-charcoal/60 mt-0.5 font-semibold">
                Resource usage quotas calculated from your active Sanity plan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
              <UsageMetricCard
                name={data.usage.apiRequests.name}
                used={data.usage.apiRequests.used}
                limit={data.usage.apiRequests.limit}
                percentage={data.usage.apiRequests.percentage}
                formattedUsed={data.usage.apiRequests.formattedUsed}
                formattedLimit={data.usage.apiRequests.formattedLimit}
                iconName="TrendingUp"
              />
              <UsageMetricCard
                name={data.usage.cdnRequests.name}
                used={data.usage.cdnRequests.used}
                limit={data.usage.cdnRequests.limit}
                percentage={data.usage.cdnRequests.percentage}
                formattedUsed={data.usage.cdnRequests.formattedUsed}
                formattedLimit={data.usage.cdnRequests.formattedLimit}
                iconName="Zap"
              />
              <UsageMetricCard
                name={data.usage.assetStorage.name}
                used={data.usage.assetStorage.used}
                limit={data.usage.assetStorage.limit}
                percentage={data.usage.assetStorage.percentage}
                formattedUsed={data.usage.assetStorage.formattedUsed}
                formattedLimit={data.usage.assetStorage.formattedLimit}
                iconName="HardDrive"
              />
              <UsageMetricCard
                name={data.usage.bandwidth.name}
                used={data.usage.bandwidth.used}
                limit={data.usage.bandwidth.limit}
                percentage={data.usage.bandwidth.percentage}
                formattedUsed={data.usage.bandwidth.formattedUsed}
                formattedLimit={data.usage.bandwidth.formattedLimit}
                iconName="Wifi"
              />
              <UsageMetricCard
                name={data.usage.documentCount.name}
                used={data.usage.documentCount.used}
                limit={data.usage.documentCount.limit}
                percentage={data.usage.documentCount.percentage}
                formattedUsed={data.usage.documentCount.formattedUsed}
                formattedLimit={data.usage.documentCount.formattedLimit}
                iconName="FileText"
              />
            </div>
          </div>

          {/* 3. Vercel Usage Monitoring */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-t border-primary/5 pt-6">
              <div>
                <h2 className="text-xl font-bold text-primary font-serif">Vercel Usage Monitoring</h2>
                <p className="text-xs text-charcoal/60 mt-0.5 font-semibold">
                  Resource usage limits, edge traffic, and project execution quotas from Vercel.
                </p>
              </div>
              {vercelData && (
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-charcoal/50">Plan:</span>
                  <span className="text-primary bg-primary/10 px-2.5 py-0.5 rounded-full capitalize font-mono text-[10px] font-bold">
                    {vercelData.plan}
                  </span>
                  {vercelData.isFallback && (
                    <span className="text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                      Hobby Fallback Active
                    </span>
                  )}
                </div>
              )}
            </div>

            {vercelError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{vercelError}</span>
              </div>
            )}

            {vercelData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <VercelMetricCard
                  name={vercelData.usage.edgeRequests.name}
                  used={vercelData.usage.edgeRequests.used}
                  limit={vercelData.usage.edgeRequests.limit}
                  percentage={vercelData.usage.edgeRequests.percentage}
                  formattedUsed={vercelData.usage.edgeRequests.formattedUsed}
                  formattedLimit={vercelData.usage.edgeRequests.formattedLimit}
                  iconName="Globe"
                />

                <VercelMetricCard
                  name={vercelData.usage.bandwidth.name}
                  used={vercelData.usage.bandwidth.used}
                  limit={vercelData.usage.bandwidth.limit}
                  percentage={vercelData.usage.bandwidth.percentage}
                  formattedUsed={vercelData.usage.bandwidth.formattedUsed}
                  formattedLimit={vercelData.usage.bandwidth.formattedLimit}
                  iconName="Wifi"
                />

                <VercelMetricCard
                  name={vercelData.usage.functionInvocations.name}
                  used={vercelData.usage.functionInvocations.used}
                  limit={vercelData.usage.functionInvocations.limit}
                  percentage={vercelData.usage.functionInvocations.percentage}
                  formattedUsed={vercelData.usage.functionInvocations.formattedUsed}
                  formattedLimit={vercelData.usage.functionInvocations.formattedLimit}
                  iconName="Zap"
                />
              </div>
            )}

            {/* Vercel Latest Deployment Status Card */}
            {vercelData && (
              <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row gap-6 justify-between lg:items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cream text-primary rounded-xl flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary">Latest Vercel Deployment</h4>
                    {vercelData.deployment.githubCommitMsg && (
                      <p className="font-mono text-xs text-charcoal/70 bg-cream/50 px-2 py-1 rounded border border-primary/5 mt-1 max-w-lg truncate">
                        "{vercelData.deployment.githubCommitMsg}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 md:gap-8 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="text-[11px]">
                      <span className="text-charcoal/50 uppercase tracking-wider block">Deployment Domain</span>
                      <a
                        href={`https://${vercelData.deployment.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-primary font-bold underline hover:text-accent"
                      >
                        {vercelData.deployment.url}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-[11px]">
                      <span className="text-charcoal/50 uppercase tracking-wider block">Completed At</span>
                      <span className="font-mono text-primary font-bold">{vercelData.deployment.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-[11px]">
                      <span className="text-charcoal/50 uppercase tracking-wider block">Deployment Status</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        vercelData.deployment.status === "READY"
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                          : vercelData.deployment.status === "BUILDING"
                          ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-700 border-rose-500/20"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          vercelData.deployment.status === "READY"
                            ? "bg-emerald-500"
                            : vercelData.deployment.status === "BUILDING"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`} />
                        {vercelData.deployment.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* System Properties Metadata */}
          <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row gap-6 justify-between md:items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cream text-primary rounded-xl flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary">System Credentials Configuration</h4>
                <p className="text-xs text-charcoal/60 mt-0.5 font-semibold">
                  Secure server-side credentials initialized from environment variables.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-secondary shrink-0" />
                <div className="text-[11px] font-semibold">
                  <span className="text-charcoal/50 uppercase tracking-wider block">Connected Project ID</span>
                  <span className="font-mono text-primary font-bold">{data.connectedProjectId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-secondary shrink-0" />
                <div className="text-[11px] font-semibold">
                  <span className="text-charcoal/50 uppercase tracking-wider block">Dataset Name</span>
                  <span className="font-mono text-primary font-bold capitalize">{data.datasetName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Subcomponent for Vercel usage metric cards
function VercelMetricCard({
  name,
  percentage,
  formattedUsed,
  formattedLimit,
  iconName,
}: {
  name: string;
  used: number;
  limit: number;
  percentage: number;
  formattedUsed: string;
  formattedLimit: string;
  iconName: "Globe" | "Wifi" | "Zap";
}) {
  let IconComponent = Globe;
  if (iconName === "Wifi") IconComponent = Wifi;
  if (iconName === "Zap") IconComponent = Zap;

  // Health indicator thresholds:
  // Green = under 60%
  // Yellow = 60–85%
  // Red = above 85%
  let theme = {
    progressBg: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    text: "text-emerald-700",
    iconBg: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-500/10 hover:border-emerald-500/30",
    glow: "bg-emerald-500",
    statusLabel: "Healthy",
  };

  if (percentage > 85) {
    theme = {
      progressBg: "bg-rose-500",
      badge: "bg-rose-500/10 text-rose-700 border-rose-500/20",
      text: "text-rose-700",
      iconBg: "bg-rose-50 text-rose-600",
      border: "border-rose-500/10 hover:border-rose-500/30",
      glow: "bg-rose-500",
      statusLabel: "Critical",
    };
  } else if (percentage >= 60) {
    theme = {
      progressBg: "bg-amber-500",
      badge: "bg-amber-500/10 text-amber-700 border-amber-500/20",
      text: "text-amber-700",
      iconBg: "bg-amber-50 text-amber-600",
      border: "border-amber-500/10 hover:border-amber-500/30",
      glow: "bg-amber-500",
      statusLabel: "Warning",
    };
  }

  const barWidth = Math.min(percentage, 100);

  return (
    <div
      className={`bg-white border ${theme.border} rounded-2xl p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col justify-between shadow-xs`}
    >
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
        <span className={theme.text}>{theme.statusLabel}</span>
      </div>
    </div>
  );
}
