"use client";

import { motion } from "framer-motion";
import PrizeCard from "./PrizeCard";
import { ArrowLeft } from "lucide-react";
import WifeyPointsCounter from "./WifeyPointsCounter";

const PRIZES = [
  { id: "1", title: "Shoulder Massage", cost: 1000, imageColor: "#FFB6C1" },
  { id: "2", title: "Movie Night Pick", cost: 2500, imageColor: "#87CEFA" },
  { id: "3", title: "Dinner Date", cost: 5000, imageColor: "#FFD700" },
  { id: "4", title: "Weekend Getaway", cost: 15000, imageColor: "#98FB98" },
];

export default function StoreScreen({ 
  points, 
  setPoints, 
  onBack 
}: { 
  points: number, 
  setPoints: (val: number) => void,
  onBack: () => void 
}) {

  const handleClaim = (cost: number) => {
    if (points >= cost) {
      setPoints(points - cost);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      y: 50,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute inset-0 flex flex-col p-6 md:p-12 overflow-y-auto bg-[var(--color-hk-blue-soft)]"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8 sticky top-0 z-50 bg-[var(--color-hk-blue-soft)]/90 backdrop-blur-md py-4 -mt-4 rounded-b-2xl"
      >
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-3 bg-white text-[var(--color-hk-text)] rounded-full shadow hover:shadow-md transition-shadow"
        >
          <ArrowLeft size={24} />
        </motion.button>
        
        <div className="scale-75 md:scale-100 origin-right">
          <WifeyPointsCounter points={points} />
        </div>
      </motion.div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-hk-text)] tracking-tight">
          Redemption Bow-Tique
        </h1>
        <p className="text-[var(--color-hk-text)]/70 mt-2 text-lg">
          Spend your Wifey Points on exclusive rewards!
        </p>
      </div>

      {/* Prize Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12"
      >
        {PRIZES.map((prize) => (
          <PrizeCard 
            key={prize.id} 
            prize={prize} 
            userPoints={points} 
            onClaim={handleClaim} 
          />
        ))}
      </motion.div>

    </motion.div>
  );
}
