"use client";

import { motion } from "framer-motion";
import WifeyPointsCounter from "./WifeyPointsCounter";
import ComplimentClaw from "./ComplimentClaw";
import QuestInput from "./QuestInput";
import { ShoppingBag } from "lucide-react";

export default function DashboardScreen({ 
  points, 
  setPoints, 
  onNavigateStore 
}: { 
  points: number, 
  setPoints: (val: number) => void,
  onNavigateStore: () => void 
}) {
  
  // Just for testing, adding points on mount
  // In a real app, points would be fetched from a database
  if (points === 0) {
    setTimeout(() => setPoints(10000), 500);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute inset-0 flex flex-col p-6 md:p-12 overflow-y-auto no-scrollbar bg-[var(--color-hk-pink-soft)]"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[var(--color-hk-text)] tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back, Naizbooo!</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNavigateStore}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-hk-card)] text-[var(--color-hk-text)] font-bold rounded-2xl shadow border-2 border-white hover:border-[var(--color-hk-red)] transition-colors"
        >
          <ShoppingBag size={20} />
          <span className="hidden md:inline">REWARDS</span>
        </motion.button>
      </motion.div>

      {/* Main Grid Layout (2-column for tablet+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
        
        {/* Left Column */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <WifeyPointsCounter points={points} />
          <QuestInput />
        </motion.div>

        {/* Right Column */}
        <motion.div variants={itemVariants} className="flex flex-col">
          <ComplimentClaw onWin={(amt) => setPoints(points + amt)} />
        </motion.div>

      </div>

    </motion.div>
  );
}
