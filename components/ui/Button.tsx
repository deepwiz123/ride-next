"use client";

import { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "solid" | "outline";
}

export function Button({ variant = "solid", children, ...props }: ButtonProps) {
  const baseStyles =
    "w-full p-2 rounded-md font-medium transition-all duration-200 ease-in-out";

  const variantStyles =
    variant === "solid"
      ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      : "border border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-800/20";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variantStyles} ${props.className || ""}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
