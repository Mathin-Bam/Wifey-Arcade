"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function WifeyPointsCounter({ points }: { points: number }) {
  // We use a spring to animate the points smoothly
  const animatedPoints = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1,
  });

  useEffect(() => {
    animatedPoints.set(points);
  }, [points, animatedPoints]);

  // Format to 5 digits, e.g. 00000 -> 10000
  const displayPoints = useTransform(animatedPoints, (latest) => 
    Math.round(latest).toString().padStart(5, '0')
  );

  return (
    <div className="flex flex-col items-center bg-[var(--color-theme-card)] p-6 rounded-3xl shadow-sm border-2 border-white">
      <h2 className="text-[var(--color-theme-text)] font-bold uppercase tracking-widest text-sm mb-4">
        Wifey Points
      </h2>
      
      {/* Split-flap display aesthetic */}
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <div 
            key={index}
            className="relative bg-[#333] text-white text-3xl sm:text-4xl md:text-5xl font-mono font-bold w-10 sm:w-12 md:w-16 h-14 sm:h-16 md:h-20 flex items-center justify-center rounded-lg shadow-inner overflow-hidden border-b-2 border-[#111]"
          >
            {/* Split line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black/50 z-10" />
            <motion.span className="z-0">
              {/* Extracting specific character by index from the formatted string */}
              <motion.span>{useTransform(displayPoints, (v) => v[index])}</motion.span>
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}
