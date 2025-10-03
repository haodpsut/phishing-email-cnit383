
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Welcome to the Phishing Simulator</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Test your skills by analyzing realistic emails. Can you spot the phish?
      </p>
      <div className="text-left text-gray-600 dark:text-gray-300 mb-8 space-y-4">
        <p><strong>How it works:</strong></p>
        <ol className="list-decimal list-inside space-y-2">
          <li>You'll be presented with a simulated email.</li>
          <li>Analyze it for red flags like suspicious senders, links, and urgent language.</li>
          <li>Submit your verdict and reasoning.</li>
          <li>Receive instant, AI-powered feedback from our expert, CyBot!</li>
        </ol>
      </div>
      <button
        onClick={onStart}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-transform transform hover:scale-105 duration-300 text-xl shadow-xl"
      >
        Start New Simulation
      </button>
    </div>
  );
};

export default WelcomeScreen;
