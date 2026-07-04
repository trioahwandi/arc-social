"use client";

import { useState } from "react";
import { useTip } from "@/hooks/useTip";

interface TipModalProps {
  postId: `0x${string}`;
  creator: `0x${string}`;
  authorName: string;
  onClose: () => void;
}

export function TipModal({ postId, creator, authorName, onClose }: TipModalProps) {
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState("");
  const { tipPost, isPending, isSuccess, error } = useTip();

  const presets = ["0.10", "0.50", "1.00", "2.00"];

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-blue-900 mb-2">Tip sent!</h2>
          <p className="text-sm text-gray-500 mb-6">{selected || amount} USDC sent directly to <strong>{authorName}</strong></p>
          <button onClick={onClose} className="w-full bg-blue-900 text-white font-semibold py-3 rounded-full">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-blue-900">Tip USDC</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <p className="text-sm text-gray-500 mb-4">Send USDC directly to <strong>{authorName}</strong> — no middleman.</p>

        {/* PRESETS */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => { setSelected(p); setAmount(p); }}
              className={`py-2 rounded-xl text-sm font-semibold border transition ${selected === p ? "bg-blue-900 text-white border-blue-900" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* CUSTOM */}
        <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 mb-4 focus-within:border-blue-500 transition">
          <span className="text-gray-400 mr-2 text-sm">USDC</span>
          <input
            type="number"
            className="flex-1 outline-none text-sm text-gray-900"
            placeholder="Custom amount"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setSelected(""); }}
            min="0.01"
            step="0.01"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl p-3 mb-4">
          <p className="text-xs text-blue-700">⛓️ USDC goes directly to creator wallet on Arc testnet. Make sure you have enough USDC for the tip + gas.</p>
        </div>

        <button
          onClick={() => tipPost(postId, creator, amount)}
          disabled={!amount || isPending}
          className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition"
        >
          {isPending ? "Sending..." : `Send ${amount || "0"} USDC`}
        </button>
      </div>
    </div>
  );
}