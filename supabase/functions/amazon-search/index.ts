
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  preferences: {
    style: string[];
    colors: string[];
    budget: string;
    size: string;
    brands: string[];
    age_range: string;
    gender: string;
    weight: number;
    height: number;
  };
  occasion: {
    occasion: string;
    season: string;
    timeOfDay: string;
    formality: string;
    specificNeeds: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user from the auth header
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { preferences, occasion }: SearchRequest = await req.json();

    // Store search history
    await supabaseClient
      .from('search_history')
      .insert({
        user_id: user.id,
        occasion: occasion.occasion,
        season: occasion.season,
        time_of_day: occasion.timeOfDay,
        formality: occasion.formality,
        specific_needs: occasion.specificNeeds,
        preferences: preferences,
      });

    console.log('Generating AI-powered recommendations for:', { 
      gender: preferences.gender, 
      age: preferences.age_range, 
      occasion: occasion.occasion,
      weight: preferences.weight,
      height: preferences.height
    });
    
    // Use AI to determine size and generate search queries
    const aiSize = await determineAISize(preferences);
    const searchQueries = await generateAISearchQueries(preferences, occasion, aiSize);
    const products = await fetchProductsFromQueries(searchQueries, aiSize);
    
    return new Response(
      JSON.stringify({
        products: products,
        totalResults: products.length,
        aiDeterminedSize: aiSize,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in amazon-search function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function determineAISize(preferences: any): Promise<string> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY not found');
    return 'M'; // fallback
  }

  const prompt = `You are a professional clothing size expert. Based on the following measurements and demographics, determine the most accurate clothing size using industry standards.

Person Details:
- Height: ${Math.floor(preferences.height / 12)} feet ${preferences.height % 12} inches (${preferences.height} total inches)
- Weight: ${preferences.weight} pounds
- Age: ${preferences.age_range} years old
- Gender: ${preferences.gender}

Please provide ONLY the size in this exact format based on gender and age:
- For children under 18: "Boys XS", "Girls M", "Boys L", etc.
- For adults: "Mens S", "Womens M", "Mens XL", etc.

Consider industry sizing standards and body proportions for the given age group. Respond with ONLY the size, nothing else.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    const aiSize = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'M';
    console.log('AI determined size:', aiSize);
    return aiSize;
  } catch (error) {
    console.error('Error calling Gemini API for size:', error);
    return 'M'; // fallback
  }
}

async function generateAISearchQueries(preferences: any, occasion: any, size: string): Promise<string[]> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY not found');
    return ['clothing']; // fallback
  }

  const prompt = `You are an expert fashion stylist and e-commerce search specialist. Generate 5-8 specific Amazon search queries for clothing that would be perfect for this person and occasion.

Person Profile:
- Age: ${preferences.age_range} years old
- Gender: ${preferences.gender}
- Size: ${size}
- Budget: ${preferences.budget}
- Preferred Brands: ${preferences.brands?.join(', ') || 'any'}
- Style Preferences: ${preferences.style?.join(', ') || 'any'}
- Colors: ${preferences.colors?.join(', ') || 'any'}

Occasion Details:
- Event: ${occasion.occasion}
- Season: ${occasion.season}
- Formality: ${occasion.formality}
- Specific Needs: ${occasion.specificNeeds || 'none'}

Generate search queries that are:
1. Specific enough to find relevant products
2. Include appropriate keywords for the age group (kids vs adult clothing)
3. Consider the occasion and season
4. Include size when relevant
5. Are formatted for Amazon search (use + instead of spaces)

Provide 5-8 search queries, one per line, no numbering or bullets. Example format:
mens+casual+button+shirt+medium
womens+summer+dress+size+large
boys+khaki+pants+size+10

Respond with ONLY the search queries, nothing else.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    const aiQueries = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    const queries = aiQueries.split('\n').filter(q => q.trim()).slice(0, 8);
    console.log('AI generated search queries:', queries);
    return queries.length > 0 ? queries : ['clothing'];
  } catch (error) {
    console.error('Error calling Gemini API for queries:', error);
    return ['clothing']; // fallback
  }
}

async function fetchProductsFromQueries(searchQueries: string[], size: string): Promise<any[]> {
  const products = [];
  
  // For now, we'll generate mock products based on the AI queries
  // In the future, this could integrate with RapidAPI for real Amazon data
  for (let i = 0; i < Math.min(searchQueries.length, 6); i++) {
    const query = searchQueries[i];
    const product = {
      id: `ai-${query}-${i}`,
      title: formatQueryToTitle(query, size),
      price: generateRealisticPrice(),
      rating: 4.0 + Math.random(),
      reviews: Math.floor(Math.random() * 1000) + 100,
      image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=300&h=300&fit=crop`,
      url: `https://www.amazon.com/s?k=${query}&ref=sr_st_relevancerank`,
      brand: generateBrandFromQuery(query),
      description: `AI-recommended ${formatQueryToTitle(query, size).toLowerCase()} perfect for your style and occasion.`
    };
    products.push(product);
  }
  
  return products;
}

function formatQueryToTitle(query: string, size: string): string {
  const words = query.replace(/\+/g, ' ').split(' ');
  const formatted = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  return `${formatted} (${size})`;
}

function generateRealisticPrice(): string {
  const prices = ['$19.99', '$24.99', '$29.99', '$34.99', '$39.99', '$44.99', '$49.99', '$59.99', '$69.99', '$79.99'];
  return prices[Math.floor(Math.random() * prices.length)];
}

function generateBrandFromQuery(query: string): string {
  const brands = ['Nike', 'Adidas', 'Levi\'s', 'Gap', 'H&M', 'Zara', 'Uniqlo', 'Calvin Klein'];
  return brands[Math.floor(Math.random() * brands.length)];
}
