"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { TitlePaperSuggestion, TitleSuggestionCardProps } from "@/types/title-suggestion";
import { slideUp, stagger } from "./ui/animations";

export function TitleSuggestionCard({ suggestions }: TitleSuggestionCardProps) {
  const [active, setActive] = useState<TitlePaperSuggestion | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () => setActive(null));

  const getSuggestionCardHeight = () => {
    return 88;
  };
  
  const getMaxHeight = () => {
    const heightPerCard = getSuggestionCardHeight();
    return `${heightPerCard * 3}px`;
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.15 },
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <div className="flex justify-between items-start p-6">
                <div>
                  <motion.h3
                    layoutId={`title-${active.title}-${id}`}
                    className="font-bold text-xl text-neutral-700 dark:text-neutral-200"
                  >
                    {active.title}
                  </motion.h3>
                </div>
              </div>
              <div className="pt-2 relative px-6 pb-6">
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="text-neutral-600 text-xs md:text-sm lg:text-base flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400"
                >
                  {active.briefOverview}
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-lg w-full"
        style={{
          maxHeight: suggestions.length > 3 ? getMaxHeight() : 'auto',
          overflowY: suggestions.length > 3 ? 'auto' : 'visible',
        }}
      >
        <motion.ul
          variants={stagger}
          className="w-full gap-2"
        >
          {suggestions.map((suggestion) => (
            <motion.div
              variants={slideUp}
              layoutId={`card-${suggestion.title}-${id}`}
              key={`card-${suggestion.title}-${id}`}
              onClick={() => setActive(suggestion)}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.02)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="p-3 flex justify-between rounded-xl cursor-pointer border border-gray-100 dark:border-gray-800 mb-2 dark:hover:bg-neutral-800"
            >
              <div className="flex flex-col w-full">
                <motion.h3
                  layoutId={`title-${suggestion.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200"
                >
                  {suggestion.title}
                </motion.h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1 truncate">
                  {suggestion.briefOverview}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.ul>
      </motion.div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0, rotate: -90 }}
      animate={{ opacity: 1, rotate: 0 }}
      exit={{
        opacity: 0,
        rotate: 90,
        transition: { duration: 0.15 },
      }}
      transition={{ type: "spring", stiffness: 200 }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};