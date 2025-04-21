export interface TitlePaperSuggestion {
  title: string;
  briefOverview: string;
}

export interface TitlePaperSuggestionResponse {
  suggestions: TitlePaperSuggestion[];
}

export interface TitleSuggestionCardProps {
  suggestions: TitlePaperSuggestion[];
}
