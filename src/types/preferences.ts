
export interface UserPreferences {
  age_range?: string;
  gender?: string;
  budget?: string;
  size?: string;
  weight?: number;
  height?: number;
  brands?: string[];
  colors?: string[];
  confirmed_style_description?: string;
  selected_outfit_images?: string[];
}

export interface OccasionDetails {
  occasion: string;
  season: string;
  activity_type: string;
  specific_needs: string;
}

export interface OutfitSuggestion {
  id: string;
  user_id: string;
  age_range: string;
  gender: string;
  outfit_images: string[];
  ai_descriptions: string[];
  selected_description?: string;
  created_at: string;
}
