import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, ExternalLink, RefreshCw, Sparkles, ShoppingBag, Heart } from "lucide-react";
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
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
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
    console.log('Product clicked:', product.title, product.url);
    window.open(product.url, '_blank', 'noopener,noreferrer');
  };

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
      }
      return newLiked;
    });
  };

  const ProductSkeleton = () => (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm overflow-hidden">
      <div className="aspect-square bg-slate-200 animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Perfect Style Matches</h2>
        <p className="text-lg text-slate-600">Curated just for you based on your preferences</p>
      </motion.div>

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Your Style Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                    Age: {preferences.age_range}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                    {preferences.gender}
                  </Badge>
                  {preferences.size && (
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200">
                      Size: {preferences.size}
                    </Badge>
                  )}
                </div>
                <div className="text-slate-700">
                  <span className="font-medium">Style:</span> {preferences.confirmed_style_description}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    {occasion.occasion}
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                    {occasion.season}
                  </Badge>
                </div>
                <div className="text-slate-700">
                  <span className="font-medium">Activity:</span> {occasion.activity_type}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center">
            <Heart className="w-6 h-6 mr-2 text-red-500" />
            Recommended for You
            {!loading && products.length > 0 && (
              <Badge className="ml-3 bg-gradient-to-r from-purple-600 to-blue-600">
                {products.length} items
              </Badge>
            )}
          </h3>
          <Button
            onClick={searchProducts}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </motion.div>
          ) : products.length > 0 ? (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden">
                    <div className="relative">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <Badge className="absolute top-3 left-3 bg-white/90 text-slate-700 border-0">
                        {product.brand}
                      </Badge>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(product.id);
                        }}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            likedProducts.has(product.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-slate-600'
                          }`} 
                        />
                      </Button>

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <ExternalLink className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
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
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product);
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Amazon
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No products found</h3>
                  <p className="text-slate-600 mb-6">
                    We couldn't find products matching your preferences. Try adjusting your criteria.
                  </p>
                  <Button onClick={onStartOver} variant="outline" className="px-6">
                    Start Over
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="flex justify-center pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button
          onClick={onStartOver}
          variant="outline"
          size="lg"
          className="px-8 py-6 text-lg border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Start Over
        </Button>
      </motion.div>
    </div>
  );
};

export default FashionResults;
