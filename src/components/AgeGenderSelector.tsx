
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, User, Calendar } from "lucide-react";

interface AgeGenderSelectorProps {
  onSubmit: (ageRange: string, gender: string) => void;
}

const AgeGenderSelector = ({ onSubmit }: AgeGenderSelectorProps) => {
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  const ageRanges = [
    '18-25', '26-35', '36-45', '46-55', '56-65', '65+'
  ];

  const genders = [
    'Woman', 'Man', 'Non-binary'
  ];

  const handleSubmit = () => {
    if (selectedAge && selectedGender) {
      onSubmit(selectedAge, selectedGender);
    }
  };

  const isValid = selectedAge && selectedGender;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Age Range</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">Select your age range</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ageRanges.map(age => (
              <Badge
                key={age}
                variant={selectedAge === age ? "default" : "outline"}
                className={`cursor-pointer p-4 text-center justify-center transition-all duration-200 hover:scale-105 ${
                  selectedAge === age
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'hover:bg-slate-100'
                }`}
                onClick={() => setSelectedAge(age)}
              >
                {age}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <User className="w-5 h-5 text-purple-600" />
            <span>Gender</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">Select your gender identity</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {genders.map(gender => (
              <Badge
                key={gender}
                variant={selectedGender === gender ? "default" : "outline"}
                className={`cursor-pointer p-4 text-center justify-center transition-all duration-200 hover:scale-105 ${
                  selectedGender === gender
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'hover:bg-slate-100'
                }`}
                onClick={() => setSelectedGender(gender)}
              >
                {gender}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

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
          <span>Get Style Suggestions</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default AgeGenderSelector;
