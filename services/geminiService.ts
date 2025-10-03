
import { GoogleGenAI, Type } from '@google/genai';
import { Analysis, Email, Feedback } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const feedbackSchema = {
  type: Type.OBJECT,
  properties: {
    whatYouGotRight: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of points the student correctly identified in their analysis. Be encouraging."
    },
    whatYouMissed: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of phishing indicators from the analysis_key that the student did not mention."
    },
    expertAnalysis: {
      type: Type.STRING,
      description: "A detailed, step-by-step breakdown of all the indicators in the email, explaining why each is a red flag. Use Markdown for formatting."
    },
    keyTakeaways: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 bullet points summarizing the most important lessons from this specific simulation."
    }
  },
  required: ['whatYouGotRight', 'whatYouMissed', 'expertAnalysis', 'keyTakeaways']
};

export const generateFeedback = async (studentAnalysis: Analysis, email: Email): Promise<Feedback> => {
  const prompt = `
    You are 'CyBot', a helpful and clear cybersecurity instructor. Your tone should be encouraging but precise.
    Your task is to analyze a student's evaluation of a simulated email and provide structured feedback.

    Here is the original email data and the correct analysis (the ground truth):
    - Email Type: ${email.type}
    - Sender: ${email.sender_name} <${email.sender_email}>
    - Subject: ${email.subject}
    - Correct Analysis Points (analysis_key): ${JSON.stringify(email.analysis_key, null, 2)}

    Here is the student's submission:
    - Student's Verdict: ${studentAnalysis.verdict}
    - Sender Analysis: "${studentAnalysis.senderAnalysis}"
    - Subject Line Analysis: "${studentAnalysis.subjectAnalysis}"
    - Links & Attachments Analysis: "${studentAnalysis.linksAnalysis}"
    - Grammar & Tone Analysis: "${studentAnalysis.grammarAnalysis}"
    - Overall Reasoning: "${studentAnalysis.overallReasoning}"

    INSTRUCTIONS:
    1. Compare the student's analysis with the 'Correct Analysis Points'.
    2. Identify what the student correctly spotted.
    3. Identify what key points from the 'analysis_key' the student missed.
    4. Generate a comprehensive 'Expert Analysis' based ONLY on the provided 'analysis_key'.
    5. Formulate 2-3 key takeaways.
    6. Return your feedback in the specified JSON format. If the student's analysis is brief, infer their reasoning and still provide a full feedback structure. For "What you got right", if the student correctly identified the email as phishing, mention that first.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: feedbackSchema,
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    const feedbackData = JSON.parse(jsonText);

    // Validate the structure just in case
    if (
      !feedbackData.whatYouGotRight ||
      !feedbackData.whatYouMissed ||
      !feedbackData.expertAnalysis ||
      !feedbackData.keyTakeaways
    ) {
      throw new Error("AI response is missing required fields.");
    }
    
    return feedbackData as Feedback;

  } catch (error) {
    console.error("Error generating feedback from Gemini API:", error);
    throw new Error("Failed to get feedback from CyBot.");
  }
};
