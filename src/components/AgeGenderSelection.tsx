
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPreferences } from "@/types/preferences";
import { ArrowRight, User, Calendar } from "lucide-react";

interface AgeGenderSelectionProps {
  onComplete: (preferences: UserPreferences) => void;
}

const AgeGenderSelection = ({ onComplete }: AgeGenderSelectionProps) => {
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');

  const ageRanges = [
    { value: '18-24', label: '18-24', emoji: '🎓' },
    { value: '25-34', label: '25-34', emoji: '💼' },
    { value: '35-44', label: '35-44', emoji: '🏡' },
    { value: '45-54', label: '45-54', emoji: '🌟' },
    { value: '55+', label: '55+', emoji: '👑' }
  ];

  const genders = [
    { value: 'female', label: 'Women', emoji: '👩', color: 'from-pink-500 to-rose-500' },
    { value: 'male', label: 'Men', emoji: '👨', color: 'from-blue-500 to-indigo-500' },
    { value: 'unisex', label: 'Unisex', emoji: '👤', color: 'from-purple-500 to-violet-500' }
  ];

  const handleContinue = () => {
    if (selectedAge && selectedGender) {
      onComplete({
        age_range: selectedAge,
        gender: selectedGender
      });
    }
  };

  const canContinue = selectedAge && selectedGender;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Tell us about yourself</h2>
        <p className="text-lg text-slate-600">Help us personalize your fashion recommendations</p>
      </motion.div>

      <div className="space-y-12">
        {/* Age Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900">What's your age range?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {ageRanges.map((age, index) => (
                  <motion.div
                    key={age.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedAge === age.value 
                          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedAge(age.value)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="text-2xl mb-2">{age.emoji}</div>
                        <div className="font-medium text-slate-900">{age.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gender Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900">What style are you looking for?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {genders.map((gender, index) => (
                  <motion.div
                    key={gender.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedGender === gender.value 
                          ? 'ring-2 ring-purple-500 bg-purple-50 border-purple-200' 
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedGender(gender.value)}
                    >
                      <CardContent className="p-8 text-center">
                        <div className={`w-16 h-16 bg-gradient-to-br ${gender.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <span className="text-2xl">{gender.emoji}</span>
                        </div>
                        <div className="font-semibold text-lg text-slate-900 mb-2">{gender.label}</div>
                        <div className="text-sm text-slate-600">Fashion & Style</div>
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
          Continue to Style Selection
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default AgeGenderSelection;
