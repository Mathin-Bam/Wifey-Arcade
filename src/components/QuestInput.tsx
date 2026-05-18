"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Send } from "lucide-react";

export default function QuestInput() {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    // In a real app, this would validate the cheat code
    setValue("");
  };

  return (
    <div className="flex flex-col bg-[var(--color-hk-card)] p-6 rounded-3xl shadow-sm border-2 border-white">
      <h2 className="text-[var(--color-hk-text)] font-bold uppercase tracking-widest text-sm mb-4">
        Real-Life Quest (Cheat Code)
      </h2>
      
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center w-full"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-[var(--color-hk-gold-glow)] pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: isFocused ? 0.5 : 0, 
            scale: isFocused ? 1.05 : 0.95,
            filter: isFocused ? "blur(8px)" : "blur(0px)"
          }}
          transition={{ duration: 0.3 }}
        />
        
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter secret code..."
          className="w-full relative z-10 bg-white border-2 border-transparent focus:border-[var(--color-hk-pink-soft)] outline-none rounded-full py-3 px-6 text-[var(--color-hk-text)] font-medium placeholder:text-gray-300 transition-colors shadow-inner"
        />
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-2 z-20 p-2 bg-[var(--color-hk-red)] text-white rounded-full shadow hover:shadow-md transition-shadow disabled:opacity-50"
          disabled={!value.trim()}
        >
          <Send size={18} className={value.trim() ? "animate-[hk-bounce_0.5s_var(--ease-hk)]" : ""} />
        </motion.button>
      </form>
      
      <p className="text-xs text-gray-400 mt-4 text-center">
        Complete real-life tasks to earn codes for Wifey Points!
      </p>
    </div>
  );
}
