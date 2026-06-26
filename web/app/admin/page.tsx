import { client } from "@/lib/sanity";
import Link from "next/link";
import { Compass, BookOpen, Tv, Plus, Calendar, Briefcase, Activity } from "lucide-react";
import { getProjectHealthAndUsage } from "@/lib/healthService";

// Never cache this page — always fetch fresh data from Sanity
export const revalidate = 0;

async function getDashboardData() {
  const fetchOpts = { cache: "no-store" as const };
  const [tripsCount, upcomingToursCount, blogsCount, vlogsCount, collaborationsCount, recentItems] = await Promise.all([
    client.fetch(`count(*[_type == "trip"])`, {}, fetchOpts),
    client.fetch(`count(*[_type == "upcomingTour"])`, {}, fetchOpts),
    client.fetch(`count(*[_type == "blog"])`, {}, fetchOpts),
    client.fetch(`count(*[_type == "vlog"])`, {}, fetchOpts),
    client.fetch(`count(*[_type == "collaboration"])`, {}, fetchOpts),
    client.fetch(
      `
      *[_type in ["trip", "upcomingTour", "blog", "vlog", "collaboration"]] | order(_createdAt desc)[0...5] {
        _id,
        _type,
        title,
        company,
        _createdAt
      }
    `,
      {},
      fetchOpts
    ),
  ]);

  return {
    tripsCount,
    upcomingToursCount,
    blogsCount,
    vlogsCount,
    collaborationsCount,
    recentItems,
  };
}

