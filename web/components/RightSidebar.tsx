"use client";

const SUGGESTED_USERS = [
  { name: "alice.arc", handle: "@alice", bio: "Builder on Arc testnet" },
  { name: "novadust", handle: "@nova", bio: "Web3 content creator" },
  { name: "rini.arc", handle: "@rini", bio: "Smart contract dev" },
];

const TRENDING_TOPICS = [
  { topic: "#ArcTestnet", posts: "1.2K posts" },
  { topic: "#USDC", posts: "890 posts" },
  { topic: "#Web3Social", posts: "654 posts" },
  { topic: "#Arciden", posts: "421 posts" },
  { topic: "#SmartContract", posts: "312 posts" },
];

export function RightSidebar() {
  return (
    <aside className="w-72 shrink-0 sticky top-0 h-screen overflow-y-auto px-4 py-5">
      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-2.5 mb-4">
        <span className="text-gray-400">🔍</span>
        <input className="flex-1 outline-none text-sm text-gray-600 placeholder-gray-400 bg-transparent" placeholder="Search..." />
      </div>

      {/* TRENDING */}
      <div className="bg-white border border-blue-100 rounded-2xl p-4 mb-3">
        <div className="font-semibold text-gray-900 mb-3 text-sm">Trending on Arciden</div>
        {TRENDING_TOPICS.map((t) => (
          <div key={t.topic} className="py-2.5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-blue-50 rounded-lg px-2 transition">
            <div className="font-semibold text-blue-900 text-sm">{t.topic}</div>
            <div className="text-xs text-gray-400 mt-0.5">{t.posts}</div>
          </div>
        ))}
      </div>

      {/* SUGGESTED USERS */}
      <div className="bg-white border border-blue-100 rounded-2xl p-4 mb-3">
        <div className="font-semibold text-gray-900 mb-3 text-sm">Who to follow</div>
        {SUGGESTED_USERS.map((user) => (
          <div key={user.handle} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
              <div className="text-xs text-gray-400">{user.bio}</div>
            </div>
            <button className="text-xs font-semibold text-blue-900 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-full transition flex-shrink-0">
              Follow
            </button>
          </div>
        ))}
        <button className="text-xs text-blue-600 font-medium mt-2 hover:underline">Show more →</button>
      </div>

      {/* FOOTER */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 px-1">
        {["© 2026 Arciden", "Terms", "Privacy", "How it works", "Support"].map((item) => (
          <span key={item} className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">{item}</span>
        ))}
      </div>
    </aside>
  );
}