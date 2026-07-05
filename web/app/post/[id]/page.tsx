"use client";

import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { useComments } from "@/hooks/useComments";
import { usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESSES, FEED_CONTRACT_ABI, PROFILE_REGISTRY_ABI } from "@/lib/contracts";
import { arcTestnet } from "@/lib/wagmi";
import { use } from "react";

function timeAgo(timestamp: bigint) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - Number(timestamp);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const postId = id as `0x${string}`;
  const [post, setPost] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const client = usePublicClient({ chainId: arcTestnet.id });
  const { comments, addComment, isPending } = useComments(postId);

  useEffect(() => {
    async function loadPost() {
      if (!client || !postId) return;
      try {
        const postData = await client.readContract({
          address: CONTRACT_ADDRESSES.FeedContract,
          abi: FEED_CONTRACT_ABI,
          functionName: "getPost",
          args: [postId],
        }) as any;

        const profileData = await client.readContract({
          address: CONTRACT_ADDRESSES.ProfileRegistry,
          abi: PROFILE_REGISTRY_ABI,
          functionName: "getProfile",
          args: [postData.author],
        }) as any;

        setPost(postData);
        setAuthor(profileData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [client, postId]);

  return (
    <div className="flex min-h-screen max-w-6xl mx-auto">
      <Sidebar />
      <main className="flex-1 border-x border-blue-100 min-w-0">
        {/* HEADER */}
        <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-blue-100 z-10 px-4 py-3 flex items-center gap-3">
          <a href="/" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition text-gray-600 text-lg">←</a>
          <span className="font-bold text-gray-900">Post</span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-400">Loading post...</p>
          </div>
        ) : !post ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Post not found</p>
          </div>
        ) : (
          <div>
            {/* ORIGINAL POST */}
            <div className="p-4 border-b border-blue-100">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {(author?.username || "??").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{author?.username || "Unknown"}</span>
                    <span className="text-blue-500 text-xs">✓</span>
                  </div>
                  <p className="text-xs text-gray-400">@{author?.username || post.author.slice(0, 8)}</p>
                </div>
              </div>
              <p className="text-gray-800 text-base leading-relaxed mb-3">{post.contentURI}</p>
              <p className="text-xs text-gray-400">{timeAgo(post.timestamp)}</p>
            </div>

            {/* COMPOSE COMMENT */}
            <div className="p-4 border-b border-blue-100 flex gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">ME</div>
              <div className="flex-1 flex gap-2">
                <input
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400 transition"
                  placeholder="Write a reply..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && commentText.trim()) { addComment(commentText); setCommentText(""); } }}
                />
                <button
                  onClick={() => { if (commentText.trim()) { addComment(commentText); setCommentText(""); } }}
                  disabled={!commentText.trim() || isPending}
                  className="bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                >
                  {isPending ? "..." : "Reply"}
                </button>
              </div>
            </div>

            {/* COMMENTS */}
            <div className="p-4">
              <p className="text-sm font-semibold text-gray-500 mb-3">{comments.length} Replies</p>
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">💬</div>
                  <p className="text-sm text-gray-400">No replies yet. Be the first!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 mb-4 pb-4 border-b border-gray-50">
                    <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {comment.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">{comment.username}</span>
                        <span className="text-xs text-gray-400">{timeAgo(comment.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{comment.contentURI}</p>
                    </div>
                  </div>
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