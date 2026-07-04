"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESSES, FEED_CONTRACT_ABI } from "@/lib/contracts";
import { keccak256, toBytes } from "viem";
import { useState } from "react";

export function useCreatePost() {
  const [error, setError] = useState<string | null>(null);
  const { writeContract, data: txHash, isPending } = useWriteContract();

  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function createPost(content: string) {
    try {
      setError(null);
      if (!content.trim()) return;

      const contentHash = keccak256(toBytes(content));
      const emptyParentId = "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;

      writeContract({
        address: CONTRACT_ADDRESSES.FeedContract,
        abi: FEED_CONTRACT_ABI,
        functionName: "createPost",
        args: [content, contentHash, emptyParentId],
      });
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error(err);
    }
  }

  return {
    createPost,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}