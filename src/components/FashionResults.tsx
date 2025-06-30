
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, RefreshCw, Star, ShoppingCart, ArrowLeft } from "lucide-react";
import { UserPreferences, OccasionDetails } from "@/pages/Index";

interface FashionResultsProps {
  preferences: UserPreferences;
  occasion: OccasionDetails;
  onStartOver: () => void;
}

interface OutfitItem {
  id: string;
  title: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  amazonUrl: string;
  description: string;
  matchReason: string;
}

const FashionResults = ({ preferences, occasion, onStartOver }: FashionResultsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [outfitItems, setOutfitItems] = useState<OutfitItem[]>([]);

  // Generate mock Amazon-style results based on user preferences
  const generateMockResults = () => {
    const mockItems: OutfitItem[] = [
      {
        id: '1',
        title: 'Classic Cotton Button-Down Shirt',
        price: '$24.99',
        rating: 4.3,
        reviews: 1247,
        image: '/api/placeholder/300/400',
        category: 'Tops',
        amazonUrl: 'https://amazon.com/product/1',
        description: 'Versatile cotton shirt perfect for business casual occasions',
        matchReason: `Perfect for ${occasion.occasion} with ${occasion.formality} dress code`
      },
      {
        id: '2',
        title: 'Tailored Chino Pants',
        price: '$39.99',
        rating: 4.5,
        reviews: 892,
        image: '/api/placeholder/300/400',
        category: 'Bottoms',
        amazonUrl: 'https://amazon.com/product/2',
        description: 'Comfortable chinos that work for work and weekend',
        matchReason: `Matches your ${preferences.style.join(', ')} style preference`
      },
      {
        id: '3',
        title: 'Leather Oxford Shoes',
        price: '$79.99',
        rating: 4.7,
        reviews: 456,
        image: '/api/placeholder/300/400',
        category: 'Shoes',
        amazonUrl: 'https://amazon.com/product/3',
        description: 'Professional leather shoes for any formal occasion',
        matchReason: `Ideal for ${occasion.timeOfDay} ${occasion.occasion}`
      },
      {
        id: '4',
        title: 'Structured Blazer',
        price: '$89.99',
        rating: 4.4,
        reviews: 623,
        image: '/api/placeholder/300/400',
        category: 'Outerwear',
        amazonUrl: 'https://amazon.com/product/4',
        description: 'Elegant blazer that elevates any outfit',
        matchReason: `Perfect for ${occasion.formality} events in ${occasion.season}`
      },
      {
        id: '5',
        title: 'Silk Scarf Accessory',
        price: '$16.99',
        rating: 4.2,
        reviews: 334,
        image: '/api/placeholder/300/400',
        category: 'Accessories',
        amazonUrl: 'https://amazon.com/product/5',
        description: 'Elegant silk scarf to complete your look',
        matchReason: `Complements your preferred ${preferences.colors.join(', ')} colors`
      },
      {
        id: '6',
        title: 'Classic Watch',
        price: '$129.99',
        rating: 4.6,
        reviews: 789,
        image: '/api/placeholder/300/400',
        category: 'Accessories',
        amazonUrl: 'https://amazon.com/product/6',
        description: 'Timeless watch that works with any outfit',
        matchReason: `Essential accessory for ${occasion.occasion}`
      }
    ];

    // Filter items based on budget
    const budgetFilter = (item: OutfitItem) => {
      const price = parseFloat(item.price.replace('$', ''));
      switch (preferences.budget) {
        case 'under-50':
          return price < 50;
        case '50-100':
          return price >= 50 && price <= 100;
        case '100-200':
          return price >= 100 && price <= 200;
        case '200-500':
          return price >= 200 && price <= 500;
        case 'over-500':
          return price > 500;
        default:
          return true;
      }
    };

    return mockItems.filter(budgetFilter);
  };

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setOutfitItems(generateMockResults());
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [preferences, occasion]);

  const handleRefresh = () => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setOutfitItems(generateMockResults());
      setIsLoading(false);
    }, 1500);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 mb-4">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Searching Amazon for your perfect outfits...</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <Skeleton className="w-full h-48 mb-4 rounded-lg" />
                <Skeleton className="h-6 mb-2" />
                <Skeleton className="h-4 mb-2 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Summary Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Your Style</h3>
              <div className="flex flex-wrap gap-1">
                {preferences.style.map(style => (
                  <Badge key={style} variant="secondary" className="text-xs">
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Occasion</h3>
              <p className="text-sm text-slate-600">
                {occasion.occasion} • {occasion.formality} • {occasion.timeOfDay}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Budget</h3>
              <p className="text-sm text-slate-600">
                {preferences.budget.replace('-', ' - $').replace('under', 'Under $').replace('over', 'Over $')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-slate-800">
          Found {outfitItems.length} Perfect Matches
        </h3>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Results</span>
        </Button>
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outfitItems.map(item => (
          <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Fashion Item Image</p>
                  </div>
                </div>
                <Badge className="absolute top-3 left-3 bg-blue-600">
                  {item.category}
                </Badge>
              </div>

              <div className="p-6">
                <h4 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {renderStars(item.rating)}
                  </div>
                  <span className="text-sm text-slate-500">
                    ({item.reviews.toLocaleString()})
                  </span>
                </div>

                <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-700">
                    <strong>Why this matches:</strong> {item.matchReason}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-800">
                    {item.price}
                  </span>
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                    onClick={() => window.open(item.amazonUrl, '_blank')}
                  >
                    <span>View on Amazon</span>
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-8">
        <Button
          onClick={onStartOver}
          variant="outline"
          size="lg"
          className="px-8 py-6 text-lg"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Start Over
        </Button>
        
        <Button
          onClick={handleRefresh}
          size="lg"
          className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <RefreshCw className="mr-2 w-5 h-5" />
          Find More Styles
        </Button>
      </div>
    </div>
  );
};

export default FashionResults;
