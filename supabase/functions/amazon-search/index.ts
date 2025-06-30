
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

    console.log('Searching products for:', { 
      gender: preferences.gender, 
      age: preferences.age_range, 
      occasion: occasion.occasion, 
      colors: preferences.colors,
      size: preferences.size
    });

    // Build search query based on preferences
    const searchQuery = buildSearchQuery(preferences, occasion);
    console.log('Search query:', searchQuery);

    const products = await searchAmazonProducts(searchQuery, preferences);
    
    return new Response(
      JSON.stringify({
        products: products,
        totalResults: products.length,
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

function buildSearchQuery(preferences: any, occasion: any): string {
  const { gender, age_range, colors, size } = preferences;
  const { occasion: occ, season } = occasion;
  
  const ageNum = parseInt(age_range);
  const isMinor = ageNum < 18;
  
  // Build search terms
  let searchTerms = [];
  
  // Add gender/age category
  if (isMinor) {
    searchTerms.push(gender === 'boy' ? 'boys' : 'girls');
  } else {
    searchTerms.push(gender === 'male' ? 'mens' : 'womens');
  }
  
  // Add clothing type based on occasion
  if (occ.toLowerCase().includes('formal') || occ.toLowerCase().includes('wedding')) {
    searchTerms.push(isMinor ? 'dress shirt' : 'formal wear');
  } else if (occ.toLowerCase().includes('work') || occ.toLowerCase().includes('office')) {
    searchTerms.push('business casual');
  } else {
    searchTerms.push('casual wear');
  }
  
  // Add colors if specified
  if (colors && colors.length > 0) {
    searchTerms.push(colors[0]); // Use first color preference
  }
  
  // Add size
  if (size) {
    searchTerms.push(`size ${size}`);
  }
  
  return searchTerms.join(' ');
}

async function searchAmazonProducts(query: string, preferences: any) {
  const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
  
  if (!rapidApiKey) {
    console.error('RAPIDAPI_KEY not found');
    return generateFallbackProducts(preferences);
  }

  try {
    const response = await fetch('https://amazon-products1.p.rapidapi.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'amazon-products1.p.rapidapi.com'
      },
      body: JSON.stringify({
        query: query,
        country: 'US',
        category: 'fashion'
      })
    });

    if (!response.ok) {
      console.error('RapidAPI request failed:', response.status, response.statusText);
      return generateFallbackProducts(preferences);
    }

    const data = await response.json();
    console.log('RapidAPI response:', data);

    if (!data || !data.results || !Array.isArray(data.results)) {
      console.error('Invalid response format from RapidAPI');
      return generateFallbackProducts(preferences);
    }

    // Transform RapidAPI results to our format
    return data.results.slice(0, 12).map((product: any, index: number) => ({
      id: product.asin || `product-${index}`,
      title: product.title || 'Product',
      price: product.price || '$0.00',
      rating: product.rating || 4.0,
      reviews: product.reviews_count || 0,
      image: product.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      url: product.url || '#',
      brand: product.brand || 'Unknown',
      description: product.description || 'Quality clothing item'
    }));

  } catch (error) {
    console.error('Error calling RapidAPI:', error);
    return generateFallbackProducts(preferences);
  }
}

function generateFallbackProducts(preferences: any) {
  const { gender, age_range, size } = preferences;
  const ageNum = parseInt(age_range);
  const isMinor = ageNum < 18;
  
  // Generate fallback products based on preferences
  const fallbackProducts = [
    {
      id: 'fallback-1',
      title: `${isMinor ? (gender === 'boy' ? 'Boys' : 'Girls') : (gender === 'male' ? 'Mens' : 'Womens')} Cotton T-Shirt (${size})`,
      price: '$19.99',
      rating: 4.3,
      reviews: 1247,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      url: 'https://www.amazon.com/s?k=cotton+t-shirt+' + encodeURIComponent(`${gender} ${size}`),
      brand: 'Amazon Essentials',
      description: 'Comfortable cotton t-shirt perfect for everyday wear'
    },
    {
      id: 'fallback-2',
      title: `${isMinor ? (gender === 'boy' ? 'Boys' : 'Girls') : (gender === 'male' ? 'Mens' : 'Womens')} Jeans (${size})`,
      price: '$34.99',
      rating: 4.1,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
      url: 'https://www.amazon.com/s?k=jeans+' + encodeURIComponent(`${gender} ${size}`),
      brand: "Levi's",
      description: 'Classic fit jeans with comfort stretch'
    },
    {
      id: 'fallback-3',
      title: `${isMinor ? (gender === 'boy' ? 'Boys' : 'Girls') : (gender === 'male' ? 'Mens' : 'Womens')} Casual Shirt (${size})`,
      price: '$27.99',
      rating: 4.2,
      reviews: 634,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop',
      url: 'https://www.amazon.com/s?k=casual+shirt+' + encodeURIComponent(`${gender} ${size}`),
      brand: 'Goodthreads',
      description: 'Versatile casual shirt for any occasion'
    }
  ];

  return fallbackProducts;
}
