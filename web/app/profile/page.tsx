"use client";

import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { PostCard } from "@/components/PostCard";
import { useProfile } from "@/hooks/useProfile";
import { useAccount, useReadContract, usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESSES, FEED_CONTRACT_ABI } from "@/lib/contracts";
import { arcTestnet } from "@/lib/wagmi";

const EMPTY_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { profile } = useProfile();
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const client = usePublicClient({ chainId: arcTestnet.id });

  useEffect(() => { setMounted(true); }, []);

  const { data: postIds } = useReadContract({
    address: CONTRACT_ADDRESSES.FeedContract,
    abi: FEED_CONTRACT_ABI,
    functionName: "getPostsByAuthor",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: followingCount } = useReadContract({
    address: CONTRACT_ADDRESSES.FeedContract,
    abi: FEED_CONTRACT_ABI,
    functionName: "getFollowingCount",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: followersCount } = useReadContract({
    address: CONTRACT_ADDRESSES.FeedContract,
    abi: FEED_CONTRACT_ABI,
    functionName: "getFollowersCount",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  useEffect(() => {
    async function loadUserPosts() {
      if (!postIds || !client || postIds.length === 0) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const loaded: any[] = [];
        for (const postId of [...postIds].reverse()) {
          const post = await client.readContract({
            address: CONTRACT_ADDRESSES.FeedContract,
            abi: FEED_CONTRACT_ABI,
            functionName: "getPost",
            args: [postId],
          }) as any;
          // Skip reply
          if (post.parentId !== EMPTY_BYTES32) continue;
          if (post.isActive) loaded.push(post);
        }
        setPosts(loaded);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUserPosts();
  }, [postIds, client]);

  function timeAgo(timestamp: bigint) {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - Number(timestamp);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen max-w-6xl mx-auto">
      <Sidebar />
      <main className="flex-1 border-x border-blue-100 min-w-0">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-full py-32 text-center">
            <div className="text-5xl mb-4">🔷</div>
            <p className="text-gray-500">Connect your wallet to view profile</p>
          </div>
        ) : (
          <div>
            <div className="h-32 bg-gradient-to-r from-blue-900 to-blue-600 relative">
              <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 rounded-full bg-blue-900 border-4 border-white flex items-center justify-center text-white font-bold text-2xl">
                  {profile?.username ? profile.username.slice(0, 2).toUpperCase() : "??"}
                </div>
              </div>
            </div>

            <div className="pt-14 px-6 pb-4 border-b border-blue-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900">{profile?.username || "No username"}</h1>
                    <span className="text-blue-500">✓</span>
                  </div>
                  <p className="text-sm text-gray-400">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                </div>
                <button className="border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-50 transition">
                  Edit Profile
                </button>
              </div>

              <div className="flex gap-5 mb-3">
                <div><span className="font-bold text-gray-900">{posts.length}</span><span className="text-gray-400 text-sm ml-1">Posts</span></div>
                <div><span className="font-bold text-gray-900">{followingCount?.toString() || "0"}</span><span className="text-gray-400 text-sm ml-1">Following</span></div>
                <div><span className="font-bold text-gray-900">{followersCount?.toString() || "0"}</span><span className="text-gray-400 text-sm ml-1">Followers</span></div>
              </div>

              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                🔷 On-chain since block #{profile?.registeredAt?.toString() || "..."}
              </div>
            </div>

            <div className="flex border-b border-blue-100">
              {["Posts", "Replies", "Media"].map((tab, i) => (
                <button key={tab} className={`px-5 py-4 text-sm font-medium transition relative ${i === 0 ? "text-blue-900 font-semibold" : "text-gray-400"}`}>
                  {tab}
                  {i === 0 && <div className="absolute bottom-0 left-5 right-5 h-0.5 bg-blue-900 rounded-full" />}
                </button>
              ))}
            </div>

            <div className="p-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm text-gray-400">Loading your posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">✍️</div>
                  <p className="text-gray-400 text-sm">No posts yet. Start casting!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    author={profile?.username || address?.slice(0, 8) || ""}
                    handle={`@${profile?.username || address?.slice(0, 6)}`}
                    time={timeAgo(post.timestamp)}
                    content={post.contentURI}
                    likes={0}
                    reposts={0}
                    comments={0}
                    postId={post.id}
                    creator={address}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </main>
      <RightSidebar />
    </div>
  );
}