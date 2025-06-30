
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Calendar, Sun, Activity } from "lucide-react";
import { OccasionDetails } from "@/types/preferences";

interface SimplifiedOccasionFormProps {
  onSubmit: (details: OccasionDetails) => void;
  onBack: () => void;
}

const SimplifiedOccasionForm = ({ onSubmit, onBack }: SimplifiedOccasionFormProps) => {
  const [details, setDetails] = useState<OccasionDetails>({
    occasion: '',
    season: '',
    activity_type: '',
    specific_needs: ''
  });

  const occasionOptions = [
    'Work/Office', 'Date Night', 'Casual Outing', 'Wedding', 'Party',
    'Interview', 'Travel', 'Shopping', 'Dinner', 'Weekend Relaxing'
  ];

  const seasonOptions = ['Spring', 'Summer', 'Fall', 'Winter'];

  const activityOptions = [
    'Mostly Sitting', 'Walking Around', 'Active/Sporty', 'Dancing', 
    'Outdoor Activities', 'Indoor Events'
  ];

  const handleOptionSelect = (field: keyof OccasionDetails, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (details.occasion && details.season && details.activity_type) {
      onSubmit(details);
    }
  };

  const isValid = details.occasion && details.season && details.activity_type;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>What's the Occasion?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
              <Activity className="w-5 h-5 text-purple-600" />
              <span>Activity Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {activityOptions.map(activity => (
                <Badge
                  key={activity}
                  variant={details.activity_type === activity ? "default" : "outline"}
                  className={`cursor-pointer p-3 text-center justify-center transition-all duration-200 hover:scale-105 ${
                    details.activity_type === activity
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={() => handleOptionSelect('activity_type', activity)}
                >
                  {activity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Any Specific Needs?</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., need comfortable shoes, prefer breathable fabrics, want to stand out, etc."
            value={details.specific_needs}
            onChange={(e) => setDetails(prev => ({ ...prev, specific_needs: e.target.value }))}
            className="min-h-[80px] resize-none"
          />
        </CardContent>
      </Card>

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

export default SimplifiedOccasionForm;
