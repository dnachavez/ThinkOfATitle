import { useState } from 'react';
import { generateContent } from '@/services/gemini-api';
import { TitlePaperSuggestion } from '@/types/title-suggestion';
import { parseGeminiResponse } from '@/utils/parse-gemini-response';

export function useTitleSuggestions() {
  const [suggestions, setSuggestions] = useState<TitlePaperSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState('');

  const fetchSuggestions = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setSubmittedQuery(query);

    try {
      const response = await generateContent(query);
      const parsedSuggestions = parseGeminiResponse(response);
      
      if (parsedSuggestions.length === 0) {
        throw new Error('No suggestions were returned');
      }
      
      setSuggestions(parsedSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSuggestions = () => {
    setSuggestions([]);
    setSubmittedQuery('');
    setError(null);
  };

  return {
    suggestions,
    isLoading,
    error,
    submittedQuery,
    fetchSuggestions,
    resetSuggestions
  };
}