export default async function AdminDashboard() {
  const { tripsCount, upcomingToursCount, blogsCount, vlogsCount, collaborationsCount, recentItems } = await getDashboardData();
  const healthData = await getProjectHealthAndUsage().catch((e) => {
    console.error("Failed to load health summary on dashboard:", e);
    return null;
  });

  const cards = [
    {
      title: "Trips",
      count: tripsCount,
      icon: Compass,
      bgClass: "bg-primary text-cream shadow-md",
      glowBg: "bg-primary",
      link: "/admin/trips",
      createLink: "/admin/trips/create",
    },
    {
      title: "Upcoming Tours",
      count: upcomingToursCount,
      icon: Calendar,
      bgClass: "bg-emerald-600 text-cream shadow-md",
      glowBg: "bg-emerald-600",
      link: "/admin/upcoming-tours",
      createLink: "/admin/upcoming-tours/create",
    },
    {
      title: "Blogs",
      count: blogsCount,
      icon: BookOpen,
      bgClass: "bg-accent text-primary shadow-md",
      glowBg: "bg-accent",
      link: "/admin/blogs",
      createLink: "/admin/blogs/create",
    },
    {
      title: "Vlogs",
      count: vlogsCount,
      icon: Tv,
      bgClass: "bg-secondary text-cream shadow-md",
      glowBg: "bg-secondary",
      link: "/admin/vlogs",
      createLink: "/admin/vlogs/create",
    },
    {
      title: "Collaborations",
      count: collaborationsCount,
      icon: Briefcase,
      bgClass: "bg-blue-600 text-cream shadow-md",
      glowBg: "bg-blue-600",
      link: "/admin/collaboration",
      createLink: null,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary font-serif">Dashboard</h1>
          <p className="text-charcoal/60 mt-1 font-medium">Overview of Explorush content management.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-white hover:bg-primary/5 text-primary rounded-xl transition duration-200 border border-primary/10 text-sm font-semibold shadow-sm"
          >
            View Live Site
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white border border-primary/10 rounded-2xl p-6 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group shadow-sm flex flex-col justify-between"
            >
              {/* Decorative Gradient Background */}
              <div
                className={`absolute -right-10 -top-10 w-32 h-32 ${card.glowBg} opacity-10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500`}
              ></div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-charcoal/60 text-sm font-semibold uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h3 className="text-4xl font-extrabold text-primary mt-2 tracking-tight font-serif">
                    {card.count}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl ${card.bgClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <div className="flex gap-3 mt-6 border-t border-primary/5 pt-4">
                <Link
                  href={card.link}
                  className="text-xs text-primary hover:text-secondary font-bold transition"
                >
                  Manage {card.title} →
                </Link>
                {card.createLink && (
                  <>
                    <span className="text-primary/15">|</span>
                    <Link
                      href={card.createLink}
                      className="text-xs text-secondary hover:text-primary font-bold transition flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> New
                    </Link>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Items Column */}
        <div className="lg:col-span-2 space-y-6">
          {healthData && (
            <div
              className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-sm ${
                healthData.overallStatus === "error"
                  ? "bg-rose-500/5 border-rose-500/25 text-rose-900"
                  : healthData.overallStatus === "warning"
                  ? "bg-amber-500/5 border-amber-500/25 text-amber-900"
                  : "bg-emerald-500/5 border-emerald-500/25 text-emerald-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-white shadow-xs shrink-0 flex items-center justify-center ${
                  healthData.overallStatus === "error"
                    ? "text-rose-600"
                    : healthData.overallStatus === "warning"
                    ? "text-amber-600"
                    : "text-emerald-600"
                }`}>
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Project Health</span>
                    <span className={`w-2 h-2 rounded-full ${
                      healthData.overallStatus === "error"
                        ? "bg-rose-500 animate-ping"
                        : healthData.overallStatus === "warning"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`} />
                  </div>
                  <p className="text-sm font-extrabold tracking-tight mt-0.5">
                    {healthData.overallStatus === "error"
                      ? "Critical: Limit exceeded or CMS offline"
                      : healthData.overallStatus === "warning"
                      ? "Warning: Approaching resource quotas"
                      : "All systems healthy and active"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-charcoal/70">
                <div className="hidden md:block">
                  Docs: <span className="font-mono font-bold text-primary">{healthData.usage.documentCount.formattedUsed}</span>
                  <span className="text-charcoal/30 mx-2">|</span>
                  Assets: <span className="font-mono font-bold text-primary">{healthData.usage.assetStorage.formattedUsed}</span>
                </div>
                <Link
                  href="/admin/health-usage"
                  className="px-3.5 py-1.5 bg-white border border-primary/10 hover:border-primary/20 text-primary hover:text-secondary rounded-xl font-bold shadow-xs transition text-xs shrink-0"
                >
                  View Health Details →
                </Link>
              </div>
            </div>
          )}

          {/* Recent Entries */}
          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-primary font-serif mb-4">Recent Entries</h2>
          {recentItems.length === 0 ? (
            <p className="text-charcoal/50 text-sm py-4">No content has been created yet.</p>
          ) : (
            <div className="space-y-4">
               {recentItems.map((item: any) => {
                let badgeColor = "bg-primary/10 text-primary border-primary/20";
                if (item._type === "blog")
                  badgeColor = "bg-accent/25 text-primary border-accent/40";
                if (item._type === "vlog")
                  badgeColor = "bg-secondary/15 text-primary border-secondary/30";
                if (item._type === "upcomingTour")
                  badgeColor = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
                if (item._type === "collaboration")
                  badgeColor = "bg-blue-500/10 text-blue-700 border-blue-500/20";

                return (
                  <div
                    key={item._id}
                    className="flex justify-between items-center p-4 rounded-xl bg-cream/40 border border-primary/5 hover:border-primary/15 hover:bg-cream/70 transition"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-primary">
                        {item._type === "collaboration" ? `Collab: ${item.company}` : item.title}
                      </h4>
                      <p className="text-xs text-charcoal/60 mt-1 font-medium">
                        Created on {new Date(item._createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border ${badgeColor} capitalize font-semibold`}
                    >
                      {item._type === "upcomingTour"
                        ? "Upcoming Tour"
                        : item._type === "collaboration"
                        ? "Collaboration"
                        : item._type}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          </div>
        </div>

        {/* Quick Actions & System Info */}
        <div className="space-y-6">
          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-primary font-serif mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/admin/trips/create"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-cream/40 border border-primary/5 hover:border-primary/15 hover:bg-cream/70 text-sm text-charcoal hover:text-primary transition font-semibold"
              >
                <span>Add New Trip Adventure</span>
                <Plus className="w-4 h-4 text-primary" />
              </Link>
              <Link
                href="/admin/upcoming-tours/create"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-cream/40 border border-primary/5 hover:border-primary/15 hover:bg-cream/70 text-sm text-charcoal hover:text-primary transition font-semibold"
              >
                <span>Add Upcoming Tour / Event</span>
                <Plus className="w-4 h-4 text-primary" />
              </Link>
              <Link
                href="/admin/blogs/create"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-cream/40 border border-primary/5 hover:border-primary/15 hover:bg-cream/70 text-sm text-charcoal hover:text-primary transition font-semibold"
              >
                <span>Write New Blog Post</span>
                <Plus className="w-4 h-4 text-primary" />
              </Link>
              <Link
                href="/admin/vlogs/create"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-cream/40 border border-primary/5 hover:border-primary/15 hover:bg-cream/70 text-sm text-charcoal hover:text-primary transition font-semibold"
              >
                <span>Upload New Vlog Link</span>
                <Plus className="w-4 h-4 text-primary" />
              </Link>
            </div>
          </div>

          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-primary font-serif mb-4">CMS Connection</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-charcoal/60">Dataset</span>
                <span className="text-charcoal font-mono">production</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-charcoal/60">API Status</span>
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}