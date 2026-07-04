"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESSES, PROFILE_REGISTRY_ABI } from "@/lib/contracts";
import { useState } from "react";

export function useProfile() {
  const { address } = useAccount();
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const [error, setError] = useState<string | null>(null);

  // Cek apakah wallet sudah punya profil
  const { data: hasProfile, refetch: refetchHasProfile } = useReadContract({
    address: CONTRACT_ADDRESSES.ProfileRegistry,
    abi: PROFILE_REGISTRY_ABI,
    functionName: "hasProfile",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Ambil data profil
  const { data: profile, refetch: refetchProfile } = useReadContract({
    address: CONTRACT_ADDRESSES.ProfileRegistry,
    abi: PROFILE_REGISTRY_ABI,
    functionName: "getProfile",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Tunggu transaksi register selesai
  const { isSuccess: isRegistered } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Fungsi register username
  async function register(username: string) {
    try {
      setError(null);
      writeContract({
        address: CONTRACT_ADDRESSES.ProfileRegistry,
        abi: PROFILE_REGISTRY_ABI,
        functionName: "register",
        args: [username, ""],
      });
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    }
  }

  return {
    hasProfile: !!hasProfile,
    profile,
    register,
    isPending,
    isRegistered,
    error,
    refetch: () => { refetchHasProfile(); refetchProfile(); },
  };
}