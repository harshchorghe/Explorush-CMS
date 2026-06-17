import { client } from "@/lib/sanity";
import Link from "next/link";
import { Compass, BookOpen, Tv, Plus } from "lucide-react";

// Never cache this page — always fetch fresh data from Sanity
export const revalidate = 0;

async function getDashboardData() {
  const fetchOpts = { cache: "no-store" as const };
  const [tripsCount, blogsCount, vlogsCount, recentItems] = await Promise.all([
    client.fetch(`count(*[_type == "trip"])`, {}, fetchOpts),
    client.fetch(`count(*[_type == "blog"])`, {}, fetchOpts),
    client.fetch(`count(*[_type == "vlog"])`, {}, fetchOpts),
    client.fetch(
      `
      *[_type in ["trip", "blog", "vlog"]] | order(_createdAt desc)[0...5] {
        _id,
        _type,
        title,
        _createdAt
      }
    `,
      {},
      fetchOpts
    ),
  ]);

  return {
    tripsCount,
    blogsCount,
    vlogsCount,
    recentItems,
  };
}

export default async function AdminDashboard() {
  const { tripsCount, blogsCount, vlogsCount, recentItems } = await getDashboardData();

  const cards = [
    {
      title: "Trips",
      count: tripsCount,
      icon: Compass,
      color: "from-cyan-500 to-blue-500",
      link: "/admin/trips",
      createLink: "/admin/trips/create",
    },
    {
      title: "Blogs",
      count: blogsCount,
      icon: BookOpen,
      color: "from-purple-500 to-indigo-500",
      link: "/admin/blogs",
      createLink: "/admin/blogs/create",
    },
    {
      title: "Vlogs",
      count: vlogsCount,
      icon: Tv,
      color: "from-rose-500 to-pink-500",
      link: "/admin/vlogs",
      createLink: "/admin/vlogs/create",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of Explorush content management.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition duration-200 border border-slate-700 text-sm font-medium"
          >
            View Live Site
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Decorative Gradient Background */}
              <div
                className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500`}
              ></div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h3 className="text-4xl font-extrabold text-white mt-2 tracking-tight">
                    {card.count}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <div className="flex gap-3 mt-6 border-t border-slate-800/80 pt-4">
                <Link
                  href={card.link}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition"
                >
                  Manage {card.title} →
                </Link>
                <span className="text-slate-700">|</span>
                <Link
                  href={card.createLink}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> New
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Items */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Recent Entries</h2>
          {recentItems.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">No content has been created yet.</p>
          ) : (
            <div className="space-y-4">
              {recentItems.map((item: any) => {
                let badgeColor = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
                if (item._type === "blog")
                  badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";
                if (item._type === "vlog")
                  badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";

                return (
                  <div
                    key={item._id}
                    className="flex justify-between items-center p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-750 transition"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Created on {new Date(item._createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border ${badgeColor} capitalize font-medium`}
                    >
                      {item._type}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions & System Info */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/admin/trips/create"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-750 hover:bg-slate-800/20 text-sm text-slate-300 hover:text-white transition font-medium"
              >
                <span>Add New Trip Adventure</span>
                <Plus className="w-4 h-4 text-emerald-400" />
              </Link>
              <Link
                href="/admin/blogs/create"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-750 hover:bg-slate-800/20 text-sm text-slate-300 hover:text-white transition font-medium"
              >
                <span>Write New Blog Post</span>
                <Plus className="w-4 h-4 text-purple-400" />
              </Link>
              <Link
                href="/admin/vlogs/create"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-750 hover:bg-slate-800/20 text-sm text-slate-300 hover:text-white transition font-medium"
              >
                <span>Upload New Vlog Link</span>
                <Plus className="w-4 h-4 text-rose-400" />
              </Link>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">CMS Connection</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Dataset</span>
                <span className="text-slate-200 font-mono">production</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">API Status</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
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