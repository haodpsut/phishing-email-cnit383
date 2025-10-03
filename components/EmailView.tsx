
import React from 'react';
import { Email } from '../types';

interface EmailViewProps {
  email: Email;
}

const EmailView: React.FC<EmailViewProps> = ({ email }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{email.subject}</h2>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="font-semibold text-gray-800 dark:text-gray-200 mr-2">{email.sender_name}</div>
          <div>&lt;{email.sender_email}&gt;</div>
        </div>
      </div>
      <div 
        className="p-6 prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: email.body }}
      />
    </div>
  );
};

export default EmailView;
