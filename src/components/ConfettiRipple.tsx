"use client";

import confetti from "canvas-confetti";
import { useCallback } from "react";
import { motion } from "framer-motion";

export default function ConfettiRipple({ children, onClaim }: { children: React.ReactNode, onClaim: () => void }) {
  
  const triggerConfetti = useCallback(() => {
    // Custom confetti with pink/red/gold colors
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFDDF4', '#ED1C24', '#FFD700', '#FFF5FA']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFDDF4', '#ED1C24', '#FFD700', '#FFF5FA']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
    
    // Call the original claim function
    onClaim();
  }, [onClaim]);

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={triggerConfetti}
      className="w-full cursor-pointer"
    >
      {children}
    </motion.div>
  );
}
