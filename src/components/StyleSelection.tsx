
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPreferences } from "@/types/preferences";
import { ArrowRight, DollarSign, Scale, Ruler, Heart, Sparkles } from "lucide-react";

interface StyleSelectionProps {
  preferences: UserPreferences;
  onComplete: (preferences: UserPreferences) => void;
}

const StyleSelection = ({ preferences, onComplete }: StyleSelectionProps) => {
  const [budget, setBudget] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [feet, setFeet] = useState<string>('');
  const [inches, setInches] = useState<string>('');
  const [brands, setBrands] = useState<string[]>([]);

  const budgetOptions = [
    { value: 'under-50', label: 'Under $50', emoji: '💰' },
    { value: '50-100', label: '$50 - $100', emoji: '💳' },
    { value: '100-200', label: '$100 - $200', emoji: '💎' },
    { value: '200-500', label: '$200 - $500', emoji: '👑' },
    { value: 'over-500', label: 'Over $500', emoji: '✨' }
  ];

  const popularBrands = [
    'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Levi\'s', 
    'Calvin Klein', 'Tommy Hilfiger', 'Ralph Lauren', 'Gap'
  ];

  const handleBrandToggle = (brand: string) => {
    setBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const weightNum = parseFloat(weight);
  const feetNum = parseFloat(feet);
  const inchesNum = parseFloat(inches);
  const hasValidMeasurements = weightNum > 0 && feetNum > 0 && inchesNum >= 0;

  const handleContinue = () => {
    if (budget && hasValidMeasurements) {
      onComplete({
        ...preferences,
        budget,
        size: 'AI-determined', // Placeholder - AI will determine actual size
        brands,
        weight: weightNum,
        height: feetNum * 12 + inchesNum // Store total height in inches
      });
    }
  };

  const canContinue = budget && hasValidMeasurements;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Style Preferences</h2>
        <p className="text-lg text-slate-600">Help us find your perfect fit and budget</p>
      </motion.div>

      <div className="space-y-8">
        {/* Budget Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900">What's your budget?</CardTitle>
              <p className="text-sm text-slate-600 mt-2">Per complete outfit</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {budgetOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        budget === option.value 
                          ? 'ring-2 ring-green-500 bg-green-50 border-green-200' 
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                      onClick={() => setBudget(option.value)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{option.emoji}</div>
                        <div className="font-medium text-slate-900 text-sm">{option.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weight and Height */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900">Your measurements</CardTitle>
              <p className="text-sm text-slate-600 mt-2">Our AI will determine your perfect size using professional sizing standards</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-lg mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-medium text-slate-700">
                    Weight (pounds)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    min="20"
                    max="400"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 140"
                    className="h-12 text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feet" className="text-sm font-medium text-slate-700">
                    Height (ft)
                  </Label>
                  <Input
                    id="feet"
                    type="number"
                    min="2"
                    max="8"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    placeholder="e.g. 5"
                    className="h-12 text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inches" className="text-sm font-medium text-slate-700">
                    Height (in)
                  </Label>
                  <Input
                    id="inches"
                    type="number"
                    min="0"
                    max="11"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    placeholder="e.g. 6"
                    className="h-12 text-center"
                  />
                </div>
              </div>
              {hasValidMeasurements && (
                <motion.div 
                  className="mt-6 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                    <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-purple-700 font-medium">AI will determine your perfect size</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Brand Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900">Favorite brands? (Optional)</CardTitle>
              <p className="text-sm text-slate-600 mt-2">Select any brands you prefer</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {popularBrands.map((brand, index) => (
                  <motion.div
                    key={brand}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.03, duration: 0.3 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        brands.includes(brand) 
                          ? 'ring-2 ring-purple-500 bg-purple-50 border-purple-200' 
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                      onClick={() => handleBrandToggle(brand)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="font-medium text-slate-900 text-sm">{brand}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.div 
        className="flex justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          size="lg"
          className={`px-8 py-6 text-lg font-medium rounded-xl transition-all duration-300 ${
            canContinue 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue to Occasion
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default StyleSelection;
