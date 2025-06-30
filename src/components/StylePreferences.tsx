
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, User, DollarSign, Ruler, Star } from "lucide-react";
import { UserPreferences } from "@/types/preferences";

interface StylePreferencesProps {
  onSubmit: (preferences: UserPreferences) => void;
}

const StylePreferences = ({ onSubmit }: StylePreferencesProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    age_range: '',
    gender: '',
    budget: '',
    size: '',
    brands: []
  });

  const budgetOptions = [
    { value: 'under-50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200-500', label: '$200 - $500' },
    { value: 'over-500', label: 'Over $500' }
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

  const handleSubmit = () => {
    if (preferences.age_range && preferences.gender && preferences.budget && preferences.size) {
      onSubmit(preferences);
    }
  };

  const isValid = preferences.age_range && preferences.gender && preferences.budget && preferences.size;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Age Range */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <User className="w-5 h-5 text-blue-600" />
            <span>Age Range</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, age_range: value }))}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select your age range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="18-25">18-25</SelectItem>
              <SelectItem value="26-35">26-35</SelectItem>
              <SelectItem value="36-45">36-45</SelectItem>
              <SelectItem value="46-55">46-55</SelectItem>
              <SelectItem value="55+">55+</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Gender */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <User className="w-5 h-5 text-purple-600" />
            <span>Gender</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, gender: value }))}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Non-binary">Non-binary</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
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
