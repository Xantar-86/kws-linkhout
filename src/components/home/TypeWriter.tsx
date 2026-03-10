"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypeWriterProps {
  text: string;
  delay?: number;
  highlightWord?: string;
  highlightClass?: string;
  emoji?: string;
}

export function TypeWriter({
  text,
  delay = 80,
  highlightWord = "hart",
  highlightClass = "text-primary",
  emoji = "❤️",
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      setTimeout(() => setShowEmoji(true), 300);
    }
  }, [index, text, delay]);

  const renderText = () => {
    if (!displayText.includes(highlightWord)) return displayText;
    const parts = displayText.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className={highlightClass}>{highlightWord}</span>
        {parts[1] || ""}
      </>
    );
  };

  return (
    <span className="relative">
      {renderText()}
      {showEmoji && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-block ml-2"
        >
          {emoji}
        </motion.span>
      )}
      {!isComplete && (
        <span className="absolute -right-1 top-0 h-full w-0.5 bg-primary animate-pulse" />
      )}
    </span>
  );
}
