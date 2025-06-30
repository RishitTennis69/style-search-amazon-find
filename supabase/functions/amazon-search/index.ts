
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

    // Mock Amazon-style product results (in a real implementation, you'd use Amazon's API)
    const mockProducts = [
      {
        id: '1',
        title: `${preferences.style[0] || 'Stylish'} ${occasion.occasion} Outfit`,
        price: '$49.99',
        rating: 4.5,
        reviews: 1234,
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop',
        url: '#',
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
        url: '#',
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
        url: '#',
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
        url: '#',
        brand: 'ModernWear',
        description: `Essential ${preferences.style[1] || 'modern'} pieces that work for any ${occasion.occasion.toLowerCase()}.`
      }
    ];

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
