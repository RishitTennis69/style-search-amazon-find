
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

    console.log('Generating products for:', { gender: preferences.gender, age: preferences.age_range, occasion: occasion.occasion });
    
    const targetedProducts = generateTargetedProducts(preferences, occasion);
    
    return new Response(
      JSON.stringify({
        products: targetedProducts,
        totalResults: targetedProducts.length,
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

function generateTargetedProducts(preferences: any, occasion: any) {
  const { gender, size, age_range } = preferences;
  const { occasion: occ, season } = occasion;
  
  const ageNum = parseInt(age_range);
  const isMinor = ageNum < 18;
  
  console.log('Product generation params:', { gender, isMinor, occasion: occ });
  
  // Use working Amazon search URLs instead of direct product links
  const searchTermsByCategory = {
    // Boys clothing
    boys: {
      shirts: [
        { searchTerm: 'boys+cotton+t-shirt', title: 'Boys Cotton T-Shirt', price: '$12.99' },
        { searchTerm: 'boys+long+sleeve+shirt', title: 'Boys Long Sleeve Shirt', price: '$16.99' },
        { searchTerm: 'boys+polo+shirt', title: 'Boys Polo Shirt', price: '$14.99' }
      ],
      pants: [
        { searchTerm: 'boys+jeans', title: 'Boys Jeans', price: '$24.99' },
        { searchTerm: 'boys+khaki+pants', title: 'Boys Khaki Pants', price: '$19.99' },
        { searchTerm: 'boys+cargo+shorts', title: 'Boys Cargo Shorts', price: '$16.99' }
      ],
      outerwear: [
        { searchTerm: 'boys+hoodie', title: 'Boys Hoodie', price: '$22.99' },
        { searchTerm: 'boys+jacket', title: 'Boys Jacket', price: '$34.99' }
      ]
    },
    // Girls clothing
    girls: {
      shirts: [
        { searchTerm: 'girls+t-shirt', title: 'Girls T-Shirt', price: '$11.99' },
        { searchTerm: 'girls+blouse', title: 'Girls Blouse', price: '$18.99' },
        { searchTerm: 'girls+long+sleeve+top', title: 'Girls Long Sleeve Top', price: '$15.99' }
      ],
      pants: [
        { searchTerm: 'girls+jeans', title: 'Girls Jeans', price: '$23.99' },
        { searchTerm: 'girls+leggings', title: 'Girls Leggings', price: '$12.99' },
        { searchTerm: 'girls+shorts', title: 'Girls Shorts', price: '$14.99' }
      ],
      dresses: [
        { searchTerm: 'girls+casual+dress', title: 'Girls Casual Dress', price: '$19.99' },
        { searchTerm: 'girls+party+dress', title: 'Girls Party Dress', price: '$28.99' }
      ],
      outerwear: [
        { searchTerm: 'girls+cardigan', title: 'Girls Cardigan', price: '$21.99' },
        { searchTerm: 'girls+jacket', title: 'Girls Jacket', price: '$32.99' }
      ]
    },
    // Men's clothing
    mens: {
      shirts: [
        { searchTerm: 'mens+dress+shirt', title: 'Men\'s Dress Shirt', price: '$29.99' },
        { searchTerm: 'mens+t-shirt', title: 'Men\'s T-Shirt', price: '$15.99' },
        { searchTerm: 'mens+polo+shirt', title: 'Men\'s Polo Shirt', price: '$24.99' }
      ],
      pants: [
        { searchTerm: 'mens+jeans', title: 'Men\'s Jeans', price: '$39.99' },
        { searchTerm: 'mens+dress+pants', title: 'Men\'s Dress Pants', price: '$34.99' },
        { searchTerm: 'mens+chinos', title: 'Men\'s Chinos', price: '$28.99' }
      ],
      outerwear: [
        { searchTerm: 'mens+button+shirt', title: 'Men\'s Button Shirt', price: '$32.99' },
        { searchTerm: 'mens+jacket', title: 'Men\'s Jacket', price: '$49.99' }
      ]
    },
    // Women's clothing
    womens: {
      shirts: [
        { searchTerm: 'womens+blouse', title: 'Women\'s Blouse', price: '$26.99' },
        { searchTerm: 'womens+t-shirt', title: 'Women\'s T-Shirt', price: '$18.99' },
        { searchTerm: 'womens+long+sleeve+top', title: 'Women\'s Long Sleeve Top', price: '$22.99' }
      ],
      pants: [
        { searchTerm: 'womens+jeans', title: 'Women\'s Jeans', price: '$34.99' },
        { searchTerm: 'womens+dress+pants', title: 'Women\'s Dress Pants', price: '$29.99' },
        { searchTerm: 'womens+leggings', title: 'Women\'s Leggings', price: '$19.99' }
      ],
      dresses: [
        { searchTerm: 'womens+casual+dress', title: 'Women\'s Casual Dress', price: '$34.99' },
        { searchTerm: 'womens+formal+dress', title: 'Women\'s Formal Dress', price: '$49.99' }
      ],
      outerwear: [
        { searchTerm: 'womens+cardigan', title: 'Women\'s Cardigan', price: '$32.99' },
        { searchTerm: 'womens+blazer', title: 'Women\'s Blazer', price: '$44.99' }
      ]
    }
  };

  // Determine gender category for product selection
  let genderCategory = '';
  if (isMinor) {
    genderCategory = gender === 'boy' ? 'boys' : gender === 'girl' ? 'girls' : 'boys'; // Default to boys for unisex minors
  } else {
    genderCategory = gender === 'male' ? 'mens' : gender === 'female' ? 'womens' : 'mens'; // Default to mens for unisex adults
  }

  const categoryProducts = searchTermsByCategory[genderCategory];
  const products = [];

  // Select appropriate items based on occasion and gender
  if (occ.toLowerCase().includes('work') || occ.toLowerCase().includes('formal')) {
    // Formal occasions
    products.push(...categoryProducts.shirts.slice(0, 2));
    products.push(...categoryProducts.pants.slice(0, 1));
    if (categoryProducts.outerwear) {
      products.push(categoryProducts.outerwear[1]); // More formal outerwear
    }
  } else if (occ.toLowerCase().includes('party') || occ.toLowerCase().includes('date')) {
    // Party/social occasions
    if (genderCategory === 'girls' || genderCategory === 'womens') {
      products.push(...categoryProducts.dresses.slice(0, 1));
      products.push(...categoryProducts.shirts.slice(0, 1));
    } else {
      products.push(...categoryProducts.shirts.slice(0, 2));
    }
    products.push(...categoryProducts.pants.slice(0, 1));
  } else {
    // Casual occasions
    products.push(...categoryProducts.shirts.slice(0, 2));
    products.push(...categoryProducts.pants.slice(0, 2));
    if (categoryProducts.outerwear) {
      products.push(categoryProducts.outerwear[0]);
    }
  }

  // Convert to final format with working Amazon search URLs
  return products.map((product, index) => ({
    id: `${product.searchTerm}-${index}`,
    title: `${product.title} (${size})`,
    price: product.price,
    rating: 4.0 + Math.random(),
    reviews: Math.floor(Math.random() * 1000) + 100,
    image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=300&h=300&fit=crop`,
    url: `https://www.amazon.com/s?k=${product.searchTerm}+size+${size}&ref=sr_st_relevancerank`,
    brand: getBrandForCategory(genderCategory),
    description: `Perfect ${product.title.toLowerCase()} for ${genderCategory} size ${size}. Great for ${occ.toLowerCase()} occasions.`
  }));
}

function getBrandForCategory(category: string): string {
  const brands = {
    boys: ['Carter\'s', 'Nike Kids', 'Adidas Kids'],
    girls: ['Carter\'s', 'Disney', 'Justice'],
    mens: ['Levi\'s', 'Nike', 'Adidas', 'Gap'],
    womens: ['Levi\'s', 'Nike', 'Zara', 'H&M']
  };
  
  const categoryBrands = brands[category] || brands.mens;
  return categoryBrands[Math.floor(Math.random() * categoryBrands.length)];
}
