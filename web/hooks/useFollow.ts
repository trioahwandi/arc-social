"use client";

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { CONTRACT_ADDRESSES, FEED_CONTRACT_ABI } from "@/lib/contracts";

export function useFollow(targetAddress: `0x${string}`) {
  const { address } = useAccount();
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  // Cek apakah sudah follow
  const { data: isFollowing, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.FeedContract,
    abi: FEED_CONTRACT_ABI,
    functionName: "isFollowing",
    args: address && targetAddress ? [address, targetAddress] : undefined,
    query: { enabled: !!address && !!targetAddress },
  });

  function follow() {
    writeContract({
      address: CONTRACT_ADDRESSES.FeedContract,
      abi: FEED_CONTRACT_ABI,
      functionName: "follow",
      args: [targetAddress],
    });
  }

  function unfollow() {
    writeContract({
      address: CONTRACT_ADDRESSES.FeedContract,
      abi: FEED_CONTRACT_ABI,
      functionName: "unfollow",
      args: [targetAddress],
    });
  }

  return { isFollowing: !!isFollowing, follow, unfollow, isPending, isSuccess, refetch };
}