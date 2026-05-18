"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookHeart } from "lucide-react";
import { useCompliments } from "@/hooks/useCompliments";

export default function ComplimentAlbum({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { unlockedCompliments } = useCompliments();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--color-hk-card)] w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl border-4 border-white flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-[var(--color-hk-blue-soft)] border-b-4 border-white">
              <div className="flex items-center gap-3">
                <BookHeart size={28} className="text-[var(--color-hk-red)]" />
                <h2 className="text-xl md:text-2xl font-bold text-[var(--color-hk-text)] tracking-tight">
                  My Compliment Album
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white rounded-full text-[var(--color-hk-text)] hover:bg-[var(--color-hk-red)] hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              {unlockedCompliments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                  <BookHeart size={64} className="mb-4 text-gray-400" />
                  <p className="text-xl font-medium text-[var(--color-hk-text)]">
                    Your album is empty!
                  </p>
                  <p className="mt-2 text-[var(--color-hk-text)]">
                    Play the Compliment Claw to collect sweet stickers!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {unlockedCompliments.map((compliment, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white p-4 rounded-xl shadow-md border-2 border-[var(--color-hk-blue-soft)] relative transform hover:-translate-y-1 hover:shadow-lg transition-all"
                    >
                      {/* Cute tape effect */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-pink-100/80 rotate-[-3deg] backdrop-blur-sm" />
                      
                      <p className="text-[var(--color-hk-text)] font-medium text-center mt-3 text-lg leading-snug">
                        "{compliment}"
                      </p>
                      
                      <div className="absolute bottom-2 right-2 opacity-20">
                        <BookHeart size={16} className="text-[var(--color-hk-red)]" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-[var(--color-hk-blue-soft)]/30 border-t-2 border-white text-center text-sm font-bold text-[var(--color-hk-text)]/70">
              Collected: {unlockedCompliments.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
