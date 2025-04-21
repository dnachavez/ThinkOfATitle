"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { TitleSuggestionCard } from "@/components/title-suggestion-card";
import { useTitleSuggestions } from "@/hooks/use-title-suggestions";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedButton, slideUp, stagger } from "@/components/ui/animations";
import { CardSkeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ThinkOfATitle />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <motion.div
      className="h-screen w-full flex flex-col justify-center items-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="w-full max-w-xl mx-auto text-center">
        <motion.h2 className="mb-8 text-4xl sm:text-7xl text-center dark:text-white text-black font-bold transition-all duration-300">
          ThinkOfATitle
        </motion.h2>
        <div className="w-full max-w-xl mx-auto">
          <CardSkeleton />
        </div>
      </motion.div>
    </motion.div>
  );
}

function SuggestionButton({
  emoji,
  text,
  onClick,
}: {
  emoji: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <AnimatedButton
      className="px-4 py-2 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-full text-sm flex items-center sm:justify-start justify-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all duration-200 border border-gray-200 dark:border-zinc-700 sm:max-w-fit max-w-full w-full sm:w-auto"
      onClick={onClick}
    >
      <span>{emoji}</span> <span className="truncate">{text}</span>
    </AnimatedButton>
  );
}

function ThinkOfATitle() {
  const [inputValue, setInputValue] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { suggestions, isLoading, error, submittedQuery, fetchSuggestions, resetSuggestions } =
    useTitleSuggestions();

  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam && queryParam !== submittedQuery) {
      setInputValue(queryParam);
      fetchSuggestions(queryParam);
    }
  }, [searchParams, fetchSuggestions, submittedQuery]);

  const placeholders = [
    "for a doctoral dissertation",
    "for an undergraduate thesis",
    "for a scientific research paper",
    "for a literature review",
    "for an academic conference",
  ];

  const suggestionExamples = [
    { emoji: "💻", text: "Computer Science" },
    { emoji: "🖥️", text: "Information Technology" },
    { emoji: "🤖", text: "Artificial Intelligence" },
    { emoji: "🧠", text: "Machine Learning" },
    { emoji: "⚙️", text: "System Development" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    router.push(`/?q=${encodeURIComponent(inputValue)}`, { scroll: false });
    await fetchSuggestions(inputValue);
  };

  const handleReset = () => {
    if (isResetting) return;

    setIsResetting(true);

    router.replace("/", { scroll: false });

    setTimeout(() => {
      setInputValue("");
      resetSuggestions();

      setTimeout(() => {
        setIsResetting(false);
      }, 500);
    }, 100);
  };

  const handleRegenerate = () => {
    if (submittedQuery) {
      fetchSuggestions(submittedQuery);
      router.push(`/?q=${encodeURIComponent(submittedQuery)}`, { scroll: false });
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    router.push(`/?q=${encodeURIComponent(text)}`, { scroll: false });
    fetchSuggestions(text);
  };

  const hasSearchResults = submittedQuery || isLoading;

  return (
    <motion.div
      className="h-screen w-full flex flex-col justify-center items-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`w-full max-w-6xl transition-all duration-300 ${hasSearchResults ? "flex flex-col md:flex-row gap-8" : "flex flex-col items-center"}`}
        layout="position"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      >
        <motion.div
          layout="position"
          className={`${hasSearchResults ? "w-full md:w-1/2 md:self-center" : "w-full max-w-xl mx-auto text-center"}`}
          transition={{ type: "spring", duration: 0.7 }}
        >
          <motion.h2
            layout="position"
            className={`mb-8 ${hasSearchResults ? "text-3xl sm:text-5xl text-left" : "text-4xl sm:text-7xl text-center"} dark:text-white text-black font-bold transition-all duration-300`}
            transition={{ duration: 0.5 }}
          >
            ThinkOfATitle
          </motion.h2>

          <motion.div className="relative" layout="position">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
              disabled={isLoading}
            />

            <AnimatePresence>
              {submittedQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="mt-4 flex justify-end space-x-2"
                >
                  <AnimatedButton
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-all bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 shadow-sm hover:shadow hover:bg-red-200 dark:hover:bg-red-800"
                    disabled={isLoading || isResetting}
                  >
                    <motion.span
                      animate={{
                        rotate: isResetting ? [0, -360] : 0,
                        scale: isResetting ? [1, 1.2, 1] : 1,
                      }}
                      transition={{
                        duration: isResetting ? 0.5 : 0.2,
                        ease: "easeInOut",
                      }}
                    >
                      ↺
                    </motion.span>
                    Reset
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={handleRegenerate}
                    className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-all bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm hover:shadow hover:bg-blue-200 dark:hover:bg-blue-800"
                    disabled={isLoading}
                  >
                    <motion.span
                      animate={{
                        rotate: isLoading ? [0, 360] : 0,
                      }}
                      transition={{
                        repeat: isLoading ? Infinity : 0,
                        duration: 1.5,
                      }}
                    >
                      ↻
                    </motion.span>
                    Regenerate
                  </AnimatedButton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Only show suggestion buttons when no results are displayed */}
          <AnimatePresence mode="wait">
            {!hasSearchResults && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={stagger}
                className="flex flex-wrap justify-center mt-8 gap-2 w-full"
              >
                {suggestionExamples.map((suggestion, index) => (
                  <motion.div key={index} variants={slideUp} custom={index * 0.1}>
                    <SuggestionButton
                      emoji={suggestion.emoji}
                      text={suggestion.text}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg"
              >
                <p>Error: {error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="wait">
          {hasSearchResults && (
            <motion.div
              layout="position"
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div className="mb-4">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  You asked for:
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="text-lg font-medium text-black dark:text-white"
                >
                  {submittedQuery}
                </motion.p>
              </motion.div>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardSkeleton />
                  </motion.div>
                ) : suggestions.length > 0 ? (
                  <motion.div
                    key="suggestions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TitleSuggestionCard suggestions={suggestions} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
