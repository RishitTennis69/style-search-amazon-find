
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

    // Generate search terms based on preferences and occasion
    const styleTerms = preferences.style.join(' ');
    const colorTerms = preferences.colors.join(' ');
    const brandTerms = preferences.brands.length > 0 ? preferences.brands.join(' ') : '';
    
    const searchQuery = `${styleTerms} ${colorTerms} ${brandTerms} ${occasion.occasion} ${occasion.formality} ${occasion.season} clothing fashion`.trim();

    try {
      // Use RapidAPI's Amazon Product API
      const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
      
      if (!rapidApiKey) {
        console.log('No RapidAPI key found, using mock data');
        // Fallback to enhanced mock data with real Amazon search links
        const mockProducts = generateMockProductsWithRealLinks(preferences, occasion, searchQuery);
        
        return new Response(
          JSON.stringify({
            products: mockProducts,
            searchQuery,
            totalResults: mockProducts.length,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Call Amazon Product API via RapidAPI
      const apiResponse = await fetch('https://amazon-product-reviews-keywords.p.rapidapi.com/product/search', {
        method: 'POST',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'amazon-product-reviews-keywords.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: searchQuery,
          country: 'US',
          category: 'fashion'
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`API call failed: ${apiResponse.status}`);
      }

      const apiData = await apiResponse.json();
      
      // Transform API response to our product format
      const products = (apiData.products || []).slice(0, 8).map((item: any, index: number) => ({
        id: item.asin || `product-${index}`,
        title: item.title || `${preferences.style[0] || 'Stylish'} ${occasion.occasion} Outfit`,
        price: item.price || '$49.99',
        rating: item.rating || (4.0 + Math.random()),
        reviews: item.reviewsCount || Math.floor(Math.random() * 1000) + 100,
        image: item.thumbnail || `https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop`,
        url: item.url || `https://www.amazon.com/dp/${item.asin || 'B08N5WRWNW'}`,
        brand: item.brand || preferences.brands[0] || 'Fashion Brand',
        description: item.description || `Perfect ${preferences.style[0] || 'stylish'} outfit for ${occasion.occasion.toLowerCase()}. Made with premium materials.`
      }));

      return new Response(
        JSON.stringify({
          products: products.length > 0 ? products : generateMockProductsWithRealLinks(preferences, occasion, searchQuery),
          searchQuery,
          totalResults: products.length,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (apiError) {
      console.error('API call failed, using mock data:', apiError);
      
      // Fallback to enhanced mock data with real Amazon search links
      const mockProducts = generateMockProductsWithRealLinks(preferences, occasion, searchQuery);
      
      return new Response(
        JSON.stringify({
          products: mockProducts,
          searchQuery,
          totalResults: mockProducts.length,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

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

function generateMockProductsWithRealLinks(preferences: any, occasion: any, searchQuery: string) {
  const baseSearchUrl = 'https://www.amazon.com/s?k=';
  
  const products = [
    {
      id: '1',
      title: `${preferences.style[0] || 'Stylish'} ${occasion.occasion} Outfit`,
      price: '$49.99',
      rating: 4.5,
      reviews: 1234,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop',
      url: `${baseSearchUrl}${encodeURIComponent(`${preferences.style[0] || 'casual'} ${occasion.occasion} outfit`)}&ref=sr_pg_1`,
      brand: preferences.brands[0] || 'StyleBrand',
      description: `Perfect ${preferences.style[0] || 'stylish'} outfit for ${occasion.occasion.toLowerCase()}. Made with premium materials.`
    },
    {
      id: '2',
      title: `Premium ${occasion.formality} Wear`,
      price: '$79.99',
      rating: 4.7,
      reviews: 856,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop',
      url: `${baseSearchUrl}${encodeURIComponent(`${occasion.formality} wear ${occasion.occasion}`)}&ref=sr_pg_1`,
      brand: 'FashionForward',
      description: `Elegant ${occasion.formality.toLowerCase()} wear perfect for ${occasion.timeOfDay.toLowerCase()} events.`
    },
    {
      id: '3',
      title: `${preferences.colors[0] || 'Classic'} ${occasion.season} Collection`,
      price: '$64.99',
      rating: 4.3,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=300&fit=crop',
      url: `${baseSearchUrl}${encodeURIComponent(`${preferences.colors[0] || 'classic'} ${occasion.season} clothing`)}&ref=sr_pg_1`,
      brand: 'SeasonStyle',
      description: `Beautiful ${preferences.colors[0] || 'classic'} pieces perfect for ${occasion.season.toLowerCase()} occasions.`
    },
    {
      id: '4',
      title: `${preferences.style[1] || 'Modern'} Essentials`,
      price: '$89.99',
      rating: 4.6,
      reviews: 432,
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop',
      url: `${baseSearchUrl}${encodeURIComponent(`${preferences.style[1] || 'modern'} essentials clothing`)}&ref=sr_pg_1`,
      brand: 'ModernWear',
      description: `Essential ${preferences.style[1] || 'modern'} pieces that work for any ${occasion.occasion.toLowerCase()}.`
    },
    {
      id: '5',
      title: `${occasion.season} Fashion Trends`,
      price: '$55.99',
      rating: 4.4,
      reviews: 789,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop',
      url: `${baseSearchUrl}${encodeURIComponent(`${occasion.season} fashion trends ${occasion.occasion}`)}&ref=sr_pg_1`,
      brand: 'TrendSetter',
      description: `Latest ${occasion.season.toLowerCase()} fashion trends perfect for your ${occasion.occasion.toLowerCase()}.`
    },
    {
      id: '6',
      title: `Comfortable ${occasion.occasion} Wear`,
      price: '$42.99',
      rating: 4.2,
      reviews: 345,
      image: 'https://images.unsplash.com/photo-1506629905607-c28b7d96a5b1?w=300&h=300&fit=crop',
      url: `${baseSearchUrl}${encodeURIComponent(`comfortable ${occasion.occasion} wear clothing`)}&ref=sr_pg_1`,
      brand: 'ComfortZone',
      description: `Comfortable and stylish clothing perfect for ${occasion.occasion.toLowerCase()} activities.`
    }
  ];

  return products;
}
