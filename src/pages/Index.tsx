
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, ShirtIcon } from "lucide-react";
import AgeGenderSelection from '@/components/AgeGenderSelection';
import StyleSelection from '@/components/StyleSelection';
import OccasionDetails from '@/components/OccasionDetails';
import FashionResults from '@/components/FashionResults';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserPreferences, OccasionDetails as OccasionDetailsType } from '@/types/preferences';

const steps = [
  { id: 'welcome', title: 'Welcome', description: 'Your AI fashion journey starts here' },
  { id: 'profile', title: 'Profile', description: 'Tell us about yourself' },
  { id: 'style', title: 'Style', description: 'Discover your aesthetic' },
  { id: 'occasion', title: 'Occasion', description: 'What\'s the event?' },
  { id: 'results', title: 'Results', description: 'Your perfect matches' }
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [occasion, setOccasion] = useState<OccasionDetailsType>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const handleProfileComplete = (data: UserPreferences) => {
    setPreferences(data);
    setCurrentStep('style');
  };

  const handleStyleComplete = (data: UserPreferences) => {
    setPreferences(prev => ({ ...prev, ...data }));
    setCurrentStep('occasion');
  };

  const handleOccasionComplete = (data: OccasionDetailsType) => {
    setOccasion(data);
    setCurrentStep('results');
  };

  const handleStartOver = () => {
    setPreferences({});
    setOccasion({});
    setCurrentStep('welcome');
  };

  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <ShirtIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">StyleAI</h1>
            </div>
            
            {currentStep !== 'welcome' && (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Step {currentStepIndex + 1} of {steps.length}</span>
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleStartOver}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Start Over
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                  Your Personal
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> AI Stylist</span>
                </h1>
                
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  Discover your perfect style with AI-powered fashion recommendations tailored just for you
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: "👤", title: "Personal Profile", desc: "Tell us your style preferences" },
                  { icon: "✨", title: "AI Analysis", desc: "Our AI finds your perfect matches" },
                  { icon: "🛍️", title: "Curated Results", desc: "Shop handpicked recommendations" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  >
                    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl mb-3">{item.icon}</div>
                        <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-600">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Button
                  onClick={() => setCurrentStep('profile')}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <AgeGenderSelection onComplete={handleProfileComplete} />
            </motion.div>
          )}

          {currentStep === 'style' && (
            <motion.div
              key="style"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <StyleSelection 
                preferences={preferences} 
                onComplete={handleStyleComplete} 
              />
            </motion.div>
          )}

          {currentStep === 'occasion' && (
            <motion.div
              key="occasion"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <OccasionDetails onComplete={handleOccasionComplete} />
            </motion.div>
          )}

          {currentStep === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <FashionResults 
                preferences={preferences}
                occasion={occasion}
                onStartOver={handleStartOver}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
