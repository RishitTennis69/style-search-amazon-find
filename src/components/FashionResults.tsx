
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, ExternalLink, RefreshCw, ShoppingCart } from "lucide-react";
import { UserPreferences, OccasionDetails } from "@/pages/Index";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  title: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  url: string;
  brand: string;
  description: string;
}

interface FashionResultsProps {
  preferences: UserPreferences;
  occasion: OccasionDetails;
  onStartOver: () => void;
}

const FashionResults = ({ preferences, occasion, onStartOver }: FashionResultsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const searchAmazon = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('amazon-search', {
        body: {
          preferences,
          occasion,
        }
      });

      if (error) throw error;

      setProducts(data.products);
      setSearchQuery(data.searchQuery);
    } catch (error) {
      console.error('Error searching Amazon:', error);
      toast({
        title: "Search Error",
        description: "Failed to fetch product recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchAmazon();
  }, []);

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
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-slate-300" />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Searching Amazon for Your Perfect Outfits...
          </h3>
          <p className="text-slate-600">
            Our AI is analyzing thousands of products to find your ideal matches
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Search Summary */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Search Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Your Style Preferences</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {preferences.style.map(style => (
                  <Badge key={style} variant="outline" className="bg-blue-50">
                    {style}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.colors.map(color => (
                  <Badge key={color} variant="outline" className="bg-green-50">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Occasion Details</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-medium">Occasion:</span> {occasion.occasion}</p>
                <p><span className="font-medium">Season:</span> {occasion.season}</p>
                <p><span className="font-medium">Time:</span> {occasion.timeOfDay}</p>
                <p><span className="font-medium">Formality:</span> {occasion.formality}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <Card key={product.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="aspect-square bg-slate-100 rounded-t-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <Badge variant="outline" className="text-xs mb-2">
                    {product.brand}
                  </Badge>
                  <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-xs text-slate-600">
                    ({product.reviews.toLocaleString()})
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    {product.price}
                  </span>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => window.open(product.url, '_blank')}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    <span className="text-xs">View</span>
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
          onClick={searchAmazon}
          size="lg"
          className="px-8 py-6 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <RefreshCw className="mr-2 w-5 h-5" />
          Refresh Results
        </Button>
      </div>
    </div>
  );
};

export default FashionResults;
