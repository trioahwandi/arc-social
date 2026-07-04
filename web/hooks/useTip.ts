"use client";

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, TIP_CONTRACT_ABI } from "@/lib/contracts";
import { parseUnits } from "viem";
import { useState } from "react";
import { useAccount } from "wagmi";

const USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as `0x${string}`;

const USDC_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export function useTip() {
  const { address } = useAccount();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"idle" | "approving" | "tipping">("idle");

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  // Cek allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "allowance",
    args: address ? [address, CONTRACT_ADDRESSES.TipContract] : undefined,
    query: { enabled: !!address },
  });

  async function tipPost(postId: `0x${string}`, creator: `0x${string}`, amount: string) {
    try {
      setError(null);
      const amountInUnits = parseUnits(amount, 6);
      const currentAllowance = allowance ?? BigInt(0);

      // Kalau allowance kurang, approve dulu
      if (currentAllowance < amountInUnits) {
        setStep("approving");
        writeContract({
          address: USDC_ADDRESS,
          abi: USDC_ABI,
          functionName: "approve",
          args: [CONTRACT_ADDRESSES.TipContract, parseUnits("1000", 6)],
        });
        await refetchAllowance();
        return;
      }

      // Allowance cukup, langsung tip
      setStep("tipping");
      writeContract({
        address: CONTRACT_ADDRESSES.TipContract,
        abi: TIP_CONTRACT_ABI,
        functionName: "tipPost",
        args: [postId, creator, amountInUnits],
      });
    } catch (err) {
      setError("Transaction failed. Please try again.");
      console.error(err);
    }
  }

  return {
    tipPost,
    isPending,
    isSuccess,
    step,
    error,
  };
}