"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ApologyScreen from "@/components/ApologyScreen";
import DashboardScreen from "@/components/DashboardScreen";
import StoreScreen from "@/components/StoreScreen";

export type GameState = "apology" | "dashboard" | "store";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("apology");
  const [points, setPoints] = useState<number>(0);

  return (
    <main className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {gameState === "apology" && (
          <ApologyScreen key="apology" onComplete={() => setGameState("dashboard")} />
        )}
        {gameState === "dashboard" && (
          <DashboardScreen 
            key="dashboard" 
            points={points} 
            setPoints={setPoints} 
            onNavigateStore={() => setGameState("store")} 
          />
        )}
        {gameState === "store" && (
          <StoreScreen 
            key="store" 
            points={points} 
            setPoints={setPoints} 
            onBack={() => setGameState("dashboard")} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}
