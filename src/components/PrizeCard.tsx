"use client";

import { motion } from "framer-motion";
import ConfettiRipple from "./ConfettiRipple";
import { Lock } from "lucide-react";

interface Prize {
  id: string;
  title: string;
  cost: number;
  imageColor: string;
}

export default function PrizeCard({ 
  prize, 
  userPoints, 
  onClaim 
}: { 
  prize: Prize; 
  userPoints: number; 
  onClaim: (cost: number) => void;
}) {
  const canAfford = userPoints >= prize.cost;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, bounce: 0.4 } }
      }}
      whileHover={{ scale: 1.05, rotate: Math.random() > 0.5 ? 2 : -2 }}
      className="bg-white p-3 pb-6 rounded-sm shadow-xl border border-gray-100 flex flex-col gap-3 relative max-w-xs mx-auto w-full"
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
      }}
    >
      {/* Polaroid Image Area */}
      <div 
        className="w-full aspect-square rounded-sm flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: prize.imageColor }}
      >
        <span className="text-white font-bold text-xl opacity-80 mix-blend-overlay">
          {prize.title.split(' ')[0]}
        </span>
        
        {/* Overlay if locked */}
        {!canAfford && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <Lock className="text-white" size={32} />
          </div>
        )}
      </div>
      
      {/* Prize Details */}
      <div className="flex flex-col items-center gap-1 mt-2">
        <h3 className="font-bold text-[var(--color-hk-text)] font-sans text-lg">{prize.title}</h3>
        <p className="text-[var(--color-hk-red)] font-mono font-bold">{prize.cost.toLocaleString()} Pts</p>
      </div>

      {/* Claim Button */}
      <div className="mt-2 w-full px-2">
        {canAfford ? (
          <ConfettiRipple onClaim={() => onClaim(prize.cost)}>
            <div className="w-full py-3 bg-[var(--color-hk-card)] border-2 border-[var(--color-hk-pink-soft)] text-[var(--color-hk-text)] font-bold text-center rounded-xl hover:bg-[var(--color-hk-pink-soft)] transition-colors">
              CLAIM
            </div>
          </ConfettiRipple>
        ) : (
          <div className="w-full py-3 bg-gray-100 text-gray-400 font-bold text-center rounded-xl cursor-not-allowed">
            LOCKED
          </div>
        )}
      </div>
    </motion.div>
  );
}
