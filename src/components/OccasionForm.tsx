
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Calendar, Sun, Clock, Briefcase } from "lucide-react";
import { OccasionDetails } from "@/pages/Index";

interface OccasionFormProps {
  onSubmit: (details: OccasionDetails) => void;
  onBack: () => void;
}

const OccasionForm = ({ onSubmit, onBack }: OccasionFormProps) => {
  const [details, setDetails] = useState<OccasionDetails>({
    occasion: '',
    season: '',
    timeOfDay: '',
    formality: '',
    specificNeeds: ''
  });

  const occasionOptions = [
    'Work/Office', 'Date Night', 'Casual Outing', 'Wedding', 'Party',
    'Interview', 'Travel', 'Shopping', 'Dinner', 'Weekend Relaxing',
    'Gym/Sports', 'Beach/Pool', 'Concert/Event', 'Meeting Friends'
  ];

  const seasonOptions = ['Spring', 'Summer', 'Fall', 'Winter'];

  const timeOptions = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const formalityOptions = [
    'Very Casual', 'Casual', 'Smart Casual', 'Business Casual', 
    'Semi-Formal', 'Formal', 'Black Tie'
  ];

  const handleOptionSelect = (field: keyof OccasionDetails, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (details.occasion && details.season && details.timeOfDay && details.formality) {
      onSubmit(details);
    }
  };

  const isValid = details.occasion && details.season && details.timeOfDay && details.formality;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Occasion Type */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>What's the Occasion?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">Select the main purpose of your outfit</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {occasionOptions.map(occasion => (
              <Badge
                key={occasion}
                variant={details.occasion === occasion ? "default" : "outline"}
                className={`cursor-pointer p-3 text-center justify-center transition-all duration-200 hover:scale-105 ${
                  details.occasion === occasion
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'hover:bg-slate-100'
                }`}
                onClick={() => handleOptionSelect('occasion', occasion)}
              >
                {occasion}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Season and Time */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Sun className="w-5 h-5 text-yellow-600" />
              <span>Season</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {seasonOptions.map(season => (
                <Badge
                  key={season}
                  variant={details.season === season ? "default" : "outline"}
                  className={`cursor-pointer p-4 text-center justify-center transition-all duration-200 hover:scale-105 ${
                    details.season === season
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={() => handleOptionSelect('season', season)}
                >
                  {season}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Clock className="w-5 h-5 text-purple-600" />
              <span>Time of Day</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map(time => (
                <Badge
                  key={time}
                  variant={details.timeOfDay === time ? "default" : "outline"}
                  className={`cursor-pointer p-4 text-center justify-center transition-all duration-200 hover:scale-105 ${
                    details.timeOfDay === time
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={() => handleOptionSelect('timeOfDay', time)}
                >
                  {time}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formality Level */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span>Formality Level</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">How formal should your outfit be?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {formalityOptions.map(formality => (
              <Badge
                key={formality}
                variant={details.formality === formality ? "default" : "outline"}
                className={`cursor-pointer p-3 text-center justify-center transition-all duration-200 hover:scale-105 ${
                  details.formality === formality
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'hover:bg-slate-100'
                }`}
                onClick={() => handleOptionSelect('formality', formality)}
              >
                {formality}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Specific Needs */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Any Specific Needs or Preferences?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">
            Tell us about any specific requirements, comfort needs, or style details (optional)
          </p>
          <Textarea
            placeholder="e.g., need comfortable shoes for walking, prefer breathable fabrics, want to stand out, need professional look, etc."
            value={details.specificNeeds}
            onChange={(e) => setDetails(prev => ({ ...prev, specificNeeds: e.target.value }))}
            className="min-h-[100px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="px-8 py-6 text-lg"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Style
        </Button>

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
          <span>Find My Outfits</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default OccasionForm;
