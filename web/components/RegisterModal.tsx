"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";

interface RegisterModalProps {
  onSuccess: () => void;
}

export function RegisterModal({ onSuccess }: RegisterModalProps) {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<"input" | "pending" | "success">("input");
  const { register, isPending, isRegistered, error } = useProfile();

  useEffect(() => {
    if (isPending) setStep("pending");
  }, [isPending]);

  useEffect(() => {
    if (isRegistered) {
      setStep("success");
      setTimeout(() => onSuccess(), 2000);
    }
  }, [isRegistered, onSuccess]);

  const isValidUsername = username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);

  return (
    <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">

        {step === "input" && (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔷</div>
              <h2 className="text-xl font-bold text-blue-900 mb-2">Create your Arciden profile</h2>
              <p className="text-sm text-gray-500">Choose a username — this will be stored on-chain and cannot be changed.</p>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Username</label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 transition">
                <span className="text-gray-400 mr-2">@</span>
                <input
                  className="flex-1 outline-none text-gray-900 text-sm"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  maxLength={20}
                />
                <span className="text-xs text-gray-300">{username.length}/20</span>
              </div>
              {username.length > 0 && !isValidUsername && (
                <p className="text-xs text-red-500 mt-1">Min 3 characters, letters/numbers/underscore only</p>
              )}
              {isValidUsername && (
                <p className="text-xs text-green-600 mt-1">✓ Username looks good!</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-3 mb-6">
              <p className="text-xs text-blue-700 leading-relaxed">
                ⛓️ This will send a transaction to Arc testnet. Make sure you have USDC in your wallet for gas fees.
              </p>
            </div>

            <button
              onClick={() => register(username)}
              disabled={!isValidUsername}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition"
            >
              Register on-chain
            </button>
          </>
        )}

        {step === "pending" && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4 animate-pulse">⛓️</div>
            <h2 className="text-xl font-bold text-blue-900 mb-2">Waiting for confirmation</h2>
            <p className="text-sm text-gray-500">Transaction sent to Arc testnet. Please wait...</p>
            <div className="mt-6 flex justify-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-blue-900 mb-2">Profile created!</h2>
            <p className="text-sm text-gray-500">Welcome to Arciden, <strong>@{username}</strong>. Your identity is now on-chain.</p>
          </div>
        )}

      </div>
    </div>
  );
}