"use client";

import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { PostCard } from "@/components/PostCard";
import { RegisterModal } from "@/components/RegisterModal";
import { useProfile } from "@/hooks/useProfile";
import { useCreatePost } from "@/hooks/useCreatePost";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

const DUMMY_POSTS = [
  {
    author: "alice.arc",
    handle: "@alice",
    time: "2 min ago",
    content: "Just deployed my first contract on Arc testnet. Finality is insanely fast — barely felt the confirmation wait. 🔷",
    likes: 24, reposts: 5, comments: 8,
    tipAmount: "0.50",
  },
  {
    author: "bejo",
    handle: "@bejo",
    time: "15 min ago",
    content: "Gas fees in USDC is a game changer for onboarding. Regular users don't need to worry about ETH just to try a DApp. Arc really gets UX.",
    likes: 11, reposts: 2, comments: 3,
  },
  {
    author: "rini.arc",
    handle: "@rini",
    time: "1h ago",
    content: "If social media is truly on-chain, who can delete your post? Nobody. That's powerful — and a huge responsibility.",
    likes: 47, reposts: 13, comments: 19,
    tipAmount: "2.00",
  },
  {
    author: "novadust",
    handle: "@nova",
    time: "3h ago",
    content: "Arciden just launched on testnet — first time I'm using a social media that's genuinely on-chain. So excited! 🚀",
    likes: 33, reposts: 9, comments: 7,
    tipAmount: "1.00",
  },
];

export default function Home() {
  const { isConnected } = useAccount();
  const { hasProfile, profile, refetch } = useProfile();
  const { createPost, isPending } = useCreatePost();
  const [mounted, setMounted] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [postContent, setPostContent] = useState("");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && isConnected && !hasProfile) {
      setShowRegister(true);
    } else {
      setShowRegister(false);
    }
  }, [mounted, isConnected, hasProfile]);

  if (!mounted) return null;

  const avatarText = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : "YO";

  return (
    <div className="flex min-h-screen max-w-6xl mx-auto">
      <Sidebar />

      <main className="flex-1 border-x border-blue-100 min-w-0">
        {showRegister && (
          <RegisterModal onSuccess={() => { setShowRegister(false); refetch(); }} />
        )}

        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-full py-32 px-8 text-center">
            <div className="text-7xl mb-6">🔷</div>
            <h1 className="text-3xl font-bold text-blue-900 mb-3">Welcome to Arciden</h1>
            <p className="text-gray-500 leading-relaxed mb-8 max-w-sm">
              Decentralized social media on Arc testnet. Connect your wallet to start posting and tip USDC to creators.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 max-w-sm w-full">
              <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-3"><span className="text-xl">🔑</span><span>Login with wallet — no password needed</span></div>
                <div className="flex items-center gap-3"><span className="text-xl">💵</span><span>Tip USDC directly to creators</span></div>
                <div className="flex items-center gap-3"><span className="text-xl">⛓️</span><span>Posts stored on Arc blockchain</span></div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* FEED TABS */}
            <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-blue-100 z-10">
              <div className="flex">
                {["All Posts", "Following", "Highlights"].map((tab, i) => (
                  <button key={tab} className={`px-5 py-4 text-sm font-medium transition relative ${i === 0 ? "text-blue-900 font-semibold" : "text-gray-400 hover:text-gray-700"}`}>
                    {tab}
                    {i === 0 && <div className="absolute bottom-0 left-5 right-5 h-0.5 bg-blue-900 rounded-full" />}
                  </button>
                ))}
              </div>
            </div>

            {/* COMPOSE */}
            <div className="bg-white border-b border-blue-100 p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {avatarText}
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full outline-none text-gray-700 placeholder-gray-400 text-base bg-transparent py-2 resize-none"
                    placeholder="What's on your mind?"
                    rows={2}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    maxLength={280}
                  />
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex gap-1 text-blue-500">
                      <button className="hover:bg-blue-50 p-2 rounded-lg transition text-lg">🖼</button>
                      <button className="hover:bg-blue-50 p-2 rounded-lg transition text-lg">🔗</button>
                      <button className="hover:bg-blue-50 p-2 rounded-lg transition text-lg">📊</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-300">{postContent.length}/280</span>
                      <button
                        onClick={() => { if (postContent.trim()) { createPost(postContent); setPostContent(""); } }}
                        disabled={!postContent.trim() || isPending}
                        className="bg-blue-900 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2 rounded-full transition"
                      >
                        {isPending ? "Casting..." : "Cast"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* POSTS */}
            <div className="p-4">
              {DUMMY_POSTS.map((post, i) => (
                <PostCard key={i} {...post} />
              ))}
            </div>
          </div>
        )}
      </main>

      <RightSidebar />
    </div>
  );
}