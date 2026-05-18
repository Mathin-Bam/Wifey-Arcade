"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Hand, ArrowLeft, ArrowRight, BookHeart, X, Heart, Check, Lock } from "lucide-react";
import { playWhirrSound, playGrabSound, playChimeSound } from "@/lib/audio";
import { useCompliments } from "@/hooks/useCompliments";
import ComplimentAlbum from "./ComplimentAlbum";
import confetti from "canvas-confetti";

const ALL_COMPLIMENTS = [
  "You're the most beautiful person I know!",
  "Your smile lights up my whole world.",
  "You make every day feel like a birthday.",
  "I'm so incredibly lucky to have you.",
  "You're absolute perfection.",
  "Your laugh is my favorite sound.",
  "You are my literal dream come true.",
  "Your heart is as beautiful as your face.",
];

const CAPSULE_COLORS = [
  "#FFB6C1", "#87CEFA", "#98FB98", "#FFD700", "#FFA07A", "#DDA0DD"
];

interface Capsule {
  id: number;
  x: number; // 0 to 100%
  color: string;
}

export default function ComplimentClaw({ onWin }: { onWin?: (pts: number) => void }) {
  const { 
    addCompliment, 
    dailyClaimsCount, 
    incrementDailyClaims, 
    canClaimToday, 
    isLoaded 
  } = useCompliments();
  
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  
  // Game States
  const [clawX, setClawX] = useState(50);
  const [clawY, setClawY] = useState(0); // 0 = top, 100 = bottom
  const [isDropping, setIsDropping] = useState(false);
  const [hasGrabbed, setHasGrabbed] = useState(false);
  
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [grabbedCapsule, setGrabbedCapsule] = useState<Capsule | null>(null);
  const [activeCompliment, setActiveCompliment] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Initialize capsules
  useEffect(() => {
    const initialCapsules = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: 15 + Math.random() * 70, // Keep them away from extreme edges
      color: CAPSULE_COLORS[Math.floor(Math.random() * CAPSULE_COLORS.length)]
    }));
    setCapsules(initialCapsules);
  }, []);

  const moveClaw = (dir: "left" | "right") => {
    if (isDropping || activeCompliment || !canClaimToday) return;
    setClawX(prev => {
      const next = dir === "left" ? prev - 10 : prev + 10;
      return Math.max(10, Math.min(90, next));
    });
    playWhirrSound();
  };

  const handleDrop = () => {
    if (isDropping || activeCompliment || !canClaimToday) return;
    setIsDropping(true);
    setActiveCompliment(null);
    setIsSaved(false);
    playWhirrSound();

    // 1. Drop down
    setClawY(85); // move to bottom

    setTimeout(() => {
      // 2. Check grab
      const hitRadius = 8; // % threshold
      const hitCapsule = capsules.find(c => Math.abs(c.x - clawX) < hitRadius);

      if (hitCapsule) {
        setGrabbedCapsule(hitCapsule);
        setCapsules(prev => prev.filter(c => c.id !== hitCapsule.id));
        setHasGrabbed(true);
        playGrabSound();
      }

      // 3. Move back up
      setTimeout(() => {
        setClawY(0);
        playWhirrSound();

        // 4. If grabbed, move to chute (X: 10)
        setTimeout(() => {
          if (hitCapsule) {
            setClawX(10);
            playWhirrSound();

            // 5. Drop into chute
            setTimeout(() => {
              setGrabbedCapsule(null); // let it fall
              setHasGrabbed(false);
              
              // 6. Reveal Prize & Confetti
              setTimeout(() => {
                playChimeSound();
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.6 },
                  colors: ['#FFDDF4', '#ED1C24', '#FFD700', '#FFF5FA']
                });
                
                const randomComp = ALL_COMPLIMENTS[Math.floor(Math.random() * ALL_COMPLIMENTS.length)];
                setActiveCompliment(randomComp);
                
              }, 500);

            }, 800);
          } else {
            // Didn't grab anything
            setIsDropping(false);
          }
        }, 800);
      }, 500);
    }, 800);
  };

  const handleSaveToAlbum = () => {
    if (!activeCompliment || isSaved) return;
    
    setIsSaved(true);
    addCompliment(activeCompliment);
    incrementDailyClaims();
    playChimeSound();
    
    // Heart burst confetti
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FFDDF4', '#ED1C24', '#FFD700']
    });
    
    if (onWin) onWin(250); // Award points!

    // Wait and then reset the claw game
    setTimeout(() => {
      setActiveCompliment(null);
      setClawX(50);
      setIsDropping(false);
      setIsSaved(false);
    }, 1500);
  };

  const handleDiscard = () => {
    // Add a fresh capsule back so the machine stays filled
    setCapsules(prev => [
      ...prev,
      {
        id: Date.now(),
        x: 15 + Math.random() * 70,
        color: CAPSULE_COLORS[Math.floor(Math.random() * CAPSULE_COLORS.length)]
      }
    ]);
    setActiveCompliment(null);
    setClawX(50);
    setIsDropping(false);
    setIsSaved(false);
  };

  return (
    <>
      <div className="flex flex-col bg-[var(--color-hk-card)] p-4 md:p-6 rounded-3xl shadow-sm border-2 border-white relative h-[500px]">
        {/* Header & Album Button */}
        <div className="flex justify-between items-center z-10 mb-2">
          <h2 className="text-[var(--color-hk-text)] font-bold uppercase tracking-widest text-sm">
            Compliment Claw
          </h2>
          <div className="flex gap-2 items-center">
            {isLoaded && (
              <span className="text-[10px] md:text-xs font-bold bg-[var(--color-hk-pink-soft)] px-2.5 py-1.5 rounded-xl text-[var(--color-hk-text)] border border-white">
                💖 {Math.max(0, 2 - dailyClaimsCount)}/2 Tokens Left
              </span>
            )}
            <button 
              onClick={() => setIsAlbumOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white text-[var(--color-hk-red)] font-bold rounded-xl shadow-sm hover:shadow transition-all text-xs border border-gray-100"
            >
              <BookHeart size={16} />
              ALBUM
            </button>
          </div>
        </div>
        
        {/* Arcade Cabinet Screen */}
        <div className="flex-1 w-full bg-[var(--color-hk-pink-soft)] rounded-2xl border-4 border-white overflow-hidden relative shadow-inner mb-4">
          
          {/* Glass glare effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-20" />

          {/* Redemption Chute */}
          <div className="absolute bottom-0 left-4 w-20 h-24 bg-black/10 rounded-t-xl border-t-2 border-x-2 border-white/50 flex flex-col items-center justify-end pb-2 z-0">
            <div className="w-16 h-4 bg-black/20 rounded-full blur-sm" />
            <span className="text-white font-bold text-xs mt-1 drop-shadow-md">PRIZE</span>
          </div>

          {/* Out of Tokens Lock Screen Overlay */}
          {isLoaded && !canClaimToday && !activeCompliment && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 bg-black/40 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border-4 border-[var(--color-hk-pink-soft)] shadow-xl flex flex-col items-center max-w-[85%]"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--color-hk-pink-soft)] flex items-center justify-center text-[var(--color-hk-red)] mb-4 animate-bounce">
                  <Lock size={32} />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-hk-text)] uppercase tracking-wider mb-2">
                  NO TOKENS LEFT!
                </h3>
                <p className="text-sm font-medium text-[var(--color-hk-text)]/80 leading-snug">
                  You've claimed your 2 compliments today! Come back tomorrow for more sweet surprises. 💕
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Claw Assembly */}
          <motion.div 
            className="absolute top-0 z-10 flex flex-col items-center"
            animate={{ 
              left: `${clawX}%`, 
              y: isDropping ? (clawY === 0 ? 0 : 250) : [-5, 5, -5] // Gentle float when idle
            }}
            transition={{ 
              left: { type: "spring", stiffness: 120, damping: 20 },
              y: isDropping ? { duration: 0.8, ease: "easeInOut" } : { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ x: "-50%" }}
          >
            {/* String */}
            <motion.div 
              className="w-1 bg-gray-400 absolute bottom-full origin-bottom"
              animate={{ height: isDropping && clawY > 0 ? 300 : 40 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            
            {/* Claw Head */}
            <motion.div 
              className="relative text-[var(--color-hk-red)] drop-shadow-[0_0_8px_var(--color-hk-gold-glow)]"
              animate={{ 
                scale: isDropping && clawY > 0 ? 1.1 : 1
              }}
            >
              <Hand size={48} className={`transform rotate-180 transition-transform duration-300 ${hasGrabbed ? 'scale-x-75' : ''}`} />
              
              {/* Grabbed Capsule */}
              <AnimatePresence>
                {grabbedCapsule && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0, y: 50 }} // fall down when released
                    className="absolute top-[80%] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full shadow-lg border-2 border-white/80 z-20"
                    style={{ backgroundColor: grabbedCapsule.color }}
                  >
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/50" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Rest of the Capsules */}
          <div className="absolute bottom-2 left-0 w-full h-16 pointer-events-none z-0">
            {capsules.map(cap => (
              <motion.div
                key={cap.id}
                className="absolute bottom-0 w-10 h-10 rounded-full shadow-md border-2 border-white/50"
                style={{ 
                  backgroundColor: cap.color, 
                  left: `${cap.x}%`, 
                  x: "-50%" 
                }}
                animate={{
                  y: [0, -2, 0]
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random()
                }}
              >
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/30" />
              </motion.div>
            ))}
          </div>

          {/* Compliment Popup Overlay */}
          <AnimatePresence>
            {activeCompliment && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
              >
                <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-[var(--color-hk-pink-soft)] text-center max-w-[85%] relative flex flex-col items-center">
                  
                  {/* Close / Discard Button */}
                  {!isSaved && (
                    <button
                      onClick={handleDiscard}
                      className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                  
                  <h3 className="text-[var(--color-hk-red)] font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Heart size={14} className="fill-current animate-pulse" /> Compliment Revealed!
                  </h3>
                  
                  <p className="text-[var(--color-hk-text)] font-semibold text-lg leading-snug py-2 px-1 italic">
                    "{activeCompliment}"
                  </p>
                  
                  {/* Interactive Save State / Button */}
                  <div className="mt-4 w-full">
                    {isSaved ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex items-center justify-center gap-2 py-3 px-6 bg-emerald-500 text-white font-bold rounded-2xl shadow"
                      >
                        <Check size={20} strokeWidth={3} />
                        SAVED TO ALBUM! 💖
                      </motion.div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveToAlbum}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[var(--color-hk-red)] hover:bg-[var(--color-hk-red)]/90 text-white font-bold rounded-2xl shadow-md transition-all border-b-4 border-red-800"
                      >
                        <BookHeart size={18} />
                        SAVE TO ALBUM (+250 Pts)
                      </motion.button>
                    )}
                  </div>
                  
                  {!isSaved && (
                    <button
                      onClick={handleDiscard}
                      className="mt-3 text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                    >
                      Discard Compliment
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Arcade Controls */}
        <div className="flex justify-between items-center px-2">
          {/* Joystick Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => moveClaw("left")}
              disabled={isDropping || !!activeCompliment || !canClaimToday}
              className="w-14 h-14 bg-gray-100 rounded-xl shadow-[0_4px_0_#d1d5db] active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 transition-all flex items-center justify-center disabled:opacity-40 text-[var(--color-hk-text)] border border-gray-200"
            >
              <ArrowLeft size={24} strokeWidth={3} />
            </button>
            <button 
              onClick={() => moveClaw("right")}
              disabled={isDropping || !!activeCompliment || !canClaimToday}
              className="w-14 h-14 bg-gray-100 rounded-xl shadow-[0_4px_0_#d1d5db] active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 transition-all flex items-center justify-center disabled:opacity-40 text-[var(--color-hk-text)] border border-gray-200"
            >
              <ArrowRight size={24} strokeWidth={3} />
            </button>
          </div>

          {/* Big Drop Button */}
          <button 
            onClick={handleDrop}
            disabled={isDropping || !!activeCompliment || !canClaimToday}
            className="w-20 h-20 bg-[var(--color-hk-red)] rounded-full shadow-[0_6px_0_#b91c1c] active:shadow-[0_0px_0_#b91c1c] active:translate-y-[6px] transition-all flex items-center justify-center text-white disabled:opacity-40 border-4 border-white"
          >
            <span className="font-bold text-lg tracking-wider drop-shadow-md">
              {!canClaimToday ? "LOCKED" : "DROP"}
            </span>
          </button>
        </div>
      </div>

      <ComplimentAlbum isOpen={isAlbumOpen} onClose={() => setIsAlbumOpen(false)} />
    </>
  );
}
