"use client";

import { useReadContract, usePublicClient } from "wagmi";
import { CONTRACT_ADDRESSES, FEED_CONTRACT_ABI, PROFILE_REGISTRY_ABI } from "@/lib/contracts";
import { useState, useEffect } from "react";
import { arcTestnet } from "@/lib/wagmi";

interface Post {
  id: `0x${string}`;
  author: `0x${string}`;
  contentURI: string;
  timestamp: bigint;
  isActive: boolean;
  username: string;
}

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const client = usePublicClient({ chainId: arcTestnet.id });

  // Ambil global feed IDs
  const { data: feedIds, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.FeedContract,
    abi: FEED_CONTRACT_ABI,
    functionName: "getGlobalFeed",
    args: [BigInt(0), BigInt(20)],
  });

  useEffect(() => {
    async function loadPosts() {
      if (!feedIds || !client || feedIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const loadedPosts: Post[] = [];

        for (const postId of [...feedIds].reverse()) {
          // Ambil data post
          const post = await client.readContract({
            address: CONTRACT_ADDRESSES.FeedContract,
            abi: FEED_CONTRACT_ABI,
            functionName: "getPost",
            args: [postId],
          }) as any;

          if (!post.isActive) continue;

          // Ambil username dari ProfileRegistry
          const profile = await client.readContract({
            address: CONTRACT_ADDRESSES.ProfileRegistry,
            abi: PROFILE_REGISTRY_ABI,
            functionName: "getProfile",
            args: [post.author],
          }) as any;

          loadedPosts.push({
            id: post.id,
            author: post.author,
            contentURI: post.contentURI,
            timestamp: post.timestamp,
            isActive: post.isActive,
            username: profile.username || post.author.slice(0, 8),
          });
        }

        setPosts(loadedPosts);
      } catch (err) {
        console.error("Failed to load feed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [feedIds, client]);

  return { posts, loading, refetch };
}