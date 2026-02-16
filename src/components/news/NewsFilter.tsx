"use client";

import { motion } from "framer-motion";

type Category = "all" | "clubnieuws" | "ploegnieuws" | "evenementen";

interface NewsFilterProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function NewsFilter({ activeCategory, onCategoryChange }: NewsFilterProps) {
  const categories: { value: Category; label: string }[] = [
    { value: "all", label: "Alles" },
    { value: "clubnieuws", label: "Clubnieuws" },
    { value: "ploegnieuws", label: "Ploegnieuws" },
    { value: "evenementen", label: "Evenementen" }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <motion.button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
            activeCategory === category.value
              ? "bg-primary text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category.label}
        </motion.button>
      ))}
    </div>
  );
}
