"use client";

import { useState } from "react";
import { useComments } from "@/hooks/useComments";
import { useAccount } from "wagmi";

interface CommentModalProps {
  postId: `0x${string}`;
  authorName: string;
  postContent: string;
  onClose: () => void;
}

function timeAgo(timestamp: bigint) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - Number(timestamp);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function CommentModal({ postId, authorName, postContent, onClose }: CommentModalProps) {
  const { address } = useAccount();
  const { comments, loading, addComment, isPending, isSuccess } = useComments(postId);
  const [text, setText] = useState("");

  return (
    <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Comments</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">×</button>
        </div>

        {/* ORIGINAL POST */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {authorName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-900 mb-1">{authorName}</div>
              <p className="text-sm text-gray-600 leading-relaxed">{postContent}</p>
            </div>
          </div>
        </div>

        {/* COMMENTS LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-gray-400">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {comment.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-xs text-gray-900">{comment.username}</span>
                    <span className="text-xs text-gray-400">{timeAgo(comment.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.contentURI}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* COMPOSE COMMENT */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {address?.slice(2, 4).toUpperCase()}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400 transition"
                placeholder="Write a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) { addComment(text); setText(""); } }}
                maxLength={280}
              />
              <button
                onClick={() => { if (text.trim()) { addComment(text); setText(""); } }}
                disabled={!text.trim() || isPending}
                className="bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
              >
                {isPending ? "..." : "Reply"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}