"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, Ribbon } from "lucide-react"; // Using lucide-react for SVGs

export default function ApologyScreen({ onComplete }: { onComplete: () => void }) {
  const [showButton, setShowButton] = useState(false);

  // Typewriter effect message
  const message = "I'm sorry for being late. Welcome to your Birthday Arcade...";
  const words = message.split(" ");

  const charVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  const textVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.5,
      },
    },
  };

  useEffect(() => {
    // Show button after typing finishes
    const timer = setTimeout(() => {
      setShowButton(true);
    }, message.length * 50 + 1000);
    return () => clearTimeout(timer);
  }, [message.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-theme-primary)] overflow-hidden"
    >
      {/* Kinetic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white"
            initial={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360
            }}
            animate={{ 
              top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              rotate: Math.random() * 360 + 360
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {i % 2 === 0 ? <Heart fill="currentColor" size={32} /> : <Ribbon size={32} />}
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="z-10 text-center px-4 max-w-2xl"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-theme-text)] leading-tight tracking-tight flex flex-wrap justify-center gap-y-2">
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap">
              {word.split("").map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  variants={charVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
              {/* Add space after word if it's not the last word */}
              {wordIndex < words.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          ))}
        </h1>
      </motion.div>

      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="z-10 mt-12 px-8 py-4 bg-white text-[var(--color-theme-text)] font-bold rounded-[var(--radius-hk)] shadow-lg hover:shadow-xl transition-shadow text-xl tracking-wider animate-[hk-pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] relative overflow-hidden group"
          >
            PRESS START
            <div className="absolute inset-0 bg-[var(--color-theme-glow)] opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
