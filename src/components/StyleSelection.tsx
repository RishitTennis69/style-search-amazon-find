import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPreferences } from "@/types/preferences";
import { ArrowRight, DollarSign, Scale, Ruler, Heart } from "lucide-react";

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

  const calculateSize = (weightLbs: number, feet: number, inches: number, gender: string, age: number): string => {
    const totalHeightInches = feet * 12 + inches;
    
    console.log('Size calculation:', { weightLbs, feet, inches, totalHeightInches, gender, age });
    
    const isMinor = age < 18;
    
    if (isMinor) {
      // Children's sizes based on Legendary Whitetails guidelines
      const prefix = gender === 'boy' ? 'Boys ' : 'Girls ';
      
      // Toddler sizes
      if (totalHeightInches >= 33 && totalHeightInches <= 35.5 && weightLbs >= 27 && weightLbs <= 29.5) {
        return prefix + '2T';
      }
      if (totalHeightInches >= 36 && totalHeightInches <= 38 && weightLbs >= 30 && weightLbs <= 33) {
        return prefix + '3T';
      }
      if (totalHeightInches >= 38.5 && totalHeightInches <= 40.5 && weightLbs >= 34 && weightLbs <= 37) {
        return prefix + '4T';
      }
      
      // Kids sizes
      if (totalHeightInches >= 39.5 && totalHeightInches <= 45.5 && weightLbs >= 34 && weightLbs <= 36) {
        return prefix + 'XS (Size 4)';
      }
      if (totalHeightInches >= 45.5 && totalHeightInches <= 52 && weightLbs >= 47 && weightLbs <= 69) {
        return prefix + 'S (Size 6-8)';
      }
      if (totalHeightInches >= 54 && totalHeightInches <= 58.5 && weightLbs >= 70 && weightLbs <= 94) {
        return prefix + 'M (Size 10-12)';
      }
      if (totalHeightInches >= 60 && totalHeightInches <= 63.5 && weightLbs >= 95 && weightLbs <= 120) {
        return prefix + 'L (Size 14-16)';
      }
      if (totalHeightInches >= 64 && totalHeightInches <= 67.5 && weightLbs >= 121 && weightLbs <= 145) {
        return prefix + 'XL (Size 18-20)';
      }
      
      // Fallback for out-of-range kids
      if (totalHeightInches < 39.5) return prefix + '2T';
      if (totalHeightInches < 45.5) return prefix + 'XS (Size 4)';
      if (totalHeightInches < 54) return prefix + 'S (Size 6-8)';
      if (totalHeightInches < 60) return prefix + 'M (Size 10-12)';
      if (totalHeightInches < 64) return prefix + 'L (Size 14-16)';
      return prefix + 'XL (Size 18-20)';
    }
    
    // Adult sizes
    if (gender === 'male') {
      // Men's sizes based on Men Fashion American Slim Fit
      const heightFeet = Math.floor(totalHeightInches / 12);
      const heightInchesRem = totalHeightInches % 12;
      const heightString = `${heightFeet}'${heightInchesRem}"`;
      
      if (totalHeightInches === 65) { // 5'5"
        if (weightLbs >= 130 && weightLbs < 150) return 'Mens XS';
        if (weightLbs >= 150 && weightLbs < 160) return 'Mens S';
        if (weightLbs >= 160 && weightLbs < 170) return 'Mens M';
        return 'Mens M';
      }
      if (totalHeightInches === 66) { // 5'6"
        if (weightLbs >= 130 && weightLbs < 150) return 'Mens XS';
        if (weightLbs >= 150 && weightLbs < 160) return 'Mens S';
        if (weightLbs >= 160 && weightLbs < 170) return 'Mens M';
        if (weightLbs >= 170 && weightLbs < 180) return 'Mens L';
        return 'Mens L';
      }
      if (totalHeightInches === 67) { // 5'7"
        if (weightLbs >= 130 && weightLbs < 150) return 'Mens XS';
        if (weightLbs >= 150 && weightLbs < 160) return 'Mens S';
        if (weightLbs >= 160 && weightLbs < 170) return 'Mens M';
        if (weightLbs >= 170 && weightLbs < 190) return 'Mens L';
        return 'Mens L';
      }
      if (totalHeightInches === 68) { // 5'8"
        if (weightLbs >= 130 && weightLbs < 150) return 'Mens XS';
        if (weightLbs >= 150 && weightLbs < 160) return 'Mens S';
        if (weightLbs >= 160 && weightLbs < 170) return 'Mens M';
        if (weightLbs >= 170 && weightLbs < 190) return 'Mens L';
        if (weightLbs >= 190 && weightLbs < 200) return 'Mens XL';
        return 'Mens XL';
      }
      if (totalHeightInches === 69) { // 5'9"
        if (weightLbs >= 130 && weightLbs < 150) return 'Mens XS';
        if (weightLbs >= 150 && weightLbs < 160) return 'Mens S';
        if (weightLbs >= 160 && weightLbs < 180) return 'Mens M';
        if (weightLbs >= 180 && weightLbs < 190) return 'Mens L';
        if (weightLbs >= 190 && weightLbs < 200) return 'Mens XL';
        if (weightLbs >= 200 && weightLbs < 210) return 'Mens 2XL';
        return 'Mens 2XL';
      }
      if (totalHeightInches === 70) { // 5'10"
        if (weightLbs >= 130 && weightLbs < 150) return 'Mens XS';
        if (weightLbs >= 150 && weightLbs < 160) return 'Mens S';
        if (weightLbs >= 160 && weightLbs < 180) return 'Mens M';
        if (weightLbs >= 180 && weightLbs < 200) return 'Mens L';
        if (weightLbs >= 200 && weightLbs < 220) return 'Mens 2XL';
        return 'Mens 2XL';
      }
      if (totalHeightInches === 71) { // 5'11"
        if (weightLbs >= 130 && weightLbs < 150) return 'Mens XS';
        if (weightLbs >= 150 && weightLbs < 160) return 'Mens S';
        if (weightLbs >= 160 && weightLbs < 180) return 'Mens M';
        if (weightLbs >= 180 && weightLbs < 200) return 'Mens L';
        if (weightLbs >= 200 && weightLbs < 210) return 'Mens XL';
        if (weightLbs >= 210 && weightLbs < 220) return 'Mens 2XL';
        if (weightLbs >= 220 && weightLbs < 240) return 'Mens 3XL';
        return 'Mens 3XL';
      }
      if (totalHeightInches === 72) { // 6'0"
        if (weightLbs >= 150 && weightLbs < 160) return 'Mens S';
        if (weightLbs >= 160 && weightLbs < 180) return 'Mens M';
        if (weightLbs >= 180 && weightLbs < 200) return 'Mens L';
        if (weightLbs >= 200 && weightLbs < 210) return 'Mens XL';
        if (weightLbs >= 210 && weightLbs < 220) return 'Mens 2XL';
        if (weightLbs >= 220 && weightLbs < 240) return 'Mens 3XL';
        if (weightLbs >= 240 && weightLbs < 270) return 'Mens 4XL';
        return 'Mens 4XL';
      }
      if (totalHeightInches === 73) { // 6'1"
        if (weightLbs >= 160 && weightLbs < 180) return 'Mens M';
        if (weightLbs >= 180 && weightLbs < 200) return 'Mens L';
        if (weightLbs >= 200 && weightLbs < 210) return 'Mens XL';
        if (weightLbs >= 210 && weightLbs < 220) return 'Mens 2XL';
        if (weightLbs >= 220 && weightLbs < 240) return 'Mens 3XL';
        if (weightLbs >= 240 && weightLbs < 270) return 'Mens 4XL';
        if (weightLbs >= 270 && weightLbs < 300) return 'Mens 5XL';
        return 'Mens 5XL';
      }
      if (totalHeightInches === 74) { // 6'2"
        if (weightLbs >= 170 && weightLbs < 180) return 'Mens M/L';
        if (weightLbs >= 180 && weightLbs < 200) return 'Mens L';
        if (weightLbs >= 200 && weightLbs < 210) return 'Mens XL';
        if (weightLbs >= 210 && weightLbs < 220) return 'Mens 2XL';
        if (weightLbs >= 220 && weightLbs < 240) return 'Mens 3XL';
        if (weightLbs >= 240 && weightLbs < 270) return 'Mens 4XL';
        if (weightLbs >= 270 && weightLbs < 300) return 'Mens 5XL';
        if (weightLbs >= 300 && weightLbs < 340) return 'Mens 6XL';
        return 'Mens 6XL';
      }
      if (totalHeightInches >= 75) { // 6'3" and above
        if (weightLbs >= 200 && weightLbs < 210) return 'Mens XL';
        if (weightLbs >= 210 && weightLbs < 240) return 'Mens 2XL';
        if (weightLbs >= 240 && weightLbs < 270) return 'Mens 3XL';
        if (weightLbs >= 270 && weightLbs < 300) return 'Mens 4XL';
        if (weightLbs >= 300 && weightLbs < 340) return 'Mens 5XL';
        return 'Mens 5XL';
      }
      
      // Fallback for shorter men
      if (weightLbs < 150) return 'Mens XS';
      if (weightLbs < 170) return 'Mens S';
      if (weightLbs < 190) return 'Mens M';
      return 'Mens L';
    } else {
      // Women's sizes based on Edee's Place guidelines
      if (totalHeightInches >= 59 && totalHeightInches <= 64 && weightLbs >= 95 && weightLbs <= 115) {
        return 'Womens S';
      }
      if (totalHeightInches >= 62 && totalHeightInches <= 67 && weightLbs >= 115 && weightLbs <= 135) {
        return 'Womens M';
      }
      if (totalHeightInches >= 64 && totalHeightInches <= 69 && weightLbs >= 135 && weightLbs <= 155) {
        return 'Womens L';
      }
      if (totalHeightInches >= 66 && totalHeightInches <= 71 && weightLbs >= 150 && weightLbs <= 175) {
        return 'Womens XL';
      }
      
      // Jerry's brand guidelines as fallback
      if (totalHeightInches >= 59 && totalHeightInches <= 63 && weightLbs >= 90 && weightLbs <= 105) {
        return 'Womens S';
      }
      if (totalHeightInches >= 63 && totalHeightInches <= 66 && weightLbs >= 100 && weightLbs <= 125) {
        return 'Womens M';
      }
      if (totalHeightInches >= 65 && totalHeightInches <= 69 && weightLbs >= 120 && weightLbs <= 135) {
        return 'Womens L';
      }
      if (totalHeightInches >= 65 && totalHeightInches <= 72 && weightLbs >= 135 && weightLbs <= 160) {
        return 'Womens XL';
      }
      
      // General fallback based on weight ranges
      if (weightLbs < 100) return 'Womens XS';
      if (weightLbs < 120) return 'Womens S';
      if (weightLbs < 140) return 'Womens M';
      if (weightLbs < 160) return 'Womens L';
      if (weightLbs < 180) return 'Womens XL';
      return 'Womens XXL';
    }
  };

  const weightNum = parseFloat(weight);
  const feetNum = parseFloat(feet);
  const inchesNum = parseFloat(inches);
  const calculatedSize = (weightNum > 0 && feetNum > 0 && inchesNum >= 0) ? 
    calculateSize(weightNum, feetNum, inchesNum, preferences.gender || '', parseInt(preferences.age_range || '0')) : '';

  const handleContinue = () => {
    if (budget && weightNum > 0 && feetNum > 0 && inchesNum >= 0) {
      onComplete({
        ...preferences,
        budget,
        size: calculatedSize,
        brands,
        weight: weightNum,
        height: feetNum * 12 + inchesNum // Store total height in inches
      });
    }
  };

  const canContinue = budget && weightNum > 0 && feetNum > 0 && inchesNum >= 0;

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
              <p className="text-sm text-slate-600 mt-2">We'll calculate your size automatically using industry standards</p>
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
              {calculatedSize && (
                <motion.div 
                  className="mt-6 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <Scale className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-blue-700 font-medium">Your calculated size: {calculatedSize}</span>
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
