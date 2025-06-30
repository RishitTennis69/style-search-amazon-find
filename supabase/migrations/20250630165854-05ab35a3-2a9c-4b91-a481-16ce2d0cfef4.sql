
-- Modify the user_preferences table to simplify the style selection
ALTER TABLE public.user_preferences 
  DROP COLUMN IF EXISTS style,
  DROP COLUMN IF EXISTS colors,
  ADD COLUMN IF NOT EXISTS age_range TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS confirmed_style_description TEXT,
  ADD COLUMN IF NOT EXISTS selected_outfit_images TEXT[] DEFAULT '{}';

-- Modify the search_history table to remove redundant fields
ALTER TABLE public.search_history 
  DROP COLUMN IF EXISTS formality,
  DROP COLUMN IF EXISTS time_of_day,
  ADD COLUMN IF NOT EXISTS activity_type TEXT,
  ADD COLUMN IF NOT EXISTS style_description TEXT;

-- Add a new table to store outfit images and their AI-generated descriptions
CREATE TABLE IF NOT EXISTS public.outfit_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  age_range TEXT NOT NULL,
  gender TEXT NOT NULL,
  outfit_images TEXT[] NOT NULL,
  ai_descriptions TEXT[] NOT NULL,
  selected_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS for the new table
ALTER TABLE public.outfit_suggestions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for outfit_suggestions
CREATE POLICY "Users can view their own outfit suggestions" 
  ON public.outfit_suggestions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own outfit suggestions" 
  ON public.outfit_suggestions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outfit suggestions" 
  ON public.outfit_suggestions 
  FOR UPDATE 
  USING (auth.uid() = user_id);
