"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AmbientBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Subtle Dark Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, oklch(0.7 0.15 190) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.7 0.15 190) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Scanning Line Effect */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-[1px] bg-primary/20 shadow-[0_0_8px_rgba(0,255,255,0.8)]"
        animate={{
          top: ["0%", "100%", "0%"],
          opacity: [0, 0.5, 0]
        }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity
        }}
      />

      {/* Reactive Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
    </div>
  );
}
