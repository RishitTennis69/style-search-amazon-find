
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OccasionDetails as OccasionDetailsType } from "@/types/preferences";
import { ArrowRight, Calendar, Sun } from "lucide-react";

interface OccasionDetailsProps {
  onComplete: (occasion: OccasionDetailsType) => void;
}

const OccasionDetails = ({ onComplete }: OccasionDetailsProps) => {
  const [occasion, setOccasion] = useState<string>('');
  const [season, setSeason] = useState<string>('');
  const [specificNeeds, setSpecificNeeds] = useState<string>('');

  const occasionOptions = [
    { value: 'work', label: 'Work', emoji: '💼', indoor: true },
    { value: 'casual', label: 'Casual Day', emoji: '👕', indoor: false },
    { value: 'date', label: 'Date Night', emoji: '💕', indoor: false },
    { value: 'party', label: 'Party', emoji: '🎉', indoor: true },
    { value: 'formal', label: 'Formal Event', emoji: '🎩', indoor: true },
    { value: 'workout', label: 'Workout', emoji: '💪', indoor: true },
    { value: 'travel', label: 'Travel', emoji: '✈️', indoor: false },
    { value: 'shopping', label: 'Shopping', emoji: '🛍️', indoor: false }
  ];

  const seasonOptions = [
    { value: 'spring', label: 'Spring', emoji: '🌸' },
    { value: 'summer', label: 'Summer', emoji: '☀️' },
    { value: 'fall', label: 'Fall', emoji: '🍂' },
    { value: 'winter', label: 'Winter', emoji: '❄️' }
  ];

  const selectedOccasion = occasionOptions.find(opt => opt.value === occasion);
  const isIndoorOccasion = selectedOccasion?.indoor || false;

  const handleContinue = () => {
    if (occasion && (isIndoorOccasion || season)) {
      onComplete({
        occasion,
        season: isIndoorOccasion ? 'indoor' : season,
        activity_type: '',
        specific_needs: specificNeeds
      });
    }
  };

  const canContinue = occasion && (isIndoorOccasion || season);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-4">What's the Occasion?</h2>
        <p className="text-lg text-slate-600">Tell us where you're going and we'll find the perfect outfit</p>
      </motion.div>

      <div className="space-y-8">
        {/* Occasion Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900">What's the occasion?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {occasionOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        occasion === option.value 
                          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                      onClick={() => setOccasion(option.value)}
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

        {/* Season Selection - Only show if outdoor occasion */}
        {occasion && !isIndoorOccasion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-900">What season is it?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {seasonOptions.map((option, index) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                          season === option.value 
                            ? 'ring-2 ring-orange-500 bg-orange-50 border-orange-200' 
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }`}
                        onClick={() => setSeason(option.value)}
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
        )}

        {/* Indoor Notice */}
        {occasion && isIndoorOccasion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-blue-700 font-medium">Indoor occasion - season doesn't matter! 🏢</span>
            </div>
          </motion.div>
        )}

        {/* Specific Needs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl text-slate-900">Any specific requirements? (Optional)</CardTitle>
              <p className="text-sm text-slate-600 mt-2">e.g., "need to look professional", "comfortable for walking", etc.</p>
            </CardHeader>
            <CardContent>
              <div className="max-w-md mx-auto">
                <Label htmlFor="specific-needs" className="text-sm font-medium text-slate-700">
                  Specific Needs
                </Label>
                <Input
                  id="specific-needs"
                  value={specificNeeds}
                  onChange={(e) => setSpecificNeeds(e.target.value)}
                  placeholder="Any special requirements..."
                  className="h-12 mt-2"
                />
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
          Find My Perfect Outfit
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default OccasionDetails;
