"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("h-4 w-full rounded-md bg-gray-200 dark:bg-zinc-800", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="max-w-lg w-full gap-2">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="p-3 flex justify-between rounded-xl border border-gray-100 dark:border-gray-800 mb-2 relative overflow-hidden"
        >
          <div className="flex flex-col w-full gap-2">
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-full h-3" />
          </div>
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white to-transparent dark:via-zinc-700"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        </div>
      ))}
    </div>
  );
}
