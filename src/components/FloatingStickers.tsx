"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// The sticker sheet is a 3x3 grid.
const positions = [
  "0% 0%", "50% 0%", "100% 0%",
  "0% 50%", "50% 50%", "100% 50%",
  "0% 100%", "50% 100%", "100% 100%"
];

export default function FloatingStickers() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: "120px",
            height: "120px",
            backgroundImage: "url('/stickers.png')",
            backgroundSize: "300% 300%",
            backgroundPosition: pos,
            mixBlendMode: "multiply",
            opacity: 0.15, // Slightly transparent
          }}
          initial={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.8,
            rotate: Math.random() * 360,
          }}
          animate={{
            top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            rotate: Math.random() * 360 + 360,
          }}
          transition={{
            duration: Math.random() * 30 + 40, // Very slow, gentle floating
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
