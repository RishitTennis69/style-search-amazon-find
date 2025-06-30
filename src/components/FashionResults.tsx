
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, ExternalLink, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPreferences, OccasionDetails } from "@/types/preferences";

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

  useEffect(() => {
    searchProducts();
  }, [preferences, occasion]);

  const searchProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('amazon-search', {
        body: {
          preferences: {
            style: [preferences.confirmed_style_description || 'casual'],
            colors: [],
            budget: preferences.budget || 'under-50',
            size: preferences.size || 'M',
            brands: preferences.brands || []
          },
          occasion: {
            occasion: occasion.occasion,
            season: occasion.season,
            timeOfDay: 'day',
            formality: occasion.activity_type,
            specificNeeds: occasion.specific_needs
          }
        }
      });

      if (error) {
        console.error('Error searching products:', error);
        toast({
          title: "Search Error",
          description: "Failed to search for products. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setProducts(data.products || []);
      setSearchQuery(data.searchQuery || '');
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    // Track click event
    console.log('Product clicked:', product.title, product.url);
    
    // Open Amazon product page in new tab
    window.open(product.url, '_blank', 'noopener,noreferrer');
  };

  const ProductSkeleton = () => (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardContent className="p-4">
        <Skeleton className="w-full h-48 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Search Summary */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Your Style Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div>
              <p><strong>Age:</strong> {preferences.age_range}</p>
              <p><strong>Gender:</strong> {preferences.gender}</p>
              <p><strong>Style:</strong> {preferences.confirmed_style_description}</p>
            </div>
            <div>
              <p><strong>Occasion:</strong> {occasion.occasion}</p>
              <p><strong>Season:</strong> {occasion.season}</p>
              <p><strong>Activity:</strong> {occasion.activity_type}</p>
            </div>
          </div>
          {searchQuery && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Search Query:</strong> {searchQuery}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-800">
            Recommended for You
          </h3>
          <Button
            onClick={searchProducts}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 right-2 bg-white/90 text-slate-700">
                      {product.brand}
                    </Badge>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ExternalLink className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <h4 className="font-semibold text-slate-800 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h4>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">
                        {product.price}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-slate-600">
                          {product.rating.toFixed(1)} ({product.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Amazon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <p className="text-slate-600 mb-4">
                No products found for your preferences. Try adjusting your search criteria.
              </p>
              <Button onClick={onStartOver} variant="outline">
                Start Over
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center pt-8">
        <Button
          onClick={onStartOver}
          variant="outline"
          size="lg"
          className="px-8 py-6 text-lg"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default FashionResults;
