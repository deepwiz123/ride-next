"use client";

import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import { motion } from "framer-motion";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  register?: any; // React Hook Form register prop
}

export function Input({ label, error, register, ...props }: InputProps, ref?: React.Ref<HTMLInputElement>) {
  // Use the ref to forward it to the input element
  return (
    <div className="w-full space-y-1">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <motion.input
        animate={{
          scale: 1,
          transition: {
            duration: 0.2,
            ease: "easeInOut",
          },
        }}
        {...props}
        {...register} // Spread register props for React Hook Form
        className={`w-full p-2 border rounded-md outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${props.className || ""}`}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}