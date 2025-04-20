"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { TitleSuggestionCard } from "@/components/title-suggestion-card";
import { useTitleSuggestions } from "@/hooks/use-title-suggestions";

export default function Home() {
  return <ThinkOfATitle />;
}

function SuggestionButton({ emoji, text, onClick }: { emoji: string; text: string; onClick: () => void }) {
  return (
    <button 
      className="px-4 py-2 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-full text-sm flex items-center sm:justify-start justify-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors border border-gray-200 dark:border-zinc-700 sm:max-w-fit max-w-full w-full sm:w-auto"
      onClick={onClick}
    >
      <span>{emoji}</span> <span className="truncate">{text}</span>
    </button>
  );
}

export function ThinkOfATitle() {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    suggestions,
    isLoading,
    error,
    submittedQuery, 
    fetchSuggestions,
    resetSuggestions
  } = useTitleSuggestions();

  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setInputValue(queryParam);
      fetchSuggestions(queryParam);
    }
  }, []);

  const placeholders = [
    "for a doctoral dissertation",
    "for an undergraduate thesis",
    "for a scientific research paper",
    "for a literature review",
    "for an academic conference"
  ];

  const suggestionExamples = [
    { emoji: "💻", text: "Computer Science" },
    { emoji: "🖥️", text: "Information Technology" },
    { emoji: "🤖", text: "Artificial Intelligence" },
    { emoji: "🧠", text: "Machine Learning" },
    { emoji: "⚙️", text: "System Development" }
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
    resetSuggestions();
    setInputValue("");
    router.push("/", { scroll: false });
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
    <div className="h-screen w-full flex flex-col justify-center items-center px-4">
      <div className={`w-full max-w-6xl transition-all duration-300 ${hasSearchResults ? 'flex flex-col md:flex-row gap-8' : 'flex flex-col items-center'}`}>
        <div className={`${hasSearchResults ? 'w-full md:w-1/2 md:self-center' : 'w-full max-w-xl mx-auto text-center'}`}>
          <h2 className={`mb-8 ${hasSearchResults ? 'text-3xl sm:text-5xl text-left' : 'text-4xl sm:text-7xl text-center'} dark:text-white text-black font-bold transition-all duration-300`}>
            ThinkOfATitle
          </h2>
          
          <div className="relative">
            <PlaceholdersAndVanishInput 
              placeholders={placeholders} 
              onChange={handleChange} 
              onSubmit={onSubmit}
              disabled={isLoading}
            />
            
            {submittedQuery && (
              <div className="mt-4 flex justify-end space-x-2">
                <button 
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-colors bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                  disabled={isLoading}
                >
                  ↺ Reset
                </button>
                <button 
                  onClick={handleRegenerate}
                  className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-colors bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  disabled={isLoading}
                >
                  ↻ Regenerate
                </button>
              </div>
            )}
          </div>
          
          {/* Only show suggestion buttons when no results are displayed */}
          {!hasSearchResults && (
            <div className="flex flex-wrap justify-center mt-8 gap-2 w-full">
              {suggestionExamples.map((suggestion, index) => (
                <SuggestionButton 
                  key={index}
                  emoji={suggestion.emoji} 
                  text={suggestion.text} 
                  onClick={() => handleSuggestionClick(suggestion.text)}
                />
              ))}
            </div>
          )}
          
          {error && (
            <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
              <p>Error: {error}</p>
            </div>
          )}
        </div>
        
        {hasSearchResults && (
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">You asked for:</p>
              <p className="text-lg font-medium text-black dark:text-white">{submittedQuery}</p>
            </div>
            
            {!isLoading && suggestions.length > 0 && (
              <>
                <TitleSuggestionCard suggestions={suggestions} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
