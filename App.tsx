import React, { useState, useCallback, useEffect } from 'react';
import { Email, Analysis, Feedback, ApiSettings } from './types';
import { EMAIL_SCENARIOS } from './constants';
import { generateFeedback } from './services/aiService';
import Header from './components/Header';
import EmailView from './components/EmailView';
import AnalysisForm from './components/AnalysisForm';
import FeedbackReport from './components/FeedbackReport';
import WelcomeScreen from './components/WelcomeScreen';
import SettingsModal from './components/SettingsModal';

type AppState = 'welcome' | 'analyzing' | 'feedback';

const shuffleArray = (array: Email[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [currentEmail, setCurrentEmail] = useState<Email | null>(null);
  const [emailQueue, setEmailQueue] = useState<Email[]>(() => shuffleArray(EMAIL_SCENARIOS));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    provider: 'gemini',
    apiKey: '',
    modelName: 'gemini-2.5-flash',
  });
  
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('phishing-sim-settings');
      if (savedSettings) {
        setApiSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.error("Failed to parse settings from localStorage", e);
    }
  }, []);

  const handleSaveSettings = (settings: ApiSettings) => {
    setApiSettings(settings);
    localStorage.setItem('phishing-sim-settings', JSON.stringify(settings));
  };
  
  const getNextEmail = useCallback(() => {
    let currentQueue = [...emailQueue];
    
    // If the queue is empty, reshuffle all scenarios to start a new cycle
    if (currentQueue.length === 0) {
      console.log("Reshuffling email queue.");
      let newShuffled = shuffleArray(EMAIL_SCENARIOS);

      // Ensure the first email of the new cycle isn't the same as the last one of the old cycle
      if (currentEmail && newShuffled[0].id === currentEmail.id && newShuffled.length > 1) {
        [newShuffled[0], newShuffled[1]] = [newShuffled[1], newShuffled[0]];
      }
      currentQueue = newShuffled;
    }

    const nextEmail = currentQueue.shift(); // Take the next email from the front of the queue
    if (nextEmail) {
      setCurrentEmail(nextEmail);
      setEmailQueue(currentQueue); // Update the state with the shortened queue
    }
  }, [emailQueue, currentEmail]);

  const handleStartSimulation = useCallback(() => {
    setError(null);
    setFeedback(null);
    getNextEmail();
    setAppState('analyzing');
  }, [getNextEmail]);
  
  const handleRequestNewEmail = useCallback(() => {
    setError(null);
    getNextEmail();
  }, [getNextEmail]);

  const handleSubmitAnalysis = useCallback(async (analysis: Analysis) => {
    if (!currentEmail) return;

    if (!apiSettings.apiKey) {
      setError('API Key not found. Please add your API key in the Settings menu.');
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const aiFeedback = await generateFeedback(analysis, currentEmail, apiSettings);
      setFeedback(aiFeedback);
      setAppState('feedback');
    } catch (e: any) {
      console.error(e);
      setError(`CyBot Error: ${e.message || 'Please check your API settings and try again.'}`);
    } finally {
      setIsLoading(false);
    }
  }, [currentEmail, apiSettings]);

  const renderContent = () => {
    switch (appState) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartSimulation} />;
      case 'analyzing':
        return currentEmail && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            <div>
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Simulated Email</h3>
                  <button
                    onClick={handleRequestNewEmail}
                    className="flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm shadow"
                    aria-label="Get a different email"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14" />
                    </svg>
                    New Email
                  </button>
              </div>
              <EmailView email={currentEmail} />
            </div>
            <AnalysisForm
                key={currentEmail.id}
                onSubmit={handleSubmitAnalysis}
                isLoading={isLoading}
            />
          </div>
        );
      case 'feedback':
        return currentEmail && feedback && (
          <div className="w-full">
            <FeedbackReport feedback={feedback} />
            <div className="mt-8 text-center">
              <button
                onClick={handleStartSimulation}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-lg shadow-md"
              >
                Start New Simulation
              </button>
            </div>
             <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Original Email</h3>
              <EmailView email={currentEmail} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={apiSettings}
      />
      <main className="container mx-auto p-4 md:p-8 flex flex-col items-center flex-grow">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 w-full max-w-4xl" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">
        Tran Duc Le - UWStout
      </footer>
    </div>
  );
};

export default App;