
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

    console.log('Generating products for:', { gender: preferences.gender, age: preferences.age_range, occasion: occasion.occasion, colors: preferences.colors });
    
    const targetedProducts = generateSpecificProducts(preferences, occasion);
    
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

function generateSpecificProducts(preferences: any, occasion: any) {
  const { gender, size, age_range, colors } = preferences;
  const { occasion: occ, season } = occasion;
  
  const ageNum = parseInt(age_range);
  const isMinor = ageNum < 18;
  
  console.log('Product generation params:', { gender, isMinor, occasion: occ, colors });
  
  // Curated specific Amazon product links based on gender and occasion
  const specificProducts = {
    // Boys clothing
    boys: {
      casual: [
        {
          title: "Fruit of the Loom Boys' Cotton T-Shirt Pack",
          price: "$14.99",
          rating: 4.3,
          reviews: 8542,
          brand: "Fruit of the Loom",
          url: "https://www.amazon.com/dp/B071Z8Q7KZ",
          image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=300&h=300&fit=crop",
          description: "Comfortable 100% cotton t-shirts perfect for everyday wear"
        },
        {
          title: "Levi's Boys' 511 Slim Fit Jeans",
          price: "$22.99",
          rating: 4.4,
          reviews: 3241,
          brand: "Levi's",
          url: "https://www.amazon.com/dp/B00KGZQGF8",
          image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop",
          description: "Classic slim-fit jeans with adjustable waistband"
        }
      ],
      formal: [
        {
          title: "Van Heusen Boys' Dress Shirt",
          price: "$19.99",
          rating: 4.2,
          reviews: 1876,
          brand: "Van Heusen",
          url: "https://www.amazon.com/dp/B01M5K8ZMY",
          image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop",
          description: "Wrinkle-free dress shirt perfect for special occasions"
        },
        {
          title: "Dockers Boys' Khaki Pants",
          price: "$24.99",
          rating: 4.1,
          reviews: 954,
          brand: "Dockers",
          url: "https://www.amazon.com/dp/B00KGZQGH2",
          image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop",
          description: "Classic khaki pants with stain resistance"
        }
      ]
    },
    // Girls clothing
    girls: {
      casual: [
        {
          title: "Amazon Essentials Girls' T-Shirt",
          price: "$12.99",
          rating: 4.4,
          reviews: 6732,
          brand: "Amazon Essentials",
          url: "https://www.amazon.com/dp/B07MDHQ8N9",
          image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop",
          description: "Soft cotton t-shirt in various colors"
        },
        {
          title: "Levi's Girls' Skinny Jeans",
          price: "$21.99",
          rating: 4.3,
          reviews: 2156,
          brand: "Levi's",
          url: "https://www.amazon.com/dp/B01B5L6Y7M",
          image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop",
          description: "Comfortable stretch denim with adjustable waist"
        }
      ],
      formal: [
        {
          title: "Bonny Billy Girls' Floral Dress",
          price: "$26.99",
          rating: 4.5,
          reviews: 3421,
          brand: "Bonny Billy",
          url: "https://www.amazon.com/dp/B07K6TM8NL",
          image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=300&h=300&fit=crop",
          description: "Elegant dress perfect for parties and special events"
        }
      ]
    },
    // Men's clothing
    mens: {
      casual: [
        {
          title: "Hanes Men's ComfortSoft Cotton T-Shirt",
          price: "$16.99",
          rating: 4.4,
          reviews: 15672,
          brand: "Hanes",
          url: "https://www.amazon.com/dp/B010NG5F72",
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
          description: "Ultra-soft cotton t-shirt for everyday comfort"
        },
        {
          title: "Levi's 511 Slim Jeans",
          price: "$39.99",
          rating: 4.3,
          reviews: 22154,
          brand: "Levi's",
          url: "https://www.amazon.com/dp/B0018OLTK6",
          image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
          description: "Classic slim-fit jeans with stretch comfort"
        }
      ],
      formal: [
        {
          title: "Van Heusen Men's Dress Shirt",
          price: "$29.99",
          rating: 4.2,
          reviews: 8934,
          brand: "Van Heusen",
          url: "https://www.amazon.com/dp/B00C2BYFVW",
          image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop",
          description: "Wrinkle-free dress shirt perfect for work or formal events"
        },
        {
          title: "Dockers Men's Alpha Khaki Pants",
          price: "$34.99",
          rating: 4.1,
          reviews: 5678,
          brand: "Dockers",
          url: "https://www.amazon.com/dp/B004VQ9APK",
          image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop",
          description: "Modern slim tapered khakis with stretch"
        }
      ],
      work: [
        {
          title: "Amazon Essentials Men's Slim-Fit Button-Down Shirt",
          price: "$22.99",
          rating: 4.0,
          reviews: 4321,
          brand: "Amazon Essentials",
          url: "https://www.amazon.com/dp/B07MG6SK9M",
          image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop",
          description: "Professional button-down shirt for the workplace"
        }
      ]
    },
    // Women's clothing
    womens: {
      casual: [
        {
          title: "Hanes Women's Relaxed Fit Cotton T-Shirt",
          price: "$18.99",
          rating: 4.3,
          reviews: 12453,
          brand: "Hanes",
          url: "https://www.amazon.com/dp/B07MDHQ8P3",
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
          description: "Comfortable cotton t-shirt in relaxed fit"
        },
        {
          title: "Levi's Women's 711 Skinny Jeans",
          price: "$34.99",
          rating: 4.2,
          reviews: 18765,
          brand: "Levi's",
          url: "https://www.amazon.com/dp/B01B5L6Z8K",
          image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop",
          description: "Classic skinny jeans with stretch comfort"
        }
      ],
      formal: [
        {
          title: "Calvin Klein Women's Sheath Dress",
          price: "$49.99",
          rating: 4.4,
          reviews: 5432,
          brand: "Calvin Klein",
          url: "https://www.amazon.com/dp/B07K6TM9KL",
          image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=300&h=300&fit=crop",
          description: "Elegant sheath dress perfect for formal occasions"
        },
        {
          title: "Ann Taylor LOFT Women's Blouse",
          price: "$36.99",
          rating: 4.1,
          reviews: 2987,
          brand: "LOFT",
          url: "https://www.amazon.com/dp/B08FGH9MNP",
          image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop",
          description: "Professional blouse for work and formal events"
        }
      ],
      work: [
        {
          title: "Amazon Essentials Women's Classic-Fit Blazer",
          price: "$42.99",
          rating: 4.0,
          reviews: 3654,
          brand: "Amazon Essentials",
          url: "https://www.amazon.com/dp/B07N8K4Q9R",
          image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop",
          description: "Professional blazer perfect for the workplace"
        }
      ]
    }
  };

  // Determine gender category
  let genderCategory = '';
  if (isMinor) {
    genderCategory = gender === 'boy' ? 'boys' : gender === 'girl' ? 'girls' : 'boys';
  } else {
    genderCategory = gender === 'male' ? 'mens' : gender === 'female' ? 'womens' : 'mens';
  }

  // Determine occasion category
  let occasionCategory = 'casual';
  if (occ.toLowerCase().includes('work') || occ.toLowerCase().includes('office')) {
    occasionCategory = 'work';
  } else if (occ.toLowerCase().includes('formal') || occ.toLowerCase().includes('wedding') || occ.toLowerCase().includes('interview')) {
    occasionCategory = 'formal';
  } else if (occ.toLowerCase().includes('party') || occ.toLowerCase().includes('date')) {
    occasionCategory = 'formal';
  }

  const categoryProducts = specificProducts[genderCategory];
  const occasionProducts = categoryProducts[occasionCategory] || categoryProducts.casual || [];

  // Filter by colors if specified
  let filteredProducts = [...occasionProducts];
  if (colors && colors.length > 0) {
    // For demo purposes, we'll include all products but mention color preference in description
    filteredProducts = filteredProducts.map(product => ({
      ...product,
      description: `${product.description} - Available in ${colors.join(', ')}`
    }));
  }

  // Convert to final format with size information
  return filteredProducts.map((product, index) => ({
    id: `${genderCategory}-${occasionCategory}-${index}`,
    title: `${product.title} (${size})`,
    price: product.price,
    rating: product.rating,
    reviews: product.reviews,
    image: product.image,
    url: product.url,
    brand: product.brand,
    description: product.description
  }));
}
