import React, { useState } from 'react';
import { Analysis } from '../types';
import Spinner from './Spinner';

interface AnalysisFormProps {
  onSubmit: (analysis: Analysis) => void;
  isLoading: boolean;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onSubmit, isLoading }) => {
  const [verdict, setVerdict] = useState<'phishing' | 'legitimate' | 'unsure'>('unsure');
  const [analysisFields, setAnalysisFields] = useState({
    senderAnalysis: '',
    subjectAnalysis: '',
    linksAnalysis: '',
    grammarAnalysis: '',
    overallReasoning: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAnalysisFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const analysisData: Analysis = {
      verdict,
      ...analysisFields,
    };
    onSubmit(analysisData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6 h-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b pb-3 border-gray-200 dark:border-gray-700">Your Analysis</h2>

      <div>
        <label className="block text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Verdict</label>
        <div className="flex space-x-4">
          {(['Phishing', 'Legitimate', 'Unsure'] as const).map(option => {
            const value = option.toLowerCase() as 'phishing' | 'legitimate' | 'unsure';
            return (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                    type="radio"
                    name="verdict"
                    value={value}
                    checked={verdict === value}
                    onChange={() => setVerdict(value)}
                    className="form-radio h-5 w-5 text-blue-600 bg-gray-200 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-gray-700 dark:text-gray-200">{option}</span>
                </label>
            );
          })}
        </div>
      </div>

      {[
        { name: 'senderAnalysis', label: 'Sender Analysis', placeholder: 'Is the sender name and email address suspicious?' },
        { name: 'subjectAnalysis', label: 'Subject Line Analysis', placeholder: 'Does the subject create urgency or seem unusual?' },
        { name: 'linksAnalysis', label: 'Links & Attachments Analysis', placeholder: 'Did you check the links? Are there unexpected attachments?' },
        { name: 'grammarAnalysis', label: 'Grammar & Tone Analysis', placeholder: 'Are there spelling mistakes or an odd tone?' },
        { name: 'overallReasoning', label: 'Overall Reasoning', placeholder: 'Summarize why you chose your verdict.' },
      ].map(({ name, label, placeholder }) => (
        <div key={name}>
          <label htmlFor={name} className="block text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
          <textarea
            id={name}
            name={name}
            rows={3}
            value={analysisFields[name as keyof typeof analysisFields]}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isLoading ? <><Spinner /> Submitting for Feedback...</> : 'Submit Analysis'}
      </button>
    </form>
  );
};

export default AnalysisForm;