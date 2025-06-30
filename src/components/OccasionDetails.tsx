
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OccasionDetails as OccasionDetailsType } from "@/types/preferences";
import { ArrowRight, Calendar, Sun, Activity, MessageSquare } from "lucide-react";

interface OccasionDetailsProps {
  onComplete: (details: OccasionDetailsType) => void;
}

const OccasionDetails = ({ onComplete }: OccasionDetailsProps) => {
  const [occasion, setOccasion] = useState<string>('');
  const [season, setSeason] = useState<string>('');
  const [activityType, setActivityType] = useState<string>('');
  const [specificNeeds, setSpecificNeeds] = useState<string>('');

  const occasions = [
    { value: 'work', label: 'Work/Professional', emoji: '💼' },
    { value: 'casual', label: 'Casual/Everyday', emoji: '👕' },
    { value: 'date', label: 'Date Night', emoji: '💕' },
    { value: 'party', label: 'Party/Event', emoji: '🎉' },
    { value: 'travel', label: 'Travel', emoji: '✈️' },
    { value: 'workout', label: 'Workout/Sports', emoji: '🏃' }
  ];

  const seasons = [
    { value: 'spring', label: 'Spring', emoji: '🌸' },
    { value: 'summer', label: 'Summer', emoji: '☀️' },
    { value: 'fall', label: 'Fall', emoji: '🍂' },
    { value: 'winter', label: 'Winter', emoji: '❄️' }
  ];

  const activities = [
    { value: 'indoor', label: 'Indoor', emoji: '🏠' },
    { value: 'outdoor', label: 'Outdoor', emoji: '🌳' },
    { value: 'active', label: 'Active/Sports', emoji: '⚡' },
    { value: 'formal', label: 'Formal', emoji: '🎩' },
    { value: 'relaxed', label: 'Relaxed', emoji: '😌' }
  ];

  const handleContinue = () => {
    if (occasion && season && activityType) {
      onComplete({
        occasion,
        season,
        activity_type: activityType,
        specific_needs: specificNeeds
      });
    }
  };

  const canContinue = occasion && season && activityType;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-4">What's the occasion?</h2>
        <p className="text-lg text-slate-600">Tell us about the event so we can find perfect outfits</p>
      </motion.div>

      <div className="space-y-8">
        {/* Occasion Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900">What's the occasion?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {occasions.map((occ, index) => (
                  <motion.div
                    key={occ.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        occasion === occ.value 
                          ? 'ring-2 ring-purple-500 bg-purple-50 border-purple-200' 
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                      onClick={() => setOccasion(occ.value)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{occ.emoji}</div>
                        <div className="font-medium text-slate-900 text-sm">{occ.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Season Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900">What season?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {seasons.map((seas, index) => (
                  <motion.div
                    key={seas.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        season === seas.value 
                          ? 'ring-2 ring-orange-500 bg-orange-50 border-orange-200' 
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                      onClick={() => setSeason(seas.value)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{seas.emoji}</div>
                        <div className="font-medium text-slate-900">{seas.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900">Activity type?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        activityType === activity.value 
                          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                      onClick={() => setActivityType(activity.value)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{activity.emoji}</div>
                        <div className="font-medium text-slate-900 text-sm">{activity.label}</div>
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
          Get My Recommendations
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default OccasionDetails;
