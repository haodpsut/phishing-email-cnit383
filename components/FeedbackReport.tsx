
import React from 'react';
import { Feedback } from '../types';

interface FeedbackReportProps {
  feedback: Feedback;
}

const FeedbackSection: React.FC<{ title: string; children: React.ReactNode; icon: string; bgColorClass: string }> = ({ title, children, icon, bgColorClass }) => (
  <div className={`rounded-lg p-6 ${bgColorClass}`}>
    <h3 className="text-xl font-bold flex items-center mb-3">
      <span className="text-2xl mr-3">{icon}</span>
      {title}
    </h3>
    {children}
  </div>
);

const FeedbackReport: React.FC<FeedbackReportProps> = ({ feedback }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">CyBot's Feedback Report</h2>
        <p className="text-md text-gray-500 dark:text-gray-400 mt-2">Here's a breakdown of your analysis.</p>
      </div>

      <div className="space-y-6">
        <FeedbackSection title="What You Got Right" icon="✅" bgColorClass="bg-green-100 dark:bg-green-900/50">
          {feedback.whatYouGotRight.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-green-800 dark:text-green-200">
              {feedback.whatYouGotRight.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          ) : (
            <p className="text-green-800 dark:text-green-200">It looks like you might need a bit more practice, but that's what we're here for! Let's review the details below.</p>
          )}
        </FeedbackSection>
        
        {feedback.whatYouMissed.length > 0 && (
          <FeedbackSection title="What You Missed" icon="🤔" bgColorClass="bg-yellow-100 dark:bg-yellow-900/50">
            <ul className="list-disc list-inside space-y-2 text-yellow-800 dark:text-yellow-200">
              {feedback.whatYouMissed.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </FeedbackSection>
        )}

        <FeedbackSection title="Expert Analysis" icon="🤖" bgColorClass="bg-gray-100 dark:bg-gray-700/50">
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: feedback.expertAnalysis.replace(/\n/g, '<br/>') }} />
        </FeedbackSection>

        <FeedbackSection title="Key Takeaways" icon="🔑" bgColorClass="bg-blue-100 dark:bg-blue-900/50">
          <ul className="list-disc list-inside space-y-2 font-semibold text-blue-800 dark:text-blue-200">
            {feedback.keyTakeaways.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </FeedbackSection>
      </div>
    </div>
  );
};

export default FeedbackReport;
