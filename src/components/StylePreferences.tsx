import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Palette, DollarSign, Ruler, Star } from "lucide-react";
import { UserPreferences } from "@/types/preferences";

interface StylePreferencesProps {
  onSubmit: (preferences: UserPreferences) => void;
}

const StylePreferences = ({ onSubmit }: StylePreferencesProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    style: [],
    colors: [],
    budget: '',
    size: '',
    brands: []
  });

  const styleOptions = [
    'Casual', 'Business Casual', 'Formal', 'Bohemian', 'Minimalist',
    'Trendy', 'Classic', 'Sporty', 'Vintage', 'Edgy', 'Romantic', 'Preppy'
  ];

  const colorOptions = [
    'Black', 'White', 'Navy', 'Gray', 'Beige', 'Brown',
    'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Yellow'
  ];

  const budgetOptions = [
    { value: 'under-50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200-500', label: '$200 - $500' },
    { value: 'over-500', label: 'Over $500' }
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

  const popularBrands = [
    'Nike', 'Adidas', 'Levi\'s', 'Calvin Klein', 'Tommy Hilfiger',
    'Ralph Lauren', 'Gap', 'H&M', 'Zara', 'Uniqlo'
  ];

  const handleStyleToggle = (style: string) => {
    setPreferences(prev => ({
      ...prev,
      style: prev.style.includes(style)
        ? prev.style.filter(s => s !== style)
        : [...prev.style, style]
    }));
  };

  const handleColorToggle = (color: string) => {
    setPreferences(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleBrandToggle = (brand: string) => {
    setPreferences(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handleSubmit = () => {
    if (preferences.style.length > 0 && preferences.budget && preferences.size) {
      onSubmit(preferences);
    }
  };

  const isValid = preferences.style.length > 0 && preferences.budget && preferences.size;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Style Preferences */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Palette className="w-5 h-5 text-blue-600" />
            <span>Fashion Style</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">Select all styles that appeal to you (choose at least one)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {styleOptions.map(style => (
              <Badge
                key={style}
                variant={preferences.style.includes(style) ? "default" : "outline"}
                className={`cursor-pointer p-3 text-center justify-center transition-all duration-200 hover:scale-105 ${
                  preferences.style.includes(style)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'hover:bg-slate-100'
                }`}
                onClick={() => handleStyleToggle(style)}
              >
                {style}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Preferences */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Palette className="w-5 h-5 text-green-600" />
            <span>Favorite Colors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">What colors do you love to wear?</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {colorOptions.map(color => (
              <div
                key={color}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  preferences.colors.includes(color)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => handleColorToggle(color)}
              >
                <div
                  className={`w-full h-6 rounded mb-2 ${
                    color === 'White' ? 'bg-white border border-slate-300' :
                    color === 'Black' ? 'bg-black' :
                    color === 'Navy' ? 'bg-blue-900' :
                    color === 'Gray' ? 'bg-gray-500' :
                    color === 'Beige' ? 'bg-yellow-100' :
                    color === 'Brown' ? 'bg-yellow-700' :
                    color === 'Red' ? 'bg-red-500' :
                    color === 'Blue' ? 'bg-blue-500' :
                    color === 'Green' ? 'bg-green-500' :
                    color === 'Pink' ? 'bg-pink-500' :
                    color === 'Purple' ? 'bg-purple-500' :
                    'bg-yellow-500'
                  }`}
                />
                <p className="text-xs text-center text-slate-700">{color}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget and Size */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Budget Range</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, budget: value }))}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your budget range" />
              </SelectTrigger>
              <SelectContent>
                {budgetOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Ruler className="w-5 h-5 text-purple-600" />
              <span>Size</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, size: value }))}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your size" />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map(size => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Brand Preferences */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Star className="w-5 h-5 text-yellow-600" />
            <span>Preferred Brands (Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">Any favorite brands you'd like us to prioritize?</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {popularBrands.map(brand => (
              <Badge
                key={brand}
                variant={preferences.brands.includes(brand) ? "default" : "outline"}
                className={`cursor-pointer p-3 text-center justify-center transition-all duration-200 hover:scale-105 ${
                  preferences.brands.includes(brand)
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                    : 'hover:bg-slate-100'
                }`}
                onClick={() => handleBrandToggle(brand)}
              >
                {brand}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          size="lg"
          className={`px-8 py-6 text-lg transition-all duration-300 ${
            isValid
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
              : 'bg-slate-300'
          }`}
        >
          <span>Continue to Occasion</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default StylePreferences;
