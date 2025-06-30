
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";

interface OutfitStyleSelectorProps {
  ageRange: string;
  gender: string;
  onSubmit: (selectedDescription: string, selectedImages: string[]) => void;
  onBack: () => void;
}

const OutfitStyleSelector = ({ ageRange, gender, onSubmit, onBack }: OutfitStyleSelectorProps) => {
  const [selectedOutfits, setSelectedOutfits] = useState<string[]>([]);
  const [selectedDescription, setSelectedDescription] = useState('');

  // Mock outfit images - in real implementation, these would come from an AI service
  const outfitImages = [
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551803091-e20673f15770?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=300&h=400&fit=crop'
  ];

  // Mock AI-generated style descriptions
  const styleDescriptions = [
    "Classic and timeless style with clean lines and neutral colors",
    "Bohemian and free-spirited with flowing fabrics and earthy tones", 
    "Modern minimalist with structured pieces and monochromatic palettes",
    "Romantic and feminine with soft textures and delicate details",
    "Edgy and contemporary with bold patterns and statement pieces"
  ];

  const handleOutfitToggle = (image: string) => {
    setSelectedOutfits(prev => 
      prev.includes(image) 
        ? prev.filter(img => img !== image)
        : [...prev, image]
    );
  };

  const handleSubmit = () => {
    if (selectedDescription && selectedOutfits.length > 0) {
      onSubmit(selectedDescription, selectedOutfits);
    }
  };

  const isValid = selectedDescription && selectedOutfits.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>Choose Your Favorite Outfits</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-6">
            Select the outfits that appeal to you most. We'll use AI to understand your style preferences.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {outfitImages.map((image, index) => (
              <div
                key={index}
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                  selectedOutfits.includes(image) ? 'ring-4 ring-blue-500' : ''
                }`}
                onClick={() => handleOutfitToggle(image)}
              >
                <img
                  src={image}
                  alt={`Outfit ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                {selectedOutfits.includes(image) && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedOutfits.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">AI Style Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Based on your selections, here are AI-generated style descriptions. Choose the one that best represents you:
            </p>
            <div className="space-y-3">
              {styleDescriptions.map((description, index) => (
                <Badge
                  key={index}
                  variant={selectedDescription === description ? "default" : "outline"}
                  className={`cursor-pointer p-4 text-left justify-start w-full transition-all duration-200 hover:scale-[1.02] ${
                    selectedDescription === description
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={() => setSelectedDescription(description)}
                >
                  {description}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="px-8 py-6 text-lg"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back
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
          <span>Continue to Occasion</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default OutfitStyleSelector;
