"use client";

import { useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { CONTRACT_ADDRESSES, FEED_CONTRACT_ABI, PROFILE_REGISTRY_ABI } from "@/lib/contracts";
import { keccak256, toBytes } from "viem";
import { useState, useEffect } from "react";
import { arcTestnet } from "@/lib/wagmi";

interface Comment {
  id: `0x${string}`;
  author: `0x${string}`;
  contentURI: string;
  timestamp: bigint;
  username: string;
}

export function useComments(postId: `0x${string}`) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const client = usePublicClient({ chainId: arcTestnet.id });
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  async function loadComments() {
    if (!client || !postId) return;
    try {
      setLoading(true);

      // Ambil semua post dari global feed dengan limit besar
      const feedIds = await client.readContract({
        address: CONTRACT_ADDRESSES.FeedContract,
        abi: FEED_CONTRACT_ABI,
        functionName: "getGlobalFeed",
        args: [BigInt(0), BigInt(100)],
      }) as `0x${string}`[];

      const replies: Comment[] = [];

      for (const id of feedIds) {
        const post = await client.readContract({
          address: CONTRACT_ADDRESSES.FeedContract,
          abi: FEED_CONTRACT_ABI,
          functionName: "getPost",
          args: [id],
        }) as any;

        // Cek apakah ini reply dari postId yang kita cari
        if (post.parentId !== postId) continue;
        if (!post.isActive) continue;

        const profile = await client.readContract({
          address: CONTRACT_ADDRESSES.ProfileRegistry,
          abi: PROFILE_REGISTRY_ABI,
          functionName: "getProfile",
          args: [post.author],
        }) as any;

        replies.push({
          id: post.id,
          author: post.author,
          contentURI: post.contentURI,
          timestamp: post.timestamp,
          username: profile.username || post.author.slice(0, 8),
        });
      }

      setComments(replies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadComments(); }, [postId, client]);
  useEffect(() => { if (isSuccess) loadComments(); }, [isSuccess]);

  async function addComment(content: string) {
    if (!content.trim()) return;
    const contentHash = keccak256(toBytes(content));
    writeContract({
      address: CONTRACT_ADDRESSES.FeedContract,
      abi: FEED_CONTRACT_ABI,
      functionName: "createPost",
      args: [content, contentHash, postId],
    });
  }

  return { comments, loading, addComment, isPending, isSuccess };
}