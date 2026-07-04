"use client";

import { useState } from "react";
import { TipModal } from "./TipModal";

interface PostCardProps {
  author: string;
  handle: string;
  time: string;
  content: string;
  likes: number;
  reposts: number;
  comments: number;
  tipAmount?: string;
  postId?: `0x${string}`;
  creator?: `0x${string}`;
}

export function PostCard({ author, handle, time, content, likes, reposts, comments, tipAmount, postId, creator }: PostCardProps) {
  const [showTip, setShowTip] = useState(false);
  const [liked, setLiked] = useState(false);

  const dummyPostId = "0x0000000000000000000000000000000000000000000000000000000000000001" as `0x${string}`;
  const dummyCreator = "0x0000000000000000000000000000000000000001" as `0x${string}`;

  return (
    <>
      {showTip && (
        <TipModal
          postId={postId || dummyPostId}
          creator={creator || dummyCreator}
          authorName={author}
          onClose={() => setShowTip(false)}
        />
      )}

      <div className="bg-white border border-blue-100 rounded-2xl p-4 mb-3 hover:border-blue-200 transition">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {author.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">{author}</span>
              <span className="text-blue-500 text-xs">✓</span>
              <span className="text-gray-400 text-sm">{handle}</span>
              <span className="text-gray-300 text-xs ml-auto">{time}</span>
              <button className="text-gray-300 hover:text-gray-500 text-lg leading-none">···</button>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">{content}</p>
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 text-xs px-2.5 py-1.5 rounded-full hover:bg-blue-50 transition">
                💬 {comments}
              </button>
              <button className="flex items-center gap-1.5 text-gray-400 hover:text-green-500 text-xs px-2.5 py-1.5 rounded-full hover:bg-green-50 transition">
                🔄 {reposts}
              </button>
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full transition ${liked ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
              >
                ❤️ {liked ? likes + 1 : likes}
              </button>
              <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-xs px-2.5 py-1.5 rounded-full hover:bg-gray-50 transition ml-auto">
                🔗
              </button>
              <button
                onClick={() => setShowTip(true)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-full transition"
              >
                💵 {tipAmount ? `${tipAmount} USDC` : "Tip USDC"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}