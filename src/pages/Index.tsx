
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Search, User, Calendar, ShoppingBag, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AgeGenderSelector from "@/components/AgeGenderSelector";
import OutfitStyleSelector from "@/components/OutfitStyleSelector";
import SimplifiedOccasionForm from "@/components/SimplifiedOccasionForm";
import FashionResults from "@/components/FashionResults";
import { UserPreferences, OccasionDetails } from "@/types/preferences";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    age_range: '',
    gender: '',
    budget: '',
    size: '',
    brands: []
  });
  const [occasionDetails, setOccasionDetails] = useState<OccasionDetails>({
    occasion: '',
    season: '',
    activity_type: '',
    specific_needs: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-white animate-pulse" />
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const steps = [
    { title: "Age & Gender", icon: User, description: "Tell us about yourself" },
    { title: "Style Preferences", icon: Sparkles, description: "Choose your favorite looks" },
    { title: "Occasion Details", icon: Calendar, description: "What's the occasion?" },
    { title: "Find Your Look", icon: Search, description: "Discover perfect outfits" }
  ];

  const handleAgeGenderSubmit = (ageRange: string, gender: string) => {
    setUserPreferences(prev => ({ ...prev, age_range: ageRange, gender }));
    setCurrentStep(1);
  };

  const handleStyleSubmit = (selectedDescription: string, selectedImages: string[]) => {
    setUserPreferences(prev => ({ 
      ...prev, 
      confirmed_style_description: selectedDescription,
      selected_outfit_images: selectedImages
    }));
    setCurrentStep(2);
  };

  const handleOccasionSubmit = (details: OccasionDetails) => {
    setOccasionDetails(details);
    setCurrentStep(3);
  };

  const resetForm = () => {
    setCurrentStep(0);
    setUserPreferences({
      age_range: '',
      gender: '',
      budget: '',
      size: '',
      brands: []
    });
    setOccasionDetails({
      occasion: '',
      season: '',
      activity_type: '',
      specific_needs: ''
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">StyleFinder</h1>
                <p className="text-sm text-slate-600">AI-Powered Fashion Discovery</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Progress Steps */}
              <div className="hidden md:flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
                      index === currentStep 
                        ? 'bg-blue-100 text-blue-700' 
                        : index < currentStep 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-400'
                    }`}>
                      <step.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-300 ml-4" />
                    )}
                  </div>
                ))}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Welcome back!</span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentStep === 0 && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Let's Get Started
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                First, tell us a bit about yourself so we can show you the most relevant style options.
              </p>
            </div>
            <AgeGenderSelector onSubmit={handleAgeGenderSubmit} />
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Discover Your Style
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Choose the outfits you love, and our AI will understand your unique style preferences.
              </p>
            </div>
            <OutfitStyleSelector 
              ageRange={userPreferences.age_range}
              gender={userPreferences.gender}
              onSubmit={handleStyleSubmit}
              onBack={() => setCurrentStep(0)}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                What's the Occasion?
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Help us understand the context so we can recommend the most appropriate outfits.
              </p>
            </div>
            <SimplifiedOccasionForm 
              onSubmit={handleOccasionSubmit}
              onBack={() => setCurrentStep(1)}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Your Perfect Matches
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Based on your style and occasion, here are curated outfit recommendations from Amazon.
              </p>
            </div>
            <FashionResults 
              preferences={userPreferences}
              occasion={occasionDetails}
              onStartOver={resetForm}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-slate-600">
            <p className="flex items-center justify-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Powered by Amazon's fashion collection</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
